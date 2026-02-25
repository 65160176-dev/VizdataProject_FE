<template>
    <div class="dashboard-card">
        <div class="card-header-custom" v-if="!selectedOrder">
            <h3><i class="fa fa-shopping-bag me-2"></i>ประวัติการสั่งซื้อ</h3>
        </div>

        <div class="card-body-custom" :class="{ 'p-0': isAuthenticated }">
            <template v-if="isAuthenticated">
                <div v-if="!selectedOrder">

                    <div class="order-tab-box">
                        <div class="order-tabs-wrapper">
                            <button v-for="tab in tabs" :key="tab.value" class="order-tab-btn"
                                :class="{ active: activeTab === tab.value }" @click="updateOrderFilter(tab.value)">
                                {{ tab.label }}
                                <span class="count-badge" v-if="getCount(tab.value) > 0">
                                    {{ getCount(tab.value) }}
                                </span>
                            </button>
                        </div>
                    </div>

                    <div class="p-3" v-if="isLoadingOrders">
                        <div class="text-center py-5">
                            <div class="spinner-border text-orange" role="status"></div>
                            <p class="mt-2">กำลังโหลดรายการ...</p>
                        </div>
                    </div>

                    <div class="p-3" v-else>
                        <div v-if="filteredOrders && filteredOrders.length > 0">
                            <div v-for="(order, index) in paginatedOrders" :key="index" class="order-card-item">
                                <div class="order-header">
                                    <div class="d-flex align-items-center gap-2">
                                        <NuxtLink :to="`/seller/${order.shopId}`"
                                            class="shop-name text-decoration-none text-dark hover-underline"
                                            @click.stop>
                                            <i class="fa fa-store me-1 text-orange"></i> {{ order.shopName }}
                                        </NuxtLink>
                                        <span class="text-muted divider-v">|</span>
                                        <span class="order-id">#{{ order.orderId }}</span>
                                    </div>
                                    <span class="status-badge-pill" :class="getStatusClass(order.status)">
                                        {{ formatStatus(order.status) }}
                                    </span>
                                </div>

                                <div class="order-body">
                                    <div class="product-thumb">
                                        <NuxtLink
                                            :to="`/product/three-column/thumbnail-left?id=${order.items[0]?.productId?._id || order.items[0]?.productId}`"
                                            @click.stop>
                                            <img :src="getOrderItemImage(order.items[0])"
                                                alt="product">
                                        </NuxtLink>
                                    </div>

                                    <div class="product-info">
                                        <h5 class="product-name">
                                            <NuxtLink
                                                :to="`/product/three-column/thumbnail-left?id=${order.items[0]?.productId?._id || order.items[0]?.productId}`"
                                                class="text-dark text-decoration-none hover-underline" @click.stop>
                                                {{ order.items[0]?.name || 'สินค้า' }}
                                            </NuxtLink>
                                        </h5>

                                        <p class="text-muted small mb-1" v-if="order.items.length > 1">
                                            และสินค้าอื่นๆ อีก {{ order.items.length - 1 }} รายการ
                                        </p>
                                        <p class="order-date"><i class="fa fa-clock me-1"></i> {{ order.date }}</p>

                                        <div v-if="order.note && shouldShowNote(order.status)" class="order-note-box">
                                            <i class="fa fa-info-circle me-1"></i> {{ getNoteHeader(order.status) }}: {{
                                                order.note }}
                                        </div>
                                    </div>

                                    <div class="order-price-col">
                                        <span class="label">ยอดสุทธิ</span>
                                        <span class="price">฿{{ order.total.toLocaleString() }}</span>
                                    </div>
                                </div>

                                <div class="order-footer">
                                    <button class="btn btn-outline-theme btn-sm"
                                        @click.stop="openOrder(order)">ดูรายละเอียด</button>
                                </div>
                            </div>

                            <div class="d-flex justify-content-center mt-4" v-if="totalPages > 1">
                                <nav aria-label="Order navigation">
                                    <ul class="pagination custom-pagination">
                                        <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                            <button class="page-link"
                                                @click.stop="changePage(currentPage - 1)">&laquo;</button>
                                        </li>
                                        <li class="page-item" v-for="page in totalPages" :key="page"
                                            :class="{ active: currentPage === page }">
                                            <button class="page-link" @click.stop="changePage(page)">{{ page }}</button>
                                        </li>
                                        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                            <button class="page-link"
                                                @click.stop="changePage(currentPage + 1)">&raquo;</button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>

                        <div v-else
                            class="empty-state d-flex flex-column align-items-center justify-content-center py-5">
                            <div class="empty-icon mb-3">
                                <i class="fa fa-clipboard-list text-muted" style="font-size: 4rem; opacity: 0.2;"></i>
                            </div>
                            <h4 class="text-muted mb-2">ไม่พบรายการคำสั่งซื้อ</h4>
                            <p class="text-muted small">ไม่มีรายการคำสั่งซื้อในสถานะนี้</p>
                        </div>
                    </div>
                </div>

                <div v-else>
                    <div class="p-3">
                        <OrderDetail :order="orders.find(o => o.orderId === selectedOrder?.orderId) || selectedOrder"
                            @back="closeOrder" @cancel="handleOrderCancel" @update="saveOrderChanges" />
                    </div>
                </div>
            </template>

            <div v-else class="text-center py-5">
                <p class="text-danger">กรุณาเข้าสู่ระบบเพื่อดูข้อมูล</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { useOrderStore } from '~/store/orders' // ✅ เพิ่ม Import
