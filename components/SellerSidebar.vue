<template>
  <aside class="seller-sidebar" :class="{ 'collapsed': isCollapsed }">
    
    <button class="toggle-btn" @click="$emit('toggle')">
      <Icon :name="isCollapsed ? 'feather:chevron-right' : 'feather:chevron-left'" size="18" />
    </button>

    <div class="sidebar-top">
      <div class="profile">
        <img :src="avatar" alt="avatar" class="avatar" />
        <div class="profile-info" v-show="!isCollapsed">
          <div class="name text-truncate">{{ displayName }}</div>
          <div class="role">Seller</div>
        </div>
        <button class="noti-btn" v-show="!isCollapsed">
           <Icon name="feather:bell" size="20" />
           <span class="noti-badge" v-if="notificationCount > 0">{{ notificationCount }}</span>
        </button>
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
        <li><NuxtLink to="/SellerPage/dashboard" :class="['menu-item', { 'is-active': isActive('/SellerPage/dashboard') }]"><span class="icon-slot">📊</span><span class="menu-label" v-show="!isCollapsed">Dashboard</span></NuxtLink></li>
        <li><NuxtLink to="/SellerPage/productPage" :class="['menu-item', { 'is-active': isActive('/SellerPage/productPage') }]"><span class="icon-slot">📦</span><span class="menu-label" v-show="!isCollapsed">Product</span></NuxtLink></li>
        <li><NuxtLink to="/SellerPage/shippingPage" :class="['menu-item', { 'is-active': isActive('/SellerPage/shippingPage') }]"><span class="icon-slot">🚚</span><span class="menu-label" v-show="!isCollapsed">Shipping</span></NuxtLink></li>
        <li><NuxtLink to="/SellerPage/category" :class="['menu-item', { 'is-active': isActive('/SellerPage/category') }]"><span class="icon-slot">📂</span><span class="menu-label" v-show="!isCollapsed">Category</span></NuxtLink></li>
        <li><NuxtLink to="/SellerPage/order" :class="['menu-item', { 'is-active': isActive('/SellerPage/order') }]"><span class="icon-slot">📋</span><span class="menu-label" v-show="!isCollapsed">Order</span></NuxtLink></li>
        <li><NuxtLink to="/SellerPage/orderStatus" :class="['menu-item', { 'is-active': isActive('/SellerPage/orderStatus') }]"><span class="icon-slot">📝</span><span class="menu-label" v-show="!isCollapsed">Order Status</span></NuxtLink></li>
        <li><NuxtLink to="/SellerPage/setting" :class="['menu-item', { 'is-active': isActive('/SellerPage/setting') }]"><span class="icon-slot">⚙️</span><span class="menu-label" v-show="!isCollapsed">Settings</span></NuxtLink></li>
      </ul>
    </nav>

    <div class="sidebar-bottom">
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
import { useAuthStore } from '~/store/auth'

const props = defineProps({ isCollapsed: { type: Boolean, default: false } })
const emit = defineEmits(['toggle'])

const router = useRouter()
const auth = useAuthStore()
const route = useRoute()

const notificationCount = ref(3)
const displayName = computed(() => auth.userName || 'ร้านของฉัน')
const avatar = ref('/images/avtar.jpg')

onMounted(() => {
  const savedAvatar = localStorage.getItem('sellerAvatar')
  if (savedAvatar) avatar.value = savedAvatar
  
  const handler = () => { const a = localStorage.getItem('sellerAvatar'); if (a) avatar.value = a }
  window.addEventListener('sellerProfileUpdated', handler)
  window.addEventListener('storage', (e) => { if (e.key === 'sellerAvatar') avatar.value = e.newValue })
  
  onUnmounted(() => { window.removeEventListener('sellerProfileUpdated', handler) })
})

function isActive(path) {
  try { return route.path === path || route.path.startsWith(path + '/') } catch (e) { return false }
}

function logout() {
  if (auth && typeof auth.logout === 'function') auth.logout()
  router.replace('/page/auth/LoginPage')
}
</script>

