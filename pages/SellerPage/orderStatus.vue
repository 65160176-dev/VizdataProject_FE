<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1 text-dark">Order Status</h4>
        <p class="text-secondary small mb-0">ติดตามสถานะการจัดส่ง (ที่รับออเดอร์แล้ว)</p>
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
          <h5 class="text-muted">ไม่มีรายการในสถานะนี้</h5>
        </div>
      </div>

      <div class="col-xl-4 col-md-6" v-for="order in filteredOrders" :key="order._id">
        <div class="card h-100 order-card border-0 shadow-sm rounded-4 overflow-hidden" @click="openDetail(order)">
          <div :class="['card-header border-0 py-3 d-flex justify-content-between align-items-center text-white', 'header-' + order.status]">
            <div class="d-flex align-items-center gap-2">
               <span class="fw-bold fs-6">Order #{{ order.orderId || order._id.substr(-6) }}</span>
            </div>
            <div class="d-flex align-items-center gap-1 opacity-90 small bg-white-glass px-2 py-1 rounded">
               <Icon name="feather:clock" size="12" /> {{ formatDate(order.date) }}
            </div>
          </div>
          
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="position-relative">
                  <img :src="getItemImage(order)" class="rounded-3 border" style="width: 70px; height: 70px; object-fit: cover;">
                  <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" v-if="order.item && order.item.length > 1">
                    +{{ order.item.length - 1 }}
                  </span>
              </div>
              <div class="ms-3 flex-grow-1">
                <h6 class="fw-bold mb-1 text-truncate text-dark" style="max-width: 200px;">{{ order.customer }}</h6>
                <p class="text-muted small mb-0 text-truncate">{{ getItemName(order) }}</p>
                <div class="mt-2 text-xs fw-bold d-flex align-items-center gap-1">
                    <span :class="getTextClass(order.status)">
                      ● {{ order.status }} 
                    </span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center pb-3 pt-0">
             <div class="text-secondary small d-flex align-items-center gap-1">
                <Icon name="feather:credit-card" size="14" /> {{ order.paymentMethod }}
             </div>
             <div class="fw-bolder text-dark fs-5">
                {{ formatCurrency(order.total) }}
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
              <small class="opacity-75">Status: {{ selectedOrder.status }}</small>
            </div>
            <button class="btn btn-icon btn-white-glass rounded-circle text-white" @click="closeDetail">
              <Icon name="feather:x" size="20" />
            </button>
          </div>
          
          <div class="p-4 bg-white">
             <div class="row mb-4 g-3">
                 <div class="col-md-6">
                    <div class="p-3 bg-light rounded-3 h-100 border border-light">
                      <h6 class="text-muted small mb-2 text-uppercase fw-bold">Customer Info</h6>
                      <div class="fw-bold mb-1 text-dark">
                          <Icon name="feather:user" size="14" class="me-1" :class="'text-status-' + selectedOrder.status"/> {{ selectedOrder.customer }}
                      </div>
                      <div class="small text-secondary mb-1">
                          <Icon name="feather:mail" size="14" class="me-1"/> {{ selectedOrder.email }}
                      </div>
                      <div class="small text-secondary">
                          <Icon name="feather:map-pin" size="14" class="me-1"/> {{ selectedOrder.address }}
                      </div>
                    </div>
                 </div>
                 <div class="col-md-6">
                    <div class="p-3 bg-light rounded-3 h-100 border border-light">
                      <h6 class="text-muted small mb-2 text-uppercase fw-bold">Order Info</h6>
                        <div class="d-flex justify-content-between mb-1">
                            <span class="small text-secondary">Payment:</span>
                            <span class="fw-bold text-dark">{{ selectedOrder.paymentMethod }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-1">
                            <span class="small text-secondary">Date:</span>
                            <span class="small text-dark">{{ formatDate(selectedOrder.date) }}</span>
                        </div>
                    </div>
                 </div>
             </div>

             <h6 class="fw-bold mb-3 text-dark">Items Ordered</h6>
             <div class="table-responsive mb-4 border rounded-3">
                <table class="table table-borderless mb-0 align-middle">
                    <thead class="bg-light">
                        <tr class="small text-muted">
                          <th class="ps-3">Product</th>
                          <th class="text-end">Price</th>
                          <th class="text-end">Qty</th>
                          <th class="text-end pe-3">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(it, idx) in selectedOrder.item" :key="idx" class="border-bottom last:border-0">
                            <td class="ps-3">
                                <div class="d-flex align-items-center">
                                    <img :src="it.image || '/images/dashboard/default.png'" class="rounded border me-2" style="width: 40px; height: 40px; object-fit: cover;">
                                    <div>
                                        <div class="fw-semibold small text-dark">{{ it.name }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="text-end text-muted small">{{ formatCurrency(it.price) }}</td>
                            <td class="text-end fw-bold text-dark">x{{ it.qty }}</td>
                            <td class="text-end pe-3 fw-bold text-dark">{{ formatCurrency(it.price * it.qty) }}</td>
                        </tr>
                    </tbody>
                </table>
             </div>

             <div class="d-flex justify-content-between align-items-center pt-2 border-top">
               <div>
                 <span class="text-secondary small">Total Amount</span>
                 <h4 class="fw-bolder m-0" :class="getTextClass(selectedOrder.status)">{{ formatCurrency(selectedOrder.total) }}</h4>
               </div>
               
               <div>
                 <button v-if="selectedOrder.status === 'preparing'" 
                         class="btn btn-primary text-white px-4 py-2 shadow-sm rounded-pill" 
                         @click="handleStatusUpdate(selectedOrder._id, 'shipped')">
                    ยืนยันการจัดส่ง <Icon name="feather:truck" class="ms-1"/>
                 </button>

                 <button v-if="selectedOrder.status === 'shipped'" 
                         class="btn btn-success text-white px-4 py-2 shadow-sm rounded-pill" 
                         @click="handleStatusUpdate(selectedOrder._id, 'completed')">
                    เสร็จสิ้นคำสั่งซื้อ <Icon name="feather:check" class="ms-1"/>
                 </button>

                 <button v-if="['completed', 'cancelled'].includes(selectedOrder.status)" 
                         class="btn btn-secondary px-4 py-2 rounded-pill" 
                         @click="closeDetail">
                    Close
                 </button>

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

// 1. โหลดข้อมูล
onMounted(() => {
    orderStore.fetchOrders()
})

const statuses = [
  { key: 'preparing', label: 'กำลังเตรียม', icon: 'feather:package' },
  { key: 'shipped', label: 'กำลังส่ง', icon: 'feather:truck' },
  { key: 'completed', label: 'สำเร็จ', icon: 'feather:check-circle' },
  { key: 'cancelled', label: 'ยกเลิก', icon: 'feather:x-circle' }
]

const currentStatus = ref('preparing')

// 2. กรองข้อมูล
const filteredOrders = computed(() => orderStore.ordersByStatus(currentStatus.value))

function countByStatus(s) { return orderStore.countByStatus(s) }

// 3. Update Status
async function handleStatusUpdate(id, status) {
    // ไม่มี confirm แล้ว สั่งอัปเดตเลย
    await orderStore.updateStatus(id, status)
    
    // *** สั่งปิด Popup ทันที ***
    closeDetail();
}

// Helpers
const showDetail = ref(false)
const selectedOrder = ref({ item: [] })

function openDetail(o) { 
    selectedOrder.value = JSON.parse(JSON.stringify(o)); 
    if(!selectedOrder.value.item) selectedOrder.value.item = []
    showDetail.value = true 
}
function closeDetail() { showDetail.value = false }

function formatCurrency(v){ 
    if (isNaN(v)) return '฿0'; 
    return new Intl.NumberFormat('th-TH',{ style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(v) 
}
function formatDate(d) { return d ? new Date(d).toLocaleDateString('en-GB') : '' }
function getTextClass(s) { return 'text-status-' + s }
function getItemName(o) { return (o.item && o.item.length > 0) ? o.item[0].name : 'Item' }
function getItemImage(o) {
    if(o.item && o.item.length > 0 && o.item[0].image) return o.item[0].image
    return '/images/dashboard/default.png'
}
</script>

<style scoped>
/* Theme Colors */
.header-preparing { background: linear-gradient(135deg, #0288D1 0%, #29B6F6 100%); }
.text-status-preparing { color: #0277BD; }

.header-shipped { background: linear-gradient(135deg, #5E35B1 0%, #7E57C2 100%); }
.text-status-shipped { color: #4527A0; }

.header-completed { background: linear-gradient(135deg, #00897B 0%, #26A69A 100%); }
.text-status-completed { color: #00695C; }

.header-cancelled { background: linear-gradient(135deg, #D32F2F 0%, #EF5350 100%); }
.text-status-cancelled { color: #C62828; }

/* Styles */
.custom-tabs .nav-link { color: #64748b; border-radius: 8px; padding: 10px 16px; font-weight: 600; transition: all 0.2s ease; }
.custom-tabs .nav-link:hover { background-color: #f1f5f9; color: #334155; }
.custom-tabs .nav-link.active { background: #fff; color: #0f172a; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }

.order-card { transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer; background: #fff; }
.order-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }

.bg-white-glass { background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); }
.btn-white-glass { background: rgba(255,255,255,0.25); border: none; transition: background 0.2s; }
.btn-white-glass:hover { background: rgba(255,255,255,0.4); }

.modal-backdrop-custom { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 20px; }
.modal-content-custom { background: #fff; width: 100%; max-width: 700px; border-radius: 16px; border: none; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>