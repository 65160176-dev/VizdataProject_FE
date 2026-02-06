<template>
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
        <small class="mt-3 d-block opacity-90">ยอดขายของร้านคุณ (สำเร็จ)</small>
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
</template>

<script setup>
// ... (Logic เดิมทั้งหมดคงไว้เหมือนเดิมครับ ไม่ต้องแก้ไข Script)
import { computed } from 'vue'
import { useOrderStore } from '~/store/orders'
import { useProductStore } from '~/store/products'
import { useAuthStore } from '~/store/auth'
const orderStore = useOrderStore()
const productStore = useProductStore()
const authStore = useAuthStore()

const goToProducts = () => { navigateTo('/SellerPage/productPage') }
const goToOrders = (tabName) => { navigateTo({ path: '/SellerPage/orderStatus', query: { tab: tabName } }) }

const myOrders = computed(() => {
    const all = orderStore.allOrders || []
    const myId = authStore.user?._id || authStore.user?.id || ''
    if (!myId) return []
    return all.filter(order => {
        const sellerId = typeof order.seller === 'object' ? order.seller?._id : order.seller
        return sellerId === myId
    })
})
const myProducts = computed(() => {
    const all = productStore.products || []
    const myId = authStore.user?._id || authStore.user?.id || ''
    if (!myId) return []
    return all.filter(product => {
        const ownerId = typeof product.userId === 'object' ? product.userId?._id : product.userId
        return ownerId === myId
    })
})
const totalEarnings = computed(() => {
  return myOrders.value
    .filter(o => ['completed', 'shipped', 'delivered', 'success'].includes((o.status || '').toLowerCase()))
    .reduce((sum, o) => {
      const total = Number(o.total) || 0
      const shipping = Number(o.shippingCost) || 0
      const net = total - shipping
      return sum + (net > 0 ? net : 0)
    }, 0)
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
/* --- THEME: DISTINCT COLORS (สีต่างกันชัดเจน) --- */

/* 1. Blue: ฟ้าสดใส (Electric Blue) */
.bg-distinct-blue {
    background: linear-gradient(135deg, #007adf 0%, #00ecbc 100%);
}

/* 2. Green: เขียวมรกต (Emerald Green) */
.bg-distinct-green {
    background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

/* 3. Yellow/Gold: เหลืองส้ม (Sunny Gold) - สีเตือน/Pending */
.bg-distinct-yellow {
    background: linear-gradient(135deg, #f09819 0%, #edde5d 100%);
}

/* 4. Purple: ม่วงสด (Vibrant Purple) - ตัดกับทุกสี */
.bg-distinct-purple {
    background: linear-gradient(135deg, #8E2DE2 0%, #4A00E0 100%);
}

/* Common Styles */
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
    text-shadow: 0 1px 2px rgba(0,0,0,0.1); /* เพิ่มเงาให้ตัวหนังสืออ่านง่ายขึ้นบนสีสด */
}
</style>