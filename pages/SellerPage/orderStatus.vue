<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1 text-dark">Order Status</h4>
        <p class="text-secondary small mb-0">ติดตามสถานะการจัดส่งและจัดการคำสั่งซื้อ</p>
      </div>
    </div>

    <div class="card mb-4 border-0 shadow-sm rounded-4">
      <div class="card-body p-2">
        <ul class="nav nav-pills nav-fill custom-tabs">
          <li class="nav-item" v-for="s in statuses" :key="s.key">
            <a class="nav-link d-flex align-items-center justify-content-center gap-2"
               :class="{ active: currentStatus === s.key }"
               href="#" @click.prevent="currentStatus = s.key">
              <Icon :name="s.icon" size="18" />
              <span>{{ s.label }}</span>
              <span class="badge rounded-pill ms-2" 
                    :class="currentStatus === s.key ? 'bg-white ' + getTextClass(s.key) : 'bg-light text-dark'">
                {{ countByStatus(s.key) }}
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
      <div class="col-12 text-center py-5" v-if="filteredOrders.length === 0">
        <div class="empty-state">
          <Icon name="feather:inbox" size="64" class="text-muted mb-3 opacity-25" />
          <h5 class="text-muted">ไม่มีรายการในสถานะ "{{ getStatusLabel(currentStatus) }}"</h5>
        </div>
      </div>

      <div class="col-xl-4 col-md-6" v-for="order in filteredOrders" :key="order._id">
        <div class="card h-100 order-card border-0 shadow-sm rounded-4 overflow-hidden" @click="openDetail(order)">
          <div :class="['card-header border-0 py-3 d-flex justify-content-between align-items-center text-white', 'header-' + order.status]">
            <span class="fw-bold">Order #{{ order.orderId || (order._id ? order._id.substr(-6) : 'N/A') }}</span>
            <small class="bg-white-glass px-2 py-1 rounded">
                <Icon name="feather:calendar" size="12" /> {{ formatDate(order) }}
            </small>
          </div>
          
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <img :src="getItemImage(order)" class="rounded-3 border" style="width: 70px; height: 70px; object-fit: cover;">
              <div class="ms-3 flex-grow-1">
                <h6 class="fw-bold mb-1 text-dark">{{ order.customer || 'Unknown' }}</h6>
                <p class="text-muted small mb-0 text-truncate">{{ getItemName(order) }}</p>
                <div class="mt-2 small fw-bold" :class="getTextClass(order.status)">
                   ● {{ order.status.toUpperCase() }}
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center pb-3">
             <span class="text-secondary small">{{ getItems(order).length }} รายการ</span>
             <div class="fw-bolder text-dark fs-5">
                {{ formatCurrency(calculateTotal(order)) }}
             </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showDetail" class="modal-backdrop-custom" @click.self="closeDetail">
        <div class="modal-content-custom p-0 overflow-hidden shadow-lg">
          
          <div :class="['px-4 py-3 d-flex justify-content-between align-items-center text-white', 'header-' + selectedOrder.status]">
            <div>
              <h5 class="fw-bold mb-0">Order Detail</h5>
              <small class="opacity-90">สถานะ: {{ selectedOrder.status }}</small>
            </div>
            <button class="btn btn-icon btn-white-glass rounded-circle text-white" @click="closeDetail">
              <Icon name="feather:x" size="20" />
            </button>
          </div>
          
          <div class="p-4 bg-white">
              <div class="row mb-4 g-3">
                  <div class="col-md-6">
                    <div class="p-3 bg-light rounded-3 h-100">
                      <h6 class="text-muted small mb-2 fw-bold text-uppercase">ที่อยู่จัดส่ง</h6>
                      <div class="fw-bold mb-1">{{ selectedOrder.customer }}</div>
                      <div class="small text-secondary">{{ selectedOrder.address }}</div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="p-3 bg-light rounded-3 h-100">
                      <h6 class="text-muted small mb-2 fw-bold text-uppercase">ข้อมูลคำสั่งซื้อ</h6>
                      <div class="d-flex justify-content-between small mb-1">
                          <span>Email:</span> <span class="fw-bold">{{ selectedOrder.email }}</span>
                      </div>
                      <div class="d-flex justify-content-between small">
                          <span>Date:</span> <span class="fw-bold">{{ formatDate(selectedOrder) }}</span>
                      </div>
                    </div>
                  </div>
              </div>

              <h6 class="fw-bold mb-3">รายการสินค้า</h6>
              <div class="table-responsive mb-4 border rounded-3">
                <table class="table table-borderless align-middle mb-0">
                  <thead class="bg-light small">
                    <tr><th>Product</th><th class="text-end">Price</th><th class="text-end">Qty</th><th class="text-end">Total</th></tr>
                  </thead>
                  <tbody>
                    <tr v-for="(it, idx) in getItems(selectedOrder)" :key="idx" class="border-bottom">
                      <td><div class="small fw-bold">{{ it.name }}</div></td>
                      <td class="text-end small">{{ formatCurrency(it.price) }}</td>
                      <td class="text-end small">x{{ it.qty }}</td>
                      <td class="text-end fw-bold">{{ formatCurrency(it.price * it.qty) }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                <div>
                  <span class="text-secondary small">ยอดรวมทั้งหมด</span>
                  <h3 class="fw-bolder m-0" :class="getTextClass(selectedOrder.status)">{{ formatCurrency(calculateTotal(selectedOrder)) }}</h3>
                </div>
                
                <div>
                  <button v-if="selectedOrder.status === 'preparing'" class="btn btn-primary rounded-pill px-4" @click="handleUpdate(selectedOrder._id, 'shipped')">
                    ส่งสินค้าแล้ว <Icon name="feather:truck" class="ms-1"/>
                  </button>
                  <button v-if="selectedOrder.status === 'shipped'" class="btn btn-success rounded-pill px-4" @click="handleUpdate(selectedOrder._id, 'completed')">
                    เสร็จสมบูรณ์ <Icon name="feather:check" class="ms-1"/>
                  </button>
                  <button v-else class="btn btn-secondary rounded-pill px-4" @click="closeDetail">ปิดหน้าต่าง</button>
                </div>
              </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useOrderStore } from '~/store/orders'

