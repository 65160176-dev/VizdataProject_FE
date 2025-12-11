export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware for auth pages to avoid redirect loops
  if (to.path && to.path.startsWith('/page/auth')) {
    return
  }

  // Only run on client side
  if (import.meta.client) {
    const user = localStorage.getItem('user')

    if (!user) {
      // User not logged in, redirect to login with return URL
      // Avoid redirecting to the same login page repeatedly
      const loginPath = '/page/auth/LoginPage'
      if (to.fullPath === loginPath || to.fullPath.startsWith(loginPath + '?')) {
        return
      }
      return navigateTo(`${loginPath}?redirect=${encodeURIComponent(to.fullPath)}`)
    }
  }
})