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
          this.cart = []
          return
        }
        const response = await $fetch('http://localhost:3001/api/cart', {
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
            
            const mappedItem = {
              _id: productIdString,
              id: productIdString,
              name: product.name || 'No Name',
              title: product.name || 'No Name',
              price: Number(product.price) || 0,
              quantity: Number(item.quantity) || 1,
              shippingCost: product.shippingCost || 'Free',
              image: product.image || '',
              images: product.image ? [{ src: product.image }] : [],
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
        // ถ้าไม่มี token ให้ใช้ localStorage แบบเดิม
        console.log('No token, using localStorage for cart')
        const cartItems = this.cart.find(item => {
          const itemId = item._id || item.id
          const payloadId = payload._id || payload.id
          return itemId === payloadId
        })
        const qty = payload.quantity ? payload.quantity : 1
        
        if (cartItems) {
          cartItems.quantity += qty
        } else {
          this.cart.push({
            ...payload,
            quantity: qty
          })
        }
        
        // Save to localStorage
        localStorage.setItem('product', JSON.stringify(this.cart))
        return
      }
      
      // ถ้ามี token ให้ใช้ API
      try {
        const productId = payload._id || payload.id
        const qty = payload.quantity || 1
        
        await $fetch('http://localhost:3001/api/cart', {
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
      } catch (error) {
        console.error('Error adding to cart:', error)
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
        
        const response = await $fetch(`http://localhost:3001/api/cart/${productId}`, {
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
          return;
        }
        
        await $fetch(`http://localhost:3001/api/cart/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        
        await this.fetchCart()
      } catch (error) {
        console.error('Error removing from cart:', error)
        throw error;
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
        
        await $fetch('http://localhost:3001/api/cart', {
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