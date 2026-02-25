<template>
  <div>
    <Header />
    <WidgetsBreadcrumbs title="Dashboard" />

    <div class="theme-wrapper">
      <section class="dashboard-section section-b-space user-dashboard-section">
        <div class="container-fluid" style="padding-left: 3rem; padding-right: 3rem;">
          <div class="row g-4">

            <div class="col-lg-3">
              <div class="dashboard-sidebar-card">
                <div class="user-brief" v-if="isAuthenticated">
                  <div class="user-avatar-small">
                    <img v-if="avatarSrc && !imageError" :src="avatarSrc" alt="avatar" @error="handleImageError">
                    <div v-else class="avatar-placeholder">
                      {{ userInitial }}
                    </div>
                  </div>

                  <div class="user-name-brief">
                    <span>สวัสดี,</span>
                    <h5>{{ userName || 'User' }}</h5>
                  </div>
                </div>
                <div class="user-brief justify-content-center" v-else>
                  <i class="fa fa-user-circle text-muted" style="font-size: 3rem;"></i>
                </div>

                <div class="sidebar-menu">
                  <ul class="nav flex-column" id="top-tab" role="tablist">
                    <li class="nav-item">
                      <a class="nav-link" :class="{ active: activeMainTab === 'info' }" @click="updateTab('info')">
                        <i class="fa fa-user me-2"></i> ข้อมูลบัญชี
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" :class="{ active: activeMainTab === 'address' }"
                        @click="updateTab('address')">
                        <i class="fa fa-map-marker me-2"></i> ที่อยู่
                      </a>
                    </li>
                    <li class="nav-item">
                      <a class="nav-link" :class="{ active: activeMainTab === 'orders' }" @click="updateTab('orders')">
                        <i class="fa fa-shopping-bag me-2"></i> รายการสั่งซื้อ
                      </a>
                    </li>
                    <li class="nav-item separator"></li>

                    <li class="nav-item" v-if="isAuthenticated">
                      <a class="nav-link text-danger" @click="confirmLogout">
                        <i class="fa fa-sign-out-alt me-2"></i> ออกจากระบบ
                      </a>
                    </li>
                    <li class="nav-item" v-else>
                      <a class="nav-link text-orange fw-bold" @click="goToLogin">
                        <i class="fa fa-sign-in-alt me-2"></i> เข้าสู่ระบบ
                      </a>
                    </li>

                  </ul>
                </div>
              </div>
            </div>

            <div class="col-lg-9">
              <div class="faq-content tab-content" id="top-tabContent">
                <div class="tab-pane fade" :class="{ 'show active': activeMainTab === 'info' }">
                  <UserProfile @change-tab="updateTab" />
                </div>
                <div class="tab-pane fade" :class="{ 'show active': activeMainTab === 'address' }">
                  <UserAddress />
                </div>
                <div class="tab-pane fade" :class="{ 'show active': activeMainTab === 'orders' }">
                  <UserOrder />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { useOrderStore } from '~/store/orders' // ✅ นำเข้า Order Store
import { useRuntimeConfig } from '#imports'

import UserProfile from './userDashboard/userProfile.vue'
import UserAddress from './userDashboard/userAddress.vue'
import UserOrder from './userDashboard/userOrder.vue'

const auth = useAuthStore()
const orderStore = useOrderStore() // ✅ ประกาศใช้ Store
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const BACKEND_URL = 'https://vizdataprojectbe-production.up.railway.app'

const isAuthenticated = computed(() => !!auth.isLoggedIn || (!!auth.user && Object.keys(auth.user).length > 0))
const userName = computed(() => auth.userName || auth.user?.username || 'User')

// Logic รูปภาพ
const imageError = ref(false)
const avatarSrc = computed(() => {
  imageError.value = false
  if (auth.user && auth.user.avatar) {
    const av = auth.user.avatar
    if (av.startsWith('data:')) return av               // base64 จาก MongoDB
    if (av.startsWith('http')) return av                // full URL
    if (av.startsWith('/')) return `${BACKEND_URL}${av}`
    return `${BACKEND_URL}/${av}`
  }
  return null
})

const userInitial = computed(() => {
  const name = userName.value || 'U'
  return name.charAt(0)
})

