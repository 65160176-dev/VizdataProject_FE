import { useAuthStore } from '~/store/auth'
export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log('🔐 Auth middleware running for:', to.path)
  if (to.path && to.path.startsWith('/page/auth')) {
    console.log('⏩ Skipping auth check for auth page')
    return
  }
if (import.meta.client) {
    const authStore = useAuthStore()
    console.log('👤 Current auth state:', { isLoggedIn: authStore.isLoggedIn, user: authStore.user?.username })
    
    // Initialize auth if not already done
    if (!authStore.isLoggedIn) {
      console.log('🔄 Initializing auth...')
      await authStore.initAuth()
      console.log('✅ Auth initialized:', { isLoggedIn: authStore.isLoggedIn, user: authStore.user?.username })
    }
    
    if (!authStore.isLoggedIn || !authStore.user) {
      const loginPath = '/page/auth/LoginPage'
      if (to.fullPath === loginPath || to.fullPath.startsWith(loginPath + '?')) {
        return
      }
      return navigateTo(`${loginPath}?redirect=${encodeURIComponent(to.fullPath)}`)
    }

    // If the route is a seller-only route, ensure the user has seller role (role === 0)
    if (to.path && to.path.startsWith('/SellerPage')) {
      if (authStore.userType !== 0) {
        // Not authorized for seller pages — send to home
        console.log('🚫 User not authorized for seller pages')
        return navigateTo('/')
      }
    }
  }
})