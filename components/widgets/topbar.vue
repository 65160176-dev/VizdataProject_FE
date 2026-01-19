<template>
  <div class="top-header">
    <div class="container-fluid px-4">
      <div class="row">
        <div class="col-lg-6">
          <div class="header-contact">
            <ul>
              <li>Welcome to BDN Shop</li>
              <li>
                <i class="fa fa-phone" aria-hidden="true"></i>Call Us: 123 - 456 - 7890
              </li>
            </ul>
          </div>
        </div>

        <div class="col-lg-6 text-end">
          <ul class="header-dropdown">

            <HeaderNotification v-if="isLogin" />

            <li class="mobile-wishlist" v-if="isLogin">
              <a href="javascript:void(0)" @click="checkAffiliateStatus" style="color: inherit;">
                <i class="fa fa-handshake-o" aria-hidden="true"></i> Affiliate
              </a>
            </li>

            <li class="mobile-wishlist">
              <nuxt-link to="/page/account/wishlist" style="color: inherit">
                <i class="fa fa-heart" aria-hidden="true"></i> wishlist
              </nuxt-link>
            </li>

            <li class="onhover-dropdown mobile-account">
              <i class="fa fa-user" aria-hidden="true"></i> My Account
              <ul class="onhover-show-div">
                <li>
                  <nuxt-link to="/page/account/userdashboard">Dashboard</nuxt-link>
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

  <affiliateRegPopup v-if="showAffiliate" @close="closeAffiliateModal" @confirm="confirmAffiliate" />
</template>

<script>
import affiliateRegPopup from '~/pages/afiliate/affiliateRegPopup.vue';
import UserAuth from '../../pages/page/auth/auth'
import { useAuthStore } from '~/store/auth'
import HeaderNotification from '~/components/widgets/topbarItems/notification.vue'

export default {
  components: {
    affiliateRegPopup,
    HeaderNotification
  },
  data() {
    return {
      isLogin: false,
      showAffiliate: false,
      isAffiliate: false
    }
  },

  methods: {
    logout: function () {
      const auth = useAuthStore()
      if (auth && typeof auth.logout === 'function') auth.logout()
      try { UserAuth.Logout() } catch (e) { }
      this.isLogin = false
      this.$router.replace('/page/auth/LoginPage')
      if (this.isLogin) {
        UserAuth.Logout()
        this.$router.replace('/page/auth/LoginPage')
      }
      else {
        this.$router.replace('/page/auth/LoginPage')
      }
    },
    checkAffiliateStatus() {
      if (this.isAffiliate === true) {
        this.$router.push('/afiliate/afiliatePage');
      } else {
        this.showAffiliate = true;
      }
    },

    closeAffiliateModal() {
      this.showAffiliate = false;
    },

    confirmAffiliate() {
      this.isAffiliate = true;
      this.showAffiliate = false;
      this.$router.push('/afiliate/afiliatePage');
    }
  },
  created() {
    // ตรวจสอบสถานะ Login ตอนโหลดหน้าเว็บ
    this.isLogin = Boolean(useCookie('userlogin').value || (import.meta.client && localStorage.getItem('user')))
  },
  computed: {
  }
}   
</script>