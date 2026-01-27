import { defineStore } from 'pinia'
import { authService } from '~/services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    userName: null,
    isLoggedIn: false,
    token: null,
    // userType: 0 = seller, 1 = user
    userType: 1,
  }),
  
  getters: {
    getUser: (state) => state.user,
    isAuthenticated: (state) => state.isLoggedIn,
    isSeller: (state) => state.userType === 0,
    isNormalUser: (state) => state.userType === 1,
  },
  
  actions: {
    // Initialize from localStorage (verify token with backend)
    async initAuth() {
      if (!import.meta.client) return

      const savedUser = localStorage.getItem('user')
      const savedUserName = localStorage.getItem('userName')
      const savedUserType = localStorage.getItem('userType')
      const savedToken = localStorage.getItem('token')
      // do not rely on localStorage for avatar; server is authoritative
      const savedAvatar = null

      if (savedUser && savedToken) {
        try {
          const verify = await $fetch('http://localhost:3001/api/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` }
          })
          if (verify && verify.success) {
            // use server user as authoritative (includes avatar)
            const serverUser = verify.data
            this.user = serverUser
            this.userName = serverUser.username || savedUserName
            this.token = savedToken
            this.isLoggedIn = true
            if (serverUser.userType !== undefined && serverUser.userType !== null) this.userType = Number(serverUser.userType)

            // sync localStorage with server
            try {
              localStorage.setItem('user', JSON.stringify(serverUser))
              localStorage.setItem('userName', this.userName)
              localStorage.setItem('userType', String(this.userType))
              // serverUser.avatar will be stored in `this.user.avatar`; do not mirror to localStorage
            } catch (e) {}

            return
          }
        } catch (e) {
          // token invalid or network error -> fallthrough to clear saved
        }
      }

      // If here, no valid saved session -> clear any saved auth data
      try {
        localStorage.removeItem('user')
        localStorage.removeItem('userName')
        localStorage.removeItem('userType')
        localStorage.removeItem('token')
      } catch (e) {}
      try { document.cookie = 'userlogin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT' } catch (e) {}
    },
    
    // Real API Login
    async login(email, password) {
      try {
        const response = await authService.login({ email, password })
        
        // 🔥🔥 [โซนจับโจร] เริ่มทำงาน 🔥🔥
        console.log("🕵️‍♂️ [1] Login Response ทั้งก้อน:", response);
        if (response.success) {
            console.log("🕵️‍♂️ [2] User Data ที่ Backend ส่งมา:", response.data.user);
            console.log("🕵️‍♂️ [3] ค่า Avatar คือ:", response.data.user.avatar);
        } else {
            console.log("❌ Login ไม่สำเร็จ:", response.message);
        }
        // 🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥

        if (response.success) {
          const { user, token } = response.data
          
          this.user = user
          this.userName = user.username
          this.userType = user.userType
          this.token = token
          this.isLoggedIn = true

          // Save to localStorage
          if (import.meta.client) {
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('userName', user.username)
            localStorage.setItem('userType', String(user.userType))
            localStorage.setItem('token', token)
            
            // ✅ 2. บันทึกรูปลงเครื่อง (ถ้ามี)
            // Avatar comes from server; no localStorage copy needed
            
            // Set cookie logic (เหมือนเดิม)
            try {
              const expires = new Date()
              expires.setDate(expires.getDate() + 7)
              document.cookie = `userlogin=1; path=/; expires=${expires.toUTCString()}`
            } catch (e) {}
            
            // Sync Cart logic with stock validation
            const { useCartStore } = await import('~/store/cart')
            const { useProductStore } = await import('~/store/products')
            const cartStore = useCartStore()
            const productStore = useProductStore()
            
            // Fetch server cart first to check existing items
            await cartStore.fetchCart()
            
            const localCart = JSON.parse(localStorage.getItem('product') || '[]')
            if (localCart.length > 0) {
              for (const item of localCart) {
                try {
                  const productId = item._id || item.id
                  const localQty = item.quantity || 1
                  
                  // Get current product info to check stock
                  const productResponse = await $fetch(`http://localhost:3001/api/product/${productId}`)
                  const productStock = productResponse?.stock || 0
                  
                  // Check if product already in server cart
                  const existingItem = cartStore.cart.find(cartItem => {
                    const cartItemId = cartItem._id || cartItem.id
                    return cartItemId === productId
                  })
                  
                  const existingQty = existingItem ? existingItem.quantity : 0
                  const totalQty = existingQty + localQty
                  
                  // Only add if total quantity doesn't exceed stock
                  if (totalQty <= productStock && productStock > 0) {
                    const qtyToAdd = Math.min(localQty, productStock - existingQty)
                    if (qtyToAdd > 0) {
                      await $fetch('http://localhost:3001/api/cart', {
                        method: 'POST',
                        headers: {
                          Authorization: `Bearer ${token}`,
                          'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                          productId: productId,
                          quantity: qtyToAdd
                        })
                      })
                    }
                  }
                } catch (e) {
                  console.warn('Failed to merge cart item:', e)
                }
              }
              localStorage.removeItem('product')
            }
            
            await cartStore.fetchCart()
            // Merge guest wishlist (localStorage key 'whish') into user's wishlist on login
            try {
              const localWish = JSON.parse(localStorage.getItem('whish') || '[]')
              if (localWish.length > 0) {
                for (const item of localWish) {
                  try {
                    const prodId = item._id || item.id
                    if (!prodId) continue
                    await $fetch(`http://localhost:3001/api/wishlist/${prodId}`, {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                    })
                  } catch (e) {}
                }
                localStorage.removeItem('whish')
              }
            } catch (e) {
              console.warn('Failed to merge local wishlist:', e)
            }

            await productStore.fetchWishlist()
          }

          return { 
            success: true, 
            message: response.message, 
            userType: user.userType 
          }
        }
        
        return { success: false, message: response.message }
      } catch (error) {
        console.error('Login error:', error)
        const message = error?.data?.message || 'Login failed. Please try again.'
        return { success: false, message }
      }
    },
    
    // Real API Register
    async register(username, email, password, confirmPassword, userType = 1) {
      if (!username || !email || !password || !confirmPassword) return { success: false, message: 'Please fill in all fields' }
      if (password !== confirmPassword) return { success: false, message: 'Passwords do not match' }
      
      try {
        const response = await authService.register({ username, email, password, userType })
        
        if (response.success) {
          const { user, token } = response.data
          
          this.user = user
          this.userName = user.username
          this.userType = user.userType
          this.token = token
          this.isLoggedIn = true

          if (import.meta.client) {
            localStorage.setItem('user', JSON.stringify(user))
            localStorage.setItem('userName', user.username)
            localStorage.setItem('userType', String(user.userType))
            localStorage.setItem('token', token)
            
            // Avatar comes from server; no localStorage copy needed
            
            try {
              const expires = new Date()
              expires.setDate(expires.getDate() + 7)
              document.cookie = `userlogin=1; path=/; expires=${expires.toUTCString()}`
            } catch (e) {}
            
            // Merge guest wishlist (localStorage key 'whish') into user's wishlist on register
            try {
              const { useProductStore } = await import('~/store/products')
              const productStore = useProductStore()
              const localWish = JSON.parse(localStorage.getItem('whish') || '[]')
              if (localWish.length > 0) {
                for (const item of localWish) {
                  try {
                    const prodId = item._id || item.id
                    if (!prodId) continue
                    await $fetch(`http://localhost:3001/api/wishlist/${prodId}`, {
                      method: 'POST',
                      headers: {
                        Authorization: `Bearer ${token}`
                      }
                    })
                  } catch (e) {}
                }
                localStorage.removeItem('whish')
              }
              await productStore.fetchWishlist()
            } catch (e) {
              console.warn('Failed to merge local wishlist on register:', e)
            }
          }

          return { success: true, message: response.message }
        }
        return { success: false, message: response.message }
      } catch (error) {
        const message = error?.data?.message || error?.message || 'Registration failed.'
        return { success: false, message }
      }
    },
    
    // Logout action
    logout() {
      this.user = null
      this.userName = null
      this.isLoggedIn = false
      this.token = null
      this.userType = 1
      
      if (import.meta.client) {
        localStorage.removeItem('user')
        localStorage.removeItem('userName')
        localStorage.removeItem('userType')
        localStorage.removeItem('token')
        
        try { console.log("👋 Logout: cleared auth data"); } catch (e) {}
        
        try {
          document.cookie = 'userlogin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        } catch (e) {}
      }
    }
  }
})