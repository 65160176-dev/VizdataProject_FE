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

            <li class="mobile-affiliate" v-if="isLogin">
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
import { affiliateService } from '~/services/affiliate.service'

export default {
  components: {
    affiliateRegPopup,
    HeaderNotification
  },
  data() {
    return {
      isLogin: false,
      showAffiliate: false,
      isAffiliate: false,
      affiliateData: null
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
    async checkAffiliateStatus() {
      try {
        const authStore = useAuthStore();
        const userId = authStore.user?._id || authStore.user?.id;

        if (!userId) {
          this.$router.push('/page/auth/LoginPage');
          return;
        }

        const data = await affiliateService.getMyAffiliate(userId);

        if (data && data._id) {
          this.isAffiliate = true;
          this.affiliateData = data;
          this.$router.push('/afiliate/afiliatePage');
        }
      } catch (error) {
        this.isAffiliate = false;
        this.showAffiliate = true;
      }
    },

    closeAffiliateModal() {
      this.showAffiliate = false;
    },

    async confirmAffiliate() {
      try {
        const authStore = useAuthStore();
        const userId = authStore.user?._id || authStore.user?.id;
        if (!userId) return;

        await affiliateService.register(userId);
        this.isAffiliate = true;
        this.showAffiliate = false;
        if (useNuxtApp().$showToast) {
          useNuxtApp().$showToast({ msg: 'สมัคร Affiliate สำเร็จ!', type: 'success' });
        }
        this.$router.push('/afiliate/afiliatePage');
      } catch (error) {
        if (useNuxtApp().$showToast) {
          useNuxtApp().$showToast({ msg: 'เกิดข้อผิดพลาด กรุณาลองใหม่', type: 'error' });
        }
      }
    }
  },
  created() {
    this.isLogin = Boolean(useCookie('userlogin').value || (import.meta.client && localStorage.getItem('user')))
  },
  watch: {
    isLogin: {
      immediate: true,
      handler(newVal) {
        if (import.meta.client) {
          if (newVal) {
            // ล็อกอิน: แบ่ง 4 ช่อง
            document.documentElement.style.setProperty('--nav-wishlist-pos', '40%');
            document.documentElement.style.setProperty('--nav-cart-pos', '60%');
            document.documentElement.style.setProperty('--nav-account-pos', '80%');
          } else {
            // ไม่ล็อกอิน: แบ่ง 3 ช่อง
            document.documentElement.style.setProperty('--nav-wishlist-pos', '25%');
            document.documentElement.style.setProperty('--nav-cart-pos', '50%');
            document.documentElement.style.setProperty('--nav-account-pos', '75%');
          }
        }
      }
    }
  }
}   
</script>

<style scoped>
.onhover-dropdown .onhover-show-div {
  left: auto !important;
  right: 0 !important;
}
</style>