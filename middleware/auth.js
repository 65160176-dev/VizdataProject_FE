export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware for auth pages to avoid redirect loops
  if (to.path && to.path.startsWith('/page/auth')) {
    return
  }

  // Only run on client side
  if (import.meta.client) {
    const user = localStorage.getItem('user')
    const role = Number(localStorage.getItem('userRole') || 1)

    if (!user) {
      // User not logged in, redirect to login with return URL
      // Avoid redirecting to the same login page repeatedly
      const loginPath = '/page/auth/LoginPage'
      if (to.fullPath === loginPath || to.fullPath.startsWith(loginPath + '?')) {
        return
      }
      return navigateTo(`${loginPath}?redirect=${encodeURIComponent(to.fullPath)}`)
    }

    // If the route is a seller-only route, ensure the user has seller role (role === 0)
    if (to.path && to.path.startsWith('/SellerPage')) {
      if (role !== 0) {
        // Not authorized for seller pages — send to home
        return navigateTo('/')
      }
    }
  }
})