<template>
  <div class="top-header">
    <div class="container">
      <div class="row">
        <div class="col-lg-6">
          <div class="header-contact">
            <ul>
              <li>Welcome to Our store Multikart</li>
              <li>
                <i class="fa fa-phone" aria-hidden="true"></i>Call Us: 123 - 456 - 7890
              </li>
            </ul>
          </div>
        </div>
        <div class="col-lg-6 text-end">
          <ul class="header-dropdown">
            <li class="mobile-wishlist">
              <nuxt-link to="/page/account/wishlist">
                <i class="fa fa-heart" aria-hidden="true"></i>
              </nuxt-link>
            </li>
            <li class="onhover-dropdown mobile-account">
              <i class="fa fa-user" aria-hidden="true"></i> My Account
              <ul class="onhover-show-div">
                <li>
                  <nuxt-link to="/page/account/dashboard">Dashboard</nuxt-link>
                </li>


                <li @click="logout">
                  <nuxt-link to="javascript:void(0)">
                    {{ isLogin ? 'Logout' : 'Login' }}
                  </nuxt-link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import UserAuth from '../../pages/page/auth/auth'
import { useAuthStore } from '~/store/auth'
export default {
  data() {
    return {
      isLogin: false
    }
  },

  methods: {
    logout: function () {
      const auth = useAuthStore()
      // Ensure Pinia state and localStorage are cleared
      if (auth && typeof auth.logout === 'function') auth.logout()
      // Keep cookie-based logout for compatibility with other parts
      try { UserAuth.Logout() } catch (e) {}
      this.isLogin = false
      this.$router.replace('/page/auth/LoginPage')
    }
  },
  created() {
    this.isLogin = Boolean(useCookie('userlogin').value || (import.meta.client && localStorage.getItem('user')))
  },
}
</script>
