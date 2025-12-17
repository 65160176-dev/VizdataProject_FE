<template>
  <div class="page-wrapper">
    
    <SellerSidebar />

    <div class="page-body-wrapper">
      <div class="page-body">
        <slot />
      </div>
    </div>
    
  </div>
</template>

<script setup>
// *** ใส่บรรทัดนี้: Import เข้ามาเองตรงๆ ***
// เช็ค Path ให้เป๊ะนะครับ ว่าไฟล์อยู่ที่ components/blog/blog-sellerSbar.vue จริงไหม
import SellerSidebar from '~/components/SellerSidebar.vue'
</script>

<style scoped>
.page-wrapper {
  display: flex;
  width: 100%;
}
.page-body-wrapper {
  flex-grow: 1;
  margin-left: 240px; /* ต้องเว้นที่ให้ Sidebar (ปรับให้เท่ากับ width ของ SellerSidebar) */
  min-height: 100vh;
  background-color: #fcfcfc;
  transition: 0.3s;
}
</style>