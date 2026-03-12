<template>
  <div class="card shadow-sm border-0 h-100 w-100">
    <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
      <div>
        <h5 class="fw-bold mb-0">กราฟแสดงยอดขายรายเดือน 📊</h5>
       
      </div>
      <div class="dropdown">
        <button class="btn btn-light btn-sm dropdown-toggle rounded-pill px-3 shadow-sm" type="button" data-bs-toggle="dropdown">
          ปี: {{ selectedYear }}
        </button>
        <ul class="dropdown-menu dropdown-menu-end">
          <li v-for="year in availableYears" :key="year">
            <a class="dropdown-item" href="#" @click.prevent="selectedYear = year">{{ year }}</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="card-body pt-0">
      <div class="market-chart-container">
        <apexchart v-if="hasData" type="bar" height="320" :options="chartOptions" :series="series"></apexchart>
        <div v-else class="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
           <Icon name="feather:bar-chart-2" size="40" class="mb-2 opacity-50"/>
           <span>ไม่มีข้อมูลยอดขายในปี {{ selectedYear }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useOrderStore } from '~/store/orders';
import { useAuthStore } from '~/store/auth';

const orderStore = useOrderStore();
const authStore = useAuthStore();
const selectedYear = ref(new Date().getFullYear());

// กรองเฉพาะออเดอร์ของร้านเรา
const myOrders = computed(() => {
    const all = orderStore.allOrders || []
    const myId = authStore.user?._id || authStore.user?.id || ''
    
    if (!myId) return []

    return all.filter(order => {
        const sellerId = typeof order.seller === 'object' ? order.seller?._id : order.seller
        return sellerId === myId
    })
})

// หาปีที่มีข้อมูลจาก myOrders
const availableYears = computed(() => {
  const years = new Set();
  const currentYear = new Date().getFullYear();
  years.add(currentYear);
  years.add(2026);

  myOrders.value.forEach(o => {
    const d = new Date(o.createdAt || o.date);
    if (!isNaN(d.getTime())) years.add(d.getFullYear());
  });
  
  return Array.from(years).sort((a, b) => b - a);
});

// Auto Select ปีล่าสุด
watch(availableYears, (years) => {
    if (years.length > 0) selectedYear.value = years[0];
}, { immediate: true });

// คำนวณยอดขายรายเดือน
const monthlyData = computed(() => {
  const months = Array(12).fill(0);
  const orders = myOrders.value;

  orders.forEach(order => {
    const d = new Date(order.createdAt || order.date);
    if (isNaN(d.getTime())) return;

    if (d.getFullYear() === selectedYear.value) {
      const status = (order.status || '').toLowerCase();
      if (['cancelled', 'cancel', 'return_requested'].includes(status)) return;
      
      months[d.getMonth()] += Number(order.total || 0);
    }
  });
  return months;
});

const hasData = computed(() => monthlyData.value.some(v => v > 0));
const series = computed(() => [{ name: "Revenue", data: monthlyData.value }]);

// 🟠 ตั้งค่ากราฟเป็นสีส้ม 🟠
const chartOptions = ref({
  chart: { type: "bar", height: 320, toolbar: { show: false }, fontFamily: 'Nunito, sans-serif' },
  colors: ["#ff9f40"], // ✅ เปลี่ยนรหัสสีที่นี่เป็นสีส้ม
  plotOptions: { 
    bar: { 
      borderRadius: 4, 
      columnWidth: "50%", 
      distributed: false // ✅ ปิด distributed เพื่อให้สีเหมือนกันทุกแท่ง (ดูสะอาดตาขึ้น)
    } 
  },
  dataLabels: { enabled: false },
  xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { formatter: (val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val } },
  tooltip: { y: { formatter: (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val) } },
  legend: { show: false }
});
</script>

<style scoped> 
.market-chart-container { min-height: 320px; } 
</style>