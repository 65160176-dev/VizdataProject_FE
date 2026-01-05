<template>
    <div class="pb-5 position-relative">

        <div class="bg-white p-3 mb-3 shadow-sm d-flex justify-content-between align-items-center">
            <div style="min-width: 0;">
                <button class="btn btn-link text-dark text-decoration-none p-0 fw-bold" @click="$emit('back')">
                    <i class="fa fa-arrow-left me-2"></i> รายละเอียดคำสั่งซื้อ
                </button>
            </div>
            <div class="text-end" style="min-width: 0;">
                <div class="d-flex flex-column align-items-end">
                    <span class="badge rounded-pill mb-1 px-3" :class="statusBadgeClass" style="font-size: 0.85rem;">
                        {{ order.status }}
                    </span>
                    <span class="small text-muted fw-bold">{{ order.orderId }}</span>
                    <span class="small text-muted" style="font-size: 0.75rem;">
                        {{ new Date(order.date).toLocaleDateString('th-TH', {
                            year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        }) }}
                    </span>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-3 p-4" v-if="!['Cancelled', 'Cancel Requested'].includes(order.status)">
            <div class="stepper-wrapper">
                <div class="stepper-item" :class="{ completed: step >= 1 }">
                    <div class="step-counter">1</div>
                    <div class="step-name">Pending</div>
                </div>
                <div class="stepper-item" :class="{ completed: step >= 2 }">
                    <div class="step-counter">2</div>
                    <div class="step-name">Accepted</div>
                </div>
                <div class="stepper-item" :class="{ completed: step >= 3 }">
                    <div class="step-counter">3</div>
                    <div class="step-name">Confirm</div>
                </div>
                <div class="stepper-item" :class="{ completed: step >= 4 }">
                    <div class="step-counter">4</div>
                    <div class="step-name">Completed</div>
                </div>
            </div>
        </div>

        <div class="alert mb-3 shadow-sm border-0"
            :class="['Cancelled', 'Cancel Requested'].includes(order.status) ? 'alert-danger' : 'alert-warning'" v-else>
            <div class="d-flex align-items-center">
                <i class="fa fs-4 me-3" :class="order.status === 'Cancelled' ? 'fa-times-circle' : 'fa-clock'"></i>
                <div>
                    <template v-if="order.status === 'Cancelled'">
                        <strong>คำสั่งซื้อถูกยกเลิก</strong><br>
                        <small>คุณได้ทำการยกเลิกคำสั่งซื้อนี้แล้ว</small>
                    </template>

                    <template v-else>
                        <strong>รออนุมัติการยกเลิก</strong><br>
                        <small>ส่งคำขอเรียบร้อยแล้ว กรุณารอร้านค้าตรวจสอบ</small>
                    </template>

                    <div v-if="order.cancelReason" class="mt-1 small"
                        :class="order.status === 'Cancelled' ? 'text-dark' : 'text-dark'">
                        เหตุผล: {{ order.cancelReason }}
                    </div>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm p-4 mb-3">
            <h6 class="mb-3 border-bottom pb-2 fw-bold text-dark"><i class="fa fa-map-marker-alt me-2 text-primary"></i>
                ที่อยู่จัดส่ง</h6>
            <div class="row">
                <div class="col-md-6 mb-2">
                    <small class="text-muted">ชื่อผู้รับ</small><br>
                    <span class="fw-bold">{{ order.customer }}</span>
                    <div class="small text-muted mt-1">{{ order.email }}</div>
                </div>
                <div class="col-md-6">
                    <small class="text-muted">ที่อยู่</small><br>
                    <span>{{ order.address }}</span>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-3">
            <div class="card-header bg-white border-bottom-0 pt-3">
                <div class="d-flex align-items-center border-bottom pb-2 mb-2">
                    <i class="fa fa-home me-2 text-primary"></i>

                    <NuxtLink :to="`/seller/${order.shopName || order.items[0].brand || 'official-store'}`"
                        class="fw-bold text-dark me-1 text-decoration-none hover-underline">
                        {{ order.shopName || order.items[0].brand || 'Official Store' }}
                    </NuxtLink>

                    <i class="fa fa-angle-right text-muted small"></i>
                </div>
                <strong>รายการสินค้า ({{ order.items.length }} ชิ้น)</strong>
            </div>

            <div class="card-body p-0">
                <div v-for="(item, index) in order.items" :key="index" class="p-3 border-top">
                    <div class="d-flex">

                        <NuxtLink :to="`/product/three-column/thumbnail-left?id=${item.id || item.productId || '1'}`"
                            class="bg-light rounded d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                            style="width: 70px; height: 70px; overflow: hidden; text-decoration: none;">
                            <img v-if="item.image" :src="item.image"
                                style="width: 100%; height: 100%; object-fit: cover;">
                            <i v-else class="fa fa-box text-secondary fs-4"></i>
                        </NuxtLink>

                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <NuxtLink
                                        :to="`/product/three-column/thumbnail-left?id=${item.id || item.productId || '1'}`"
                                        class="mb-1 text-dark text-decoration-none hover-underline d-block"
                                        style="line-height: 1.4; font-weight: 600;">
                                        {{ item.name }}
                                    </NuxtLink>

                                    <div class="text-muted small">จำนวน: x{{ item.qty }}</div>
                                </div>

                                <div class="fw-bold text-dark">฿{{ (item.price * item.qty).toLocaleString() }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="text-muted">ช่องทางชำระเงิน</span>
                    <span class="fw-bold">{{ order.paymentMethod }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="text-muted">ราคาสินค้า</span>
                    <span>฿{{ (order.total - (order.shippingFee || 0)).toLocaleString() }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="text-muted">ค่าจัดส่ง</span>
                    <span>฿{{ (order.shippingFee || 0).toLocaleString() }}</span>
                </div>
                <hr class="my-3">
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <span class="fw-bold fs-5">ยอดรวมสุทธิ</span>
                    <span class="fw-bold fs-4 text-primary">฿{{ order.total.toLocaleString() }}</span>
                </div>

                <div v-if="order.status === 'Cancel Requested'" class="border-top pt-3 text-center">
                    <span class="text-muted small">กำลังดำเนินการตรวจสอบ...</span>
                </div>

                <div v-else-if="['Pending Review', 'Pending'].includes(order.status)" class="border-top pt-3 text-end">
                    <button class="btn btn-outline-danger px-4 rounded-pill fw-bold" @click="handleDirectCancel">
                        ยกเลิกคำสั่งซื้อ
                    </button>
                </div>

                <div v-else-if="order.status === 'Accepted'" class="border-top pt-3 text-end">
                    <p class="text-muted small mb-2">หากต้องการยกเลิกในขั้นตอนนี้ ต้องรอการอนุมัติจากร้านค้า</p>
                    <button class="btn btn-outline-warning px-4 rounded-pill fw-bold text-dark"
                        @click="openCancelModal">
                        ส่งคำขอยกเลิกออเดอร์
                    </button>
                </div>

                <div v-else-if="['Shipped'].includes(order.status)" class="border-top pt-3">
                    <p class="text-muted small mb-2 text-center">กรุณาตรวจสอบสินค้าก่อนกดยืนยัน</p>
                    <div class="d-flex gap-2 w-100">
                        <button class="btn btn-outline-danger rounded-pill fw-bold w-50" @click="handleDirectCancel">
                            ปฏิเสธออเดอร์
                        </button>
                        <button class="btn rounded-pill fw-bold text-white w-50"
                            style="background-color: #28a745; border: none;" @click="handleConfirmReceived">
                            ฉันได้ตรวจสอบและยอมรับสินค้า
                        </button>
                    </div>
                </div>

                <div v-else-if="order.status === 'Completed'" class="border-top pt-3 text-center text-success">
                    <i class="fa fa-check-circle me-2"></i> รายการสั่งซื้อนี้เสร็จสมบูรณ์แล้ว
                </div>
            </div>
        </div>

        <cancelOrderPop v-if="showDirectCancelModal" @close="showDirectCancelModal = false"
            @confirm="confirmDirectCancel" />

        <cancReqOrderPop v-if="showCancelModal" @close="closeCancelModal" @confirm="submitRequestCancellation" />

        <confirmOrder v-if="showConfirmReceivedModal" @close="showConfirmReceivedModal = false"
            @confirm="submitConfirmReceived" />

    </div>
</template>

<script setup>
import { computed, ref } from 'vue'

// Import 3 Popup ที่เราสร้าง
import cancelOrderPop from './cancelOrderPop.vue'
import cancReqOrderPop from './cancReqOrderPop.vue'
import confirmOrder from './confirmOrder.vue'

const props = defineProps({
    order: { type: Object, required: true }
})

const emit = defineEmits(['back', 'cancel', 'update'])

// --- Create Notification Helper ---
const createNotification = (title, message) => {
    if (typeof window === 'undefined') return

    const currentNotifs = JSON.parse(localStorage.getItem('my_app_notifications') || "[]")
    const now = new Date()
    const dateString = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

    const newNotif = {
        id: Date.now(),
        title: title,
        message: message,
        date: dateString,
        isRead: false,
        image: props.order.items[0]?.image || ''
    }

    localStorage.setItem('my_app_notifications', JSON.stringify([newNotif, ...currentNotifs]))
    window.dispatchEvent(new Event('notification-updated'))
}

// ================= 1. Direct Cancel Logic =================
const showDirectCancelModal = ref(false)

const handleDirectCancel = () => {
    showDirectCancelModal.value = true
}

const confirmDirectCancel = () => {
    props.order.status = 'Cancelled'
    props.order.cancelReason = 'User cancelled directly'

    createNotification(
        'ยกเลิกคำสั่งซื้อสำเร็จ',
        `คำสั่งซื้อ #${props.order.orderId} ถูกยกเลิกเรียบร้อยแล้ว`
    )

    emit('cancel', props.order)
    showDirectCancelModal.value = false
}

// ================= 2. Request Cancel Logic =================
const showCancelModal = ref(false)

const openCancelModal = () => {
    showCancelModal.value = true
}

const closeCancelModal = () => {
    showCancelModal.value = false
}

const submitRequestCancellation = (reason) => {
    props.order.status = 'Cancel Requested'
    props.order.cancelReason = reason

    createNotification(
        'ส่งคำขอยกเลิกแล้ว',
        `คำขอยกเลิกคำสั่งซื้อ #${props.order.orderId} ได้ถูกส่งให้ร้านค้าตรวจสอบแล้ว`
    )

    emit('update', props.order)
    closeCancelModal()
}

// ================= 3. Confirm Received Logic =================
const showConfirmReceivedModal = ref(false)

const handleConfirmReceived = () => {
    showConfirmReceivedModal.value = true
}

const submitConfirmReceived = () => {
    props.order.status = 'Completed'

    createNotification(
        'คำสั่งซื้อเสร็จสมบูรณ์',
        `คุณได้ยืนยันการรับสินค้าสำหรับคำสั่งซื้อ #${props.order.orderId} เรียบร้อยแล้ว`
    )

    emit('update', props.order)
    showConfirmReceivedModal.value = false
}

// ================= Helpers =================
const step = computed(() => {
    const s = props.order.status
    if (['Pending Review', 'Pending'].includes(s)) return 1
    if (['Accepted', 'Paid', 'Shipping'].includes(s)) return 2
    if (['Shipped', 'Arrived'].includes(s)) return 3
    if (['Completed'].includes(s)) return 4
    return 1
})

const statusBadgeClass = computed(() => {
    const s = props.order.status
    switch (s) {
        case 'Accepted': return 'bg-success text-white'
        case 'Pending Review':
        case 'Pending': return 'bg-warning text-dark'
        case 'Cancel Requested':
        case 'Cancellation Requested':
        case 'Cancelled': return 'bg-danger text-white'
        case 'Shipping':
        case 'Shipped':
        case 'Arrived': return 'bg-info text-white'
        case 'Completed': return 'bg-secondary text-white'
        default: return 'bg-light text-dark border'
    }
})
</script>

<style scoped>
/* Stepper CSS */
.stepper-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    position: relative;
}

.stepper-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
}

.stepper-item::before {
    position: absolute;
    content: "";
    border-bottom: 2px solid #e0e0e0;
    width: 100%;
    top: 15px;
    left: -50%;
    z-index: 2;
}

.stepper-item::after {
    position: absolute;
    content: "";
    border-bottom: 2px solid #e0e0e0;
    width: 100%;
    top: 15px;
    left: 50%;
    z-index: 2;
}

.stepper-item .step-counter {
    position: relative;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #fff;
    border: 2px solid #e0e0e0;
    margin-bottom: 8px;
    font-weight: bold;
    color: #adb5bd;
    font-size: 14px;
}

.stepper-item.completed .step-counter {
    border-color: #28a745;
    background-color: #28a745;
    color: #fff;
}

.stepper-item.completed::before,
.stepper-item.completed::after {
    border-bottom-color: #28a745;
}

.stepper-item:first-child::before {
    content: none;
}

.stepper-item:last-child::after {
    content: none;
}

.step-name {
    font-size: 12px;
    font-weight: 600;
    color: #6c757d;
}

.stepper-item.completed .step-name {
    color: #28a745;
}

.hover-underline:hover {
    text-decoration: underline !important;
}
</style>