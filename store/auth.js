import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isLoggedIn: false,
    // role: 0 = seller, 1 = user
    role: 1,
  }),
  
  getters: {
    getUser: (state) => state.user,
    isAuthenticated: (state) => state.isLoggedIn,
  },
  
  actions: {
    // Initialize from localStorage
    initAuth() {
      if (import.meta.client) {
        const savedUser = localStorage.getItem('user')
        const savedRole = localStorage.getItem('userRole')
        if (savedUser) {
          this.user = savedUser
          this.isLoggedIn = true
          if (savedRole !== null) this.role = Number(savedRole)
        }
      }
    },
    
    // Login action (made async to support API later)
    async login(email, password) {
      // Demo credentials - ในระบบจริงควรเรียก API
      const validUsers = [
        { email: 'test@admin.com', password: 'test@123456', name: 'Test Admin', role: 1 },
        { email: 'user@demo.com', password: 'demo123', name: 'Demo User', role: 1 },
        { email: 'seller@demo.com', password: 'seller123', name: 'Demo Seller', role: 0 }
      ]
      
      // First check demo valid users
      let foundUser = validUsers.find(
        u => u.email === email && u.password === password
      )

      // If not found in demo list, check users registered via the mock register() (stored in localStorage)
      if (!foundUser && import.meta.client) {
        try {
          const stored = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
          const reg = stored.find(u => u.email === email && u.password === password)
          if (reg) foundUser = reg
        } catch (e) {
          // ignore parse errors
        }
      }
      
      if (foundUser) {
        this.user = foundUser.email
        this.role = typeof foundUser.role !== 'undefined' ? foundUser.role : 1
        this.isLoggedIn = true

        // Save to localStorage
        if (import.meta.client) {
          localStorage.setItem('user', foundUser.email)
          localStorage.setItem('userName', foundUser.name)
          localStorage.setItem('userRole', String(this.role))
          // Also set a cookie 'userlogin' for components that check cookie-based login
          try {
            const expires = new Date();
            // cookie valid for 7 days
            expires.setDate(expires.getDate() + 7);
            document.cookie = `userlogin=1; path=/; expires=${expires.toUTCString()}`;
          } catch (e) {
            // ignore if cookies unavailable
          }
        }

        return { success: true, message: 'Login successful!', role: this.role }
      }
      
      return { success: false, message: 'Invalid email or password' }
    },
    
    // Register action (accept optional username)
    async register(email, password, confirmPassword, role = 1, username = '') {
      // Validation
      if (!email || !password || !confirmPassword) {
        return { success: false, message: 'Please fill in all fields' }
      }
      
      if (password !== confirmPassword) {
        return { success: false, message: 'Passwords do not match' }
      }
      
      if (password.length < 6) {
        return { success: false, message: 'Password must be at least 6 characters' }
      }
      
      // Demo registration - ในระบบจริงควรเรียก API
      this.user = email
      this.role = role
      this.isLoggedIn = true

      const displayName = username && username.trim() ? username.trim() : email.split('@')[0]

      if (import.meta.client) {
        localStorage.setItem('user', email)
        localStorage.setItem('userName', displayName)
        localStorage.setItem('userRole', String(this.role))
        // Persist mock-registered user so login() can find it later
        try {
          const regs = JSON.parse(localStorage.getItem('registeredUsers') || '[]')
          regs.push({ email, password, name: displayName, role })
          localStorage.setItem('registeredUsers', JSON.stringify(regs))
        } catch (e) {
          // ignore
        }
        try {
          const expires = new Date();
          expires.setDate(expires.getDate() + 7);
          document.cookie = `userlogin=1; path=/; expires=${expires.toUTCString()}`;
        } catch (e) {}
      }

      return { success: true, message: 'Registration successful!' }
    },
    
    // Logout action
    logout() {
      this.user = null
      this.isLoggedIn = false
      this.role = 1
      
      if (import.meta.client) {
        localStorage.removeItem('user')
        localStorage.removeItem('userName')
        localStorage.removeItem('userRole')
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
