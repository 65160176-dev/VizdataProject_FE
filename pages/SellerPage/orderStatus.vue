<template>
  <div class="container-fluid py-4 bg-light min-vh-100">

    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1 text-dark">Order Status</h4>
        <p class="text-secondary small mb-0">ติดตามสถานะการจัดส่งและจัดการคำสั่งซื้อ</p>
      </div>

      <button
        class="btn btn-white bg-white border shadow-sm rounded-pill px-4 py-2 position-relative text-primary fw-bold"
        @click="showRequestsModal = true">
        <Icon name="feather:bell" size="18" class="me-2" />
        คำขอใหม่
        <span v-if="pendingOrders.length > 0"
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white shadow-sm">
          {{ pendingOrders.length }}
        </span>
      </button>
    </div>

    <div class="card mb-4 border-0 shadow-sm rounded-4">
      <div class="card-body p-2">
        <ul class="nav nav-pills nav-fill custom-tabs">
          <li class="nav-item" v-for="s in statuses" :key="s.key">
            <a class="nav-link d-flex align-items-center justify-content-center gap-2 transition-all"
              :class="[currentStatus === s.key ? 'active-tab-' + s.key : '']" href="#"
              @click.prevent="changeTab(s.key)">

              <Icon :name="s.icon" size="18" />
              <span>{{ s.label }}</span>

              <span class="badge rounded-pill ms-2 transition-all shadow-sm"
                :class="[currentStatus === s.key ? 'bg-white ' + getTextClass(s.key) : 'bg-light text-muted']">
                {{ countMyOrdersByStatus(s.key) }}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div v-if="orderStore.isLoading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else class="row g-3">
      <div class="col-12 text-center py-5" v-if="filteredMyOrders.length === 0">
        <div class="empty-state">
          <Icon name="feather:inbox" size="64" class="text-muted mb-3 opacity-25" />
          <h5 class="text-muted">ไม่มีรายการในสถานะ "{{ getStatusLabel(currentStatus) }}"</h5>
        </div>
      </div>

      <div class="col-xl-4 col-md-6" v-for="order in filteredMyOrders" :key="order._id">
        <div class="card h-100 order-card border-0 shadow-sm rounded-4 overflow-hidden" @click="openDetail(order)">
          <div
            :class="['card-header border-0 py-3 d-flex justify-content-between align-items-center text-white', getModalHeaderClass(order.status)]">
            <span class="fw-bold">Order #{{ order.orderId || (order._id ? order._id.substr(-6) : 'N/A') }}</span>
            <small class="bg-white-glass px-2 py-1 rounded">
              <Icon name="feather:calendar" size="12" /> {{ formatDate(order) }}
            </small>
          </div>
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <img :src="getItemImage(order)" class="rounded-3 border"
                style="width: 70px; height: 70px; object-fit: cover;">
              <div class="ms-3 flex-grow-1">
                <h6 class="fw-bold mb-1 text-dark">{{ order.customer || 'Unknown' }}</h6>
                <p class="text-muted small mb-0 text-truncate">{{ getItemName(order) }}</p>
                <div class="mt-2 small fw-bold" :class="getTextClass(order.status)">
                  ● {{ order.status ? order.status.toUpperCase() : '' }}
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer bg-white border-top-0 pb-3">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="text-secondary small">{{ getItems(order).length }} รายการ</span>
              <span class="text-secondary small">ราคารวม: {{ formatCurrency(calculateTotal(order)) }}</span>
            </div>
            <div class="d-flex justify-content-between align-items-center">
              <span class="text-success small fw-bold">เงินที่ร้านได้รับ:</span>
              <div class="fw-bolder text-success fs-5">{{ formatCurrency(order.sellerEarnings || calculateTotal(order))
              }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <OrderDetailModal v-if="showDetail" :order="selectedOrder" @close="closeDetail" @updated="handleOrderUpdated" />

    <Transition name="fade">
      <div v-if="showRequestsModal" class="modal-backdrop-custom" @click.self="showRequestsModal = false">
        <div class="modal-content-custom p-0 overflow-hidden shadow-lg" style="max-width: 600px;">
          <div class="px-4 py-3 bg-white border-bottom d-flex justify-content-between align-items-center">
            <div>
              <h5 class="fw-bold mb-0 text-dark">รายการคำขอตรวจสอบ 🚨</h5>
              <small class="text-muted">คุณมี {{ pendingOrders.length }} รายการที่ต้องแก้ไข</small>
            </div>
            <button class="btn btn-light rounded-circle" @click="showRequestsModal = false">
              <Icon name="feather:x" size="20" />
            </button>
          </div>

          <div class="p-0 bg-light" style="max-height: 70vh; overflow-y: auto;">
            <div v-if="pendingOrders.length === 0" class="text-center py-5">
              <Icon name="feather:check-circle" size="48" class="text-success mb-2 opacity-50" />
              <p class="text-muted mb-0">ไม่มีคำขอยกเลิกหรือคืนสินค้าในขณะนี้</p>
            </div>

            <div v-else class="list-group list-group-flush">
              <div v-for="order in pendingOrders" :key="order._id" class="list-group-item p-3 border-bottom">
                <div class="d-flex justify-content-between align-items-start mb-2">
                  <div class="d-flex align-items-center">
                    <img :src="getItemImage(order)" class="rounded border me-3"
                      style="width: 50px; height: 50px; object-fit: cover;">
                    <div>
                      <h6 class="fw-bold mb-0 text-dark">Order #{{ order.orderId || order._id.substr(-6) }}</h6>
                      <small class="text-muted">{{ order.customer }} • {{ getItems(order).length }} items</small>
                      <div class="text-danger small fw-bold mt-1" v-if="order.status === 'return_requested'">🚨
                        แจ้งปัญหา/ขอคืนสินค้า</div>
                      <div class="text-warning small fw-bold mt-1" v-else-if="order.status === 'cancel requested'">⚠️
                        ขอยกเลิกออเดอร์</div>
                    </div>
                  </div>
                  <div class="fw-bold text-primary">{{ formatCurrency(calculateTotal(order)) }}</div>
                </div>

                <div v-if="order.cancelReason"
                  class="bg-warning-subtle p-2 rounded mb-2 border border-warning-subtle small text-dark">
                  <span class="fw-bold">
                    <Icon name="feather:alert-triangle" size="12" /> เหตุผลที่ขอคืน/ยกเลิก:
                  </span> {{ order.cancelReason }}
                </div>

                <div v-if="order.note" class="bg-light p-2 rounded mb-2 border small text-secondary">
                  <span class="fw-bold text-dark">
                    <Icon name="feather:message-square" size="12" /> หมายเหตุจากลูกค้า:
                  </span>
                  <span class="fst-italic text-danger">"{{ order.note }}"</span>
                </div>

                <div class="d-flex gap-2 mt-2">
                  <button class="btn btn-sm btn-outline-secondary flex-grow-1 rounded-pill" @click="openDetail(order)">
                    ตรวจสอบ / ปฏิเสธ
                  </button>
                  <button class="btn btn-sm btn-success flex-grow-1 rounded-pill text-white fw-bold"
                    @click="handleRequestAction(order._id, 'cancelled')">
                    <Icon name="feather:check" size="14" class="me-1" /> อนุมัติการยกเลิก/คืนเงิน
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useOrderStore } from '~/store/orders'
import { useAuthStore } from '~/store/auth'
import OrderDetailModal from '~/pages/SellerPage/components/orderDetailModal.vue'

