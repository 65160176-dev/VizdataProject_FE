<template>
  <div class="col-xl-3 col-md-6">
    <div class="card widget-card bg-rich-blue text-white h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <div>
             <h6 class="mb-2 opacity-75">My Earnings</h6>
             <h3 class="fw-bold mb-0">{{ formatCurrency(totalEarnings) }}</h3>
          </div>
          <div class="bg-white-glass p-3 rounded-circle">
             <Icon name="feather:dollar-sign" size="24" />
          </div>
        </div>
        <small class="mt-3 d-block opacity-75">ยอดขายของร้านคุณ (สำเร็จ)</small>
      </div>
    </div>
  </div>

  <div class="col-xl-3 col-md-6">
    <div class="card widget-card bg-rich-emerald text-white h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <div>
             <h6 class="mb-2 opacity-75">My Products</h6>
             <h3 class="fw-bold mb-0">{{ totalProducts }}</h3>
          </div>
          <div class="bg-white-glass p-3 rounded-circle">
             <Icon name="feather:box" size="24" />
          </div>
        </div>
         <small class="mt-3 d-block opacity-75">สินค้าในร้านของคุณ</small>
      </div>
    </div>
  </div>

  <div class="col-xl-3 col-md-6">
    <div class="card widget-card bg-rich-orange text-white h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <div>
             <h6 class="mb-2 opacity-75 fw-bold">Pending Orders</h6>
             <h3 class="fw-bold mb-0">{{ pendingCount }}</h3>
          </div>
          <div class="bg-white-glass p-3 rounded-circle shadow-sm">
             <Icon name="feather:clock" size="24" />
          </div>
        </div>
        <small class="mt-3 d-block fw-bold opacity-75">ออเดอร์ที่ต้องจัดการ</small>
      </div>
    </div>
  </div>

  <div class="col-xl-3 col-md-6">
    <div class="card widget-card bg-rich-pink text-white h-100">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center">
          <div>
             <h6 class="mb-2 opacity-75 fw-bold">Total Orders</h6>
             <h3 class="fw-bold mb-0">{{ allOrdersCount }}</h3>
          </div>
          <div class="bg-white-glass p-3 rounded-circle shadow-sm">
             <Icon name="feather:shopping-bag" size="24" />
          </div>
        </div>
        <small class="mt-3 d-block opacity-75">คำสั่งซื้อทั้งหมดของร้าน</small>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOrderStore } from '~/store/orders'
import { useProductStore } from '~/store/products'
import { useAuthStore } from '~/store/auth'

const orderStore = useOrderStore()
const productStore = useProductStore()
const authStore = useAuthStore()

// --- Logic เดิม ---
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
        .reduce((sum, o) => sum + (Number(o.total) || 0), 0)
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
/* --- ชุดสีใหม่: Rich & Vibrant (สีแน่น ตัวหนังสือขาวชัด) --- */

/* 1. Earnings: Ocean Blue */
.bg-rich-blue {
    background: linear-gradient(45deg, #0288d1 0%, #29b6f6 100%);
}

/* 2. Products: Emerald Green (แทนสีเทา) */
.bg-rich-emerald {
    background: linear-gradient(45deg, #009688 0%, #4db6ac 100%);
}

/* 3. Pending: Burnt Orange (แทนสีเหลือง เพื่อให้ text-white อ่านออก) */
.bg-rich-orange {
    background: linear-gradient(45deg, #f57c00 0%, #ffb74d 100%);
}

/* 4. Total Orders: Deep Pink/Magenta (แทนสีแดง) */
.bg-rich-pink {
    background: linear-gradient(45deg, #d81b60 0%, #f06292 100%);
}

/* Common Styles */
.widget-card {
    border: none;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.1); /* เงาฟุ้งๆ */
    transition: transform 0.2s;
}
.widget-card:hover {
    transform: translateY(-5px);
}

/* ไอคอนพื้นหลังกระจก */
.bg-white-glass {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255,255,255,0.2);
    color: white !important;
}

/* บังคับตัวหนังสือสีขาว */
.text-white h3, .text-white h6, .text-white small {
    color: #fff !important;
}
</style>