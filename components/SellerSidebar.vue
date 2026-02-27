<template>
  <aside class="seller-sidebar" :class="{ 'collapsed': isCollapsed }">

    <div v-if="isNotiOpen" class="fixed-overlay" @click="isNotiOpen = false"></div>

    <OrderDetailModal v-if="showOrderModal" :order="selectedOrder" @close="closeOrderModal"
      @updated="handleOrderUpdated" />

    <div v-if="loadingOrder" class="fixed-overlay d-flex align-items-center justify-content-center"
      style="z-index: 2100; background: rgba(255,255,255,0.5);">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <button class="toggle-btn" @click="$emit('toggle')">
      <Icon :name="isCollapsed ? 'feather:chevron-right' : 'feather:chevron-left'" size="18" />
    </button>

    <div class="sidebar-top">
      <div class="profile">
        <div class="avatar-container" @click="triggerFileInput">
          <img :src="avatar" alt="avatar" class="avatar" :class="{ 'uploading': isUploading }"
            @error="handleImageError" />
          <div v-if="isUploading" class="loading-overlay">
            <div class="spinner-border text-white spinner-border-sm" role="status"></div>
          </div>
        </div>
        <input type="file" ref="fileInputRef" class="d-none" accept="image/*" @change="handleFileUpload" />

        <div class="profile-info" v-show="!isCollapsed">
          <div class="name text-truncate">{{ displayName }}</div>
          <div class="role">Seller</div>
        </div>

        <div class="noti-wrapper" v-show="!isCollapsed">
          <button class="noti-btn" @click="toggleNoti">
            <Icon name="feather:bell" size="20" class="bell-icon" />
            <div class="badge-wrapper" v-if="unreadCount > 0">
              <span class="badge-ping"></span>
              <span class="noti-badge">{{ unreadCount > 99 ? '99+' : unreadCount }}</span>
            </div>
          </button>

          <transition name="fade">
            <div class="noti-dropdown" v-if="isNotiOpen">
              <div class="noti-header">
                <span>การแจ้งเตือน ({{ unreadCount }})</span>

                <div class="header-actions">
                  <button class="action-link" @click="markAllRead" v-if="unreadCount > 0">อ่านทั้งหมด</button>
                  <span class="divider" v-if="unreadCount > 0 && notifications.length > 0">|</span>
                  <button class="action-link text-danger" @click="clearAll"
                    v-if="notifications.length > 0">ลบทั้งหมด</button>
                </div>
              </div>

              <div class="noti-list">
                <div v-for="item in notifications" :key="item._id" class="noti-item" :class="{ 'unread': !item.isRead }"
                  @click="handleNotificationClick(item)">

                  <div class="noti-dot"></div>

                  <div class="noti-img-wrapper">
                    <img v-if="getNotiImage(item)" :src="getNotiImage(item)" class="noti-img"
                      @error="$event.target.style.display = 'none'; $event.target.nextElementSibling.style.display = 'flex'">

                    <div :style="getNotiImage(item) ? 'display:none' : 'display:flex'" class="default-icon-bg noti-img">
                      <i class="fa fa-info" aria-hidden="true" style="margin: auto;"></i>
                    </div>
                  </div>

                  <div class="noti-content">
                    <div class="noti-title">{{ item.title }}</div>
                    <p class="noti-text">{{ item.message }}</p>
                    <span class="noti-time">{{ formatDate(item.createdAt) }}</span>
                  </div>

                  <div class="noti-delete" @click.stop="deleteItem(item._id)">
                    <i class="fa fa-trash-o" aria-hidden="true"></i>
                  </div>

                </div>
                <div v-if="notifications.length === 0" class="noti-empty">ไม่มีการแจ้งเตือน</div>
              </div>
            </div>
          </transition>
        </div>
      </div>

      <div class="profile-actions" v-if="!isCollapsed">
        <NuxtLink to="/SellerPage/editProfile" class="btn btn-sm btn-outline-primary w-100">แก้ไขโปรไฟล์</NuxtLink>
      </div>
      <div class="profile-actions justify-content-center" v-else>
        <NuxtLink to="/SellerPage/editProfile" class="btn btn-sm btn-outline-primary p-1">
          <Icon name="feather:edit" size="14" />
        </NuxtLink>
      </div>
    </div>

    <hr class="sidebar-divider" />

    <nav class="sidebar-menu">
      <ul>
        <li>
          <NuxtLink to="/SellerPage/dashboard"
            :class="['menu-item', { 'is-active': isActive('/SellerPage/dashboard') }]">
            <span class="icon-slot">📊</span><span class="menu-label" v-show="!isCollapsed">Dashboard</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/productPage"
            :class="['menu-item', { 'is-active': isActive('/SellerPage/productPage') }]">
            <span class="icon-slot">📦</span><span class="menu-label" v-show="!isCollapsed">Product</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/order" :class="['menu-item', { 'is-active': isActive('/SellerPage/order') }]">
            <span class="icon-slot">📋</span><span class="menu-label" v-show="!isCollapsed">Order</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/orderStatus"
            :class="['menu-item', { 'is-active': isActive('/SellerPage/orderStatus') }]">
            <span class="icon-slot">🚚</span><span class="menu-label" v-show="!isCollapsed">Order Status</span>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/SellerPage/wallet" :class="['menu-item', { 'is-active': isActive('/SellerPage/wallet') }]">
            <span class="icon-slot">💳</span><span class="menu-label" v-show="!isCollapsed">Wallet</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <div class="sidebar-bottom">
      <button class="logout-btn" @click="logout" :title="isCollapsed ? 'Logout' : ''">
        <span v-if="isCollapsed">⎋</span><span v-else>⎋ Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useNuxtApp } from '#app'
