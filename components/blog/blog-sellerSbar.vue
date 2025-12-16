<template>
  <aside class="sidebar-wrapper seller-theme"> 
    <div class="logo-wrapper">
       <h5 class="text-center py-3">SELLER CENTER</h5>
    </div>
    <nav class="sidebar-main">
      <ul class="sidebar-links list-unstyled">
        <SidebarItem 
          v-for="(item, index) in store.data" 
          :key="index" 
          :menuItem="item" 
        />
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { useSellerStore } from "@/store/seller";
// ถ้าหน้าเว็บไม่แสดงเมนู ลอง Uncomment บรรทัดล่างนี้ดูครับ (บางที Nuxt หาข้ามโฟลเดอร์ไม่เจอ)
// import SidebarItem from '~/components/SidebarItem.vue';

const store = useSellerStore();
</script>

<style scoped>
/* *** ส่วนที่ต้องเพิ่มเพื่อให้เป็น Sidebar *** */
.sidebar-wrapper.seller-theme {
  width: 280px;      /* 1. ต้องกำหนดความกว้าง */
  height: 100vh;     /* 2. สูงเต็มจอ */
  position: fixed;   /* 3. ยึดติดจอไม่ให้ขยับ */
  top: 0;
  left: 0;
  overflow-y: auto;  /* 4. ให้เลื่อนขึ้นลงได้ถ้าเมนูเยอะ */
  z-index: 99;       /* 5. ให้อยู่ชั้นบนสุด */
  
  /* ส่วนตกแต่งเดิมของคุณ */
  background: #fff; 
  border-right: 1px solid #ff9900; 
  transition: all 0.3s;
}

/* ปรับแต่ง Logo Wrapper นิดหน่อยให้สวยงาม */
.logo-wrapper {
  padding: 10px;
  border-bottom: 1px solid #eee;
}
</style>