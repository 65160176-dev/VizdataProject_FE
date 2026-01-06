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
    // Initialize from localStorage
    initAuth() {
      if (import.meta.client) {
        const savedUser = localStorage.getItem('user')
        const savedUserName = localStorage.getItem('userName')
        const savedUserType = localStorage.getItem('userType')
        const savedToken = localStorage.getItem('token')
        
        // ✅ 1. กู้คืนรูปภาพตอน Refresh หน้า
        const savedAvatar = localStorage.getItem('sellerAvatar')
        
        if (savedUser && savedToken) {
          this.user = JSON.parse(savedUser)
          
          // ยัดรูปกลับใส่ User Object (ถ้ามี)
          if (savedAvatar && this.user) {
             this.user.avatar = savedAvatar
          }

          this.userName = savedUserName
          this.token = savedToken
          this.isLoggedIn = true
          if (savedUserType !== null) this.userType = Number(savedUserType)
        }
      }
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
            if (user.avatar) {
                console.log("✅ [4] กำลังบันทึกรูปลง LocalStorage: sellerAvatar =", user.avatar);
                localStorage.setItem('sellerAvatar', user.avatar)
            } else {
                console.warn("⚠️ [4] ไม่พบรูปภาพ (avatar เป็น null หรือ undefined) จึงไม่ได้บันทึก");
            }
            
            // Set cookie logic (เหมือนเดิม)
            try {
              const expires = new Date()
              expires.setDate(expires.getDate() + 7)
              document.cookie = `userlogin=1; path=/; expires=${expires.toUTCString()}`
            } catch (e) {}
            
            // Sync Cart logic (เหมือนเดิม)
            const { useCartStore } = await import('~/store/cart')
            const { useProductStore } = await import('~/store/products')
            const cartStore = useCartStore()
            const productStore = useProductStore()
            
            const localCart = JSON.parse(localStorage.getItem('product') || '[]')
            if (localCart.length > 0) {
              for (const item of localCart) {
                try {
                  await $fetch('http://localhost:3001/api/cart', {
                    method: 'POST',
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                      productId: item._id || item.id,
                      quantity: item.quantity || 1
                    })
                  })
                } catch (e) {}
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
            
            // ✅ 3. บันทึกรูปตอนสมัคร (ถ้ามี)
            if (user.avatar) {
                localStorage.setItem('sellerAvatar', user.avatar)
            }
            
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
        
        // ✅ 4. ลบรูปออกตอน Logout
        console.log("👋 Logout: ลบ sellerAvatar ออกจากเครื่อง");
        localStorage.removeItem('sellerAvatar')
        
        try {
          document.cookie = 'userlogin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        } catch (e) {}
      }
    }
  }
})