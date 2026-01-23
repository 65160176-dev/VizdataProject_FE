<template>
  <div class="col-xl-6 col-md-6">
    <div class="card shadow-sm border-0 h-100 overflow-hidden">
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
      <div class="chart-area mt-2" style="margin-bottom: -15px;">
        <apexchart type="bar" height="100" :options="chartOptions" :series="series"></apexchart>
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

// 2. นับจำนวนออเดอร์ 7 วัน (Auto-detect Date)
const last7DaysCount = computed(() => {
  const data = Array(7).fill(0);
  const orders = myOrders.value; // ใช้ myOrders
  
  if (orders.length === 0) return data;

  // หา "วันที่ล่าสุด"
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
       data[index] += 1; // นับ +1
    }
  });
  return data;
});

const totalOrders7Days = computed(() => last7DaysCount.value.reduce((a,b)=>a+b, 0));
const series = computed(() => [{ name: "Orders", data: last7DaysCount.value }]);

const chartOptions = ref({
  chart: { type: "bar", height: 100, sparkline: { enabled: true }, fontFamily: 'Nunito, sans-serif' },
  colors: ["#544fff"], // สีน้ำเงินเข้ม
  plotOptions: { bar: { borderRadius: 3, columnWidth: '60%', distributed: false } },
  tooltip: { 
      fixed: { enabled: false }, 
      x: { show: false }, 
      marker: { show: false },
      y: { formatter: (val) => `${val} Orders` }
  }
});
</script>