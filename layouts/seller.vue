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
import { ref, onMounted, onBeforeUnmount } from 'vue'
import SellerSidebar from '~/components/SellerSidebar.vue'
import { useAuthStore } from '~/store/auth'

const isCollapsed = ref(false)
const auth = useAuthStore()

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

// 🌟 ฟังก์ชันดักจับขนาดหน้าจอ
const checkScreenSize = () => {
  if (window.innerWidth <= 991) {
    isCollapsed.value = true // ถ้าจอเล็ก (มือถือ/แท็บเล็ต) ให้พับ Sidebar อัตโนมัติ
  } else {
    isCollapsed.value = false // ถ้าจอคอม ให้กางปกติ
  }
}

onMounted(async () => {
  checkScreenSize() // เช็คขนาดจอตอนโหลดหน้าครั้งแรก
  window.addEventListener('resize', checkScreenSize) // ดักจับเวลามีการย่อ/ขยายหน้าต่างเบราว์เซอร์

  try {
    if (auth && typeof auth.initAuth === 'function') {
      await auth.initAuth()
    }
  } catch (e) {
    // silent
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style scoped>
.page-wrapper {
  width: 100%;
  min-height: 100vh;
  overflow-x: hidden; /* ป้องกันเนื้อหาล้นจนเกิด Scrollbar แนวนอน */
}

.page-body-wrapper {
  margin-left: 260px; 
  width: calc(100% - 260px); 
  min-height: 100vh;
  background-color: #fcfcfc; 
  transition: margin-left 0.3s ease-in-out, width 0.3s ease-in-out, background-color 0.3s ease;
  padding: 24px;
}

.page-body-wrapper.collapsed {
  margin-left: 80px;
  width: calc(100% - 80px); 
}

/* --- 🌟 จัดการพื้นที่บนมือถือและแท็บเล็ต --- */
@media (max-width: 991px) {
  .page-body-wrapper {
    /* บังคับให้เนื้อหาหลักอิงตามขนาด Sidebar ตอนพับเสมอ เนื้อหาจะได้ไม่ถูกบีบ */
    margin-left: 80px !important;
    width: calc(100% - 80px) !important;
    padding: 15px; /* ลดขอบลง ให้มีพื้นที่แสดงผลมากขึ้น */
  }
}

/* --- 🔥 DARK MODE OVERRIDE 🔥 --- */
:global(body.dark) .page-body-wrapper,
:global(body.dark) .page-body {
  background-color: #121212 !important; 
}
</style>