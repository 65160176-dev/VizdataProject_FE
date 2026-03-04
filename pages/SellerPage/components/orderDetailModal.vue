<template>
    <Transition name="fade">
        <div class="modal-backdrop-custom" @click.self="$emit('close')">

            <div class="modal-content-custom p-0 overflow-hidden shadow-lg">

                <div
                    :class="['px-4 py-3 d-flex justify-content-between align-items-center text-white', 'header-' + (order.status || 'default').toLowerCase()]">
                    <div>
                        <h5 class="fw-bold mb-0">Order Detail</h5>
                        <small class="opacity-90" v-if="checkStatus(order.status, 'request')">
                            ⚠️ ลูกค้าขอคืนสินค้า/ยกเลิก
                        </small>
                        <small class="opacity-90" v-else>สถานะ: {{ order.status }}</small>
                    </div>
                    <button class="btn btn-icon btn-white-glass rounded-circle text-white" @click="$emit('close')">
                        <Icon name="feather:x" size="20" />
                    </button>
                </div>

                <div class="p-4 bg-white" v-if="order">
                    <div class="row mb-4 g-3">
                        <div class="col-md-6">
                            <div class="p-3 bg-light rounded-3 h-100 border border-light">
                                <h6 class="text-muted small mb-2 fw-bold text-uppercase">ข้อมูลลูกค้า & การจัดส่ง</h6>
                                <div class="fw-bold mb-2 text-dark d-flex align-items-center">
                                    <Icon name="feather:user" size="14" class="me-2 text-secondary" />
                                    {{ order.customer?.firstName || order.customer || 'Unknown' }}
                                </div>
                                <div class="small text-secondary mb-2 d-flex align-items-center">
                                    <Icon name="feather:mail" size="14" class="me-2 text-secondary" />
                                    {{ order.email || '-' }}
                                </div>
                                <div class="small text-secondary d-flex align-items-start">
                                    <Icon name="feather:map-pin" size="14"
                                        class="me-2 mt-1 text-secondary flex-shrink-0" />
                                    <span>{{ order.address }}</span>
                                </div>

                                <div v-if="order.note" class="mt-3 pt-2 border-top border-secondary-subtle">
                                    <h6 class="text-muted small mb-1 fw-bold text-uppercase">หมายเหตุ</h6>
                                    <div class="small text-danger fst-italic">"{{ order.note }}"</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="p-3 bg-light rounded-3 h-100 border border-light">
                                <h6 class="text-muted small mb-2 fw-bold text-uppercase">ข้อมูลคำสั่งซื้อ</h6>
                                <div class="d-flex justify-content-between small mb-1">
                                    <span class="text-secondary">Order ID:</span>
                                    <span class="fw-bold text-dark">{{ order.orderId || order._id }}</span>
                                </div>
                                <div class="d-flex justify-content-between small mb-1">
                                    <span class="text-secondary">Date:</span>
                                    <span class="fw-bold text-dark">{{ formatDate(order.createdAt || order.date)
                                    }}</span>
                                </div>
                                <div class="d-flex justify-content-between small mb-1">
                                    <span class="text-secondary">Payment:</span>
                                    <span class="badge bg-secondary text-white">{{ order.paymentMethod || 'N/A'
                                    }}</span>
                                </div>
                                <div class="d-flex justify-content-between small">
                                    <span class="text-secondary">Status:</span>
                                    <span class="badge" :class="getStatusClass(order.status)">{{ order.status }}</span>
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
                                            <img :src="getImgUrl(it)" class="rounded border me-2"
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

                    <div class="pt-3 border-top">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-secondary small">ราคาสินค้า (Subtotal)</span>
                            <span class="fw-bold text-dark">{{ formatCurrency(calculateTotal(order)) }}</span>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-secondary small">ค่าจัดส่ง</span>
                            <span class="fw-bold text-dark">{{ formatCurrency(order.shippingCost || 0) }}</span>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-danger small">ค่าแพลตฟอร์ม (3%)</span>
                            <span class="fw-bold text-danger">-{{ formatCurrency(order.platformFee || 0) }}</span>
                        </div>

                        <div v-if="order.affiliateCommission > 0"
                            class="d-flex justify-content-between align-items-center mb-2">
                            <span class="text-danger small">ค่าคอม Affiliate</span>
                            <span class="fw-bold text-danger">-{{ formatCurrency(order.affiliateCommission) }}</span>
                        </div>

                        <div class="d-flex justify-content-between align-items-center pt-3 border-top">
                            <div>
                                <span class="text-secondary small">เงินที่ร้านได้รับจริง</span>
                                <h3 class="fw-bolder m-0 text-success">
                                    {{ formatCurrency(order.sellerEarnings || 0) }}
                                </h3>
                            </div>

                            <div class="d-flex gap-2">
                                <template v-if="checkStatus(order.status, 'request')">
                                    <button class="btn btn-outline-secondary rounded-pill px-4 shadow-sm fw-bold"
                                        @click="openRejectModal('preparing')">
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
                                        @click="openRejectModal('cancelled')">Reject</button>
                                    <button class="btn btn-success text-white rounded-pill px-4 shadow-sm fw-bold"
                                        @click="handleAction('preparing')">Accept Order</button>
                                </template>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Transition name="fade">
                <div v-if="showRejectDialog" class="modal-backdrop-custom" style="z-index: 3000;"
                    @click.stop="closeRejectModal">
                    <div class="modal-content-custom p-4 shadow-lg" style="max-width: 400px;" @click.stop>
                        <h5 class="fw-bold mb-3 text-danger">
                            <Icon name="feather:alert-circle" class="me-2" />{{ modalTitle }}
                        </h5>
                        <p class="text-secondary small mb-3">
                            {{ modalDesc }}
                        </p>

                        <div class="mb-3">
                            <label class="form-label small fw-bold text-dark mb-2">เลือกเหตุผล:</label>
                            <div class="d-flex flex-column gap-2">
                                <div class="form-check" v-for="(option, index) in rejectOptions" :key="index">
                                    <input class="form-check-input" type="radio" :name="'rejectReason'"
                                        :id="'reason-' + index" :value="option" v-model="selectedRejectReason">
                                    <label class="form-check-label small" :for="'reason-' + index">
                                        {{ option }}
                                    </label>
                                </div>

                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="rejectReason" id="reason-other"
                                        value="other" v-model="selectedRejectReason">
                                    <label class="form-check-label small fw-bold" for="reason-other">
                                        อื่นๆ (โปรดระบุ)
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div class="mb-3" v-if="selectedRejectReason === 'other'">
                            <textarea v-model="rejectNote" class="form-control bg-light border-0" rows="3"
                                placeholder="พิมพ์เหตุผลเพิ่มเติม...">
                </textarea>
                        </div>

                        <div class="d-flex gap-2 mt-4">
                            <button class="btn btn-light flex-grow-1 rounded-pill"
                                @click="closeRejectModal">ยกเลิก</button>
                            <button class="btn btn-danger flex-grow-1 rounded-pill fw-bold"
                                :disabled="selectedRejectReason === 'other' && !rejectNote.trim()"
                                @click="submitReject">
                                ยืนยัน
                            </button>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
