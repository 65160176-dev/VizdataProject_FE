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
        
        if (savedUser && savedToken) {
          this.user = JSON.parse(savedUser)
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
            
            // Set cookie for backward compatibility
            try {
              const expires = new Date()
              expires.setDate(expires.getDate() + 7)
              document.cookie = `userlogin=1; path=/; expires=${expires.toUTCString()}`
            } catch (e) {
              // ignore if cookies unavailable
            }
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
      // Validation
      if (!username || !email || !password || !confirmPassword) {
        return { success: false, message: 'Please fill in all fields' }
      }
      
      if (password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match' }
      }
      
      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' }
      }

      if (username.length < 3) {
        return { success: false, message: 'Username must be at least 3 characters' }
      }
      
      try {
        const response = await authService.register({
          username,
          email,
          password,
          userType,
        })
        
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
            
            try {
              const expires = new Date()
              expires.setDate(expires.getDate() + 7)
              document.cookie = `userlogin=1; path=/; expires=${expires.toUTCString()}`
            } catch (e) {}
          }

          return { success: true, message: response.message }
        }
        
        return { success: false, message: response.message }
      } catch (error) {
        console.error('Register error:', error)
        console.error('Error details:', {
          message: error?.message,
          data: error?.data,
          statusCode: error?.statusCode,
          response: error?.response
        })
        const message = error?.data?.message || error?.message || 'Registration failed. Please try again.'
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
        
        // remove cookie
        try {
          document.cookie = 'userlogin=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
        } catch (e) {
          // ignore
        }
      }
    }
  }
})

