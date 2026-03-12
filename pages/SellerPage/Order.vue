<template>
    <div class="container-fluid py-4 bg-light min-vh-100">
        <div class="mb-4">
            <h4 class="fw-bold mb-1 text-dark">สินค้าใหม่</h4>
            <p class="text-secondary small">คำสั่งซื้อใหม่ที่รอการยืนยัน</p>
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

            <div class="col-xl-3 col-md-6" v-for="order in myStoreOrders" :key="order._id">
                <div class="card h-100 order-card border-0 shadow-sm rounded-4 overflow-hidden"
                    @click="openDetail(order)">

                    <div
                        :class="['card-header border-0 py-3 d-flex justify-content-between align-items-center text-white', getModalHeaderClass(order.status)]">
                        <span class="fw-bold">Order #{{ order.orderId || (order._id ? order._id.substr(-6) : 'N/A')
                        }}</span>
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
                            <span class="text-secondary small">ราคารวม: {{ formatCurrency(calculateTotal(order))
                            }}</span>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="text-success small fw-bold">เงินที่ร้านได้รับ:</span>
                            <div class="fw-bolder text-success fs-5">{{ formatCurrency(order.sellerEarnings ||
                                calculateTotal(order))
                            }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <OrderDetailModal v-if="showDetail" :order="selectedOrder" @close="closeDetail" @updated="handleOrderUpdated" />
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

const showDetail = ref(false)
const selectedOrder = ref({ item: [] })

const checkAndOpenOrder = (id) => {
    if (!id || !orderStore.allOrders.length) return
    const targetOrder = orderStore.allOrders.find(o => String(o._id) === String(id) || o.orderId === id)
    if (targetOrder) openDetail(targetOrder)
}

watch(() => route.query.id, async (newId) => {
    if (newId) {
        await orderStore.fetchOrders()
        checkAndOpenOrder(newId)
    } else {
        closeDetail()
    }
})

onMounted(async () => {
    await orderStore.fetchOrders()
    if (route.query.id) {
        checkAndOpenOrder(route.query.id)
    }
})

const myStoreOrders = computed(() => {
    const allPending = orderStore.pendingOrders || []
    const myId = authStore.user?._id || authStore.user?.id
    if (!myId) return []

    // seller field เก็บ User ID ของเจ้าของร้าน (ไม่ใช่ Seller collection ID)
    return allPending.filter(order => {
        return String(order.seller) === String(myId)
    })
})

function openDetail(o) {
    selectedOrder.value = { ...o }
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

async function handleOrderUpdated() {
    await orderStore.fetchOrders()
    closeDetail()
}

// --- Helper Functions (เพิ่ม getModalHeaderClass และ getTextClass) ---

const getModalHeaderClass = (status) => {
    const s = (status || '').toLowerCase()
    // ในหน้า Order ส่วนใหญ่จะเป็น pending แต่ใส่เผื่อไว้ให้ครบ
    if (['pending', 'pending review'].includes(s)) return 'header-pending'
    if (['preparing', 'processing', 'confirm'].includes(s)) return 'header-preparing'
    return 'header-pending' // Default สีส้ม
}

const getTextClass = (s) => 'text-status-' + (s || 'pending').toLowerCase()

function getItems(order) { return order.item || order.items || [] }
function calculateTotal(order) { const items = getItems(order); return items.length > 0 ? items.reduce((sum, i) => sum + (Number(i.price) * Number(i.qty)), 0) : (order.total || 0) }
function getItemName(order) { const items = getItems(order); return items.length > 0 ? items[0].name : 'No Items' }
function getItemImage(order) { const items = getItems(order); return (items.length > 0 && items[0].image) ? items[0].image : '/images/dashboard/default.png' }
function formatDate(order) { const d = order.updatedAt || order.date; return d ? new Date(d).toLocaleDateString('th-TH') : '-' }
function formatCurrency(v) { return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(v || 0) }
</script>

<style scoped>
/* Gradient Backgrounds */
.header-pending {
    background: linear-gradient(135deg, #FF8F00 0%, #FFB300 100%);
}

.header-preparing {
    background: linear-gradient(135deg, #0288D1 0%, #29B6F6 100%);
}

/* Text Colors */
.text-status-pending {
    color: #E65100;
}

.text-status-preparing {
    color: #0277BD;
}

/* Card & Button Styles */
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