import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { useProductStore } from './products'

export const useCartStore = defineStore({
  id: 'cart-store',
  state: () => {
    return {
      cart: [],
      abc: {},
      // [เพิ่มใหม่ 1] State สำหรับเก็บสินค้าที่ถูกเลือกจากหน้า Cart เพื่อไปหน้า Checkout
      selectedCheckoutItems: [],
      loading: false
    }
  },
  actions: {
    async fetchCart() {
      this.loading = true
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          // โหลดตะกร้าจาก localStorage สำหรับ guest user
          const localCart = localStorage.getItem('product')
          let cartItems = localCart ? JSON.parse(localCart) : []
          
          // ตรวจสอบสต็อกล่าสุดจาก API สำหรับทุกสินค้าในตะกร้า
          if (cartItems.length > 0) {
            const updatedCart = []
            for (const item of cartItems) {
              try {
                const productId = item._id || item.id
                if (!productId) continue
                const product = await $fetch(`https://vizdataprojectbe-production.up.railway.app/api/product/${productId}`)
                const currentStock = Number(product?.stock ?? 0)
                
                if (currentStock <= 0) {
                  // สินค้าหมด ไม่ใส่กลับในตะกร้า
                  continue
                }
                
                // ปรับจำนวนในตะกร้าให้ไม่เกินสต็อกจริง
                updatedCart.push({
                  ...item,
                  stock: currentStock,
                  quantity: Math.min(item.quantity, currentStock)
                })
              } catch (err) {
                // ถ้าดึงสินค้าไม่ได้ (อาจถูกลบ) ให้ข้ามไป
                console.warn(`[Cart] ไม่สามารถเช็คสต็อกสินค้า ${item._id || item.id}:`, err.message)
              }
            }
            cartItems = updatedCart
            localStorage.setItem('product', JSON.stringify(cartItems))
          }
          
          this.cart = cartItems
          this.loading = false
          return
        }
        const response = await $fetch('https://vizdataprojectbe-production.up.railway.app/api/cart', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        this.cart = response.items
          .filter(item => item.productId && typeof item.productId === 'object')
          .map(item => {
            const product = item.productId
            
            if (typeof product === 'string') {
              return null;
            }
            
            let productIdString = '';
            if (product._id) {
              if (typeof product._id === 'string') {
                productIdString = product._id;
              } else if (product._id._id) {
                productIdString = String(product._id._id);
              } else {
                const idStr = String(product._id);
                productIdString = idStr.replace(/^ObjectId\(['"](.+)['"]\)$/, '$1');
              }
            }
            
            let shopName = 'Shop'
            if (product.userId && typeof product.userId === 'object') {
              shopName = product.userId.username || 
                         `${product.userId.firstName || ''} ${product.userId.lastName || ''}`.trim() || 
                         'Shop'
            }

            // Build proper image URL
            let imageUrl = ''
            if (product.image) {
              if (product.image.startsWith('data:')) {
                imageUrl = ''  // legacy base64 — skip, use placeholder
              } else if (product.image.startsWith('http')) {
                imageUrl = product.image
              } else if (product.image.startsWith('/')) {
                imageUrl = `https://vizdataprojectbe-production.up.railway.app${product.image}`
              } else {
                imageUrl = `https://vizdataprojectbe-production.up.railway.app/${product.image}`
              }
            }
            
            const mappedItem = {
              _id: productIdString,
              id: productIdString,
              name: product.name || 'No Name',
              title: product.name || 'No Name',
              price: Number(product.price) || 0,
              quantity: Number(item.quantity) || 1,
              shippingCost: product.shippingCost || 'Free',
              image: imageUrl,
              images: imageUrl ? [{ src: imageUrl }] : [],
              stock: Number(product.stock) || 0,
              commission: Number(product.commission) || 0,
              weight: Number(product.weight) || 0,
              description: product.description || '',
              category: product.category || '',
              brand: shopName,
              seller: product.userId && typeof product.userId === 'object' ? {
                _id: product.userId._id ? (typeof product.userId._id === 'string' ? product.userId._id : product.userId._id.toString()) : '',
                name: shopName,
                display_name: shopName,
                username: product.userId.username || '',
                firstName: product.userId.firstName || '',
                lastName: product.userId.lastName || '',
                email: product.userId.email || ''
              } : null
            }
            
            return mappedItem;
          })
          .filter(item => item !== null)
      } catch (error) {
        console.error('Error fetching cart:', error)
        this.cart = []
      } finally {
        this.loading = false
      }
    },
    async addToCart(payload) {
      const token = localStorage.getItem('token')
      
      if (!token) {
        // ถ้าไม่มี token ให้ใช้ localStorage แบบเดิม และเช็คสต็อกล่าสุด
        console.log('No token, using localStorage for cart')
        
        // ตรวจสอบสต็อกล่าสุดจาก API ก่อนเพิ่มลงตะกร้า
        try {
          const productResponse = await $fetch(`https://vizdataprojectbe-production.up.railway.app/api/product/${payload._id || payload.id}`)
          const currentStock = Number(productResponse?.stock || 0)
          
          if (currentStock <= 0) {
            useNuxtApp().$showToast({ msg: "สินค้าหมดแล้ว", type: "error" })
            return
          }
          
          const cartItems = this.cart.find(item => {
            const itemId = item._id || item.id
            const payloadId = payload._id || payload.id
            return itemId === payloadId
          })
          
          const qty = payload.quantity ? payload.quantity : 1
          
          if (cartItems) {
            const newQty = cartItems.quantity + qty
            // Check if new quantity exceeds current stock
            if (newQty > currentStock) {
              useNuxtApp().$showToast({ msg: `มีสินค้าเหลือเพียง ${currentStock} ชิ้น`, type: "error" })
              return
            }
            cartItems.quantity = newQty
            cartItems.stock = currentStock // อัพเดทสต็อกล่าสุด
          } else {
            // Check if quantity exceeds stock for new item
            if (qty > currentStock) {
              useNuxtApp().$showToast({ msg: `มีสินค้าเหลือเพียง ${currentStock} ชิ้น`, type: "error" })
              return
            }
            this.cart.push({
              ...payload,
              quantity: qty,
              stock: currentStock // เก็บสต็อกล่าสุด
            })
          }
        } catch (error) {
          console.error('Error checking stock:', error)
          useNuxtApp().$showToast({ msg: "ไม่สามารถตรวจสอบสต็อกได้", type: "error" })
          return
        }
        
        // Save to localStorage
        localStorage.setItem('product', JSON.stringify(this.cart))
        useNuxtApp().$showToast({ msg: "Product added to cart", type: "success" })
        return
      }
      
      // ถ้ามี token ให้ใช้ API
      try {
        const productId = payload._id || payload.id
        const qty = payload.quantity || 1
        
        await $fetch('https://vizdataprojectbe-production.up.railway.app/api/cart', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            productId: productId,
            quantity: qty
          })
        })
        
        await this.fetchCart()
        useNuxtApp().$showToast({ msg: "Product added to cart", type: "success" })
      } catch (error) {
        console.error('Error adding to cart:', error)
        const errorMessage = error.data?.message || error.message || 'Failed to add product to cart'
        useNuxtApp().$showToast({ msg: errorMessage, type: "error" })
      }
    },
    async updateCartQuantity(payload) {
      const token = localStorage.getItem('token')
      
      if (!token) {
        function calculateStockCounts(product, quantity) {
          const qty = product.quantity + quantity
          const stock = product.stock
          if (stock < qty) {
            return false
          }
          return true
        }
        
        this.cart.find((items, index) => {
          const itemId = items._id || items.id
          const payloadId = payload.product._id || payload.product.id
          if (itemId === payloadId) {
            const qty = this.cart[index].quantity + payload.qty
            const stock = calculateStockCounts(this.cart[index], payload.qty)
            if (qty !== 0 && stock) {
              this.cart[index].quantity = qty
            }
            return true
          }
        })
        
        localStorage.setItem('product', JSON.stringify(this.cart))
        return
      }
      
      try {
        const productId = payload.product._id || payload.product.id
        const currentQty = payload.product.quantity
        const changeQty = payload.qty
        const newQty = currentQty + changeQty
        
        if (newQty <= 0) {
          console.log('Quantity <= 0, removing item');
          await this.removeCartItem(payload.product)
          return
        }
        
        const response = await $fetch(`https://vizdataprojectbe-production.up.railway.app/api/cart/${productId}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            quantity: newQty
          })
        })
        
        await this.fetchCart()
        
        this.cart = [...this.cart];
      } catch (error) {
        console.error('Error updating cart quantity:', error)
        const errorMessage = error.data?.message || error.message || 'Failed to update quantity'
        useNuxtApp().$showToast({ msg: errorMessage, type: "error" })
        // Refresh cart to show current state
        await this.fetchCart()
      }
    },
    async removeCartItem(payload) {
      const token = localStorage.getItem('token')
      
      if (!token) {
        this.cart = this.cart.filter((item) => {
          const itemId = item._id || item.id
          const payloadId = payload._id || payload.id
          return itemId != payloadId
        })
        
        localStorage.setItem('product', JSON.stringify(this.cart))
        return
      }
      
      try {
        const productId = payload._id || payload.id
        
        if (!productId) {
          console.error('No productId found in payload:', payload)
          return;
        }
        
        console.log('Deleting product from cart, productId:', productId)
        
        const response = await $fetch(`https://vizdataprojectbe-production.up.railway.app/api/cart/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        console.log('Delete response:', response)
        
        // Remove from local cart immediately
        this.cart = this.cart.filter((item) => {
          const itemId = item._id || item.id
          return itemId !== productId
        })
        
        // Then sync with server
        await this.fetchCart()
      } catch (error) {
        console.error('Error removing from cart:', error)
        // Still remove locally even if API fails
        const productId = payload._id || payload.id
        if (productId) {
          this.cart = this.cart.filter((item) => {
            const itemId = item._id || item.id
            return itemId !== productId
          })
        }
      }
    },
    setInitialCart(payload) {
      this.cart = payload
    },
    async clearCart() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          this.cart = []
          return
        }
        
        await $fetch('https://vizdataprojectbe-production.up.railway.app/api/cart', {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        this.cart = []
      } catch (error) {
        console.error('Error clearing cart:', error)
        this.cart = []
      }
    },
    // [เพิ่มใหม่ 2] Action สำหรับบันทึกรายการสินค้าที่ถูกเลือก (เรียกใช้ตอนกดปุ่ม Checkout)
    setSelectedItems(payload) {
      this.selectedCheckoutItems = payload
    },
    
    // [เพิ่มใหม่] ตรวจสอบสต็อกล่าสุดก่อน checkout
    async validateCheckoutStock() {
      const token = localStorage.getItem('token')
      let hasStockIssues = false
      const updatedItems = []
      
      for (const item of this.cart) {
        try {
          // ดึงข้อมูลสต็อกล่าสุดจาก API
          const productResponse = await $fetch(`https://vizdataprojectbe-production.up.railway.app/api/product/${item._id || item.id}`)
          const currentStock = Number(productResponse?.stock || 0)
          
          if (currentStock <= 0) {
            // ถ้าสินค้าหมด ให้ลบออกจากตะกร้า
            useNuxtApp().$showToast({ 
              msg: `สินค้า "${item.name}" หมดแล้ว จะถูกลบออกจากตะกร้า`, 
              type: "warning" 
            })
            hasStockIssues = true
            continue // ข้าม item นี้ (ไม่ใส่ใน updatedItems)
          }
          
          if (item.quantity > currentStock) {
            // ถ้าจำนวนในตะกร้ามากกว่าสต็อก ให้ปรับจำนวนลง
            useNuxtApp().$showToast({ 
              msg: `สินค้า "${item.name}" เหลือเพียง ${currentStock} ชิ้น จำนวนในตะกร้าถูกปรับแล้ว`, 
              type: "warning" 
            })
            updatedItems.push({
              ...item,
              quantity: currentStock,
              stock: currentStock
            })
            hasStockIssues = true
          } else {
            // สต็อกเพียงพอ 
            updatedItems.push({
              ...item,
              stock: currentStock
            })
          }
        } catch (error) {
          console.error(`Error checking stock for product ${item._id}:`, error)
          useNuxtApp().$showToast({ 
            msg: `ไม่สามารถตรวจสอบสต็อกของ "${item.name}" ได้`, 
            type: "error" 
          })
          return false
        }
      }
      
      // อัพเดทตะกร้าด้วยข้อมูลสต็อกล่าสุด
      this.cart = updatedItems
      
      // บันทึกลง localStorage สำหรับ guest user
      if (!token) {
        localStorage.setItem('product', JSON.stringify(this.cart))
      }
      
      return !hasStockIssues
    }
  },
  getters: {
    cartItems: (state) => {
      return state.cart
    },
    // นับจำนวนสินค้าทั้งหมด รวม quantity
    cartTotalQuantity: (state) => {
      return state.cart.reduce((total, product) => {
        return total + (product.quantity || 0)
      }, 0)
    },
    cartTotalAmount: (state) => {
      return state.cart.reduce((total, product) => {
        return total + (product.price * product.quantity)
      }, 0)
    },
    // [เพิ่มใหม่ 3] Getter คำนวณราคารวม เฉพาะสินค้าที่ถูกเลือก (ใช้ในหน้า Checkout)
    selectedCheckoutTotal: (state) => {
      return state.selectedCheckoutItems.reduce((total, product) => {
        return total + (product.price * product.quantity)
      }, 0)
    }
  }
})