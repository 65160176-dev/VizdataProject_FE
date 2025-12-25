<template>
    <div class="pb-5">

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
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-3 p-4" v-if="order.status !== 'Cancelled'">
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
                    <div class="step-name">Shipping</div>
                </div>
                <div class="stepper-item" :class="{ completed: step >= 4 }">
                    <div class="step-counter">4</div>
                    <div class="step-name">Confirm Order</div>
                </div>
                <div class="stepper-item" :class="{ completed: step >= 5 }">
                    <div class="step-counter">5</div>
                    <div class="step-name">Completed</div>
                </div>
            </div>
        </div>

        <div class="alert alert-danger mb-3 shadow-sm border-0" v-else>
            <div class="d-flex align-items-center">
                <i class="fa fa-times-circle me-3 fs-4"></i>
                <div>
                    <strong>คำสั่งซื้อถูกยกเลิก</strong><br>
                    <small>คุณได้ทำการยกเลิกคำสั่งซื้อนี้แล้ว</small>
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
                    <span class="fw-bold text-dark me-1">
                        {{ order.shopName || order.items[0].brand || 'Official Store' }}
                    </span>
                    <i class="fa fa-angle-right text-muted small"></i>
                </div>
                <strong>รายการสินค้า ({{ order.items.length }} ชิ้น)</strong>
            </div>

            <div class="card-body p-0">
                <div v-for="(item, index) in order.items" :key="index" class="p-3 border-top">
                    <div class="d-flex">
                        <div class="bg-light rounded d-flex align-items-center justify-content-center me-3 flex-shrink-0"
                            style="width: 70px; height: 70px; overflow: hidden;">
                            <img v-if="item.image" :src="item.image"
                                style="width: 100%; height: 100%; object-fit: cover;">
                            <i v-else class="fa fa-box text-secondary fs-4"></i>
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between align-items-start">
                                <div>
                                    <h6 class="mb-1 text-dark" style="line-height: 1.4;">{{ item.name }}</h6>
                                    <div class="text-muted small">จำนวน: x{{ item.qty }}</div>
                                </div>
                                <div class="fw-bold text-dark">฿{{ item.price.toLocaleString() }}</div>
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

                <div v-if="order.status === 'Cancellation Requested'" class="border-top pt-3 text-center">
                    <div class="alert alert-warning border-0 mb-0 d-inline-block">
                        <i class="fa fa-clock me-2"></i>
                        <strong>ส่งคำขอยกเลิกแล้ว</strong>
                        <div class="small mt-1">กรุณารอร้านค้าตรวจสอบและอนุมัติ</div>
                    </div>
                </div>

                <div v-else-if="['Pending Review', 'Pending'].includes(order.status)" class="border-top pt-3 text-end">
                    <button class="btn btn-outline-danger px-4 rounded-pill fw-bold" @click="handleCancel">
                        ยกเลิกคำสั่งซื้อ
                    </button>
                </div>

                <div v-else-if="order.status === 'Accepted'" class="border-top pt-3 text-end">
                    <p class="text-muted small mb-2">หากต้องการยกเลิกในขั้นตอนนี้ ต้องรอการอนุมัติจากร้านค้า</p>
                    <button class="btn btn-outline-warning px-4 rounded-pill fw-bold text-dark"
                        @click="handleRequestReject">
                        ส่งคำขอปฏิเสธออเดอร์
                    </button>
                </div>

                <div v-else-if="['Shipped'].includes(order.status)" class="border-top pt-3 text-end">
                    <p class="text-muted small mb-2">กรุณาตรวจสอบสินค้าก่อนกดยืนยัน</p>

                    <button class="btn btn-outline-danger px-4 rounded-pill fw-bold me-2" @click="handleCancel">
                        ยกเลิกออเดอร์
                    </button>

                    <button class="btn btn-solid px-4 rounded-pill fw-bold text-white"
                        style="background-color: #28a745; border-color: #28a745;" @click="handleConfirmReceived">
                        ฉันได้ตรวจสอบและยอมรับสินค้า
                    </button>
                </div>

                <div v-else-if="order.status === 'Completed'" class="border-top pt-3 text-center text-success">
                    <i class="fa fa-check-circle me-2"></i> รายการสั่งซื้อนี้เสร็จสมบูรณ์แล้ว
                </div>

            </div>
        </div>

    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    order: { type: Object, required: true }
})

const emit = defineEmits(['back', 'cancel', 'update'])

// เปลี่ยนสถานะเมื่อกด "ส่งคำขอปฏิเสธออเดอร์"
const handleRequestReject = () => {
    if (confirm('ยืนยันการ "ส่งคำขอปฏิเสธออเดอร์" ใช่หรือไม่? \n(ร้านค้าอาจติดต่อกลับเพื่อยืนยันเหตุผล)')) {
        // ใช้คำว่า Cancellation Requested
        props.order.status = 'Cancellation Requested'
        emit('update', props.order)
    }
}

const handleCancel = () => {
    if (confirm('ยืนยันที่จะยกเลิกคำสั่งซื้อนี้?')) {
        props.order.status = 'Cancelled'
        emit('cancel', props.order)
    }
}

const handleConfirmReceived = () => {
    if (confirm('คุณได้รับสินค้าและตรวจสอบความถูกต้องเรียบร้อยแล้วใช่หรือไม่? \nเมื่อกดยืนยันแล้วจะไม่สามารถขอคืนเงินได้')) {
        props.order.status = 'Completed'
        emit('update', props.order)
    }
}

// กำหนด Step
const step = computed(() => {
    const s = props.order.status

    // Step 1: รวม Pending และ Cancellation Requested
    if (['Pending Review', 'Pending', 'Cancellation Requested'].includes(s)) return 1

    if (['Accepted', 'Paid'].includes(s)) return 2
    if (['Shipping'].includes(s)) return 3
    if (['Shipped', 'Arrived'].includes(s)) return 4
    if (['Completed'].includes(s)) return 5

    return 1
})

const statusBadgeClass = computed(() => {
    const s = props.order.status
    switch (s) {
        case 'Accepted':
            return 'bg-success text-white'
        case 'Pending Review':
        case 'Pending':
            return 'bg-warning text-dark'
        case 'Cancellation Requested': // สีส้มเตือนใจ เหมือน Pending
            return 'bg-warning text-dark'
        case 'Shipping':
        case 'Shipped':
        case 'Arrived':
            return 'bg-info text-white'
        case 'Completed':
            return 'bg-secondary text-white'
        case 'Cancelled':
            return 'bg-danger text-white'
        default:
            return 'bg-light text-dark border'
    }
})
</script>

<style scoped>
/* CSS เดิม */
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
</style>