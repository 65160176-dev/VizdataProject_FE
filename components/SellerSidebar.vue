<template>
  <aside class="seller-sidebar" :class="{ 'collapsed': isCollapsed }">
    
    <button class="toggle-btn" @click="toggleSidebar">
      <Icon :name="isCollapsed ? 'feather:chevron-right' : 'feather:chevron-left'" size="18" />
    </button>

    <div class="sidebar-top">
      <div class="profile">
        <img :src="avatar" alt="avatar" class="avatar" />
        <div class="profile-info" v-show="!isCollapsed">
          <div class="name text-truncate">{{ displayName }}</div>
          <div class="role">Seller</div>
        </div>
      </div>

      <div class="profile-actions" v-if="!isCollapsed">
        <NuxtLink to="/SellerPage/editProfile" class="btn btn-sm btn-outline-primary w-100">แก้ไขโปรไฟล์</NuxtLink>
      </div>
      <div class="profile-actions justify-content-center" v-else>
         <NuxtLink to="/SellerPage/editProfile" class="btn btn-sm btn-outline-primary p-1">
            <Icon name="feather:edit" size="14"/>
         </NuxtLink>
      </div>
    </div>

    <hr class="sidebar-divider" />

    <nav class="sidebar-menu">
      <ul>
        <li>
          <NuxtLink to="/SellerPage/dashboard" :class="['menu-item', { 'is-active': isActive('/SellerPage/dashboard') }]" title="Dashboard">
            <span class="icon-slot">📊</span>
            <span class="menu-label" v-show="!isCollapsed">Dashboard</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/productPage" :class="['menu-item', { 'is-active': isActive('/SellerPage/productPage') }]" title="Product">
            <span class="icon-slot">📦</span>
            <span class="menu-label" v-show="!isCollapsed">Product</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/shippingPage" :class="['menu-item', { 'is-active': isActive('/SellerPage/shippingPage') }]" title="Shipping">
            <span class="icon-slot">🚚</span>
            <span class="menu-label" v-show="!isCollapsed">Shipping</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/category" :class="['menu-item', { 'is-active': isActive('/SellerPage/category') }]" title="Category">
            <span class="icon-slot">📂</span>
            <span class="menu-label" v-show="!isCollapsed">Category</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/order" :class="['menu-item', { 'is-active': isActive('/SellerPage/order') }]" title="Order">
             <span class="icon-slot">📋</span>
             <span class="menu-label" v-show="!isCollapsed">Order</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/orderStatus" :class="['menu-item', { 'is-active': isActive('/SellerPage/orderStatus') }]" title="Order Status">
             <span class="icon-slot">📝</span>
             <span class="menu-label" v-show="!isCollapsed">Order Status</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/setting" :class="['menu-item', { 'is-active': isActive('/SellerPage/setting') }]" title="Settings">
             <span class="icon-slot">⚙️</span>
             <span class="menu-label" v-show="!isCollapsed">Settings</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="sidebar-bottom">
      
      <button class="theme-btn" @click="toggleTheme" :title="isDarkMode ? 'Light Mode' : 'Dark Mode'">
        <span class="icon-slot">
          <Icon :name="isDarkMode ? 'feather:sun' : 'feather:moon'" size="18" />
        </span>
        <span class="menu-label" v-show="!isCollapsed">
          {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
        </span>
      </button>

      <button class="logout-btn" @click="logout" :title="isCollapsed ? 'Logout' : ''">
        <span v-if="isCollapsed">⎋</span>
        <span v-else>⎋ Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import UserAuth from '~/pages/page/auth/auth'
import { useAuthStore } from '~/store/auth'

const router = useRouter()
const auth = useAuthStore()
const route = useRoute()

// --- State Sidebar ---
const isCollapsed = ref(false)
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

// --- State Theme (Dark Mode) ---
const isDarkMode = ref(false)

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  if (isDarkMode.value) {
    document.body.classList.add('dark-mode')
    localStorage.setItem('theme', 'dark')
  } else {
    document.body.classList.remove('dark-mode')
    localStorage.setItem('theme', 'light')
  }
}

// --- User Data ---
const displayName = computed(() => auth.userName || 'ร้านของฉัน')
const avatar = ref('/images/avtar.jpg')

onMounted(() => {
  auth.initAuth && auth.initAuth()
  
  // โหลดรูป Profile
  const savedAvatar = localStorage.getItem('sellerAvatar')
  if (savedAvatar) avatar.value = savedAvatar

  // [เพิ่ม] โหลด Theme ที่จำไว้
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    document.body.classList.add('dark-mode')
  }

  // Event Listeners เดิม
  const handler = () => {
    const a = localStorage.getItem('sellerAvatar')
    if (a) avatar.value = a
  }
  window.addEventListener('sellerProfileUpdated', handler)
  
  const storageHandler = (e) => {
    if (e.key === 'sellerAvatar') {
      avatar.value = e.newValue || '/images/avtar.jpg'
    }
  }
  window.addEventListener('storage', storageHandler)

  onUnmounted(() => {
    window.removeEventListener('sellerProfileUpdated', handler)
    window.removeEventListener('storage', storageHandler)
  })
})

