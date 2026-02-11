<template>
  <div class="pb-5 position-relative">

    <div class="bg-white shadow-sm rounded-4 p-4 overflow-hidden">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <div style="min-width: 0;">
          <button class="btn btn-link text-dark text-decoration-none p-0 fw-bold" @click="$emit('back')">
            <i class="fa fa-arrow-left me-2"></i> รายละเอียดคำสั่งซื้อ
          </button>
        </div>
        <div class="text-end" style="min-width: 0;">
          <div class="d-flex flex-column align-items-end">
            <span class="badge rounded-pill mb-1 px-3" :class="statusBadgeClass" style="font-size: 0.85rem;">
              {{ formatStatus(order.status) }}
            </span>
            <span class="small text-muted fw-bold">{{ order.orderId }}</span>
            <span class="small text-muted" style="font-size: 0.75rem;">
              {{ formatDate(order.date || order.createdAt) }}
            </span>
          </div>
        </div>
      </div>

      <hr class="border-secondary-subtle my-4">

      <div class="mb-4" v-if="!isCancelled">
        <div class="stepper-wrapper px-3">
          <div class="stepper-item" :class="{ completed: step >= 1 }">
            <div class="step-counter">1</div>
            <div class="step-name">Pending</div>
          </div>
          <div class="stepper-item" :class="{ completed: step >= 2 }">
            <div class="step-counter">2</div>
            <div class="step-name">Preparing</div>
          </div>
          <div class="stepper-item" :class="{ completed: step >= 3 }">
            <div class="step-counter">3</div>
            <div class="step-name">Shipped</div>
          </div>
          <div class="stepper-item" :class="{ completed: step >= 4 }">
            <div class="step-counter">4</div>
            <div class="step-name">Completed</div>
          </div>
        </div>
      </div>

      <hr class="border-secondary-subtle my-4" v-if="!isCancelled">

      <div class="mb-4">
        <h6 class="mb-3 fw-bold text-dark">
          <i class="fa fa-map-marker-alt me-2 text-primary"></i> ที่อยู่จัดส่ง
        </h6>
        <div class="row ps-4">
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

      <hr class="border-secondary-subtle my-4">

      <div class="mb-4">
        <div class="d-flex align-items-center bg-light p-2 rounded mb-3">
          <i class="fa fa-home me-2 text-primary ms-2"></i>
          <NuxtLink :to="`/seller/${order.shopId || order.items[0]?.productId?.userId?._id || 'official-store'}`"
            class="fw-bold text-dark me-1 text-decoration-none hover-underline">
            {{ order.shopName || 'Official Store' }}
          </NuxtLink>
          <i class="fa fa-angle-right text-muted small"></i>
        </div>

        <div v-for="(item, index) in order.items" :key="index" class="p-2 mb-2">
          <div class="d-flex">
            <NuxtLink
              :to="`/product/three-column/thumbnail-left?id=${item.productId?._id || item.productId || item.id || '1'}`"
              class="bg-light rounded d-flex align-items-center justify-content-center me-3 flex-shrink-0 border"
              style="width: 70px; height: 70px; overflow: hidden; text-decoration: none;">
              <img v-if="item.image" :src="item.image" style="width: 100%; height: 100%; object-fit: cover;">
              <i v-else class="fa fa-box text-secondary fs-4"></i>
            </NuxtLink>

            <div class="flex-grow-1">
              <div class="d-flex justify-content-between align-items-start">
                <div>
                  <NuxtLink
                    :to="`/product/three-column/thumbnail-left?id=${item.productId?._id || item.productId || item.id || '1'}`"
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

      <hr class="border-secondary-subtle my-4">

      <div>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="text-muted">ช่องทางชำระเงิน</span>
          <span class="fw-bold">{{ order.paymentMethod || 'PromptPay' }}</span>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="text-muted">ราคาสินค้า</span>
          <span>฿{{ (order.total - (order.shippingFee || 0)).toLocaleString() }}</span>
        </div>
        <div class="d-flex justify-content-between align-items-center mb-2">
          <span class="text-muted">ค่าจัดส่ง</span>
          <span>฿{{ (order.shippingFee || 0).toLocaleString() }}</span>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3">
          <span class="fw-bold fs-5">ยอดรวมสุทธิ</span>
          <span class="fw-bold fs-4 text-primary">฿{{ order.total.toLocaleString() }}</span>
        </div>

        <div v-if="order.note && shouldShowNote(order.status)"
          class="mt-4 p-3 rounded text-start border border-danger shadow-sm" style="background-color: #ffebee;">
          <div class="fw-bold text-danger mb-2 d-flex align-items-center border-bottom border-danger-subtle pb-2">
            <i class="fa fa-exclamation-circle me-2 fs-5"></i>
            <span style="font-size: 1rem;">{{ noteHeader }}</span>
          </div>
          <div class="text-dark pt-1 ps-1" style="font-size: 0.95rem; line-height: 1.5;">
            {{ order.note }}
          </div>
        </div>

        <div v-if="checkStatus(order.status, 'pending')" class="mt-4 text-end">
          <button class="btn btn-outline-danger px-4 rounded-pill fw-bold" @click="openCancelModal">
            ยกเลิกคำสั่งซื้อ
          </button>
        </div>

        <div v-else-if="checkStatus(order.status, 'cancel requested') || checkStatus(order.status, 'return requested')"
          class="mt-4 text-center p-3 bg-light rounded text-muted small">
          กำลังดำเนินการตรวจสอบคำขอจากทางร้าน...
        </div>

        <div v-else-if="checkStatus(order.status, 'processing')" class="mt-4 text-end">
          <p class="text-muted small mb-2">สินค้าอยู่ระหว่างเตรียมการ หากต้องการยกเลิกต้องรอการอนุมัติ</p>
          <button class="btn btn-outline-warning px-4 rounded-pill fw-bold text-dark" @click="openCancelModal">
            ส่งคำขอยกเลิกออเดอร์
          </button>
        </div>

        <div v-else-if="checkStatus(order.status, 'shipping')" class="mt-4 text-center">
          <p class="text-muted small mb-2">สินค้าอยู่ระหว่างจัดส่ง กรุณาตรวจสอบสินค้าก่อนกดยืนยัน</p>
          <div class="d-flex gap-2 w-100 justify-content-end">
            <button class="btn btn-outline-danger rounded-pill fw-bold" style="min-width: 120px;"
              @click="openReturnModal">
              ปฏิเสธ/มีปัญหา
            </button>

            <button class="btn rounded-pill fw-bold text-white"
              style="background-color: #28a745; border: none; min-width: 120px;" @click="handleConfirmReceived">
              ได้รับสินค้าแล้ว
            </button>
          </div>
        </div>

        <div v-else-if="checkStatus(order.status, 'completed')"
          class="mt-4 text-center text-success bg-light p-3 rounded">
          <i class="fa fa-check-circle me-2"></i> รายการสั่งซื้อนี้เสร็จสมบูรณ์แล้ว
        </div>

      </div>

    </div>

    <cancReqOrderPop v-if="showCancelModal" :status="order.status" @close="closeCancelModal"
      @confirm="submitRequestCancellation" />

    <confirmOrder v-if="showConfirmReceivedModal" @close="showConfirmReceivedModal = false"
      @confirm="submitConfirmReceived" />

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useNuxtApp, useRuntimeConfig } from '#app'
import cancReqOrderPop from './cancReqOrderPop.vue'
import confirmOrder from './confirmOrder.vue'

