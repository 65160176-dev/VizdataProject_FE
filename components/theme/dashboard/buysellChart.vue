<template>
  <div class="card shadow-sm border-0 h-100 w-100">
    <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
      <div>
         <h5 class="fw-bold mb-0">เปรียบเทียบยอดขายกับยกเลิก 📉</h5>
      </div>
    </div>
    <div class="card-body">
      <!-- ช่วงเวลา -->
      <div class="d-flex flex-wrap gap-1 mb-3">
        <button
          v-for="d in dayOptions"
          :key="d"
          class="btn btn-period"
          :class="{ active: selectedDays === d }"
          @click="selectedDays = d"
        >{{ d }} วัน</button>
      </div>
      <div class="chart-container">
          <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
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

const dayOptions = [7, 14, 30, 45, 60];
const selectedDays = ref(7);

// --- 2. กรองเฉพาะออเดอร์ของร้านเรา (My Orders) ---
const myOrders = computed(() => {
    const all = orderStore.allOrders || []
    const myId = authStore.user?._id || authStore.user?.id || ''
    
    if (!myId) return []

    return all.filter(order => {
        const sellerId = typeof order.seller === 'object' ? order.seller?._id : order.seller
        return sellerId === myId
    })
})

// --- 3. คำนวณยอดเงินตามช่วงเวลาที่เลือก ---
const chartData = computed(() => {
  const days = selectedDays.value;
  const successData = Array(days).fill(0);
  const cancelData = Array(days).fill(0);
  const categories = []; 
  
  const orders = myOrders.value;

  const defaultCats = Array.from({ length: days }, (_, i) => `D${i + 1}`);
  if (orders.length === 0) return { successData, cancelData, categories: defaultCats };

  const dates = orders.map(o => new Date(o.createdAt || o.date).getTime()).filter(d => !isNaN(d));
  if (dates.length === 0) return { successData, cancelData, categories };
  
  const maxDate = new Date(Math.max(...dates));
  maxDate.setHours(23, 59, 59, 999); 

  const tempDate = new Date(maxDate);
  for (let i = 0; i < days; i++) {
      categories.unshift(tempDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })); 
      tempDate.setDate(tempDate.getDate() - 1);
  }

  orders.forEach(order => {
    const d = new Date(order.createdAt || order.date);
    if (isNaN(d.getTime())) return;

    const diffTime = maxDate - d;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < days) {
       const index = (days - 1) - diffDays; 
       const amount = Number(order.total || 0);
       const status = (order.status || '').toLowerCase();

       if (['cancelled', 'cancel', 'cancel requested', 'return_requested'].includes(status)) {
           cancelData[index] += amount;
       } else {
           successData[index] += amount;
       }
    }
  });

  return { successData, cancelData, categories };
});

const series = computed(() => [
  { name: "Income (ยอดขาย)", data: chartData.value.successData },
  { name: "Lost (ยอดที่ถูกยกเลิก)", data: chartData.value.cancelData },
]);

const formatCurrency = (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val);

const chartOptions = computed(() => ({
  chart: { 
      height: 350, 
      type: "bar", 
      toolbar: { show: false }, 
      fontFamily: 'Nunito, sans-serif' 
  },
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%', 
      borderRadius: 4,    
      endingShape: 'rounded'
    },
  },
  // ✅ เปลี่ยนสีแรก (Income) เป็นสีส้ม, สีสอง (Lost) เป็นสีแดงเหมือนเดิม
  colors: ["#ff9f40", "#f73164"], 
  dataLabels: { enabled: false },
  stroke: { 
      show: true, 
      width: 2, 
      colors: ['transparent'] 
  },
  xaxis: {
    categories: chartData.value.categories,
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
      labels: { formatter: (val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val }
  },
  fill: { 
      opacity: 1 
  },
  grid: { borderColor: '#f1f1f1' },
  tooltip: { 
      y: { formatter: (val) => formatCurrency(val) } 
  },
  legend: { position: 'top' }
}));
</script>

<style scoped>
.chart-container { min-height: 350px; }

.btn-period {
  font-size: 11px;
  padding: 2px 10px;
  border-radius: 20px;
  border: 1.5px solid #ffcc80;
  background: #fff8ee;
  color: #e65100;
  font-weight: 600;
  transition: background 0.15s, color 0.15s;
  cursor: pointer;
}

.btn-period:hover {
  background: #ffe0b2;
}

.btn-period.active {
  background: #ff9f40;
  color: #fff;
  border-color: #ff9f40;
}
</style>