definePageMeta({ layout: 'seller' })

const orderStore = useOrderStore()
const currentStatus = ref('preparing')

const statuses = [
  { key: 'preparing', label: 'กำลังเตรียม', icon: 'feather:package' },
  { key: 'shipped', label: 'กำลังส่ง', icon: 'feather:truck' },
  { key: 'completed', label: 'สำเร็จแล้ว', icon: 'feather:check-circle' },
  { key: 'cancelled', label: 'ยกเลิกแล้ว', icon: 'feather:x-circle' }
]

onMounted(async () => {
    await orderStore.fetchOrders()
})

// ดึงข้อมูลตามสถานะจาก Getter ใน Store
const filteredOrders = computed(() => orderStore.ordersByStatus(currentStatus.value))

function countByStatus(s) { return orderStore.countByStatus(s) }
function getStatusLabel(key) { return statuses.find(s => s.key === key)?.label || key }

// ฟังก์ชันดึงรายการสินค้า
function getItems(o) {
    if (!o) return []
    return o.item || o.items || []
}

// คำนวณราคาสุทธิ
function calculateTotal(o) {
    const items = getItems(o)
    if (items.length > 0) {
        return items.reduce((sum, i) => sum + (Number(i.price) * Number(i.qty)), 0)
    }
    return o.total || 0
}

function getItemName(o) {
    const items = getItems(o)
    return items.length > 0 ? items[0].name : 'No Items'
}

function getItemImage(o) {
    const items = getItems(o)
    return (items.length > 0 && items[0].image) ? items[0].image : '/images/dashboard/default.png'
}

function formatDate(o) {
    if (!o) return ''
    const d = o.updatedAt || o.date
    return d ? new Date(d).toLocaleDateString('th-TH') : 'N/A'
}

function formatCurrency(v) {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(v || 0)
}

function getTextClass(s) { return 'text-status-' + (s || '').toLowerCase() }

// Modal Logic
const showDetail = ref(false)
const selectedOrder = ref({ item: [] })

function openDetail(o) {
    selectedOrder.value = { ...o }
    showDetail.value = true
}
function closeDetail() { showDetail.value = false }

async function handleUpdate(id, newStatus) {
    await orderStore.updateStatus(id, newStatus)
    closeDetail()
}
</script>

<style scoped>
/* พื้นหลังไล่เฉดตามสถานะ */
.header-preparing { background: linear-gradient(135deg, #0288D1 0%, #29B6F6 100%); }
.text-status-preparing { color: #0277BD; }

.header-shipped { background: linear-gradient(135deg, #5E35B1 0%, #7E57C2 100%); }
.text-status-shipped { color: #4527A0; }

.header-completed { background: linear-gradient(135deg, #00897B 0%, #26A69A 100%); }
.text-status-completed { color: #00695C; }

.header-cancelled { background: linear-gradient(135deg, #D32F2F 0%, #EF5350 100%); }
.text-status-cancelled { color: #C62828; }

/* การตกแต่ง Tabs */
.custom-tabs .nav-link { color: #64748b; border-radius: 8px; font-weight: 600; padding: 12px; transition: 0.2s; border: 1px solid transparent; }
.custom-tabs .nav-link.active { background: #fff !important; color: #0f172a !important; border-color: #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); }

/* การตกแต่ง Card */
.order-card { cursor: pointer; transition: 0.2s; }
.order-card:hover { transform: translateY(-4px); box-shadow: 0 12px 20px rgba(0,0,0,0.08) !important; }
.bg-white-glass { background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); }

/* Modal */
.modal-backdrop-custom { position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 20px; }
.modal-content-custom { background: #fff; width: 100%; max-width: 700px; border-radius: 20px; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>