<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    <div class="mb-4">
        <h4 class="fw-bold mb-1 text-dark">New Orders</h4>
        <p class="text-secondary small">คำสั่งซื้อใหม่ที่รอการยืนยัน (Pending)</p>
    </div>

    <div v-if="orderStore.isLoading" class="text-center py-5">
        <div class="spinner-border text-warning" role="status"></div>
    </div>

    <div v-else class="row g-3">
        <div class="col-12 text-center py-5" v-if="pendingOrders.length === 0">
            <div class="opacity-50">
                <Icon name="feather:inbox" size="64" class="text-muted mb-3" />
                <h5 class="text-muted">ไม่พบคำสั่งซื้อใหม่</h5>
            </div>
        </div>

        <div class="col-xl-4 col-md-6" v-for="order in pendingOrders" :key="order._id">
            <div class="card h-100 order-card border-0 shadow-sm rounded-4 overflow-hidden" @click="openDetail(order)">
                <div class="card-header border-0 py-3 d-flex justify-content-between align-items-center text-white header-pending">
                    <span class="fw-bold">Order #{{ order.orderId || order._id.substr(-6) }}</span>
                    <small class="bg-white-glass px-2 py-1 rounded">
                        <Icon name="feather:clock" size="12" /> {{ formatDate(order.date) }}
                    </small>
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
                            <h6 class="fw-bold mb-1 text-dark">{{ order.customer }}</h6>
                            <p class="text-muted small mb-1 text-truncate">{{ getItemName(order) }}</p>
                            <span class="badge bg-light text-warning border border-warning">
                                ● รอการยืนยัน
                            </span>
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                        <span class="text-muted small">Click to manage</span>
                        <span class="fw-bold fs-5 text-status-pending">{{ formatCurrency(order.total) }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <Transition name="fade">
      <div v-if="showDetail" class="modal-backdrop-custom" @click.self="closeDetail">
        <div class="modal-content-custom p-0 overflow-hidden shadow-lg">
          
          <div class="px-4 py-3 d-flex justify-content-between align-items-center text-white header-pending">
            <div>
              <h5 class="fw-bold mb-0">Manage Order</h5>
              <small class="opacity-90">ตรวจสอบรายละเอียดก่อนกดยืนยัน</small>
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
                           <Icon name="feather:user" size="14" class="me-1 text-status-pending"/> {{ selectedOrder.customer }}
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
                            <div class="text-muted x-small" v-if="it.variant">{{ it.variant }}</div>
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
                  <h3 class="fw-bolder m-0 text-status-pending">{{ formatCurrency(selectedOrder.total) }}</h3>
                </div>
                
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-danger rounded-pill px-4 py-2" 
                            @click="handleReject(selectedOrder._id)">
                        <Icon name="feather:x-circle" class="me-1"/> Reject
                    </button>
                    
                    <button class="btn btn-success text-white rounded-pill px-4 py-2 shadow-sm fw-bold" 
                            @click="handleAccept(selectedOrder._id)">
                        Accept Order <Icon name="feather:check-circle" class="ms-1"/>
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
import { useRouter } from 'vue-router'
import { useOrderStore } from '~/store/orders'

definePageMeta({ layout: 'seller' })

const router = useRouter()
const orderStore = useOrderStore()

// 1. โหลดข้อมูลตอนเปิดหน้า
onMounted(() => {
    orderStore.fetchOrders()
})

// 2. กรองเฉพาะ Pending มาโชว์
const pendingOrders = computed(() => orderStore.pendingOrders)

// --- Actions ปุ่มกด ---

// ฟังก์ชันรับออเดอร์ (Accept)
// ฟังก์ชันรับออเดอร์
async function handleAccept(id) {
    // if(!confirm('ยืนยันรับออเดอร์ใช่หรือไม่?')) return; // <--- ลบบรรทัดนี้ทิ้ง
    
    await orderStore.updateStatus(id, 'Preparing')
    closeDetail()
    router.push('/SellerPage/orderStatus')
}

// ฟังก์ชันยกเลิก
async function handleReject(id) {
    // if(!confirm('คุณต้องการปฏิเสธคำสั่งซื้อนี้ใช่หรือไม่?')) return; // <--- ลบบรรทัดนี้ทิ้ง
    
    await orderStore.updateStatus(id, 'Cancelled')
    closeDetail()
}


// --- Modal & Helpers ---
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
function getItemName(o) { return (o.item && o.item.length > 0) ? o.item[0].name : 'Item' }
function getItemImage(o) {
    if(o.item && o.item.length > 0 && o.item[0].image) return o.item[0].image
    return '/images/dashboard/default.png'
}
</script>

<style scoped>
/* CSS เน้นสีส้ม (Pending Style) */
.header-pending { background: linear-gradient(135deg, #FF8F00 0%, #FFB300 100%); }
.text-status-pending { color: #E65100; }

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