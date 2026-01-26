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
      console.log('🔗 Affiliate button clicked')
      // เช็คว่าเป็น affiliate หรือยัง
      try {
        const authStore = useAuthStore();
        const userId = authStore.user?._id || authStore.user?.id;
        console.log('👤 User ID:', userId)
        
        if (!userId) {
          console.log('❌ No user ID, redirecting to login')
          this.$router.push('/page/auth/LoginPage');
          return;
        }

        console.log('📡 Checking affiliate status...')
        const data = await affiliateService.getMyAffiliate(userId);
        console.log('✅ Affiliate data found:', data)
        
        if (data && data._id) {
          this.isAffiliate = true;
          this.affiliateData = data;
          console.log('🚀 Navigating to affiliate dashboard...')
        this.$router.push('/afiliate/afiliatePage');
      }
      } catch (error) {
        console.log('⚠️ Not an affiliate yet, showing registration popup')
        console.error('Affiliate check error:', error)
        // ยังไม่ได้สมัคร affiliate
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
        console.error('Failed to register affiliate:', error);
        if (useNuxtApp().$showToast) {
          useNuxtApp().$showToast({ msg: 'เกิดข้อผิดพลาด กรุณาลองใหม่', type: 'error' });
        }
      }
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