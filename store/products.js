import { defineStore } from 'pinia'

export const useProductStore = defineStore({
    id: 'product-store',
    state: () => {
      return {
        productslist: [],
        products: [],
        wishlist: [],
        compare: [],
        currency: {
          value:'usd',
          curr: 1,
          symbol: '$'
        },
        order: [],
        locale: 'en',
        searchProducts: [],
        loading: false
      }
    },
    actions: {
      async fetchProducts(force = false) {
        if (!force && this.products.length > 0) return
        this.loading = true
        try {
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Request timeout')), 10000)
          )
          const fetchPromise = $fetch('https://vizdataprojectbe-production.up.railway.app/api/product')
          const response = await Promise.race([fetchPromise, timeoutPromise])
          const list = Array.isArray(response) ? response : []
          this.products = list
          this.productslist = list
        } catch (error) {
          console.error('Error fetching products:', error)
          this.products = []
          this.productslist = []
        } finally {
          this.loading = false
        }
      }, 
      changeCurrency2(payload) {
      this.currency = payload
      if (this.currency.value === 'eur') {
        this.currency.curr = 0.90
       
      } else if (this.currency.value === 'inr') {
        this.currency.curr = 70.93
      } else if (this.currency.value === 'gbp') {
        this.currency.curr = 0.78
       
      } else if (this.currency.value === 'usd') {
        this.currency.curr = 1
      
      }
    },
    async fetchWishlist() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          // โหลด wishlist สำหรับ guest จาก localStorage และอัปเดตสต็อกล่าสุดจากเซิร์ฟเวอร์
          const localWishlistRaw = localStorage.getItem('guestWishlist') || localStorage.getItem('whish')
          const localItems = localWishlistRaw ? JSON.parse(localWishlistRaw) : []
          const refreshed = await Promise.all(localItems.map(async (item) => {
            const id = item._id || item.id
            if (!id) return item
            try {
              const latest = await $fetch(`https://vizdataprojectbe-production.up.railway.app/api/product/${id}`)
              return {
                ...item,
                stock: (latest && typeof latest.stock === 'number') ? latest.stock : item.stock,
                price: (latest && typeof latest.price === 'number') ? latest.price : item.price,
                image: latest?.image || item.image,
                name: latest?.name || item.name || item.title,
              }
            } catch (e) {
              return item
            }
          }))
          this.wishlist = refreshed
          try { localStorage.setItem('guestWishlist', JSON.stringify(refreshed)) } catch (e) {}
          return
        }
        const response = await $fetch('https://vizdataprojectbe-production.up.railway.app/api/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        })
        this.wishlist = Array.isArray(response?.products) ? response.products : []
      } catch (error) {
        console.error('Error fetching wishlist:', error)
        this.wishlist = []
      }
    },
    async addToWishlist(payload) {
      try {
        const token = localStorage.getItem('token')
        
        console.log('addToWishlist payload:', payload)
        const productId = payload.id || payload._id
        console.log('Extracted productId:', productId)
        
        // Validate productId
        if (!productId || productId === 'undefined' || productId === undefined) {
          console.error('Invalid product ID. Product object:', payload)
          useNuxtApp().$showToast({ msg: "Invalid product - missing ID", type: "error" })
          return
        }
        
        // Check stock before adding to wishlist
        const productStock = payload.stock !== undefined ? payload.stock : 0
        if (productStock <= 0) {
          useNuxtApp().$showToast({ msg: "This product is out of stock", type: "error" })
          return
        }
        
        if (!token) {
          // Guest user - save to localStorage
          const localWishlist = localStorage.getItem('guestWishlist')
          let wishlistArray = localWishlist ? JSON.parse(localWishlist) : []
          
          // Check if product already in wishlist
          const exists = wishlistArray.find(item => (item.id || item._id) === productId)
          if (!exists) {
            wishlistArray.push(payload)
            localStorage.setItem('guestWishlist', JSON.stringify(wishlistArray))
            this.wishlist = wishlistArray
            useNuxtApp().$showToast({ msg: "Product added to wishlist", type: "success" })
          } else {
            useNuxtApp().$showToast({ msg: "Product already in wishlist", type: "info" })
          }
          return
        }
        
        // Logged in user - save to server
        await $fetch(`https://vizdataprojectbe-production.up.railway.app/api/wishlist/${productId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        useNuxtApp().$showToast({ msg: "Product added to wishlist", type: "success" })
        // Refresh wishlist
        await this.fetchWishlist()
      } catch (error) {
        console.error('Error adding to wishlist:', error)
        useNuxtApp().$showToast({ msg: error.data?.message || "Failed to add to wishlist", type: "error" })
      }
    },
    setInitialWhishlist(payload){
      this.wishlist = payload
    },
    async removeWishlistItem(payload) {
      try {
        const token = localStorage.getItem('token')
        
        const productId = payload.id || payload._id
        
        // Validate productId
        if (!productId || productId === 'undefined') {
          console.error('Invalid product ID:', payload)
          return
        }
        
        if (!token) {
          // Guest user - remove from localStorage
          const localWishlist = localStorage.getItem('guestWishlist')
          let wishlistArray = localWishlist ? JSON.parse(localWishlist) : []
          wishlistArray = wishlistArray.filter(item => (item.id || item._id) !== productId)
          localStorage.setItem('guestWishlist', JSON.stringify(wishlistArray))
          this.wishlist = wishlistArray
          useNuxtApp().$showToast({ msg: "Product removed from wishlist", type: "success" })
          return
        }
        
        // Logged in user - remove from server
        await $fetch(`https://vizdataprojectbe-production.up.railway.app/api/wishlist/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        useNuxtApp().$showToast({ msg: "Product removed from wishlist", type: "success" })
        // Refresh wishlist
        await this.fetchWishlist()
      } catch (error) {
        console.error('Error removing from wishlist:', error)
        useNuxtApp().$showToast({ msg: "Failed to remove from wishlist", type: "error" })
      }
    },
    addToCompare( payload) {

      const product = this.products.find(item => item.id === payload.id)
      const compareItems = this.compare.find(item => item.id === payload.id)
      if (compareItems) {
      } else {
        this.compare.push({
          ...product
        })
      }
    },
    setInitialCompare(payload){
      this.compare = payload
    },
    removeCompareItem(payload){
      const index = this.compare.indexOf(payload)
      this.compare.splice(index, 1)
    },
    searchProduct(payload)  {
      payload = payload.toLowerCase()
      this.searchProducts = []
      if (payload.length) {
        this.products.filter((product) => {
          if (product.title.toLowerCase().includes(payload)) {
            this.searchProducts.push(product)
          }
        })
      }
    },
    createOrder( payload){
      this.order = payload
    }
  },
    getters: {
      price:(state)=>{
        return state.products.map((product) => {
          if(product.price){
            return product.price
          }
        })
        
      },
      getcollectionProduct: (state) => {
        return collection => state.products.filter((product) => {
          return collection === product.collection
        })
      },
      getProductById: (state) => {
        return id => state.products.find((product) => {
           return product.id ===+id
        })
      },
      getProductsByBrand: (state) => {
        return (brand) => state.products.filter(p => p.brand && p.brand.toLowerCase() === (brand || '').toLowerCase())
      },
      getProductsBySellerId: (state) => {
        return (sellerId) => state.products.filter(p => p.seller_id && +p.seller_id === +sellerId)
      },
      compareItems: (state) => {
        return state.compare
      },
      wishlistItems: (state) => {
        return state.wishlist
      },
      changeCurrency: (state) => {
       
        return state.currency
       
      },
      getOrder: (state) => {
        return state.order
      }    },
  })