import { useAuthStore } from '~/store/auth'
import { useNotificationStore } from '~/store/notification'
import { useRuntimeConfig } from '#app'
import OrderDetailModal from '~/pages/SellerPage/components/orderDetailModal.vue'
import { useOrderStore } from '~/store/orders'

const orderStore = useOrderStore()
const props = defineProps({ isCollapsed: { type: Boolean, default: false } })
const emit = defineEmits(['toggle'])

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const notiStore = useNotificationStore()
const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiBase || 'https://vizdataprojectbe-production.up.railway.app'
const { $showToast } = useNuxtApp()

const displayName = computed(() => auth.userName || 'ร้านของฉัน')

// --- Avatar Logic ---
const avatar = computed(() => {
  const userAvatar = auth.user?.avatar || null
  if (userAvatar) {
    if (userAvatar.startsWith('data:') || userAvatar.startsWith('blob:') || userAvatar.startsWith('http')) return userAvatar
    const cleanPath = userAvatar.startsWith('/') ? userAvatar : `/${userAvatar}`
    return `${API_BASE_URL}${cleanPath}`
  }
  return '/images/avtar.jpg'
})

const fileInputRef = ref(null)
const isUploading = ref(false)
const triggerFileInput = () => { if (!isUploading.value) fileInputRef.value.click() }
const handleImageError = (e) => { e.target.src = '/images/avtar.jpg' }
function clearAll() {
  notiStore.deleteAllNotifications();
}
const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) { alert('ไฟล์ใหญ่เกินไป'); return; }
  isUploading.value = true
  try {
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('file', file)
    const response = await $fetch(`${API_BASE_URL}/api/sellers/upload-avatar`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })
    if (response.success) {
      auth.user.avatar = response.data.avatar
    }
  } catch (error) { console.error('Upload Error:', error) }
  finally { isUploading.value = false; if (fileInputRef.value) fileInputRef.value.value = '' }
}

// --- Notification & Popup Logic ---
const isNotiOpen = ref(false)
const notifications = computed(() => notiStore.notifications)
const unreadCount = computed(() => notiStore.unreadCount)
const showOrderModal = ref(false)
const selectedOrder = ref(null)
const loadingOrder = ref(false)

