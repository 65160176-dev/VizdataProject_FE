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
        <div class="col-12 text-center py-5" v-if="myStoreOrders.length === 0">
            <div class="opacity-50">
                <Icon name="feather:inbox" size="64" class="text-muted mb-3" />
                <h5 class="text-muted">ไม่พบคำสั่งซื้อใหม่สำหรับร้านคุณ</h5>
            </div>
        </div>

        <div class="col-xl-4 col-md-6" v-for="order in myStoreOrders" :key="order._id">
            <div class="card h-100 order-card border-0 shadow-sm rounded-4 overflow-hidden" @click="openDetail(order)">
                <div class="card-header border-0 py-3 d-flex justify-content-between align-items-center text-white header-pending">
                    <span class="fw-bold">Order #{{ order.orderId || order._id.substr(-6) }}</span>
                    <small class="bg-white-glass px-2 py-1 rounded">
                        <Icon name="feather:clock" size="12" /> {{ formatDate(order) }}
                    </small>
                </div>

                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <div class="position-relative">
                             <img :src="getItemImage(order)" class="rounded-3 border" style="width: 70px; height: 70px; object-fit: cover;">
                             <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" v-if="getItems(order).length > 1">
                                +{{ getItems(order).length - 1 }}
                             </span>
                        </div>
                        
                        <div class="ms-3 flex-grow-1">
                            <h6 class="fw-bold mb-1 text-dark">{{ order.customer || 'Customer' }}</h6>
                            <p class="text-muted small mb-1 text-truncate">{{ getItemName(order) }}</p>
                            <span class="badge bg-light text-warning border border-warning">● รอการยืนยัน</span>
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                        <span class="text-muted small">คลิกเพื่อจัดการ</span>
                        <span class="fw-bold fs-5 text-status-pending">{{ formatCurrency(calculateTotal(order)) }}</span>
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
                        <div class="fw-bold mb-1 text-dark"><Icon name="feather:user" size="14"/> {{ selectedOrder.customer }}</div>
                        <div class="small text-secondary mb-1"><Icon name="feather:mail" size="14"/> {{ selectedOrder.email }}</div>
                        <div class="small text-secondary"><Icon name="feather:map-pin" size="14"/> {{ selectedOrder.address }}</div>
                      </div>
                  </div>
                  <div class="col-md-6">
                      <div class="p-3 bg-light rounded-3 h-100 border border-light">
                        <h6 class="text-muted small mb-2 text-uppercase fw-bold">Order Info</h6>
                        <div class="d-flex justify-content-between mb-1">
                            <span class="small text-secondary">Order ID:</span>
                            <span class="fw-bold text-dark">{{ selectedOrder.orderId }}</span>
                        </div>
                        <div class="d-flex justify-content-between mb-1">
                            <span class="small text-secondary">Date:</span>
                            <span class="small text-dark">{{ formatDate(selectedOrder) }}</span>
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
                    <tr v-for="(it, idx) in getItems(selectedOrder)" :key="idx" class="border-bottom last:border-0">
                      <td class="ps-3">
                        <div class="d-flex align-items-center">
                          <img :src="it.image || '/images/dashboard/default.png'" class="rounded border me-2" style="width: 40px; height: 40px; object-fit: cover;">
                          <div class="fw-semibold small text-dark">{{ it.name }}</div>
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
                  <h3 class="fw-bolder m-0 text-status-pending">{{ formatCurrency(calculateTotal(selectedOrder)) }}</h3>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-outline-danger rounded-pill px-4 py-2" @click="handleReject(selectedOrder._id)">Reject</button>
                    <button class="btn btn-success text-white rounded-pill px-4 py-2 shadow-sm fw-bold" @click="handleAccept(selectedOrder._id)">Accept Order</button>
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
import { useAuthStore } from '~/store/auth' // ✅ Import Auth Store

definePageMeta({ layout: 'seller' })

const router = useRouter()
const orderStore = useOrderStore()
const authStore = useAuthStore() // ✅ เรียกใช้ Auth Store

onMounted(async () => {
    // โหลดออเดอร์ทั้งหมดมาก่อน (จริงๆ Backend ควรมี Endpoint filter ให้ แต่ใช้ Frontend Filter ก่อนได้)
    await orderStore.fetchOrders()
})

// ✅ Logic สำคัญ: กรองออเดอร์เฉพาะที่เป็นของร้านนี้ (User นี้)
const myStoreOrders = computed(() => {
    const allPending = orderStore.pendingOrders || []
    const myId = authStore.user?._id || authStore.user?.id

    if (!myId) return [] // ถ้าไม่มี User ID ไม่โชว์อะไรเลย

    return allPending.filter(order => {
        const items = order.item || order.items || []
        if (items.length === 0) return false
        
        // เช็คว่าสินค้าชิ้นแรกในออเดอร์ เป็นของ User นี้หรือไม่
        // โครงสร้าง Backend Populate: item.productId.userId._id
        const productOwner = items[0]?.productId?.userId
        
        // รองรับทั้งแบบ owner เป็น Object (Populated) หรือ String ID
        const ownerId = (typeof productOwner === 'object') ? productOwner?._id : productOwner

        return ownerId === myId
    })
})

function getItems(order) {
    if (!order) return []
    return order.item || order.items || []
}

function calculateTotal(order) {
    const items = getItems(order)
    // คำนวณยอดรวมใหม่จากรายการสินค้าจริงในออเดอร์นี้
    return items.length > 0 ? items.reduce((sum, i) => sum + (Number(i.price) * Number(i.qty)), 0) : (order.total || 0)
}

function getItemName(order) {
    const items = getItems(order)
    return items.length > 0 ? items[0].name : 'No Items'
}

function getItemImage(order) {
    const items = getItems(order)
    return (items.length > 0 && items[0].image) ? items[0].image : '/images/dashboard/default.png'
}

function formatDate(order) {
    const d = order.updatedAt || order.date
    return d ? new Date(d).toLocaleDateString('th-TH') : '-'
}

function formatCurrency(v) {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(v || 0)
}

const showDetail = ref(false)
const selectedOrder = ref({ item: [] })

function openDetail(o) {
    selectedOrder.value = { ...o }
    showDetail.value = true
}

function closeDetail() { showDetail.value = false }

async function handleAccept(id) {
    await orderStore.updateStatus(id, 'preparing')
    closeDetail()
    // รีเฟรชข้อมูลหลังอัปเดต
    await orderStore.fetchOrders() 
    router.push('/SellerPage/orderStatus')
}

async function handleReject(id) {
    await orderStore.updateStatus(id, 'cancelled')
    closeDetail()
    await orderStore.fetchOrders()
}
</script>

<style scoped>
.header-pending { background: linear-gradient(135deg, #FF8F00 0%, #FFB300 100%); }
.text-status-pending { color: #E65100; }
.order-card { transition: 0.2s; cursor: pointer; }
.order-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
.modal-backdrop-custom { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; z-index: 1050; }
.modal-content-custom { background: #fff; width: 100%; max-width: 700px; border-radius: 16px; }

/* เพิ่ม CSS ให้ปุ่มปิด Modal สวยขึ้น */
.btn-white-glass { background: rgba(255,255,255,0.2); border: none; transition: 0.2s; }
.btn-white-glass:hover { background: rgba(255,255,255,0.4); transform: rotate(90deg); }
</style>