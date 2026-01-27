<template>
    <Transition name="fade">
        <div class="modal-backdrop-custom" @click.self="$emit('close')">
            <div class="modal-content-custom p-0 overflow-hidden shadow-lg">

                <div
                    :class="['px-4 py-3 d-flex justify-content-between align-items-center text-white', 'header-' + (order.status || 'default').toLowerCase()]">
                    <div>
                        <h5 class="fw-bold mb-0">Manage Order</h5>
                        <small class="opacity-90">สถานะ: {{ order.status }}</small>
                    </div>
                    <button class="btn btn-icon btn-white-glass rounded-circle text-white" @click="$emit('close')">
                        <Icon name="feather:x" size="20" />
                    </button>
                </div>

                <div class="p-4 bg-white" v-if="order">
                    <div class="row mb-4 g-3">
                        <div class="col-md-6">
                            <div class="p-3 bg-light rounded-3 h-100 border border-light">
                                <h6 class="text-muted small mb-2 fw-bold text-uppercase">ที่อยู่จัดส่ง</h6>
                                <div class="fw-bold mb-1 text-dark">{{ order.customer?.firstName || order.customer ||
                                    'Unknown' }}</div>
                                <div class="small text-secondary">{{ order.address }}</div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="p-3 bg-light rounded-3 h-100 border border-light">
                                <h6 class="text-muted small mb-2 fw-bold text-uppercase">ข้อมูลคำสั่งซื้อ</h6>
                                <div class="d-flex justify-content-between small mb-1">
                                    <span class="text-secondary">Email:</span> <span class="fw-bold text-dark">{{
                                        order.email }}</span>
                                </div>
                                <div class="d-flex justify-content-between small mb-1">
                                    <span class="text-secondary">Order ID:</span> <span class="fw-bold text-dark">{{
                                        order.orderId }}</span>
                                </div>
                                <div class="d-flex justify-content-between small">
                                    <span class="text-secondary">Date:</span> <span class="fw-bold text-dark">{{
                                        formatDate(order.createdAt || order.date) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h6 class="fw-bold mb-3 text-dark">รายการสินค้า</h6>
                    <div class="table-responsive mb-4 border rounded-3">
                        <table class="table table-borderless align-middle mb-0">
                            <thead class="bg-light small">
                                <tr>
                                    <th class="ps-3">Product</th>
                                    <th class="text-end">Price</th>
                                    <th class="text-end">Qty</th>
                                    <th class="text-end pe-3">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(it, idx) in getItems(order)" :key="idx" class="border-bottom last:border-0">
                                    <td class="ps-3">
                                        <div class="d-flex align-items-center">
                                            <img :src="getImgUrl(it.image)" class="rounded border me-2"
                                                style="width: 40px; height: 40px; object-fit: cover;">
                                            <div class="small fw-bold text-dark text-wrap">{{ it.name }}</div>
                                        </div>
                                    </td>
                                    <td class="text-end small text-muted">{{ formatCurrency(it.price) }}</td>
                                    <td class="text-end small fw-bold">x{{ it.qty }}</td>
                                    <td class="text-end fw-bold pe-3 text-dark">{{ formatCurrency(it.price * it.qty) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                        <div>
                            <span class="text-secondary small">ยอดรวมทั้งหมด</span>
                            <h3 class="fw-bolder m-0" :class="getTextClass(order.status)">{{
                                formatCurrency(calculateTotal(order)) }}</h3>
                        </div>

                        <div class="d-flex gap-2">

                            <template v-if="checkStatus(order.status, 'request')">
                                <button class="btn btn-outline-secondary rounded-pill px-4 shadow-sm fw-bold"
                                    @click="handleAction('preparing')">
                                    ปฏิเสธคำขอ
                                </button>

                                <button class="btn btn-danger rounded-pill px-4 shadow-sm text-white fw-bold"
                                    @click="handleAction('cancelled')">
                                    อนุมัติยกเลิก
                                    <Icon name="feather:x-circle" class="ms-1" />
                                </button>
                            </template>

                            <button v-if="checkStatus(order.status, 'preparing')"
                                class="btn btn-primary rounded-pill px-4 shadow-sm fw-bold"
                                @click="handleAction('shipped')">
                                ส่งสินค้าแล้ว
                                <Icon name="feather:truck" class="ms-1" />
                            </button>

                            <template v-if="checkStatus(order.status, 'pending')">
                                <button class="btn btn-outline-danger rounded-pill px-4"
                                    @click="handleAction('cancelled')">Reject</button>
                                <button class="btn btn-success text-white rounded-pill px-4 shadow-sm fw-bold"
                                    @click="handleAction('preparing')">Accept</button>
                            </template>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { useRuntimeConfig, useNuxtApp } from '#app'
import { useOrderStore } from '~/store/orders'

const props = defineProps({
    order: { type: Object, required: true }
})
const emit = defineEmits(['close', 'updated'])

const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiBase || 'http://localhost:3001'
const orderStore = useOrderStore()
const { $showToast } = useNuxtApp()

// --- Helper Functions ---
const getImgUrl = (path) => {
    if (!path) return '/images/dashboard/default.png';
    if (path.startsWith('http')) return path;
    if (path.startsWith('uploads') || path.startsWith('/uploads')) {
        const cleanPath = path.startsWith('/') ? path.slice(1) : path;
        return `${API_BASE_URL}/${cleanPath}`;
    }
    return '/images/' + path;
}

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('th-TH', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
}

const formatCurrency = (v) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(v || 0)
}

const getItems = (o) => o.item || o.items || []

const calculateTotal = (o) => {
    const items = getItems(o)
    return items.length > 0 ? items.reduce((sum, i) => sum + (Number(i.price) * Number(i.qty)), 0) : (o.total || 0)
}

const getTextClass = (s) => 'text-status-' + (s || '').toLowerCase()

const checkStatus = (status, type) => {
    const s = (status || '').toLowerCase();
    if (type === 'preparing') return s === 'preparing' || s === 'processing' || s === 'confirmed';
    if (type === 'request') return s === 'cancel requested' || s === 'return_requested' || s === 'return requested';
    if (type === 'pending') return s === 'pending';
    return false;
}

// --- Action Logic ---
const handleAction = async (newStatus) => {
    // ใช้ _id ในการ update
    if (!props.order._id) return;
    try {
        await orderStore.updateStatus(props.order._id, newStatus)
        try { $showToast({ msg: `ดำเนินการเรียบร้อย`, type: 'success' }) } catch (e) { }
        emit('updated')
        emit('close')
    } catch (error) {
        console.error(error)
        try { $showToast({ msg: 'เกิดข้อผิดพลาด', type: 'error' }) } catch (e) { }
    }
}
</script>

<style scoped>
/* Header Gradients */
.header-preparing,
.header-processing,
.header-confirmed {
    background: linear-gradient(135deg, #0288D1 0%, #29B6F6 100%);
}

.header-shipped,
.header-shipping {
    background: linear-gradient(135deg, #5E35B1 0%, #7E57C2 100%);
}

.header-completed,
.header-delivered {
    background: linear-gradient(135deg, #00897B 0%, #26A69A 100%);
}

.header-cancelled,
.header-cancel {
    background: linear-gradient(135deg, #D32F2F 0%, #EF5350 100%);
}

.header-return_requested,
.header-cancel.requested,
.header-pending {
    background: linear-gradient(135deg, #F57F17 0%, #FFB300 100%);
}

.header-default {
    background: #6c757d;
}

/* Text Colors */
.text-status-preparing,
.text-status-processing {
    color: #0277BD;
}

.text-status-shipped {
    color: #4527A0;
}

.text-status-completed {
    color: #00695C;
}

.text-status-cancelled {
    color: #C62828;
}

.text-status-pending,
.text-status-return_requested {
    color: #E65100;
}

.modal-backdrop-custom {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2050;
    padding: 20px;
}

.modal-content-custom {
    background: #fff;
    width: 100%;
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

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>