<template>
    <div>
        <div class="bg-white p-3 mb-3 shadow-sm d-flex align-items-center">

            <div style="flex: 1; min-width: 0;">
                <button class="btn btn-link text-dark text-decoration-none p-0" @click="$emit('back')">
                    <i class="fa fa-chevron-left"></i> ย้อนกลับ
                </button>
            </div>

            <div class="text-center px-2" style="flex: 2; min-width: 0;">
                <div class="text-dark fw-bold text-truncate fs-5">
                    <i class="fa fa-home me-2"></i>{{ order.shopName || order.items[0].brand || 'Official Store'
                    }}
                </div>
            </div>

            <div class="text-end" style="flex: 1; min-width: 0;">
                <div class="d-flex flex-column align-items-end">
                    <span class="badge rounded-pill mb-1" :class="statusBadgeClass">{{ order.status }}</span>
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
                    <div class="step-name">Completed</div>
                </div>
            </div>
        </div>

        <div class="alert alert-danger mb-3" v-else>
            <i class="fa fa-times-circle me-2"></i> คำสั่งซื้อนี้ถูกยกเลิก (Cancelled)
        </div>

        <div class="card border-0 shadow-sm p-4 mb-3">
            <h6 class="mb-3 border-bottom pb-2"><i class="fa fa-user me-2"></i> ข้อมูลลูกค้า</h6>
            <div class="row">
                <div class="col-md-6">
                    <strong>ชื่อ:</strong> {{ order.customer }}<br>
                    <strong>อีเมล:</strong> {{ order.email }}
                </div>
                <div class="col-md-6">
                    <strong>ที่อยู่จัดส่ง:</strong><br>
                    {{ order.address }}
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-3">
            <div class="card-header bg-white border-bottom-0 pt-3">
                <strong>รายการสินค้า ({{ order.items.length }} ชิ้น)</strong>
            </div>

            <div class="card-body p-0">
                <div v-for="(item, index) in order.items" :key="index" class="p-3 border-top">
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="d-flex align-items-center">
                            <div class="bg-light rounded d-flex align-items-center justify-content-center me-3"
                                style="width: 50px; height: 50px; overflow: hidden;">
                                <img v-if="item.image" :src="item.image"
                                    style="width: 100%; height: 100%; object-fit: cover;">
                                <i v-else class="fa fa-box text-secondary" style="font-size: 20px;"></i>
                            </div>
                            <div>
                                <h6 class="mb-0">{{ item.name }}</h6>
                                <small class="text-muted">จำนวน: {{ item.qty }}</small>
                            </div>
                        </div>
                        <div class="fw-bold">฿{{ item.price.toLocaleString() }}</div>
                    </div>
                </div>
            </div>
        </div>

        <div class="card border-0 shadow-sm mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="text-muted">ช่องทางชำระเงิน</span>
                    <span>{{ order.paymentMethod }}</span>
                </div>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="text-muted">ค่าจัดส่ง</span>
                    <span>฿{{ (order.shippingFee || 0).toLocaleString() }}</span>
                </div>
                <hr>
                <div class="d-flex justify-content-between align-items-center">
                    <span class="fw-bold fs-5">ยอดรวมสุทธิ</span>
                    <span class="fw-bold fs-5 text-primary">฿{{ order.total.toLocaleString() }}</span>
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
const emit = defineEmits(['back'])

const step = computed(() => {
    const s = props.order.status
    if (s === 'Pending Review') return 1
    if (s === 'Accepted') return 2
    if (s === 'Shipping') return 3
    if (s === 'Completed') return 4
    return 1
})

const statusBadgeClass = computed(() => {
    const s = props.order.status
    if (s === 'Accepted') return 'bg-success text-white'
    if (s === 'Pending Review') return 'bg-warning text-dark'
    if (s === 'Cancelled') return 'bg-danger text-white'
    return 'bg-secondary text-white'
})
</script>

<style scoped>
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
    border-bottom: 3px solid #eee;
    width: 100%;
    top: 15px;
    left: -50%;
    z-index: 2;
}

.stepper-item::after {
    position: absolute;
    content: "";
    border-bottom: 3px solid #eee;
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
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #fff;
    border: 3px solid #ccc;
    margin-bottom: 6px;
    font-weight: bold;
    color: #ccc;
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
    font-weight: bold;
    color: #555;
}
</style>