import { useRuntimeConfig } from '#imports'
import OrderDetail from '../orders/orderDetail.vue'

const auth = useAuthStore()
const orderStore = useOrderStore() // ✅ ประกาศใช้ Store
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const API_BASE = config.public?.apiBase || 'https://vizdataprojectbe-production.up.railway.app/api'

const isAuthenticated = computed(() => !!auth.isLoggedIn || (!!auth.user && Object.keys(auth.user).length > 0))
const selectedOrder = ref(null)

// ✅ 1. เปลี่ยนจาก ref([]) เป็น computed() เพื่อให้ Update ตาม Store อัตโนมัติ
const orders = computed(() => {
    const rawOrders = orderStore.allOrders || []
    const currentUserId = auth.user?._id || auth.user?.id

    // กรองเฉพาะออเดอร์ที่เป็นของ User คนนี้
    let myOrders = rawOrders.filter(o => {
        const orderUserId = (o.user && typeof o.user === 'object') ? o.user._id : o.user;
        return String(orderUserId) === String(currentUserId);
    });

    // Map ข้อมูล (Logic เดิมจาก fetchOrders)
    return myOrders.map(order => {
        let displayDate = order.date;
        if (!displayDate && order.createdAt) {
            displayDate = new Date(order.createdAt).toLocaleString('en-GB', {
                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
            });
        }

        let shopName = 'Official Store';
        let shopId = null;
        const firstItem = order.item && order.item[0];
        if (firstItem && firstItem.productId && firstItem.productId.userId) {
            shopName = firstItem.productId.userId.shopName || firstItem.productId.userId.username || 'Shop';
            shopId = firstItem.productId.userId._id || firstItem.productId.userId;
        }

        return {
            ...order,
            items: order.item || [],
            date: displayDate,
            shopName: shopName,
            shopId: shopId,
            shippingFee: order.shippingCost || order.shippingFee || 0
        };
    }).sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
})

const isLoadingOrders = ref(false)
const activeTab = ref('all')
const currentPage = ref(1)
const itemsPerPage = 5

const tabs = [
    { label: 'ทั้งหมด', value: 'all' },
    { label: 'รอยืนยัน', value: 'pending' },
    { label: 'กำลังเตรียม', value: 'processing' },
    { label: 'ที่ต้องได้รับ', value: 'shipping' },
    { label: 'สำเร็จ', value: 'completed' },
    { label: 'ยกเลิก', value: 'cancelled' }
]

// ✅ 2. ปรับปรุง fetchOrders ให้สั่ง Store ดึงข้อมูล
const fetchOrders = async () => {
    if (!auth.isLoggedIn) return;
    isLoadingOrders.value = true;
    try {
        // สั่งให้ Store โหลดข้อมูลใหม่ (computed ด้านบนจะขยับตามเอง)
        await orderStore.fetchOrders();
        checkUrlAndOpenOrder();
    } catch (error) {
        console.error("Failed to fetch orders:", error);
    } finally {
        isLoadingOrders.value = false;
    }
}

const checkStatus = (orderStatus, tab) => {
    const s = (orderStatus || '').toLowerCase();
    switch (tab) {
        case 'pending': return s === 'pending' || s === 'pending review';
        case 'processing': return s === 'preparing' || s === 'processing' || s === 'accepted';
        case 'shipping': return s === 'shipped' || s === 'shipping' || s === 'arrived';
        case 'completed': return s === 'completed' || s === 'delivered';
        case 'cancelled': return s === 'cancelled' || s === 'cancel requested' || s === 'cancel' || s === 'return_requested' || s === 'return requested';
        default: return false;
    }
}