definePageMeta({ layout: 'seller' })

const router = useRouter()
const route = useRoute()
const orderStore = useOrderStore()
const authStore = useAuthStore()

// --- State Definitions ---
const currentStatus = ref('preparing')
const showRequestsModal = ref(false)
const showDetail = ref(false)
const selectedOrder = ref({ item: [] })

const statuses = [
  { key: 'preparing', label: 'กำลังเตรียม', icon: 'feather:package' },
  { key: 'shipped', label: 'กำลังส่ง', icon: 'feather:truck' },
  { key: 'completed', label: 'สำเร็จ', icon: 'feather:check-circle' },
  { key: 'cancelled', label: 'ยกเลิก', icon: 'feather:x-circle' }
]

// --- Core Logic & Lifecycle ---

const changeTab = async (statusKey) => {
  currentStatus.value = statusKey
  const query = { ...route.query, status: statusKey }
  delete query.id
  await router.push({ path: route.path, query })
}

const checkAndOpenOrder = (id) => {
  if (!id || !orderStore.allOrders || orderStore.allOrders.length === 0) return

  const targetOrder = orderStore.allOrders.find(o =>
    String(o._id) === String(id) || o.orderId === id
  )

  if (targetOrder) {
    openDetail(targetOrder)
  }
}

// ✅ 1. Watch Status: เมื่อเปลี่ยน Tab ผ่าน URL ให้โหลดข้อมูลใหม่
watch(() => route.query.status, async (newStatus) => {
  if (newStatus && statuses.some(s => s.key === newStatus)) {
    currentStatus.value = newStatus
    // เพิ่มบรรทัดนี้ เพื่อดึงข้อมูลใหม่เมื่อ Tab เปลี่ยน
    await orderStore.fetchOrders()
  }
})

// ✅ 2. Watch ID: เมื่อ ID ใน URL เปลี่ยน (กด Noti มา) ให้เช็คและเปิด Popup
watch(() => route.query.id, async (newId) => {
  if (newId) {
    // ถ้าข้อมูลยังไม่มา หรือหาไม่เจอ ให้โหลดใหม่ก่อน
    const exists = orderStore.allOrders.find(o => o._id === newId || o.orderId === newId)
    if (!exists) {
      await orderStore.fetchOrders()
    }
    checkAndOpenOrder(newId)
  } else {
    closeDetail()
  }
})

onMounted(async () => {
  await orderStore.fetchOrders()

  const queryStatus = route.query.status
  if (queryStatus && statuses.some(s => s.key === queryStatus)) {
    currentStatus.value = queryStatus
  } else {
    if (!route.query.id) {
      changeTab('preparing')
    } else {
      currentStatus.value = 'preparing'
    }
  }

  if (route.query.id) {
    checkAndOpenOrder(route.query.id)
  }
})