</template>

<script setup>
import { ref } from 'vue'
import { useRuntimeConfig, useNuxtApp } from '#app'
import { useOrderStore } from '~/store/orders'
import Swal from 'sweetalert2'

const props = defineProps({
    order: { type: Object, required: true }
})
const emit = defineEmits(['close', 'updated'])

const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiBase || 'https://vizdataprojectbe-production.up.railway.app'
const orderStore = useOrderStore()
const { $showToast } = useNuxtApp()

// --- State Definitions ---
const showRejectDialog = ref(false)
const rejectNote = ref('')
const selectedRejectReason = ref('')
const targetStatus = ref('')
const modalTitle = ref('')
const modalDesc = ref('')
const rejectOptions = ref([])

const rejectOptionsRequest = [
    'สินค้าอยู่ระหว่างการจัดส่งแล้ว ไม่สามารถยกเลิกได้',
    'แพ็คสินค้าเรียบร้อยแล้วพร้อมส่ง',
    'สินค้าไม่เข้าเงื่อนไขการรับประกัน/คืนเงิน',
    'หลักฐานไม่เพียงพอ'
]
const rejectOptionsCancel = [
    'สินค้าหมดสต็อก / Out of Stock',
    'ข้อมูลที่อยู่จัดส่งไม่ถูกต้อง',
    'ไม่สามารถติดต่อลูกค้าได้',
    'ลูกค้าขอยกเลิก (ผ่านแชท)'
]

// --- Logic ---