function toggleNoti() { isNotiOpen.value = !isNotiOpen.value }
function markAllRead() { notiStore.markAllAsRead() }

const handleNotificationClick = async (item) => {
  if (!item.isRead) notiStore.markAsRead(item);
  isNotiOpen.value = false;

  const orderId = item.data?.orderId || item.orderId;
  if (orderId) {
    loadingOrder.value = true
    try {
      const token = localStorage.getItem('token')
      const response = await $fetch(`${API_BASE_URL}/api/order/${orderId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      const status = (response.status || '').toLowerCase();
      await orderStore.fetchOrders()

      const isCancelGroup = ['cancelled', 'cancel', 'cancel requested', 'return_requested', 'return requested'].includes(status);

      if (isCancelGroup) {
        selectedOrder.value = response
        showOrderModal.value = true
      }
      else if (['pending', 'pending review'].includes(status)) {
        router.push({
          path: '/SellerPage/order',
          query: { id: orderId }
        });
      }
      else {
        let targetTab = 'preparing';
        if (['shipped', 'shipping', 'arrived'].includes(status)) targetTab = 'shipped';
        else if (['completed', 'delivered', 'success'].includes(status)) targetTab = 'completed';

        router.push({
          path: '/SellerPage/orderStatus',
          query: { status: targetTab, id: orderId }
        });
      }

    } catch (error) {
      console.error("Fetch Order Error:", error)
    } finally {
      loadingOrder.value = false
    }
  }
}

const closeOrderModal = () => {
  showOrderModal.value = false
  selectedOrder.value = null
}

const handleOrderUpdated = () => {
  notiStore.fetchNotifications()
}

watch(() => auth.user, (newUser) => {
  if (newUser && (newUser._id || newUser.id)) {
    notiStore.fetchNotifications();
    notiStore.initSocket();
  }
}, { immediate: true, deep: true })

onBeforeUnmount(() => { notiStore.disconnectSocket() })

// Helper
const getImgUrl = (path) => {
  if (!path) return '/images/icon/logo.png';
  if (path.startsWith('http')) return path;
  if (path.startsWith('uploads') || path.startsWith('/uploads')) {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    return `${API_BASE_URL}/${cleanPath}`;
  }
  return '/images/' + path;
}

// ✅ 🚨 ฟังก์ชันใหม่สำหรับดึงรูปใน Noti โดยเฉพาะ (ดัดแปลงมาจาก getItemImage)
const getNotiImage = (item) => {
  const resolve = (url) => {
    if (!url || url.trim() === '' || url === '/images/dashboard/default.png') return null
    if (url.startsWith('data:')) return url   // base64 จาก MongoDB
    if (url.startsWith('http')) return url    // full URL
    if (url.startsWith('/')) return `${API_BASE_URL}${url}`
    return `${API_BASE_URL}/${url}`
  }

  // ลองดึงจากข้อมูลใน data ก่อนเผื่อมี 
  const fromData = resolve(item?.data?.image)
  if (fromData) return fromData

  // ถ้าไม่มีค่อยไปดึงจาก image ตรงๆ
  const fromItem = resolve(item?.image)
  if (fromItem) return fromItem

  return null
}

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleString('th-TH', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
const deleteItem = async (id) => {
  try {
    await notiStore.deleteNotification(id);
  } catch (error) {
    console.error("Failed to delete notification:", error);
  }
}

function isActive(path) { try { return route.path === path || route.path.startsWith(path + '/') } catch (e) { return false } }

function logout() {
  if (auth && typeof auth.logout === 'function') auth.logout()
  if (process.client) { localStorage.removeItem('user'); localStorage.removeItem('token') }
  router.replace('/page/auth/LoginPage')
}
</script>

<style scoped>
/* CSS เดิมทั้งหมด (พร้อมเพิ่ม CSS ของ default-icon-bg) */
.seller-sidebar {
  width: 260px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background: linear-gradient(180deg, #fff, #fffaf0);
  border-right: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 18px 14px;
  box-shadow: 0 4px 18px rgba(14, 20, 30, 0.06);
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

.seller-sidebar.collapsed .logout-btn {
  justify-content: center;
  text-align: center;
}

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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1001;
}

.toggle-btn:hover {
  background: #f8f9fa;
}

.sidebar-divider {
  margin: 15px 0;
  border: 0;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  width: 100%;
}

.fixed-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1001;
  background: transparent;
}

.sidebar-top .profile {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 8px 4px;
  position: relative;
  overflow: visible;
}

.avatar-container {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  object-fit: cover;
  background: #eee;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
}

.avatar.uploading {
  opacity: 0.5;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-info {
  flex: 1;
  min-width: 0;
}

.profile-info .name {
  font-weight: 700;
  font-size: 14px;
  white-space: nowrap;
}

.profile-info .role {
  font-size: 12px;
  color: #9a7b4f;
  white-space: nowrap;
}

.sidebar-menu {
  flex: 1;
  overflow: hidden;
}

.sidebar-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-menu ul li {
  display: block;
  margin-bottom: 4px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  color: #3b3b3b;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 600;
  transition: all .15s ease;
  white-space: nowrap;
}

.icon-slot {
  font-size: 18px;
  min-width: 24px;
  text-align: center;
}

.menu-item:hover {
  transform: translateX(2px);
  background: rgba(255, 249, 240, 0.8);
}

.menu-item.is-active {
  background: linear-gradient(90deg, #fff3e6, #fff7f0);
  box-shadow: inset 4px 0 0 #ff9900;
  color: #b85a00
}

.sidebar-bottom {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.logout-btn {
  background: transparent;
  border: 1px solid #f0543b;
  color: #f0543b;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.logout-btn:hover {
  background: rgba(240, 84, 59, 0.05);
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 110px;
}

.noti-wrapper {
  margin-left: auto;
  position: relative;
}

.noti-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  position: relative;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.noti-btn:hover {
  background: rgba(0, 0, 0, 0.05);
  color: #333;
}

.badge-wrapper {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 10px;
  height: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.noti-badge {
  position: relative;
  z-index: 2;
  background-color: #ff4757;
  color: white;
  font-size: 10px;
  font-weight: 700;
  min-width: 18px;
  height: 18px;
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #fff;
  padding: 0 4px;
  top: -6px;
  right: -6px;
}

.badge-ping {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #ff4757;
  opacity: 0.75;
  top: -6px;
  right: -6px;
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
  z-index: 1;
}

.noti-dropdown {
  position: absolute;
  top: -10px;
  left: 100%;
  margin-left: 25px;
  width: 300px;
  background: white;
  border-radius: 12px;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  z-index: 1002;
  overflow: hidden;
  transform-origin: top left;
}

.noti-dropdown::before {
  content: '';
  position: absolute;
  top: 18px;
  left: -6px;
  width: 12px;
  height: 12px;
  background: white;
  transform: rotate(45deg);
  border-left: 1px solid rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.noti-header {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 14px;
  position: relative;
  z-index: 2;
  background: white;
}

.mark-read-btn {
  background: none;
  border: none;
  color: #ff9900;
  font-size: 12px;
  cursor: pointer;
}

.mark-read-btn:hover {
  text-decoration: underline;
}

.noti-list {
  max-height: 320px;
  overflow-y: auto;
  position: relative;
  z-index: 2;
  background: white;
}

.noti-item {
  padding: 12px 16px;
  border-bottom: 1px solid #f9f9f9;
  display: flex;
  gap: 10px;
  cursor: pointer !important;
  transition: background 0.2s;
  align-items: flex-start;
  position: relative;
  padding-right: 40px;
}

.noti-item:hover {
  background: #fffcf5;
}

.noti-item:last-child {
  border-bottom: none;
}

.noti-item.unread {
  background: #fff8eb;
}

.noti-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #ddd;
  margin-top: 6px;
  flex-shrink: 0;
}

.noti-item.unread .noti-dot {
  background: #ff4757;
}

.noti-img-wrapper {
  flex-shrink: 0;
}

.noti-img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #eee;
}

/* ✅ กล่องสีเทากรณีรูปพัง */
.default-icon-bg {
  width: 36px;
  height: 36px;
  background-color: #ddd;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
}

.noti-content {
  flex: 1;
  min-width: 0;
}

.noti-title {
  font-weight: 700;
  font-size: 13px;
  color: #222;
  margin-bottom: 2px;
}

.noti-text {
  font-size: 12px;
  color: #555;
  margin: 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
}

.noti-time {
  font-size: 11px;
  color: #999;
  margin-top: 4px;
  display: block;
}

.noti-empty {
  padding: 20px;
  text-align: center;
  color: #999;
  font-size: 13px;
}

.noti-delete {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: #999;
  transition: all 0.2s;
  z-index: 5;
}

.noti-delete:hover {
  color: #ff4757;
  background-color: rgba(255, 71, 87, 0.1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-10px) scale(0.95);
}

@keyframes ping {

  75%,
  100% {
    transform: scale(2.5);
    opacity: 0;
  }
}

.header-pending {
  background: linear-gradient(135deg, #FF8F00 0%, #FFB300 100%);
}

.text-status-pending {
  color: #E65100;
}

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content-custom {
  background: #fff;
  width: 90%;
  max-width: 700px;
  border-radius: 16px;
  overflow: hidden;
}

.btn-white-glass {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  transition: 0.2s;
}

.btn-white-glass:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: rotate(90deg);
}

:global(body.dark) .seller-sidebar {
  background: #1e1e2f !important;
  border-right: 1px solid #333;
}

:global(body.dark) .profile-info .name {
  color: #fff;
}

:global(body.dark) .menu-item {
  color: #a6a6a6;
}

:global(body.dark) .menu-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

:global(body.dark) .menu-item.is-active {
  background: #2b2b40;
  color: #ff9900;
  box-shadow: inset 4px 0 0 #ff9900;
}

:global(body.dark) .toggle-btn {
  background: #2b2b40;
  border-color: #444;
  color: #fff;
}

:global(body.dark) .sidebar-divider {
  border-top: 1px solid #444;
}

:global(body.dark) .noti-btn {
  color: #ccc;
}

:global(body.dark) .noti-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

:global(body.dark) .noti-badge {
  border-color: #1e1e2f;
}

:global(body.dark) .noti-dropdown {
  background: #2b2b40;
  border-color: #444;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.3);
}

:global(body.dark) .noti-dropdown::before {
  background: #2b2b40;
  border-color: #444;
}

:global(body.dark) .noti-header {
  border-bottom-color: #444;
  color: #fff;
  background: #2b2b40;
}

:global(body.dark) .noti-list {
  background: #2b2b40;
}

:global(body.dark) .noti-text {
  color: #eee;
}

:global(body.dark) .noti-title {
  color: #fff;
}

:global(body.dark) .noti-item {
  border-bottom-color: #333;
}

:global(body.dark) .noti-item:hover {
  background: #35354a;
}

:global(body.dark) .noti-item.unread {
  background: rgba(255, 71, 87, 0.1);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-link {
  background: none;
  border: none;
  color: #ff9900;
  font-size: 12px;
  cursor: pointer;
  padding: 0;
}

.action-link:hover {
  text-decoration: underline;
}

.action-link.text-danger {
  color: #ff4757;
}

.divider {
  color: #ccc;
  font-size: 12px;
}

:global(body.dark) .noti-delete {
  color: #666;
}

:global(body.dark) .noti-delete:hover {
  color: #ff4757;
  background-color: rgba(255, 71, 87, 0.2);
}
</style>