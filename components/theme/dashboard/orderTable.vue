<template>
  <div class="col-xl-6 xl-100">
    <div class="card shadow-sm border-0 h-100">
      <div class="card-header bg-transparent border-0 pb-2">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="fw-bold mb-0">Latest Orders 📦</h5>
          
        </div>
        
        <div class="d-flex gap-2 overflow-auto pb-1 no-scrollbar">
            <button 
                v-for="tab in tabs" 
                :key="tab.value"
                class="btn btn-sm rounded-pill px-3 fw-bold border-0 transition-all"
                :class="currentFilter === tab.value ? tab.activeClass : 'bg-light text-secondary'"
                @click="currentFilter = tab.value"
                style="white-space: nowrap;"
            >
                {{ tab.label }}
            </button>
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
                  <span class="badge rounded-pill" :class="getStatusColor(order.status)">
                    {{ order.status }}
                  </span>
                </td>
                <td class="text-end pe-4 fw-bold">{{ formatCurrency(order.total) }}</td>
              </tr>
              <tr v-if="latestOrders.length === 0">
                <td colspan="4" class="text-center py-5 text-muted">
                    <div class="opacity-50 mb-2">
                        <Icon name="feather:inbox" size="24" />
                    </div>
                    ไม่พบรายการในสถานะนี้
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useOrderStore } from '~/store/orders'

const orderStore = useOrderStore()
const currentFilter = ref('all')

// กำหนดตัวเลือก Tabs
const tabs = [
    { value: 'all', label: 'ทั้งหมด', activeClass: 'bg-dark text-white' },
    { value: 'preparing', label: 'เตรียมจัดส่ง', activeClass: 'bg-primary text-white' },
    { value: 'shipped', label: 'กำลังส่ง', activeClass: 'bg-info text-white' },
    { value: 'completed', label: 'สำเร็จ', activeClass: 'bg-success text-white' },
    { value: 'cancelled', label: 'ยกเลิก', activeClass: 'bg-danger text-white' }
]

const latestOrders = computed(() => {
  let orders = orderStore.allOrders || []

  // 1. กรองตามสถานะที่เลือก
  if (currentFilter.value !== 'all') {
    orders = orders.filter(o => {
        const s = (o.status || '').toLowerCase()
        // กรณี cancelled รวมสถานะที่เกี่ยวข้องกันเข้าไปด้วย
        if (currentFilter.value === 'cancelled') {
            return ['cancelled', 'cancel requested', 'return_requested'].includes(s)
        }
        return s === currentFilter.value
    })
  }

  // 2. เรียงลำดับและตัดมาแค่ 5 รายการ
  return [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
})

const getStatusColor = (status) => {
  const s = (status || '').toLowerCase()
  if (['completed', 'success'].includes(s)) return 'bg-success text-white'
  if (['pending', 'preparing'].includes(s)) return 'bg-primary text-white'
  if (['shipped'].includes(s)) return 'bg-info text-white'
  if (['cancelled', 'cancel requested', 'return_requested'].includes(s)) return 'bg-danger text-white'
  return 'bg-secondary text-white'
}

const formatCurrency = (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val || 0)
const formatDate = (date) => {
    if(!date) return ''
    return new Date(date).toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
}
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
.transition-all {
    transition: all 0.2s ease;
}
</style>