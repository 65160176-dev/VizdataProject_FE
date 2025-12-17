<template>
  <div class="top-header">
    <div class="container">
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
            <li class="mobile-wishlist">
              <nuxt-link to="/page/account/notification" style="color: inherit">
                <div class="notification-icon-wrapper">
                  <i class="fa fa-bell" aria-hidden="true"></i>
                  <span v-if="unreadCount > 0" class="badge-count">
                    {{ unreadCount }}
                  </span>
                </div>
                Notification
              </nuxt-link>
            </li>
            <li class="mobile-wishlist">
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
  <affiliateRegPopup v-if="showAffiliate" @close="closeAffiliateModal" @confirm="confirmAffiliate" />

</template>

<script>
import affiliateRegPopup from '~/pages/afiliate/affiliateRegPopup.vue';
import UserAuth from '../../pages/page/auth/auth'
import { useAuthStore } from '~/store/auth'
import notificationData from "~/data/notificationData.json"
export default {
  components: {
    affiliateRegPopup
  },
  data() {
    return {
      isLogin: false,
      showAffiliate: false,
      isAffiliate: false,
      notifications: notificationData
    }
  },

  methods: {
    logout: function () {
      const auth = useAuthStore()
      // Ensure Pinia state and localStorage are cleared
      if (auth && typeof auth.logout === 'function') auth.logout()
      // Keep cookie-based logout for compatibility with other parts
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
    }, checkAffiliateStatus() {
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
    this.isLogin = Boolean(useCookie('userlogin').value || (import.meta.client && localStorage.getItem('user')))
  },
  computed: {
    // 3. Logic เดิม: นับจำนวนที่ isRead = false
    unreadCount() {
      // เช็คก่อนว่ามีข้อมูลไหม เพื่อป้องกัน Error กรณีไฟล์ว่าง
      if (!this.notifications) return 0;

      return this.notifications.filter(n => n.isRead === false).length;
    }
  }
}   
</script>

<style scoped>
/* จัดตำแหน่ง wrapper ให้เป็น relative เพื่อให้ badge อ้างอิงตำแหน่งได้ */
.notification-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-right: 5px;
  /* เว้นระยะห่างจากคำว่า Notification เล็กน้อย */
}

/* ดีไซน์ตัวเลขแจ้งเตือน */
.badge-count {
  position: absolute;
  top: -8px;
  /* ปรับขึ้นลงตรงนี้ */
  right: -6px;
  /* ปรับซ้ายขวาตรงนี้ */

  background-color: #ff4c3b;
  /* สีแดง (หรือเปลี่ยนตาม Theme ร้าน) */
  color: white;
  border-radius: 50%;
  /* ทำเป็นวงกลม */

  font-size: 10px;
  font-weight: bold;

  /* กำหนดขนาดวงกลม */
  min-width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: 1px solid #fff;
  /* ขอบขาวเล็กน้อยเพื่อให้ตัดกับพื้นหลัง */
}
</style>