const openRejectModal = (status) => {
    targetStatus.value = status

    if (status === 'cancelled') {
        modalTitle.value = 'ยกเลิกคำสั่งซื้อ'
        modalDesc.value = 'กรุณาระบุเหตุผลที่ต้องการยกเลิกคำสั่งซื้อนี้'
        rejectOptions.value = rejectOptionsCancel
    } else {
        modalTitle.value = 'ปฏิเสธคำขอ'
        modalDesc.value = 'กรุณาระบุเหตุผลที่ปฏิเสธ เพื่อแจ้งให้ลูกค้าทราบ'
        rejectOptions.value = rejectOptionsRequest
    }

    selectedRejectReason.value = rejectOptions.value[0]
    rejectNote.value = ''
    showRejectDialog.value = true
}

const closeRejectModal = () => {
    showRejectDialog.value = false
}

const submitReject = async () => {
    let finalReason = selectedRejectReason.value
    if (selectedRejectReason.value === 'other') {
        finalReason = rejectNote.value
    }
    await handleAction(targetStatus.value, finalReason)
    closeRejectModal()
}

const getItemProductId = (item) => {
    const product = item?.productId
    if (!product) return null
    if (typeof product === 'string') return product
    return product?._id || product?.id || null
}

const getItemQty = (item) => {
    const qty = Number(item?.qty ?? item?.quantity ?? 1)
    return !isNaN(qty) && qty > 0 ? qty : 1
}

const getKnownStock = (item) => {
    const stock = Number(item?.productId?.stock ?? item?.stock)
    return isNaN(stock) ? null : stock
}

const getApiBaseForRest = () => {
    const fromConfig = String(config.public.apiBase || '').replace(/\/$/, '')
    if (fromConfig.endsWith('/api')) return fromConfig
    if (fromConfig) return `${fromConfig}/api`
    return 'https://vizdataprojectbe-production.up.railway.app/api'
}

const fetchLiveStock = async (item) => {
    const knownStock = getKnownStock(item)
    if (knownStock !== null) return knownStock

    const productId = getItemProductId(item)
    if (!productId) return null

    try {
        const product = await $fetch(`${getApiBaseForRest()}/product/${productId}`)
        const liveStock = Number(product?.stock)
        return isNaN(liveStock) ? null : liveStock
    } catch (error) {
        console.warn('Cannot fetch stock for product:', productId, error)
        return null
    }
}

