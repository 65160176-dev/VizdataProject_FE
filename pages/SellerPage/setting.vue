<template>
  <div class="setting-container">
    <div class="setting-header">
      <h2>ตั้งค่าระบบ</h2>
      <p class="text-muted">จัดการการแจ้งเตือนและรูปแบบการแสดงผล</p>
    </div>

    <div class="setting-card">
      <div class="setting-row">
        <div class="setting-info">
          <div class="setting-label">
            <Icon name="feather:bell" size="20" class="me-2" /> 
            การแจ้งเตือน
          </div>
          <div class="setting-desc">รับการแจ้งเตือนเมื่อมีคำสั่งซื้อใหม่</div>
        </div>
        <div class="setting-action">
          <label class="switch">
            <input type="checkbox" v-model="notification" @change="saveSettings">
            <span class="slider round"></span>
          </label>
        </div>
      </div>

      <hr class="divider">

      <div class="setting-row">
        <div class="setting-info">
          <div class="setting-label">
            <Icon name="feather:moon" size="20" class="me-2" />
            โหมดกลางคืน (Dark Mode)
          </div>
          <div class="setting-desc">เปลี่ยนธีมเป็นสีเข้ม (Theme Default)</div>
        </div>
        <div class="setting-action">
          <label class="switch">
            <input type="checkbox" v-model="isDarkMode">
            <span class="slider round"></span>
          </label>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLayoutStore } from '~/store/layout'

definePageMeta({
  layout: 'seller'
})

const layoutStore = useLayoutStore()
const notification = ref(true)

// --- Logic เชื่อมต่อ Store ---
const isDarkMode = computed({
  get() {
    return layoutStore.layout.version === 'dark'
  },
  set(val) {
    // เรียกฟังก์ชันเปลี่ยนธีมของ Store (Multikart)
    layoutStore.setLayoutVersion()
  }
})

onMounted(() => {
  // Init store เพื่อโหลดค่าล่าสุด
  layoutStore.set()

  const savedNotify = localStorage.getItem('seller_notify')
  if (savedNotify !== null) {
    notification.value = JSON.parse(savedNotify)
  }
})

const saveSettings = () => {
  localStorage.setItem('seller_notify', JSON.stringify(notification.value))
}
</script>

<style scoped>
/* --- Light Mode (Default) --- */
.setting-container { padding: 30px; max-width: 800px; margin: 0 auto; }
.setting-header { margin-bottom: 25px; }
.setting-header h2 { font-weight: 700; color: #333; margin-bottom: 5px; }
.setting-card { background: #fff; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); padding: 30px; }
.setting-row { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; }
.setting-label { font-size: 18px; font-weight: 600; color: #2c3e50; display: flex; align-items: center; gap: 10px; }
.setting-desc { font-size: 14px; color: #7f8c8d; margin-top: 5px; margin-left: 34px; }
.divider { border: 0; border-top: 1px solid #f0f0f0; margin: 20px 0; }

/* Switch CSS */
.switch { position: relative; display: inline-block; width: 52px; height: 28px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; transition: .4s; }
.slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 4px; bottom: 4px; background-color: white; transition: .4s; }
input:checked + .slider { background-color: #f0543b; }
input:checked + .slider:before { transform: translateX(24px); }
.slider.round { border-radius: 34px; }
.slider.round:before { border-radius: 50%; }

/* --- 🔥 DARK MODE OVERRIDES 🔥 --- */
/* ทำงานเมื่อ body มี class="dark" (จาก Store) */

:global(body.dark) .setting-header h2 { color: #fff; }
:global(body.dark) .text-muted { color: #aaa !important; }
:global(body.dark) .setting-card { background-color: #1e1e2f; box-shadow: 0 5px 20px rgba(0,0,0,0.2); }
:global(body.dark) .setting-label { color: #e0e0e0; }
:global(body.dark) .setting-desc { color: #888; }
:global(body.dark) .divider { border-top-color: #333; }
</style>