<template>
  <div class="page-wrapper">
    
    <SellerSidebar 
      :isCollapsed="isCollapsed" 
      @toggle="toggleSidebar" 
    />

    <div class="page-body-wrapper" :class="{ 'collapsed': isCollapsed }">
      <div class="page-body">
        <slot />
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SellerSidebar from '~/components/SellerSidebar.vue'
import { useAuthStore } from '~/store/auth'

const isCollapsed = ref(false)
const auth = useAuthStore()

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

onMounted(async () => {
  // Ensure auth state (including avatar) is initialized on client mount
  try {
    if (auth && typeof auth.initAuth === 'function') {
      await auth.initAuth()
    }
  } catch (e) {
    // silent
  }
})
</script>

<style scoped>
.page-wrapper {
  /* ลบ display: flex; ออก เพราะ Sidebar เป็น Fixed ลอยอยู่แล้ว */
  width: 100%;
  min-height: 100vh;
}

.page-body-wrapper {
  /* กำหนดให้ความกว้างลบด้วยพื้นที่ของ Sidebar เสมอ เนื้อหาจะได้ไม่ล้นไปทางขวา */
  margin-left: 260px; 
  width: calc(100% - 260px); 
  
  min-height: 100vh;
  background-color: #fcfcfc; /* สีพื้นหลัง Light Mode */
  
  /* เพิ่ม width เข้าไปใน transition ให้มันยืดหดสมูทไปพร้อมกับ margin */
  transition: margin-left 0.3s ease-in-out, width 0.3s ease-in-out, background-color 0.3s ease;
  padding: 24px;
}

/* เมื่อ Sidebar หุบ */
.page-body-wrapper.collapsed {
  margin-left: 80px;
  width: calc(100% - 80px); /* คืนพื้นที่ความกว้างกลับมาตอนหุบ */
}

/* --- 🔥 DARK MODE OVERRIDE 🔥 --- */
/* เมื่อ body มี class="dark" ให้เปลี่ยนสีพื้นหลังของส่วนเนื้อหาทั้งหมด */
:global(body.dark) .page-body-wrapper,
:global(body.dark) .page-body {
  background-color: #121212 !important; /* เปลี่ยนเป็นสีดำ */
}
</style>