const handleAction = async (newStatus, reason = null) => {
    // 1. Check Stock — เช็คทั้งตอน Accept (preparing) และตอนส่ง (shipped)
    if (newStatus === 'shipped' || newStatus === 'preparing') {
        const items = props.order.item || props.order.items || []

        const itemChecks = await Promise.all(items.map(async (item) => ({
            item,
            qty: getItemQty(item),
            stock: await fetchLiveStock(item)
        })))

        const unknownStockItems = itemChecks.filter(x => x.stock === null)
        if (unknownStockItems.length > 0) {
            Swal.fire({
                icon: 'warning',
                title: 'ไม่สามารถตรวจสอบสต็อกได้',
                html: `
                    <div class="text-start px-3">
                        <p class="mb-2">ไม่สามารถตรวจสอบสต็อกของสินค้าบางรายการได้</p>
                        <small class="text-muted">กรุณาลองใหม่อีกครั้ง หรือตรวจสอบข้อมูลสินค้าในคลัง</small>
                    </div>
                `,
                confirmButtonText: 'เข้าใจแล้ว',
                confirmButtonColor: '#ff9f43',
                focusConfirm: false,
                customClass: {
                    container: 'swal-z-index-fix',
                    popup: 'rounded-4 shadow-lg border-0',
                    confirmButton: 'rounded-pill px-4 shadow-sm'
                }
            })
            return
        }

        const stockIssueItems = itemChecks.filter(x => {
            const stock = Number(x.stock)
            return stock <= 0 || x.qty > stock
        })

        if (stockIssueItems.length > 0) {
            const actionLabel = newStatus === 'shipped' ? 'ส่งสินค้า' : 'รับออเดอร์'
            const listHtml = stockIssueItems.map(({ item, qty, stock }) => {
                const isOutOfStock = stock <= 0
                const statusText = isOutOfStock
                    ? `<span class="text-danger fw-bold">สินค้าหมด (Stock: ${stock})</span>`
                    : `<span class="text-danger fw-bold">สั่ง ${qty} ชิ้น แต่เหลือในสต็อกเพียง ${stock} ชิ้น</span>`
                return `<div class="mb-2 pb-2 border-bottom"><p class="mb-1">สินค้า: <strong>${item.name}</strong></p><p class="mb-0">${statusText}</p></div>`
            }).join('')

            Swal.fire({
                icon: 'warning',
                title: `ไม่สามารถ${actionLabel}ได้`,
                html: `
                    <div class="text-start px-3">
                        ${listHtml}
                        <small class="text-muted">กรุณาเติมสต็อกสินค้าในคลังสินค้าก่อนดำเนินการ</small>
                    </div>
                `,
                confirmButtonText: 'เข้าใจแล้ว',
                confirmButtonColor: '#ff9f43',
                focusConfirm: false,
                customClass: {
                    container: 'swal-z-index-fix',
                    popup: 'rounded-4 shadow-lg border-0',
                    confirmButton: 'rounded-pill px-4 shadow-sm'
                }
            })
            return
        }
    }

    // 2. Call API
    if (!props.order._id) return;
    try {
        await orderStore.updateStatus(props.order._id, newStatus, reason)

        if (newStatus === 'shipped') {
            // ✅ แสดง Toast แจ้งเตือนปกติ
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            })
            Toast.fire({ icon: 'success', title: 'อัปเดตสถานะจัดส่งเรียบร้อย' })

            // ✅ เริ่มระบบนับเวลาถอยหลัง 3 นาที (180,000 ms)
            console.log('Auto-complete timer started: 3 minutes');
            setTimeout(async () => {
                // ตรวจสอบสถานะล่าสุดจากฐานข้อมูลหรือ Store ก่อนเปลี่ยน
                // โดยดึงออเดอร์นี้ขึ้นมาเช็คอีกรอบ
                const currentOrder = orderStore.allOrders.find(o => o._id === props.order._id);

                if (currentOrder && (currentOrder.status === 'shipped' || currentOrder.status === 'shipping')) {
                    console.log('Time is up! Changing order to completed.');
                    await orderStore.updateStatus(props.order._id, 'completed');
                    await orderStore.fetchOrders(); // อัปเดตข้อมูลใหม่ทั้งหมด
                }
            }, 3 * 60 * 1000);

        } else {
            try { $showToast({ msg: `ดำเนินการเรียบร้อย`, type: 'success' }) } catch (e) { }
        }

        // ✅ ต้องสั่ง fetchOrders ที่นี่ด้วยเพื่อให้ข้อมูลหน้าบ้านอัปเดตทันทีหลังกดปุ่ม
        await orderStore.fetchOrders();
        emit('updated')
        emit('close')

    } catch (error) {
        console.error("Update Status Failed:", error)
        const msg = error.response?._data?.message || error.message || 'เกิดข้อผิดพลาดในการอัปเดต';

        Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด!',
            text: msg,
            confirmButtonText: 'ปิด',
            confirmButtonColor: '#d33',
            customClass: {
                container: 'swal-z-index-fix',
                popup: 'rounded-4'
            }
        })
    }
}

// --- Helpers ---
const getImgUrl = (it) => {
    const resolve = (path) => {
        if (!path || path === '/images/dashboard/default.png') return null
        if (path.startsWith('data:')) return null  // legacy base64 — skip
        if (path.startsWith('http')) return path
        if (path.startsWith('/')) return `${API_BASE_URL}${path}`
        return `${API_BASE_URL}/${path}`
    }
    // productId.image (populate) ก่อน, fallback ไปที่ it.image
    const fromProduct = resolve(it?.productId?.image)
    if (fromProduct) return fromProduct
    const fromItem = resolve(it?.image || (typeof it === 'string' ? it : null))
    return fromItem || 'https://placehold.co/40'
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

const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
        case 'pending': return 'bg-warning text-dark';
        case 'preparing': case 'processing': return 'bg-info text-white';
        case 'shipped': return 'bg-primary text-white';
        case 'completed': return 'bg-success text-white';
        case 'cancelled': return 'bg-danger text-white';
        default: return 'bg-secondary text-white';
    }
}

const checkStatus = (status, type) => {
    const s = (status || '').toLowerCase();
    if (type === 'preparing') return s === 'preparing' || s === 'processing' || s === 'confirmed';
    if (type === 'request') return s === 'cancel requested' || s === 'return_requested' || s === 'return requested';
    if (type === 'pending') return s === 'pending';
    return false;
}
</script>

<style scoped>
/* CSS เดิม (Scoped) */
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

<style>
.swal-z-index-fix {
    z-index: 3050 !important;
}
</style>