const handleImageError = () => {
  imageError.value = true
}

// ส่วนจัดการ Tab
const activeMainTab = ref('info')

const updateTab = (tabName) => {
  activeMainTab.value = tabName
  const newQuery = { ...route.query }
  newQuery.tab = tabName
  delete newQuery.orderId
  router.replace({ query: newQuery })
}

// Watch URL changes (เช่น กดจาก Notification)
watch(
  () => route.query.tab,
  (newTab) => {
    if (newTab) {
      activeMainTab.value = newTab
    }
  }
)

const goToLogin = () => {
  router.push('/page/auth/LoginPage')
}

const confirmLogout = () => {
  if (confirm('คุณต้องการออกจากระบบหรือไม่?')) {
    if (typeof auth.logout === 'function') auth.logout();
    else { auth.user = null; auth.isLoggedIn = false }
    router.push('/')
  }
}

// ✅ 1. ฟังก์ชัน Init
const initDashboard = () => {
  if (route.query.tab) {
    activeMainTab.value = route.query.tab
  }
}

// ✅ 2. เพิ่ม Watcher เผื่อ User โหลดช้า
watch(() => auth.user, (val) => {
  if (val) {
    initDashboard()
  }
}, { immediate: true })

// ในไฟล์ userdashboard.vue
let refreshInterval = null;

onMounted(async () => {
  initDashboard();

  const orderStore = useOrderStore();
  await orderStore.fetchOrders();

  if (!refreshInterval) {
    refreshInterval = setInterval(async () => {
      await orderStore.fetchOrders();

      // ✅ เพิ่ม Logic: ตรวจสอบออเดอร์ที่มีสถานะ Shipped และเวลาเกิน 3 นาที
      const now = new Date();
      orderStore.allOrders.forEach(async (order) => {
        if (order.status.toLowerCase() === 'shipped' && order.updatedAt) {
          const updatedTime = new Date(order.updatedAt);
          const diffMinutes = (now - updatedTime) / (1000 * 60);

          if (diffMinutes >= 3) {
            console.log(`Order ${order.orderId} is over 3 mins, auto-completing...`);
            await $fetch(`https://vizdataprojectbe-production.up.railway.app/api/order/${order._id}`, {
              method: 'PUT',
              headers: { Authorization: `Bearer ${auth.token}` },
              body: { status: 'completed' }
            });
            await orderStore.fetchOrders();
          }
        }
      });
    }, 15000); // เช็คทุก 15 วินาที
  }
});
</script>

<style scoped>
.theme-wrapper {
  background-color: #f8f9fa;
  min-height: 100vh;
  font-family: 'Prompt', sans-serif;
  padding-bottom: 50px;
}

.user-dashboard-section {
  padding-top: 30px;
  position: relative;
  z-index: 2;
}

.dashboard-sidebar-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
  transition: all 0.2s ease;
}

.dashboard-sidebar-card:hover {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.05);
}

.user-brief {
  padding: 24px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
  gap: 15px;
}

.user-avatar-small {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #fff3e0;
  flex-shrink: 0;
  background-color: #ff5722;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-avatar-small img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  background-color: #ff5722;
}

.user-name-brief span {
  font-size: 0.8rem;
  color: #718096;
}

.user-name-brief h5 {
  margin: 0;
  font-weight: 700;
  color: #2d3748;
  font-size: 1rem;
}

.sidebar-menu .nav-link {
  color: #4a5568;
  padding: 16px 24px;
  font-weight: 500;
  border-left: 4px solid transparent;
  transition: all 0.2s;
  cursor: pointer;
}

.sidebar-menu .nav-link:hover {
  background-color: #f7fafc;
  color: #ff5722;
}

.sidebar-menu .nav-link.active {
  background-color: #fff3e0;
  color: #e64a19;
  border-left-color: #ff5722;
  font-weight: 600;
}

.separator {
  height: 1px;
  background: #f0f0f0;
  margin: 8px 0;
}

.text-orange {
  color: #ff5722 !important;
}

@media (max-width: 991px) {
  .dashboard-sidebar-card {
    margin-bottom: 20px;
  }

  .user-brief {
    flex-direction: column;
    text-align: center;
  }
}
</style>