// --- Computed Properties ---

const myAllOrders = computed(() => {
  const all = orderStore.allOrders || []
  const myId = authStore.user?._id || authStore.user?.id
  if (!myId) return []
  return all.filter(order => {
    const items = order.item || order.items || []
    if (items.length === 0) return false
    const productOwner = items[0]?.productId?.userId
    const ownerId = (typeof productOwner === 'object') ? productOwner?._id : productOwner
    return ownerId === myId
  })
})

const pendingOrders = computed(() => {
  return myAllOrders.value.filter(o => {
    const s = (o.status || '').toLowerCase()
    return s === 'cancel requested' || s === 'return_requested'
  })
})

const filteredMyOrders = computed(() => {
  return myAllOrders.value.filter(o => (o.status || '').toLowerCase() === currentStatus.value.toLowerCase())
})

// --- Helper Functions ---

const getModalHeaderClass = (status) => {
  const s = (status || '').toLowerCase()
  if (['pending', 'preparing', 'confirm'].includes(s)) return 'header-preparing'
  if (['shipped', 'shipping'].includes(s)) return 'header-shipped'
  if (['completed', 'success', 'delivered'].includes(s)) return 'header-completed'
  if (['cancelled', 'cancel', 'cancel requested', 'rejected'].includes(s)) return 'header-cancelled'
  if (['return_requested', 'returned'].includes(s)) return 'header-return_requested'
  return 'header-preparing'
}

function countMyOrdersByStatus(statusKey) { return myAllOrders.value.filter(o => (o.status || '').toLowerCase() === statusKey.toLowerCase()).length }
function getStatusLabel(key) { return statuses.find(s => s.key === key)?.label || key }
function getItems(o) { return o.item || o.items || [] }
function calculateTotal(o) { const items = getItems(o); return items.length > 0 ? items.reduce((sum, i) => sum + (Number(i.price) * Number(i.qty)), 0) : (o.total || 0) }
function getItemName(o) { const items = getItems(o); return items.length > 0 ? items[0].name : 'No Items' }
function getItemImage(o) { const items = getItems(o); return (items.length > 0 && items[0].image) ? items[0].image : '/images/dashboard/default.png' }
function formatDate(o) { if (!o) return ''; const d = o.updatedAt || o.date; return d ? new Date(d).toLocaleDateString('th-TH') : 'N/A' }
function formatCurrency(v) { return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(v || 0) }
function getTextClass(s) { return 'text-status-' + (s || '').toLowerCase() }

// --- Modal Actions ---

function openDetail(o) {
  selectedOrder.value = { ...o };
  showDetail.value = true

  if (!route.query.id) {
    router.replace({ query: { ...route.query, id: o.orderId || o._id } })
  }
}

function closeDetail() {
  showDetail.value = false
  const query = { ...route.query }
  delete query.id
  router.replace({ query })
}

// ฟังก์ชันอนุมัติทันที (ไม่ต้องมี Modal)
async function handleRequestAction(id, action) {
  await orderStore.updateStatus(id, action)
  // ถ้าไม่มี pending เหลือแล้ว ให้ปิด modal รายการ
  if (pendingOrders.value.length === 0) {
    showRequestsModal.value = false
  }
}

async function handleOrderUpdated() {
  await orderStore.fetchOrders()
  closeDetail()
}
</script>

<style scoped>
/* ใช้ CSS ที่คุณมีอยู่แล้ว */
.header-preparing {
  background: linear-gradient(135deg, #0288D1 0%, #29B6F6 100%);
}

.text-status-preparing {
  color: #0277BD;
}

.header-shipped {
  background: linear-gradient(135deg, #5E35B1 0%, #7E57C2 100%);
}

.text-status-shipped {
  color: #4527A0;
}

.header-completed {
  background: linear-gradient(135deg, #00897B 0%, #26A69A 100%);
}

.text-status-completed {
  color: #00695C;
}

.header-cancelled {
  background: linear-gradient(135deg, #D32F2F 0%, #EF5350 100%);
}

.text-status-cancelled {
  color: #C62828;
}

.header-return_requested {
  background: linear-gradient(135deg, #F57F17 0%, #FFB300 100%);
}

.active-tab-preparing {
  background-color: #0288D1 !important;
  color: white !important;
}

.active-tab-shipped {
  background-color: #5E35B1 !important;
  color: white !important;
}

.active-tab-completed {
  background-color: #00897B !important;
  color: white !important;
}

.active-tab-cancelled {
  background-color: #D32F2F !important;
  color: white !important;
}

.custom-tabs .nav-link {
  color: #64748b;
  border-radius: 12px;
  font-weight: 600;
  padding: 12px;
  border: 1px solid transparent;
}

.custom-tabs .nav-link:hover {
  background-color: #f8fafc;
}

.transition-all {
  transition: all 0.3s ease;
}

.order-card {
  cursor: pointer;
  transition: 0.2s;
}

.order-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1) !important;
}

.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  padding: 20px;
}

.modal-content-custom {
  background: #fff;
  width: 100%;
  max-width: 700px;
  border-radius: 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>