<template>
  <div class="row g-3 mb-4">
    <div class="col-xl-3 col-md-6">
  <div class="card widget-card bg-distinct-blue text-white h-100">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <h6 class="mb-2 opacity-90">My Earnings</h6>
          <h3 class="fw-bold mb-0">{{ formatCurrency(totalEarnings) }}</h3>
        </div>
        <div class="bg-white-glass p-3 rounded-circle">
          <Icon name="feather:dollar-sign" size="24" />
        </div>
      </div>
      <small class="mt-3 d-block opacity-90">
        รายได้ทั้งหมดของร้าน
      </small>
    </div>
  </div>
</div>

    <div class="col-xl-3 col-md-6" 
         @click="goToProducts" 
         style="cursor: pointer;"
         title="จัดการสินค้า">
      <div class="card widget-card bg-distinct-green text-white h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-2 opacity-90">My Products</h6>
              <h3 class="fw-bold mb-0">{{ totalProducts }}</h3>
            </div>
            <div class="bg-white-glass p-3 rounded-circle">
              <Icon name="feather:box" size="24" />
            </div>
          </div>
          <small class="mt-3 d-block opacity-90">สินค้าในร้านของคุณ <Icon name="feather:chevron-right" size="14"/></small>
        </div>
      </div>
    </div>

    <div class="col-xl-3 col-md-6" 
         @click="goToOrders('preparing')" 
         style="cursor: pointer;" 
         title="ดูรายการที่ต้องเตรียม">
      <div class="card widget-card bg-distinct-yellow text-white h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-2 opacity-90 fw-bold">Preparing Orders</h6>
              <h3 class="fw-bold mb-0">{{ pendingCount }}</h3>
            </div>
            <div class="bg-white-glass p-3 rounded-circle shadow-sm">
              <Icon name="feather:clock" size="24" />
            </div>
          </div>
          <small class="mt-3 d-block fw-bold opacity-90">กำลังเตรียม <Icon name="feather:chevron-right" size="14"/></small>
        </div>
      </div>
    </div>

    <div class="col-xl-3 col-md-6">
      <div class="card widget-card bg-distinct-purple text-white h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-2 opacity-90 fw-bold">Total Orders</h6>
              <h3 class="fw-bold mb-0">{{ allOrdersCount }}</h3>
            </div>
            <div class="bg-white-glass p-3 rounded-circle shadow-sm">
              <Icon name="feather:shopping-bag" size="24" />
            </div>
          </div>
          <small class="mt-3 d-block opacity-90">คำสั่งซื้อทั้งหมดของร้าน</small>
        </div>
      </div>
    </div>
  </div>

  <Transition name="fade">
    <div v-if="showEarningsModal" class="modal-backdrop-custom" @click.self="showEarningsModal = false">
      <div class="modal-content-custom p-0 overflow-hidden shadow-lg" style="max-width: 500px;">
        
        <div class="px-4 py-3 bg-distinct-blue text-white d-flex justify-content-between align-items-center">
          <div>
            <h5 class="fw-bold mb-0"><Icon name="feather:pie-chart" class="me-2"/>รายได้ทั้งหมด</h5>
            <small class="opacity-75">สรุปยอดขายแยกตามสถานะ</small>
          </div>
          <button class="btn btn-white-glass rounded-circle btn-sm" @click="showEarningsModal = false">
            <Icon name="feather:x" size="20" />
          </button>
        </div>

        <div class="p-4 bg-light">
            
            <div class="card border-0 shadow-sm mb-3 rounded-4 overflow-hidden">
                <div class="card-body d-flex align-items-center">
                    <div class="p-3 rounded-circle bg-success-subtle text-success me-3">
                        <Icon name="feather:check-circle" size="32" />
                    </div>
                    <div>
                        <p class="text-secondary small mb-0 fw-bold">ยอดขายที่สำเร็จ (รับเงินแล้ว)</p>
                        <h4 class="fw-bold text-success mb-0">{{ formatCurrency(earningsSuccess) }}</h4>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm mb-3 rounded-4 overflow-hidden">
                <div class="card-body d-flex align-items-center">
                    <div class="p-3 rounded-circle bg-warning-subtle text-warning me-3">
                        <Icon name="feather:truck" size="32" />
                    </div>
                    <div>
                        <p class="text-secondary small mb-0 fw-bold">อยู่ระหว่างจัดส่ง/เตรียมของ</p>
                        <h4 class="fw-bold text-dark mb-0">{{ formatCurrency(earningsProcess) }}</h4>
                        <small class="text-muted" style="font-size: 0.75rem;">*ยอดนี้จะได้รับเมื่อลูกค้ากดยืนยัน</small>
                    </div>
                </div>
            </div>

            <div class="text-center mt-4">
                <p class="text-muted small">
                    ยอดรวมทั้งหมด: 
                    <span class="fw-bold text-primary">{{ formatCurrency(earningsSuccess + earningsProcess) }}</span>
                </p>
            </div>

        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '~/store/orders'
