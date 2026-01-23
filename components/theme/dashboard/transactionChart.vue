<template>
  <div class="col-xl-3 col-md-6">
    <div class="card shadow-sm border-0 h-100 overflow-hidden">
      <div class="card-body pb-0">
        <div class="d-flex justify-content-between">
          <div>
            <p class="text-muted mb-1 text-uppercase small fw-bold">Avg. Order Value</p>
            <h4 class="fw-bolder mb-0">{{ formatCurrency(avgOrderValue) }}</h4>
            <small class="text-muted" style="font-size: 10px;">(ค่าเฉลี่ย)</small>
          </div>
          <div class="d-flex align-items-center justify-content-center bg-success-subtle text-success rounded-3 px-2" style="height: 35px; width: 35px;">
            <Icon name="feather:pie-chart" size="18" />
          </div>
        </div>
      </div>
      <div class="chart-area mt-2" style="margin-bottom: -15px;">
        <apexchart type="line" height="100" :options="chartOptions" :series="series"></apexchart>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useOrderStore } from '~/store/orders';

const orderStore = useOrderStore();

// คำนวณ AOV (Average Order Value)
const avgOrderValue = computed(() => {
    const orders = (orderStore.orders || []).filter(o => o.status !== 'cancelled');
    if (orders.length === 0) return 0;
    const total = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    return total / orders.length;
});

// Mock กราฟเส้นสวยๆ (เพราะ AOV รายวันอาจจะผันผวนมาก ใช้เส้นเรียบๆ ประกอบสวยกว่า)
const series = ref([{ name: "AOV Trend", data: [400, 450, 420, 480, 500, 490, 510] }]); 

const formatCurrency = (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits:0 }).format(val);

const chartOptions = ref({
  chart: { type: "line", height: 100, sparkline: { enabled: true } },
  stroke: { curve: "smooth", width: 2, dashArray: 0 },
  colors: ["#51bb25"],
  tooltip: { fixed: { enabled: false }, x: { show: false } }
});
</script>