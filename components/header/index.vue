<template>
  <div>
    <header class="position-relative">

      <div class="mobile-fix-option"></div>
      <WidgetsTopbar />
      <div class="container-fluid px-4">
        <div class="row">
          <div class="col-12">
            <div class="main-menu">

              <div class="menu-left">
                <div class="brand-logo">
                  <nuxt-link :to="{ path: '/' }">
                    <img src="/images/icon/logo.png" class="img-fluid" alt="logo" />
                  </nuxt-link>
                </div>
              </div>

              <div class="menu-right pull-right">
                <WidgetsNavbar />
                <WidgetsHeaderWidgets />
              </div>

            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  data() {
    return {
      leftSidebarVal: false
    }
  },
  methods: {
    left_sidebar() {
      this.leftSidebarVal = !this.leftSidebarVal
    },
    closeBarValFromChild(val) {
      this.leftSidebarVal = val
    }
  },
}
</script>

<style scoped>
/* ==========================================
   CSS จัดระเบียบ Bottom Navigation (แถบล่างมือถือ)
   (แก้ไขสี, ตำแหน่ง Badge, และไอคอนซ้อน)
============================================= */
@media (max-width: 577px) {

  /* 1. ล้างค่าโครงสร้างหลัก และล็อคตำแหน่งให้อยู่แถบล่าง */
  :deep(.mobile-affiliate),
  :deep(.mobile-wishlist),
  :deep(.mobile-cart),
  :deep(.mobile-account) {
    position: fixed !important;
    bottom: 0 !important;
    /* ดันลงให้ติดขอบล่างสุด */
    height: 60px !important;
    /* ให้ความสูงเท่ากับแถบสีขาวพอดี */
    right: auto !important;
    transform: translateX(-50%) !important;
    z-index: 999 !important;
    padding: 0 !important;
    margin: 0 !important;
    list-style: none !important;
    display: flex !important;
    justify-content: center;
    align-items: center;
  }

  /* 2. ซ่อนตัวหนังสือให้หมด (เหลือแต่ไอคอน) */
  :deep(.mobile-affiliate > a),
  :deep(.mobile-wishlist > a),
  :deep(.mobile-account),
  :deep(.mobile-cart > a) {
    font-size: 0 !important;
    color: transparent !important;
    text-decoration: none !important;
    display: flex !important;
    justify-content: center;
    align-items: center;
  }

  /* 3. 🚨 บังคับสีและความเข้มของไอคอนให้ดำสนิทเท่ากัน 100% 🚨 */
  :deep(.mobile-affiliate i),
  :deep(.mobile-wishlist i),
  :deep(.mobile-account i),
  :deep(.mobile-cart i) {
    font-size: 24px !important;
    /* ปรับขนาดให้เท่าแอปทั่วไป */
    color: #333333 !important;
    opacity: 1 !important;
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
  }

  /* คืนค่าตัวหนังสือใน Popup My Account ไม่ให้พัง */
  :deep(.mobile-account .onhover-show-div a) {
    font-size: 14px !important;
    color: #333333 !important;
  }

  /* 4. 🚨 จัดการตะกร้า (Cart) 🚨 */
  /* ซ่อนรูปภาพตะกร้าทิ้ง ให้เหลือแค่ Icon ลายเส้น */
  :deep(.mobile-cart > a > img) {
    display: none !important;
  }

  /* ล็อคให้ Badge สีแดงเกาะติดกับไอคอนตะกร้า ไม่ลอยหนี */
  :deep(.mobile-cart > a) {
    position: relative !important;
    width: auto !important;
    height: auto !important;
  }

  /* จัดตำแหน่งตัวเลข Badge สีแดงให้มุมขวาบนเป๊ะๆ */
  :deep(.cart_qty_cls) {
    position: absolute !important;
    top: -6px !important;
    right: -10px !important;
    background-color: #ff4c3b !important;
    color: white !important;
    font-size: 11px !important;
    font-weight: bold !important;
    width: 18px !important;
    height: 18px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 50% !important;
    padding: 0 !important;
    margin: 0 !important;
    line-height: 1 !important;
    border: 1px solid #fff !important;
    /* เพิ่มขอบขาวให้ดูมีมิติแบบแอป */
  }

  /* 5. ซ่อนปุ่มค้นหาและตั้งค่า ที่ไม่ได้ใช้ */
  :deep(.mobile-search),
  :deep(.mobile-setting) {
    display: none !important;
  }

  /* 6. กำหนดตำแหน่งซ้าย-ขวา (รับค่าจาก JavaScript ใน topbar.vue) */
  :deep(.mobile-affiliate) {
    left: 20% !important;
  }

  :deep(.mobile-wishlist) {
    left: var(--nav-wishlist-pos, 25%) !important;
    transition: left 0.3s ease;
  }

  :deep(.mobile-cart) {
    left: var(--nav-cart-pos, 50%) !important;
    transition: left 0.3s ease;
  }

  :deep(.mobile-account) {
    left: var(--nav-account-pos, 75%) !important;
    transition: left 0.3s ease;
  }
}
</style>