function isActive(path) {
  try {
    // แก้ไข: เช็คว่าต้องตรงกันเป๊ะ หรือถ้าเป็น path ลูกต้องมี / คั่น (เช่น /order/123)
    return route.path === path || route.path.startsWith(path + '/')
  } catch (e) {
    return false
  }
}

function logout() {
  if (auth && typeof auth.logout === 'function') auth.logout()
  try { UserAuth.Logout() } catch (e) {}
  router.replace('/page/auth/LoginPage')
}
</script>

<style scoped>
.seller-sidebar{
  width: 260px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: linear-gradient(180deg, #fff, #fffaf0);
  border-right: 1px solid rgba(0,0,0,0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px 14px;
  box-shadow: 0 4px 18px rgba(14,20,30,0.06);
  z-index: 1000;
  transition: width 0.3s ease-in-out, background 0.3s;
}

.seller-sidebar.collapsed {
  width: 80px;
  padding: 18px 10px;
}

.seller-sidebar.collapsed .avatar {
  width: 40px;
  height: 40px;
  margin: 0 auto;
}

.seller-sidebar.collapsed .profile {
  justify-content: center;
}

.seller-sidebar.collapsed .menu-item {
  justify-content: center;
  padding: 10px 0;
}

.seller-sidebar.collapsed .logout-btn,
.seller-sidebar.collapsed .theme-btn {
  justify-content: center;
  text-align: center;
}

/* --- Toggle Button --- */
.toggle-btn {
  position: absolute;
  top: 15px;
  right: -12px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  z-index: 1001;
}
.toggle-btn:hover { background: #f8f9fa; }

.sidebar-divider {
  margin: 15px 0;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
}

.sidebar-top .profile{
  display:flex;
  gap:12px;
  align-items:center;
  padding:8px 4px;
  overflow: hidden;
}

.avatar{
  width:56px;
  height:56px;
  border-radius:12px;
  object-fit:cover;
  background:#eee;
  box-shadow:0 2px 6px rgba(0,0,0,0.06);
  transition: all 0.3s;
}

.profile-info .name{
  font-weight:700;
  font-size:14px;
  white-space: nowrap;
}
.profile-info .role{
  font-size:12px;
  color:#9a7b4f;
  white-space: nowrap;
}

.sidebar-menu{ flex:1; overflow:hidden; }
.sidebar-menu ul{ list-style:none; padding:0; margin:0; }
.sidebar-menu ul li{ display:block; margin-bottom: 4px;}

.menu-item{
  display:flex;
  align-items:center;
  gap:8px;
  padding:10px 12px;
  color:#3b3b3b;
  border-radius:10px;
  text-decoration:none;
  font-weight:600;
  transition:all .15s ease;
  white-space: nowrap;
}
.icon-slot {
  font-size: 18px;
  min-width: 24px;
  text-align: center;
}

.menu-item:hover{ transform:translateX(2px); background:rgba(255,249,240,0.8); }
.menu-item.is-active{ background:linear-gradient(90deg,#fff3e6,#fff7f0); box-shadow: inset 4px 0 0 #ff9900; color:#b85a00 }

.sidebar-bottom{ 
  display:flex; 
  flex-direction: column; 
  gap: 8px; /* ระยะห่างระหว่างปุ่ม Theme กับ Logout */
}

/* Style ปุ่ม Theme */
.theme-btn {
  background:transparent;
  border:1px solid #ccc;
  color:#666;
  padding:8px 12px;
  border-radius:6px;
  cursor:pointer;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  transition: all 0.3s;
}
.theme-btn:hover { background: rgba(0,0,0,0.05); color: #333; }

.logout-btn{
  background:transparent;
  border:1px solid #f0543b;
  color:#f0543b;
  padding:8px 12px;
  border-radius:6px;
  cursor:pointer;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}
.logout-btn:hover{ background:rgba(240,84,59,0.05); }

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 130px;
}

/* ========================================= */
/* --- DARK MODE STYLES (สำหรับ Sidebar) --- */
/* ========================================= */
/* หมายเหตุ: คุณต้องไปเพิ่ม style สำหรับ body.dark-mode 
   ในไฟล์ assets/css/main.css หรือ App.vue ด้วยเพื่อให้ส่วนอื่นของเว็บเปลี่ยนสี 
*/

:global(body.dark-mode) .seller-sidebar {
  background: #1e1e2f; /* พื้นหลังสีมืด */
  border-right: 1px solid #333;
}

:global(body.dark-mode) .profile-info .name {
  color: #fff;
}

:global(body.dark-mode) .menu-item {
  color: #a6a6a6;
}

:global(body.dark-mode) .menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

:global(body.dark-mode) .menu-item.is-active {
  background: #2b2b40;
  color: #ff9900;
  box-shadow: inset 4px 0 0 #ff9900;
}

:global(body.dark-mode) .toggle-btn {
  background: #2b2b40;
  border-color: #444;
  color: #fff;
}

:global(body.dark-mode) .sidebar-divider {
  border-top: 1px solid #444;
}

:global(body.dark-mode) .theme-btn {
  border-color: #555;
  color: #ddd;
}
:global(body.dark-mode) .theme-btn:hover {
  background: rgba(255,255,255,0.1);
}
</style>