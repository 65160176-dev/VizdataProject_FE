<template>
  <div>
    <footer class="footer-light">
      <section class="section-b-space light-layout">
        <div class="container-fluid px-4">
          <div class="row footer-theme partition-f">

            <div class="col-lg-4 col-md-6">
              <div class="footer-title footer-mobile-title">
                <h4>About Us</h4>
              </div>
              <div class="footer-contant">
                <div class="footer-logo">
                  <img src='/images/icon/logo.jpg' alt="logo" style="max-width: 150px;" />
                </div>
                <p>เปลี่ยนทุกการช้อปให้เป็นโอกาส และเปลี่ยนคุณให้เป็นเจ้าของธุรกิจเพียงปลายนิ้ว เพราะที่นี่เราเชื่อว่า
                  'ผู้ซื้อที่ดี คือผู้ขายที่จริงใจ' ร่วมส่งต่อสินค้าที่คุณรัก ป้ายยาความคุ้มค่าที่คุณหลงใหล
                  แล้วเปลี่ยนทุกยอดการแบ่งปันให้เป็นรายได้ไปพร้อมกับเรา</p>
                <div class="footer-social">
                  <ul>
                    <li><a href="#"><i class="fa fa-facebook" aria-hidden="true"></i></a></li>
                    <li><a href="#"><i class="fa fa-google-plus" aria-hidden="true"></i></a></li>
                    <li><a href="#"><i class="fa fa-twitter" aria-hidden="true"></i></a></li>
                    <li><a href="#"><i class="fa fa-instagram" aria-hidden="true"></i></a></li>
                    <li><a href="#"><i class="fa fa-rss" aria-hidden="true"></i></a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="col offset-xl-1">
              <div class="sub-title">
                <div class="footer-title">
                  <h4>My Account</h4>
                </div>
                <div class="footer-contant">
                  <ul>
                    <li><nuxt-link to="/page/account/userdashboard">โปรไฟล์ของฉัน</nuxt-link></li>
                    <li><nuxt-link to="/page/account/userdashboard?tab=orders">ประวัติการสั่งซื้อ</nuxt-link></li>
                    <li><nuxt-link to="/page/account/wishlist">รายการที่ชอบ</nuxt-link></li>
                    <li><a href="javascript:void(0)" @click="checkAffiliateStatus">Affiliate</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="col">
              <div class="sub-title">
                <div class="footer-title">
                  <h4>Customer Service</h4>
                </div>
                <div class="footer-contant">
                  <ul>
                    <li>วิธีการสั่งซื้อ</li>
                    <li>นโยบายการคืนสินค้า</li>
                    <li>คำถามที่พบบ่อย (FAQ)</li>
                    <li>นโยบายความเป็นส่วนตัว</li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="col">
              <div class="sub-title">
                <div class="footer-title">
                  <h4>Contact Info</h4>
                </div>
                <div class="footer-contant">
                  <ul class="contact-list">
                    <li><i class="fa fa-map-marker"></i> 123 อาคารแฟชั่น ถนนสุขุมวิท กรุงเทพฯ 10110</li>
                    <li><i class="fa fa-phone"></i> โทร: 012-345-6789</li>
                    <li><i class="fa fa-envelope-o"></i> อีเมล: vizdata@Ecommerce.com</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <div class="sub-footer">
        <div class="container-fluid px-4">
          <div class="row">
            <div class="col-xl-6 col-md-6 col-sm-12">
              <div class="footer-end">
                <p><i class="fa fa-copyright"></i> 2024 Vizdata-Ecommerce. All Rights Reserved.</p>
              </div>
            </div>
            <div class="col-xl-6 col-md-6 col-sm-12">
              <div class="payment-card-bottom">
                <ul>
                  <li><img src='/images/icon/visa.png' alt="visa" /></li>
                  <li><img src='/images/icon/mastercard.png' alt="mastercard" /></li>
                  <li><img src='/images/icon/paypal.png' alt="paypal" /></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>

    <affiliateRegPopup v-if="showAffiliate" :show="showAffiliate" @close="closeAffiliateModal"
      @confirm="confirmAffiliate" />
  </div>
</template>

<script>
// ตรวจสอบ Path การ import เหล่านี้ให้ตรงกับโครงสร้างไฟล์จริงนะครับ
import affiliateRegPopup from '~/pages/afiliate/affiliateRegPopup.vue';
import { useAuthStore } from '~/store/auth'
import { affiliateService } from '~/services/affiliate.service'

export default {
  components: {
    affiliateRegPopup
  },
  data() {
    return {
      showAffiliate: false,
      isAffiliate: false,
      affiliateData: null
    }
  },
  methods: {
    // ✅ เช็คสถานะ (ถ้าเป็นแล้วไปหน้า Dashboard / ถ้ายังไม่เป็นให้เปิด Modal)
    async checkAffiliateStatus() {
      try {
        const authStore = useAuthStore();
        const userId = authStore.user?._id || authStore.user?.id;

        // ถ้ายังไม่ได้ Login ให้ส่งไปหน้า Login
        if (!userId) {
          // ตรวจสอบ Path นี้ด้วยนะครับ ปกติมักจะเป็น /page/account/login หรือ /page/auth/login
          this.$router.push('/page/auth/LoginPage');
          return;
        }

        const data = await affiliateService.getMyAffiliate(userId);

        if (data && data._id) {
          this.isAffiliate = true;
          this.affiliateData = data;
          // เป็นสมาชิกแล้ว -> ไปหน้า Affiliate
          this.$router.push('/afiliate/afiliatePage');
        } else {
          // ถ้าไม่มีข้อมูลแต่ไม่ Error (เช่น return null) ให้เปิด Modal
          this.showAffiliate = true;
        }
      } catch (error) {
        // หากหาไม่เจอ (404) หรือยังไม่เป็นสมาชิก -> เปิด Modal สมัคร
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
  }
}
</script>

<style scoped>
.footer-contant ul li a {
  cursor: pointer;
}
</style>