const filteredOrders = computed(() => {
    if (activeTab.value === 'all') return orders.value;
    return orders.value.filter(o => checkStatus(o.status, activeTab.value))
})

const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage))
const paginatedOrders = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    return filteredOrders.value.slice(start, start + itemsPerPage)
})

const changePage = (page) => { if (page >= 1 && page <= totalPages.value) currentPage.value = page }
watch(activeTab, () => { currentPage.value = 1 })

const getCount = (tabValue) => {
    if (tabValue === 'all') return orders.value.length;
    return orders.value.filter(o => checkStatus(o.status, tabValue)).length
}

const shouldShowNote = (status) => {
    if (!status) return false;
    const s = status.toLowerCase();
    if (s.includes('request') || s === 'pending') return false;
    return true;
}

const getNoteHeader = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'preparing' || s === 'processing') return 'ร้านค้าปฏิเสธคำขอ';
    if (s === 'cancelled' || s === 'cancel') return 'เหตุผลการยกเลิก';
    return 'หมายเหตุ';
}

const getStatusClass = (s) => {
    const status = (s || '').toLowerCase();
    if (status === 'accepted' || status === 'completed' || status === 'delivered') return 'status-success';
    if (status === 'pending') return 'status-warning';
    if (status === 'preparing' || status === 'processing' || status === 'confirmed') return 'status-info';
    if (status === 'shipped' || status === 'shipping') return 'status-primary';
    if (status.includes('cancel') || status.includes('return')) return 'status-danger';
    return 'status-default';
}

const formatStatus = (status) => {
    if (!status) return '';
    const s = status.toLowerCase();
    if (s === 'return_requested' || s === 'return requested' || s === 'cancel requested') { return 'Cancel Requested' }
    return status
}

const BACKEND_URL = 'https://vizdataprojectbe-production.up.railway.app'
const getOrderItemImage = (item) => {
    if (!item) return 'https://placehold.co/400'
    const resolve = (url) => {
        if (!url || url.trim() === '' || url === '/images/dashboard/default.png') return null
        if (url.startsWith('data:')) return url   // base64 จาก MongoDB
        if (url.startsWith('http')) return url
        if (url.startsWith('/')) return `${BACKEND_URL}${url}`
        return `${BACKEND_URL}/${url}`
    }
    // prioritize populate productId.image (real-time จาก MongoDB) ก่อน
    const fromProduct = resolve(item?.productId?.image)
    if (fromProduct) return fromProduct
    const fromItem = resolve(item?.image)
    if (fromItem) return fromItem
    return 'https://placehold.co/400'
}

const updateOrderFilter = (filterVal) => {
    activeTab.value = filterVal;
    router.replace({ query: { ...route.query, tab: 'orders', filter: filterVal } })
}

const openOrder = (order) => {
    selectedOrder.value = order;
    router.push({ query: { ...route.query, tab: 'orders', orderId: order.orderId } })
}

const closeOrder = () => {
    selectedOrder.value = null;
    const newQuery = { ...route.query };
    delete newQuery.orderId;
    router.replace({ query: newQuery })
}

const handleOrderCancel = (cancelledOrder) => {
    if (cancelledOrder) saveOrderChanges(cancelledOrder);
    selectedOrder.value = null
}

const saveOrderChanges = async (updatedOrder) => {
    try {
        const token = auth.token || localStorage.getItem('token');
        const id = updatedOrder._id || updatedOrder.id;
        if (!id) return;
        await $fetch(`${API_BASE}/order/${id}`, {
            method: 'PUT',
            headers: { Authorization: `Bearer ${token}` },
            body: { status: updatedOrder.status, cancelReason: updatedOrder.cancelReason }
        });

        // โหลดข้อมูลใหม่เข้า Store ทันที
        await orderStore.fetchOrders();
        useNuxtApp().$showToast({ msg: "อัปเดตสถานะสำเร็จ", type: "success" });
    } catch (error) {
        useNuxtApp().$showToast({ msg: "บันทึกสถานะไม่สำเร็จ", type: "error" });
        fetchOrders();
    }
}

const checkUrlAndOpenOrder = () => {
    const orderIdFromUrl = route.query.orderId;
    if (orders.value.length > 0 && orderIdFromUrl) {
        const targetOrder = orders.value.find(o => o.orderId === orderIdFromUrl);
        if (targetOrder) selectedOrder.value = targetOrder;
    } else {
        selectedOrder.value = null
    }
}

watch(() => route.query, () => {
    if (route.query.filter && route.query.filter !== activeTab.value) activeTab.value = route.query.filter;
    checkUrlAndOpenOrder()
})

