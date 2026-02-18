<template>
  <div class="col-xl-6 col-md-6">
    <div class="card shadow-sm border-0 h-100 overflow-hidden">
      <div class="card-body pb-0">
        <p class="text-muted mb-1 text-uppercase small fw-bold">My Revenue (7 Days)</p>
        <h4 class="fw-bolder mb-0">{{ formatCurrency(total7Days) }}</h4>
        <small class="text-muted" style="font-size: 10px;">(ยอดขายเฉพาะร้านคุณ)</small>
      </div>
      <div class="chart-area mt-3">
        <apexchart type="bar" height="85" :options="chartOptions" :series="series"></apexchart>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useOrderStore } from '~/store/orders';
import { useAuthStore } from '~/store/auth';

const orderStore = useOrderStore();
const authStore = useAuthStore();

// 1. กรองเฉพาะออเดอร์ของร้านเรา
const myOrders = computed(() => {
    const all = orderStore.allOrders || []
    const myId = authStore.user?._id || authStore.user?.id || ''
    if (!myId) return []

    return all.filter(order => {
        const sellerId = typeof order.seller === 'object' ? order.seller?._id : order.seller
        return sellerId === myId
    })
})

// 2. คำนวณยอดขาย 7 วัน
const last7DaysData = computed(() => {
  const data = Array(7).fill(0);
  const orders = myOrders.value;
  
  if (orders.length === 0) return data;

  const dates = orders.map(o => new Date(o.createdAt || o.date).getTime()).filter(d => !isNaN(d));
  if (dates.length === 0) return data;
  
  const maxDate = new Date(Math.max(...dates));
  maxDate.setHours(23, 59, 59, 999);

  orders.forEach(order => {
    if (order.status === 'cancelled' || order.status === 'cancel') return;
    
    const d = new Date(order.createdAt || order.date);
    if (isNaN(d.getTime())) return;

    const diffTime = maxDate - d;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays >= 0 && diffDays < 7) {
       const index = 6 - diffDays; 
       data[index] += Number(order.total || 0);
    }
  });
  return data;
});

const total7Days = computed(() => last7DaysData.value.reduce((a,b)=>a+b,0));
const series = computed(() => [{ name: "Sales", data: last7DaysData.value }]);
const formatCurrency = (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits:0 }).format(val);

// ตั้งค่ากราฟแท่ง
const chartOptions = ref({
  chart: { 
      type: "bar",  
      height: 85, 
      sparkline: { enabled: true },
      fontFamily: 'Nunito, sans-serif'
  },
  // ปรับแต่งแท่งกราฟ
  plotOptions: { 
      bar: { 
          borderRadius: 4,       // มุมมน
          columnWidth: '50%',    // ความกว้างของแท่ง
          distributed: false
      } 
  },
  colors: ["#ff9f40"], // ✅ เปลี่ยนเป็นสีส้ม
  tooltip: { 
      fixed: { enabled: false }, 
      x: { show: false }, 
      marker: { show: false },
      y: { formatter: (val) => formatCurrency(val) } 
  },
  grid: { padding: { top: 10, bottom: 10, left: 0, right: 0 } }
});
</script>