const props = defineProps({
  order: { type: Object, required: true }
})

const emit = defineEmits(['back', 'cancel', 'update'])

const isReturnMode = ref(false)
const showCancelModal = ref(false)
const showConfirmReceivedModal = ref(false)

const { $showToast } = useNuxtApp()
const config = useRuntimeConfig()
const API_BASE_URL = config.public.apiBase || 'http://localhost:3001'

const checkStatus = (status, type) => {
  const s = (status || '').toLowerCase();
  switch (type) {
    case 'pending': return s === 'pending' || s === 'pending review';
    case 'processing': return s === 'preparing' || s === 'processing' || s === 'accepted' || s === 'confirmed';
    case 'shipping': return s === 'shipped' || s === 'shipping' || s === 'arrived';
    case 'completed': return s === 'completed' || s === 'delivered';
    case 'cancelled': return s === 'cancelled' || s === 'cancel';
    case 'cancel requested': return s === 'cancel requested' || s === 'cancellation requested';
    case 'return requested': return s === 'return_requested' || s === 'return requested';
    default: return false;
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

const formatStatus = (status) => {
  if (!status) return ''
  const s = status.toLowerCase()
  switch (s) {
    case 'pending': return 'Pending'
    case 'pending review': return 'Pending Review'
    case 'processing': return 'Processing'
    case 'preparing': return 'Preparing'
    case 'shipped': return 'Shipped'
    case 'shipping': return 'Shipping'
    case 'completed': return 'Completed'
    case 'cancelled': return 'Cancelled'
    case 'cancel requested': return 'Cancel Requested'
    case 'return_requested': return 'Cancel Requested'
    case 'return requested': return 'Cancel Requested'
    default: return status
  }
}

const shouldShowNote = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('request') || s === 'pending') return false;
  return true;
}

