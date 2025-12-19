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
import { ref } from 'vue'
import SellerSidebar from '~/components/SellerSidebar.vue'

const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.page-wrapper {
  display: flex;
  width: 100%;
}

.page-body-wrapper {
  flex-grow: 1;
  margin-left: 260px; 
  min-height: 100vh;
  background-color: #fcfcfc; /* สีพื้นหลัง Light Mode */
  transition: margin-left 0.3s ease-in-out, background-color 0.3s ease;
  padding: 24px;
}

/* เมื่อ Sidebar หุบ */
.page-body-wrapper.collapsed {
  margin-left: 80px;
}

/* --- 🔥 DARK MODE OVERRIDE (แก้ตรงนี้) 🔥 --- */
/* เมื่อ body มี class="dark" ให้เปลี่ยนสีพื้นหลังของส่วนเนื้อหาทั้งหมด */
:global(body.dark) .page-body-wrapper,
:global(body.dark) .page-body {
  background-color: #121212 !important; /* เปลี่ยนเป็นสีดำ */
}
</style>