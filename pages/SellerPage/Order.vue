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
                <div class="card h-100 order-card border-0 shadow-sm rounded-4 overflow-hidden"
                    @click="openDetail(order)">
                    <div
                        class="card-header border-0 py-3 d-flex justify-content-between align-items-center text-white header-pending">
                        <span class="fw-bold">Order #{{ order.orderId || order._id.substr(-6) }}</span>
                        <small class="bg-white-glass px-2 py-1 rounded">
                            <Icon name="feather:clock" size="12" /> {{ formatDate(order) }}
                        </small>
                    </div>

                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="position-relative">
                                <img :src="getItemImage(order)" class="rounded-3 border"
                                    style="width: 70px; height: 70px; object-fit: cover;">
                                <span
                                    class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white"
                                    v-if="getItems(order).length > 1">
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
                            <span class="fw-bold fs-5 text-status-pending">{{ formatCurrency(calculateTotal(order))
                            }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <OrderDetailModal v-if="showDetail" :order="selectedOrder" @close="closeDetail" @updated="handleOrderUpdated" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore } from '~/store/orders'
import { useAuthStore } from '~/store/auth'
// ✅ Import Modal
import OrderDetailModal from '~/pages/SellerPage/components/orderDetailModal.vue'

definePageMeta({ layout: 'seller' })

const router = useRouter()
const orderStore = useOrderStore()
const authStore = useAuthStore()

onMounted(async () => {
    await orderStore.fetchOrders()
})

const myStoreOrders = computed(() => {
    const allPending = orderStore.pendingOrders || []
    const myId = authStore.user?._id || authStore.user?.id
    if (!myId) return []

    return allPending.filter(order => {
        const items = order.item || order.items || []
        if (items.length === 0) return false
        const productOwner = items[0]?.productId?.userId
        const ownerId = (typeof productOwner === 'object') ? productOwner?._id : productOwner
        return ownerId === myId
    })
})

const showDetail = ref(false)
const selectedOrder = ref({ item: [] })

function openDetail(o) {
    selectedOrder.value = { ...o }
    showDetail.value = true
}

function closeDetail() { showDetail.value = false }

// ✅ ฟังก์ชันรับ Event เมื่อ Modal ทำงานเสร็จ
async function handleOrderUpdated() {
    await orderStore.fetchOrders()
    // ถ้าไม่มีออเดอร์ค้างแล้ว อาจจะ redirect หรือไม่ก็ได้
}

// Helper Functions (สำหรับการ์ดด้านนอก)
function getItems(order) { return order.item || order.items || [] }
function calculateTotal(order) { const items = getItems(order); return items.length > 0 ? items.reduce((sum, i) => sum + (Number(i.price) * Number(i.qty)), 0) : (order.total || 0) }
function getItemName(order) { const items = getItems(order); return items.length > 0 ? items[0].name : 'No Items' }
function getItemImage(order) { const items = getItems(order); return (items.length > 0 && items[0].image) ? items[0].image : '/images/dashboard/default.png' }
function formatDate(order) { const d = order.updatedAt || order.date; return d ? new Date(d).toLocaleDateString('th-TH') : '-' }
function formatCurrency(v) { return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(v || 0) }
</script>

<style scoped>
.header-pending {
    background: linear-gradient(135deg, #FF8F00 0%, #FFB300 100%);
}

.text-status-pending {
    color: #E65100;
}

.order-card {
    transition: 0.2s;
    cursor: pointer;
}

.order-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
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
</style>