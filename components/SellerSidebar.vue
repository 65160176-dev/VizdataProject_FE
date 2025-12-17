<template>
  <aside class="seller-sidebar">
    <div class="sidebar-top">
      <div class="profile">
        <img :src="avatar" alt="avatar" class="avatar" />
        <div class="profile-info">
          <div class="name">{{ displayName }}</div>
          <div class="role">Seller</div>
        </div>
      </div>
      <div class="profile-actions">
        <NuxtLink to="/SellerPage/editProfile" class="btn btn-sm btn-outline-primary">แก้ไขโปรไฟล์</NuxtLink>
      </div>

    </div>

    <nav class="sidebar-menu">
      <ul>
        <li>
          <NuxtLink to="/SellerPage/dashboard" class="menu-item">📊 Dashboard</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/productPage" class="menu-item">📦 Product</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/shippingPage" class="menu-item">🚚 Shipping</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/category" class="menu-item">📊 Category</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/orderStatus" :class="['menu-item', { 'is-active': isActive('/SellerPage/orderStatus') }]">🧾 <span class="menu-label">Orders</span></NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="sidebar-bottom">
      <button class="logout-btn" @click="logout">⎋ Logout</button>
    </div>
  </aside>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import UserAuth from '~/pages/page/auth/auth'
import { useAuthStore } from '~/store/auth'

const router = useRouter()
const auth = useAuthStore()
const route = useRoute()

// profile state
const displayName = computed(() => auth.userName || 'ร้านของฉัน')
const avatar = ref('/images/avtar.jpg')

onMounted(() => {
  auth.initAuth && auth.initAuth()
  // read saved avatar
  const savedAvatar = localStorage.getItem('sellerAvatar')
  if (savedAvatar) avatar.value = savedAvatar

  // listen for profile updates from edit page
  const handler = () => {
    const a = localStorage.getItem('sellerAvatar')
    if (a) avatar.value = a
  }
  window.addEventListener('sellerProfileUpdated', handler)
  // also listen to storage events for cross-tab updates
  const storageHandler = (e) => {
    if (e.key === 'sellerAvatar') {
      avatar.value = e.newValue || '/images/avtar.jpg'
    }
    if (e.key === 'userName') {
      // auth.userName should already be in sync via Pinia
    }
  }
  window.addEventListener('storage', storageHandler)
  // cleanup on unmount
  onUnmounted(() => {
    window.removeEventListener('sellerProfileUpdated', handler)
    window.removeEventListener('storage', storageHandler)
  })
})
function isActive(path){
  try{ return route.path === path || route.path.startsWith(path) }catch(e){return false}
}

function logout() {
  // Clear Pinia state and localStorage
  if (auth && typeof auth.logout === 'function') auth.logout()
  // Clear cookie-based login if present
  try { UserAuth.Logout() } catch (e) {}
  // Redirect to the main login page
  router.replace('/page/auth/LoginPage')
}
</script>

<style scoped>
.seller-sidebar{
  width:260px;
  height:100vh;
  position:fixed;
  left:0;
  top:0;
  background:linear-gradient(180deg,#fff,#fffaf0);
  border-right:1px solid rgba(0,0,0,0.04);
  display:flex;
  flex-direction:column;
  justify-content:space-between;
  padding:18px 14px;
  box-shadow: 0 4px 18px rgba(14,20,30,0.06);
  z-index:1000;
}
.sidebar-top .profile{
  display:flex;
  gap:12px;
  align-items:center;
  padding:8px 4px;
}
.avatar{
  width:56px;
  height:56px;
  border-radius:12px;
  object-fit:cover;
  background:#eee;
  box-shadow:0 2px 6px rgba(0,0,0,0.06);
}
.profile-info .name{
  font-weight:700;
  font-size:14px;
}
.profile-info .role{
  font-size:12px;
  color:#9a7b4f;
}
.sidebar-menu{ flex:1; margin-top:18px; overflow:auto; }
.sidebar-menu ul{ list-style:none; padding:0; margin:0; }
.sidebar-menu ul li{ display:block; }
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
}
.menu-item .menu-label{ margin-left:6px }
.menu-item:hover{ transform:translateX(4px); background:rgba(255,249,240,0.8); }
.menu-item.is-active{ background:linear-gradient(90deg,#fff3e6,#fff7f0); box-shadow: inset 4px 0 0 #ff9900; color:#b85a00 }
.profile-actions{ margin-top:10px; display:flex; justify-content:flex-start }
.sidebar-bottom{ display:flex; justify-content:flex-start; }
.logout-btn{
  background:transparent;
  border:1px solid #f0543b;
  color:#f0543b;
  padding:8px 12px;
  border-radius:6px;
  cursor:pointer;
}
.logout-btn:hover{ background:rgba(240,84,59,0.05); }

.profile-edit{ padding:8px 4px; border-top:1px dashed #eee; margin-top:8px }
.profile-edit .form-group{ margin-bottom:8px }
.ss-avatar-preview{ width:64px; height:64px; border-radius:8px; object-fit:cover; display:block; margin-bottom:8px }

.seller-footer-note{ font-size:12px; color:#7a6b5a }
</style>
