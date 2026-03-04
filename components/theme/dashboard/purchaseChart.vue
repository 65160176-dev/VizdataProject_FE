<template>
  <div class="card shadow-sm border-0 h-100 w-100 overflow-hidden">
    <div class="card-body pb-0">
      <div class="d-flex justify-content-between">
        <div>
          <p class="text-muted mb-1 text-uppercase small fw-bold">My Orders Volume</p>
          <h4 class="fw-bolder mb-0">{{ totalOrders7Days }} Order(s)</h4>
          <small class="text-muted" style="font-size: 10px;">(7 วันล่าสุด)</small>
        </div>
        <div class="d-flex align-items-center justify-content-center bg-secondary-subtle text-secondary rounded-3 px-2" style="height: 35px; width: 35px;">
          <Icon name="feather:shopping-bag" size="18" />
        </div>
      </div>
    </div>
    <div class="chart-area mt-3">
      <apexchart type="bar" height="85" :options="chartOptions" :series="series"></apexchart>
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

// 2. คำนวณจำนวนออเดอร์ 7 วัน
const last7DaysCount = computed(() => {
  const data = Array(7).fill(0);
  const orders = myOrders.value;
  
  if (orders.length === 0) return data;

  const dates = orders.map(o => new Date(o.createdAt || o.date).getTime()).filter(d => !isNaN(d));
  if (dates.length === 0) return data;
  const maxDate = new Date(Math.max(...dates));
  maxDate.setHours(23, 59, 59, 999);

  orders.forEach(order => {
    const d = new Date(order.createdAt || order.date);
    if (isNaN(d.getTime())) return;
    
    const diffTime = maxDate - d;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < 7) {
       const index = 6 - diffDays;
       data[index] += 1;
    }
  });
  return data;
});

const totalOrders7Days = computed(() => last7DaysCount.value.reduce((a,b)=>a+b, 0));
const series = computed(() => [{ name: "Orders", data: last7DaysCount.value }]);

// ตั้งค่ากราฟ
const chartOptions = ref({
  chart: { type: "bar", height: 85, sparkline: { enabled: true }, fontFamily: 'Nunito, sans-serif' },
  colors: ["#ff9f40"], // ✅ เปลี่ยนเป็นสีส้ม
  plotOptions: { bar: { borderRadius: 3, columnWidth: '60%', distributed: false } },
  tooltip: { 
      fixed: { enabled: false }, 
      x: { show: false }, 
      marker: { show: false },
      y: { formatter: (val) => `${val} Orders` }
  },
  grid: { padding: { top: 10, bottom: 10, left: 0, right: 0 } }
});
</script>