const loadData = async () => {
    if (isAuthenticated.value) {
        await fetchOrders()
    }
}

watch(() => auth.user, (u) => {
    if (u) {
        loadData()
    }
}, { immediate: true })

onMounted(() => {
    loadData()
    if (route.query.filter) activeTab.value = route.query.filter
})
</script>

<style scoped>
.dashboard-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.card-header-custom {
    padding: 20px 24px;
    border-bottom: 1px solid #e2e8f0;
    background: white;
    min-height: 80px;
    display: flex;
    align-items: center;
}

.card-header-custom h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #ff5722;
}

.card-body-custom {
    padding: 24px;
    background: white;
}

.order-tab-box {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 15px;
    margin: 20px 20px 10px 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}

.order-tabs-wrapper {
    display: flex;
    gap: 10px;
    overflow-x: auto;
    padding: 10px 4px 16px 4px;
    scrollbar-width: none;
}

.order-tabs-wrapper::-webkit-scrollbar {
    display: none;
}

.order-tab-btn {
    flex: 1;
    background: #f8f9fa;
    border: none;
    padding: 8px 10px;
    border-radius: 50px;
    white-space: nowrap;
    font-size: 0.95rem;
    color: #718096;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-weight: 500;
    min-width: fit-content;
}

.order-tab-btn:hover {
    background: #fff3e0;
    color: #ff5722;
}

.order-tab-btn.active {
    background: #ff5722;
    color: white;
    font-weight: 600;
    box-shadow: 0 4px 10px rgba(255, 87, 34, 0.25);
    transform: translateY(-1px);
}

.count-badge {
    background: #edf2f7;
    color: #4a5568;
    padding: 2px 10px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
}

.order-tab-btn.active .count-badge {
    background: rgba(255, 255, 255, 0.2);
    color: white;
}

.order-card-item {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    margin-bottom: 16px;
    overflow: hidden;
    transition: transform 0.2s;
}

.order-card-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.order-header {
    background: #fcfcfc;
    padding: 12px 16px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.9rem;
}

.shop-name {
    font-weight: 600;
    color: #2d3748;
}

.order-body {
    padding: 16px;
    display: flex;
    gap: 16px;
}

.product-thumb {
    width: 80px;
    height: 80px;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    flex-shrink: 0;
}

.product-thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.product-info {
    flex: 1;
    min-width: 0;
}

.product-name {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 4px;
    color: #2d3748;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.order-price-col {
    text-align: right;
    min-width: 100px;
}

.order-price-col .label {
    display: block;
    font-size: 0.8rem;
    color: #718096;
}

.order-price-col .price {
    display: block;
    font-size: 1.1rem;
    font-weight: 700;
    color: #000000;
}

.order-footer {
    padding: 12px 16px;
    border-top: 1px solid #f0f0f0;
    text-align: right;
    background: #fff;
}

.btn-outline-theme {
    background: white;
    border: 1px solid #6c757d;
    color: #6c757d;
    font-weight: 600;
    transition: all 0.2s;
}

.btn-outline-theme:hover {
    background: #6c757d;
    color: white;
    border-color: #6c757d;
}

.status-badge-pill {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-success {
    background: #c6f6d5;
    color: #22543d;
}

.status-warning {
    background: #fefcbf;
    color: #975a16;
}

.status-info {
    background: #bee3f8;
    color: #2b6cb0;
}

.status-primary {
    background: #c3dafe;
    color: #434190;
}

.status-danger {
    background: #fed7d7;
    color: #822727;
}

.status-default {
    background: #edf2f7;
    color: #4a5568;
}

.order-note-box {
    background: #fff5f5;
    border-left: 3px solid #fc8181;
    color: #c53030;
    padding: 8px;
    font-size: 0.85rem;
    margin-top: 8px;
    border-radius: 0 4px 4px 0;
}

.custom-pagination .page-link {
    color: #4a5568;
    border-color: #e2e8f0;
    margin: 0 2px;
    border-radius: 4px;
}

.custom-pagination .page-link:hover {
    background: #f7fafc;
    color: #ff5722;
}

.custom-pagination .page-item.active .page-link {
    background: #ff5722;
    border-color: #ff5722;
    color: white;
}

.custom-pagination .page-item.disabled .page-link {
    color: #cbd5e0;
}

.hover-underline:hover {
    text-decoration: underline !important;
}

.empty-state {
    text-align: center;
    padding: 60px 20px;
    color: #a0aec0;
    min-height: 300px;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: #e2e8f0;
}
</style>