const noteHeader = computed(() => {
  const s = (props.order.status || '').toLowerCase();
  if (s === 'preparing' || s === 'processing') {
    return 'ร้านค้าปฏิเสธคำขอ';
  }
  else if (s === 'cancelled' || s === 'cancel') {
    return 'เหตุผลการยกเลิก';
  }
  return 'ข้อความจากร้านค้า';
})

const step = computed(() => {
  if (checkStatus(props.order.status, 'pending')) return 1
  if (checkStatus(props.order.status, 'processing')) return 2
  if (checkStatus(props.order.status, 'shipping')) return 3
  if (checkStatus(props.order.status, 'completed')) return 4
  return 1
})

const isCancelled = computed(() => {
  const s = (props.order.status || '').toLowerCase();
  return s === 'cancelled' || s === 'cancel' || s.includes('cancel') || s.includes('return_requested') || s.includes('return requested');
})

const statusBadgeClass = computed(() => {
  const s = (props.order.status || '').toLowerCase();
  switch (s) {
    case 'accepted': case 'completed': case 'delivered': return 'status-success'
    case 'pending review': case 'pending': return 'status-warning'
    case 'preparing': case 'processing': case 'confirmed': return 'status-info'
    case 'shipped': case 'shipping': case 'arrived': return 'status-primary'
    case 'cancel requested': case 'cancelled': case 'cancel': case 'return_requested': case 'return requested': return 'status-danger'
    default: return 'status-default'
  }
})

// --- Action Logic ---

const openCancelModal = () => {
  isReturnMode.value = false
  showCancelModal.value = true
}
const openReturnModal = () => {
  isReturnMode.value = true
  showCancelModal.value = true
}
const closeCancelModal = () => { showCancelModal.value = false }

const submitRequestCancellation = async (reason) => {
  let statusToSend = 'cancel requested'
  let title = 'ส่งคำขอยกเลิกแล้ว'

  // ถ้าอยู่หน้า shipping ถือเป็นการ "ขอคืนสินค้า" (Return Requested)
  if (checkStatus(props.order.status, 'shipping')) {
    statusToSend = 'return_requested'
    title = 'ส่งคำขอคืนสินค้าแล้ว'
  }
  // ถ้าอยู่หน้า Pending (ยังไม่เตรียมของ) ให้ Cancel ทันที
  else if (checkStatus(props.order.status, 'pending')) {
    statusToSend = 'cancelled'
    title = 'ยกเลิกคำสั่งซื้อเรียบร้อย'
  }

  try {
    const token = localStorage.getItem('token')
    await $fetch(`${API_BASE_URL}/api/order/${props.order._id || props.order.orderId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: {
        status: statusToSend,
        note: reason,
        isCancelRequest: statusToSend === 'cancel requested' || statusToSend === 'return_requested'
      }
    })

    props.order.status = statusToSend
    props.order.note = reason

    emit('update', props.order)
    closeCancelModal()
    $showToast({ msg: title, type: 'success' })

  } catch (error) {
    console.error("Update Error:", error)
    $showToast({ msg: 'เกิดข้อผิดพลาดในการดำเนินการ', type: 'error' })
  }
}

const handleConfirmReceived = () => { showConfirmReceivedModal.value = true }

const submitConfirmReceived = async () => {
  try {
    const token = localStorage.getItem('token')
    await $fetch(`${API_BASE_URL}/api/order/${props.order._id || props.order.orderId}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: { status: 'Completed' }
    })

    props.order.status = 'Completed'
    emit('update', props.order)
    showConfirmReceivedModal.value = false
    $showToast({ msg: 'ยืนยันรับสินค้าเรียบร้อย', type: 'success' })
  } catch (error) {
    console.error(error)
    $showToast({ msg: 'เกิดข้อผิดพลาด', type: 'error' })
  }
}
</script>

<style scoped>
/* CSS สีสถานะ */
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

/* Style เดิม */
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

.border-dashed {
  border-style: dashed !important;
}
</style>