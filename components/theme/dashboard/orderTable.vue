<template>
  <div class="card shadow-sm border-0 h-100 w-100">
    <div class="card-header border-0 pb-3 pt-3" 
         style="background: linear-gradient(135deg, #ff6b35 0%, #ff9f43 100%); border-radius: 10px 10px 0 0;">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h5 class="fw-bold mb-0 text-white text-shadow">Latest Orders 📦</h5>
      </div>
      <div class="d-flex gap-2 pb-1 align-items-center">
        <select v-model="timeFilter" class="form-select form-select-sm border-0 bg-white fw-bold rounded-pill text-secondary ps-3 shadow-sm" style="cursor: pointer; flex: 1;">
          <option value="all">🕒 ทุกช่วงเวลา</option>
          <option value="1">1 ชม. ล่าสุด</option>
          <option value="3">3 ชม. ล่าสุด</option>
          <option value="24">1 วันล่าสุด</option>
          <option value="168">7 วันล่าสุด</option>
        </select>
        <select v-model="statusFilter" class="form-select form-select-sm border-0 bg-white fw-bold rounded-pill text-secondary ps-3 shadow-sm" style="cursor: pointer; flex: 1;">
          <option value="all">📋 สถานะ</option>
          <option value="pending_confirm">🟠 รอการยืนยัน</option>
          <option value="preparing">🔵 กำลังเตรียม</option>
          <option value="shipped">🟣 กำลังส่ง</option>
          <option value="completed">🟢 สำเร็จ</option>
          <option value="cancelled">🔴 ยกเลิก</option>
        </select>
      </div>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="bg-light">
            <tr>
              <th class="ps-4">ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th class="text-end pe-4">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in latestOrders" :key="order._id">
              <td class="ps-4 fw-bold">#{{ order.orderId ? order.orderId : String(order._id).slice(-6) }}</td>
              <td>
                <div class="d-flex flex-column">
                  <span>{{ order.customer || 'Unknown' }}</span>
                  <small class="text-muted" style="font-size: 0.75rem;">{{ formatDate(order.createdAt) }}</small>
                </div>
              </td>
              <td>
                <NuxtLink :to="getStatusLink(order)" class="badge rounded-pill text-decoration-none border-0 shadow-sm transition-hover d-inline-flex align-items-center" :class="getStatusBadgeStyle(order.status)" style="cursor: pointer; padding: 6px 10px;">
                  {{ order.status }} <Icon name="feather:chevron-right" size="10" class="ms-1" style="opacity: 0.8;"/>
                </NuxtLink>
              </td>
              <td class="text-end pe-4 fw-bold">{{ formatCurrency(order.total) }}</td>
            </tr>
            <tr v-if="latestOrders.length === 0">
              <td colspan="4" class="text-center py-5 text-muted">
                <div class="opacity-50 mb-2"><Icon name="feather:search" size="24" /></div>
                ไม่พบรายการตามเงื่อนไขที่เลือก
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '~/store/orders'
import { useAuthStore } from '~/store/auth' 

const orderStore = useOrderStore()
const authStore = useAuthStore()

// State Filters
const timeFilter = ref('all')
const statusFilter = ref('all')

const latestOrders = computed(() => {
  let orders = orderStore.allOrders || []

  // 1. กรองร้านตัวเอง
  const mySellerId = authStore.user?._id || authStore.user?.id 
  if (mySellerId) {
    orders = orders.filter(o => {
      const orderSellerId = typeof o.seller === 'object' && o.seller !== null ? o.seller._id : o.seller
      return String(orderSellerId) === String(mySellerId)
    })
  }

  // 2. กรองเวลา
  if (timeFilter.value !== 'all') {
    const now = new Date()
    const hoursLimit = parseInt(timeFilter.value)
    orders = orders.filter(o => {
      const orderDate = new Date(o.createdAt)
      const diffInHours = (now - orderDate) / (1000 * 60 * 60)
      return diffInHours <= hoursLimit
    })
  }

  // 3. กรองสถานะ (Logic ใหม่ตาม Dropdown)
  if (statusFilter.value !== 'all') {
    orders = orders.filter(o => {
      const s = (o.status || '').toLowerCase()
      
      if (statusFilter.value === 'pending_confirm') {
        return ['pending', 'confirm', 'waiting'].includes(s)
      }
      if (statusFilter.value === 'preparing') {
        return ['preparing', 'process'].includes(s)
      }
      if (statusFilter.value === 'shipped') {
        return ['shipped', 'shipping'].includes(s)
      }
      if (statusFilter.value === 'completed') {
        return ['completed', 'success', 'delivered'].includes(s)
      }
      if (statusFilter.value === 'cancelled') {
        return ['cancelled', 'cancel', 'cancel requested', 'return_requested'].includes(s)
      }
      return s === statusFilter.value
    })
  }

  return [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

// ✅ Style Matcher: ให้สีตรงกับ orderStatus.vue เป๊ะๆ
const getStatusBadgeStyle = (status) => {
  const s = (status || '').toLowerCase()
  
  // 1. รอการยืนยัน (สีส้ม)
  if (['pending', 'confirm', 'waiting'].includes(s)) return 'badge-orange'
  
  // 2. กำลังเตรียม (สีฟ้า)
  if (['preparing', 'process'].includes(s)) return 'badge-blue'
  
  // 3. กำลังส่ง (สีม่วง)
  if (['shipped', 'shipping'].includes(s)) return 'badge-purple'
  
  // 4. สำเร็จ (สีเขียว Teals)
  if (['completed', 'success', 'delivered'].includes(s)) return 'badge-teal'
  
  // 5. ยกเลิก (สีแดง)
  if (['cancelled', 'cancel', 'cancel requested', 'return_requested'].includes(s)) return 'badge-red'
  
  return 'bg-secondary text-white'
}

// Logic Link
const getStatusLink = (order) => {
  const s = (order.status || '').toLowerCase()
  let targetTab = 'preparing' 

  // Mapping ให้ตรงกับ Tab ในหน้า orderStatus
  if (['shipped', 'shipping'].includes(s)) targetTab = 'shipped'
  else if (['completed', 'success'].includes(s)) targetTab = 'completed'
  else if (['cancelled', 'cancel requested', 'return_requested'].includes(s)) targetTab = 'cancelled'
  else if (['pending', 'confirm', 'waiting'].includes(s)) targetTab = 'preparing' // รอการยืนยัน ก็น่าจะอยู่ในหมวดเตรียม หรือ tab แรก

  return { path: '/SellerPage/orderStatus', query: { tab: targetTab, id: order._id } }
}

const formatCurrency = (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val || 0)
const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.text-shadow { text-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.transition-hover:hover { transform: scale(1.05); filter: brightness(1.1); }

/* Custom Badge Colors ให้เหมือน orderStatus.vue */
.badge-orange { background-color: #F57F17; color: white; }
.badge-blue   { background-color: #0288D1; color: white; }
.badge-purple { background-color: #5E35B1; color: white; }
.badge-teal   { background-color: #00897B; color: white; }
.badge-red    { background-color: #D32F2F; color: white; }

select.form-select:focus {
  box-shadow: none;
  border: 1px solid #eee;
}
</style>