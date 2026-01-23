<template>
  <div class="col-xl-6 col-md-6">
    <div class="card shadow-sm border-0 h-100 overflow-hidden">
      <div class="card-body pb-0">
        <p class="text-muted mb-1 text-uppercase small fw-bold">My Revenue (7 Days)</p>
        <h4 class="fw-bolder mb-0">{{ formatCurrency(total7Days) }}</h4>
        <small class="text-muted" style="font-size: 10px;">(ยอดขายเฉพาะร้านคุณ)</small>
      </div>
      <div class="chart-area mt-2" style="margin-bottom: -15px;">
        <apexchart type="area" height="100" :options="chartOptions" :series="series"></apexchart>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useOrderStore } from '~/store/orders';
import { useAuthStore } from '~/store/auth'; // ✅ เรียก Auth

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

// 2. คำนวณยอดขาย 7 วัน (Auto-detect Date)
const last7DaysData = computed(() => {
  const data = Array(7).fill(0);
  const orders = myOrders.value; // ใช้ myOrders แทน allOrders
  
  if (orders.length === 0) return data;

  // หา "วันที่ล่าสุด" ของร้านเราที่มีออเดอร์
  const dates = orders.map(o => new Date(o.createdAt || o.date).getTime()).filter(d => !isNaN(d));
  if (dates.length === 0) return data;
  
  const maxDate = new Date(Math.max(...dates));
  maxDate.setHours(23, 59, 59, 999); // set เป็นจบวัน

  orders.forEach(order => {
    // ไม่นับที่ยกเลิก
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

const chartOptions = ref({
  chart: { type: "area", height: 100, sparkline: { enabled: true } },
  stroke: { curve: "smooth", width: 2 },
  fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.0, stops: [0, 100] } },
  colors: ["#7366ff"], // สีม่วง
  tooltip: { fixed: { enabled: false }, x: { show: false }, y: { formatter: (val) => formatCurrency(val) } }
});
</script>