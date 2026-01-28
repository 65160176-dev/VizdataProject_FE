<template>
  <div class="h-100">
    <div class="card shadow-sm border-0 h-100">
      <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
        <div>
           <h5 class="fw-bold mb-0">Income vs Cancellation 📉</h5>
           <small class="text-muted">เปรียบเทียบมูลค่าที่ขายได้ (Income) กับ ที่ถูกยกเลิก (Lost) ใน 7 วันล่าสุด</small>
        </div>
      </div>
      <div class="card-body">
        <div class="chart-container">
            <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
        </div>
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

// --- 3. คำนวณยอดเงิน 7 วันย้อนหลัง ---
const chartData = computed(() => {
  const successData = Array(7).fill(0);
  const cancelData = Array(7).fill(0);
  const categories = []; 
  
  const orders = myOrders.value;

  if (orders.length === 0) return { successData, cancelData, categories: ['D1','D2','D3','D4','D5','D6','D7'] };

  const dates = orders.map(o => new Date(o.createdAt || o.date).getTime()).filter(d => !isNaN(d));
  if (dates.length === 0) return { successData, cancelData, categories };
  
  const maxDate = new Date(Math.max(...dates));
  maxDate.setHours(23, 59, 59, 999); 

  const tempDate = new Date(maxDate);
  for (let i = 0; i < 7; i++) {
      categories.unshift(tempDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })); 
      tempDate.setDate(tempDate.getDate() - 1);
  }

  orders.forEach(order => {
    const d = new Date(order.createdAt || order.date);
    if (isNaN(d.getTime())) return;

    const diffTime = maxDate - d;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < 7) {
       const index = 6 - diffDays; 
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
      type: "bar", // เปลี่ยนเป็น bar
      toolbar: { show: false }, 
      fontFamily: 'Nunito, sans-serif' 
  },
  // เพิ่มการตั้งค่าสำหรับกราฟแท่ง
  plotOptions: {
    bar: {
      horizontal: false,
      columnWidth: '55%', // ความกว้างของแท่ง
      borderRadius: 4,    // มุมมน
      endingShape: 'rounded'
    },
  },
  colors: ["#51bb25", "#f73164"], 
  dataLabels: { enabled: false },
  stroke: { 
      show: true, 
      width: 2, 
      colors: ['transparent'] // เว้นระยะห่างระหว่างแท่งนิดหน่อย
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
      opacity: 1 // ใช้สีทึบเพื่อให้ดูแน่นขึ้นสำหรับกราฟแท่ง
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
</style>