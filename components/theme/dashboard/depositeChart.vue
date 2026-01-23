<template>
  <div class="col-xl-3 col-md-6">
    <div class="card shadow-sm border-0 h-100 overflow-hidden">
      <div class="card-body pb-0">
        <div class="d-flex justify-content-between">
          <div>
            <p class="text-muted mb-1 text-uppercase small fw-bold">Net Income</p>
            <h4 class="fw-bolder mb-0 text-success">{{ formatCurrency(netIncome) }}</h4>
             <small class="text-muted" style="font-size: 10px;">(หัก Cancel แล้ว)</small>
          </div>
          <div class="d-flex align-items-center justify-content-center bg-warning-subtle text-warning rounded-3 px-2" style="height: 35px; width: 35px;">
            <Icon name="feather:credit-card" size="18" />
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

const orderStore = useOrderStore();

const netIncome = computed(() => {
    return (orderStore.orders || [])
        .filter(o => o.status === 'completed' || o.status === 'shipped') // นับเฉพาะที่ชัวร์ๆ
        .reduce((sum, o) => sum + (o.total || 0), 0);
});

// สร้าง Data จำลองจากยอดจริง (กระจายให้ดูสวย)
const series = computed(() => [{ name: "Income", data: [netIncome.value * 0.1, netIncome.value * 0.2, netIncome.value * 0.15, netIncome.value * 0.3, netIncome.value * 0.25] }]);

const formatCurrency = (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', maximumFractionDigits:0 }).format(val);

const chartOptions = ref({
  chart: { type: "bar", height: 100, sparkline: { enabled: true } },
  colors: ["#f73164"],
  plotOptions: { bar: { borderRadius: 3, columnWidth: '50%' } },
  tooltip: { fixed: { enabled: false }, x: { show: false } }
});
</script>