import { useProductStore } from '~/store/products'
import { useAuthStore } from '~/store/auth'
import { navigateTo } from '#app'

const orderStore = useOrderStore()
const productStore = useProductStore()
const authStore = useAuthStore()

// State ควบคุม Modal รายได้
const showEarningsModal = ref(false)

const goToProducts = () => { navigateTo('/SellerPage/productPage') }
const goToOrders = (tabName) => { navigateTo({ path: '/SellerPage/orderStatus', query: { status: tabName } }) }

// กรองออเดอร์เฉพาะของร้านเรา
const myOrders = computed(() => {
    const all = orderStore.allOrders || []
    const myId = authStore.user?._id || authStore.user?.id || ''
    if (!myId) return []
    return all.filter(order => {
        const items = order.item || order.items || []
        if (items.length === 0) return false
        const productOwner = items[0]?.productId?.userId
        const ownerId = (typeof productOwner === 'object') ? productOwner?._id : productOwner
        return ownerId === myId
    })
})

// Helper คำนวณยอดเงิน (ราคาสินค้า - ค่าส่ง ถ้ามี Logic นี้)
const calculateNetPrice = (order) => {
    // สมมติว่าราคารวม (total) หักลบค่าส่ง (shippingCost) คือรายได้ร้านค้า
    // หรือถ้า total คือค่าของล้วนๆ อยู่แล้ว ก็ใช้ order.total ได้เลย
    const total = Number(order.total) || 0
    const shipping = Number(order.shippingCost) || 0
    const net = total - shipping 
    return net > 0 ? net : 0
}

// 1. รายได้ที่สำเร็จแล้ว (Completed, Success)
const earningsSuccess = computed(() => {
    return myOrders.value
        .filter(o => ['completed', 'success', 'delivered'].includes((o.status || '').toLowerCase()))
        .reduce((sum, o) => sum + calculateNetPrice(o), 0)
})

// 2. รายได้ที่กำลังดำเนินการ (Pending, Preparing, Shipped)
const earningsProcess = computed(() => {
    return myOrders.value
        .filter(o => ['pending', 'preparing', 'shipped', 'shipping', 'confirm'].includes((o.status || '').toLowerCase()))
        .reduce((sum, o) => sum + calculateNetPrice(o), 0)
})

// ยอดรวม (ใช้แสดงหน้าการ์ดหลัก) - เอาเฉพาะที่สำเร็จแล้ว หรือจะรวมทั้งหมดก็ได้ตาม Business Logic
// *ในที่นี้ขอใช้ "สำเร็จแล้ว" โชว์หน้าการ์ด เพื่อความชัวร์ของตัวเลข
const totalEarnings = computed(() => earningsSuccess.value)

const myProducts = computed(() => {
    const all = productStore.products || []
    const myId = authStore.user?._id || authStore.user?.id || ''
    if (!myId) return []
    return all.filter(product => {
        const ownerId = typeof product.userId === 'object' ? product.userId?._id : product.userId
        return ownerId === myId
    })
})
const totalProducts = computed(() => myProducts.value.length)
const pendingCount = computed(() => {
    return myOrders.value.filter(o => 
        ['pending', 'preparing', 'cancel requested', 'return_requested'].includes((o.status || '').toLowerCase())
    ).length
})
const allOrdersCount = computed(() => myOrders.value.length)

const formatCurrency = (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits: 0 }).format(val || 0)
</script>

<style scoped>
/* --- THEME COLORS --- */
.bg-distinct-blue { background: linear-gradient(135deg, #007adf 0%, #00ecbc 100%); }
.bg-distinct-green { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); }
.bg-distinct-yellow { background: linear-gradient(135deg, #f09819 0%, #edde5d 100%); }
.bg-distinct-purple { background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%); }

/* Widget Styles */
.widget-card {
    border: none;
    border-radius: 16px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    transition: transform 0.2s;
    overflow: hidden;
}
.widget-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}
.bg-white-glass {
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(5px);
    border: 1px solid rgba(255,255,255,0.3);
    color: white !important;
}
.text-white h3, .text-white h6, .text-white small {
    color: #fff !important;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
.btn-white-glass {
    background: rgba(255,255,255,0.2);
    border: none;
    color: white;
}
.btn-white-glass:hover {
    background: rgba(255,255,255,0.4);
}

/* Modal Styles */
.modal-backdrop-custom {
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.6); /* Darker backdrop */
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1050;
    padding: 20px;
}
.modal-content-custom {
    background: #fff;
    width: 100%;
    border-radius: 20px;
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>