<template>
  <div class="col-xl-6 xl-100">
    <div class="card shadow-sm border-0 h-100">
      <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
        <div>
          <h5 class="fw-bold mb-0">Monthly Revenue 📊</h5>
          <small class="text-muted">ยอดขายปี {{ selectedYear }}</small>
        </div>
        <div class="dropdown">
          <button class="btn btn-light btn-sm dropdown-toggle rounded-pill px-3 shadow-sm" type="button" data-bs-toggle="dropdown">
            Year: {{ selectedYear }}
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
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useOrderStore } from '~/store/orders';

const orderStore = useOrderStore();
const selectedYear = ref(2026); // เริ่มต้นปี 2026 ตามข้อมูลคุณ

// หาปีทั้งหมดที่มีใน Order
const availableYears = computed(() => {
  const years = new Set([2026, new Date().getFullYear()]);
  (orderStore.allOrders || []).forEach(o => {
    const d = new Date(o.createdAt || o.date);
    if (!isNaN(d.getTime())) years.add(d.getFullYear());
  });
  return Array.from(years).sort((a, b) => b - a);
});

// คำนวณยอดขายรายเดือน
const monthlyData = computed(() => {
  const months = Array(12).fill(0);
  const orders = orderStore.allOrders || [];

  orders.forEach(order => {
    const d = new Date(order.createdAt || order.date);
    if (isNaN(d.getTime())) return;

    if (d.getFullYear() === selectedYear.value) {
      const status = (order.status || '').toLowerCase();
      if (status === 'cancelled' || status === 'cancel') return;
      months[d.getMonth()] += Number(order.total || 0);
    }
  });
  return months;
});

const hasData = computed(() => monthlyData.value.some(v => v > 0));
const series = computed(() => [{ name: "Revenue", data: monthlyData.value }]);

const chartOptions = ref({
  chart: { type: "bar", height: 320, toolbar: { show: false }, fontFamily: 'Nunito, sans-serif' },
  colors: ["#7366ff"],
  plotOptions: { bar: { borderRadius: 4, columnWidth: "50%", distributed: true } },
  dataLabels: { enabled: false },
  xaxis: { categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], axisBorder: { show: false }, axisTicks: { show: false } },
  yaxis: { labels: { formatter: (val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val } },
  tooltip: { y: { formatter: (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val) } },
  legend: { show: false },
  colors: ['#7366ff', '#51bb25', '#f73164', '#ff9f40', '#544fff', '#7366ff', '#51bb25', '#f73164', '#ff9f40', '#544fff', '#7366ff', '#51bb25']
});
</script>
<style scoped> .market-chart-container { min-height: 320px; } </style>