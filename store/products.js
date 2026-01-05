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
      async fetchProducts() {
        this.loading = true
        try {
          const response = await $fetch('http://localhost:3001/api/product')
          this.products = response || []
          this.productslist = response || []
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
          this.wishlist = []
          return
        }
        const response = await $fetch('http://localhost:3001/api/wishlist', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        this.wishlist = response.products || []
      } catch (error) {
        console.error('Error fetching wishlist:', error)
        this.wishlist = []
      }
    },
    async addToWishlist(payload) {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.warn('Please login to add to wishlist')
          return
        }
        const productId = payload._id || payload.id
        await $fetch(`http://localhost:3001/api/wishlist/${productId}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        // Refresh wishlist
        await this.fetchWishlist()
      } catch (error) {
        console.error('Error adding to wishlist:', error)
      }
    },
    setInitialWhishlist(payload){
      this.wishlist = payload
    },
    async removeWishlistItem(payload) {
      try {
        const token = localStorage.getItem('token')
        if (!token) return
        
        const productId = payload._id || payload.id
        await $fetch(`http://localhost:3001/api/wishlist/${productId}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        // Refresh wishlist
        await this.fetchWishlist()
      } catch (error) {
        console.error('Error removing from wishlist:', error)
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