<style scoped>
/* CSS เดิม (Light Mode) */
.seller-sidebar{ width: 260px; height: 100vh; position: fixed; left: 0; top: 0; background: linear-gradient(180deg, #fff, #fffaf0); border-right: 1px solid rgba(0,0,0,0.04); display: flex; flex-direction: column; justify-content: space-between; padding: 18px 14px; box-shadow: 0 4px 18px rgba(14,20,30,0.06); z-index: 1000; transition: width 0.3s ease-in-out, background 0.3s; }
.seller-sidebar.collapsed { width: 80px; padding: 18px 10px; }
.seller-sidebar.collapsed .avatar { width: 40px; height: 40px; margin: 0 auto; }
.seller-sidebar.collapsed .profile { justify-content: center; }
.seller-sidebar.collapsed .menu-item { justify-content: center; padding: 10px 0; }
.seller-sidebar.collapsed .logout-btn { justify-content: center; text-align: center; }
.toggle-btn { position: absolute; top: 15px; right: -12px; background: #fff; border: 1px solid #eee; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 4px rgba(0,0,0,0.1); z-index: 1001; }
.toggle-btn:hover { background: #f8f9fa; }
.sidebar-divider { margin: 15px 0; border: 0; border-top: 1px solid rgba(0, 0, 0, 0.1); width: 100%; }
.sidebar-top .profile{ display:flex; gap:12px; align-items:center; padding:8px 4px; overflow: hidden; position: relative; }
.avatar{ width:56px; height:56px; border-radius:12px; object-fit:cover; background:#eee; box-shadow:0 2px 6px rgba(0,0,0,0.06); transition: all 0.3s; }
.profile-info { flex: 1; min-width: 0; }
.profile-info .name{ font-weight:700; font-size:14px; white-space: nowrap; }
.profile-info .role{ font-size:12px; color:#9a7b4f; white-space: nowrap; }
.noti-btn { background: transparent; border: none; cursor: pointer; color: #666; padding: 6px; border-radius: 50%; position: relative; transition: all 0.2s; display: flex; align-items: center; justify-content: center; margin-left: auto; }
.noti-btn:hover { background: rgba(0,0,0,0.05); color: #333; transform: scale(1.05); }
.noti-badge { position: absolute; top: 2px; right: 2px; background-color: #ff4757; color: white; font-size: 10px; font-weight: bold; min-width: 16px; height: 16px; border-radius: 10px; display: flex; align-items: center; justify-content: center; border: 2px solid #fff; padding: 0 2px; }
.sidebar-menu{ flex:1; overflow:hidden; }
.sidebar-menu ul{ list-style:none; padding:0; margin:0; }
.sidebar-menu ul li{ display:block; margin-bottom: 4px;}
.menu-item{ display:flex; align-items:center; gap:8px; padding:10px 12px; color:#3b3b3b; border-radius:10px; text-decoration:none; font-weight:600; transition:all .15s ease; white-space: nowrap; }
.icon-slot { font-size: 18px; min-width: 24px; text-align: center; }
.menu-item:hover{ transform:translateX(2px); background:rgba(255,249,240,0.8); }
.menu-item.is-active{ background:linear-gradient(90deg,#fff3e6,#fff7f0); box-shadow: inset 4px 0 0 #ff9900; color:#b85a00 }
.sidebar-bottom{ display:flex; flex-direction: column; gap: 8px; }
.logout-btn{ background:transparent; border:1px solid #f0543b; color:#f0543b; padding:8px 12px; border-radius:6px; cursor:pointer; width: 100%; text-align: left; display: flex; align-items: center; gap: 8px; white-space: nowrap; }
.logout-btn:hover{ background:rgba(240,84,59,0.05); }
.text-truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 110px; }

/* --- 🔥 DARK MODE OVERRIDES 🔥 --- */
/* ทำงานเมื่อ body มี class="dark" (จาก Store) */

:global(body.dark) .seller-sidebar {
  background: #1e1e2f !important;
  border-right: 1px solid #333;
}
:global(body.dark) .profile-info .name { color: #fff; }
:global(body.dark) .menu-item { color: #a6a6a6; }
:global(body.dark) .menu-item:hover { background: rgba(255, 255, 255, 0.1); color: #fff; }
:global(body.dark) .menu-item.is-active { background: #2b2b40; color: #ff9900; box-shadow: inset 4px 0 0 #ff9900; }
:global(body.dark) .toggle-btn { background: #2b2b40; border-color: #444; color: #fff; }
:global(body.dark) .sidebar-divider { border-top: 1px solid #444; }
:global(body.dark) .noti-btn { color: #ccc; }
:global(body.dark) .noti-btn:hover { background: rgba(255,255,255,0.1); color: #fff; }
:global(body.dark) .noti-badge { border-color: #1e1e2f; }
</style>