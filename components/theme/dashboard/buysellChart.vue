<template>
  <div class="col-sm-12">
    <div class="card shadow-sm border-0">
      <div class="card-header bg-transparent border-0 d-flex justify-content-between align-items-center">
        <div>
           <h5 class="fw-bold mb-0">Income vs Cancellation 📉</h5>
           <small class="text-muted">เปรียบเทียบมูลค่าที่ขายได้ (Income) กับ ที่ถูกยกเลิก (Lost) ใน 7 วันล่าสุด</small>
        </div>
      </div>
      <div class="card-body">
        <div class="chart-container">
            <apexchart type="area" height="350" :options="chartOptions" :series="series"></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useOrderStore } from '~/store/orders';
import { useAuthStore } from '~/store/auth'; // ✅ 1. เรียก Auth Store เพื่อแยกร้าน

const orderStore = useOrderStore();
const authStore = useAuthStore();

// --- 2. กรองเฉพาะออเดอร์ของร้านเรา (My Orders) ---
const myOrders = computed(() => {
    const all = orderStore.allOrders || []
    const myId = authStore.user?._id || authStore.user?.id || ''
    
    if (!myId) return []

    return all.filter(order => {
        // รองรับทั้งแบบที่ seller เป็น String หรือ Object
        const sellerId = typeof order.seller === 'object' ? order.seller?._id : order.seller
        return sellerId === myId
    })
})

// --- 3. คำนวณยอดเงิน 7 วันย้อนหลัง (Auto-detect Date) ---
const chartData = computed(() => {
  const successData = Array(7).fill(0);
  const cancelData = Array(7).fill(0);
  const categories = []; // เก็บชื่อวัน (Mon, Tue)
  
  const orders = myOrders.value;

  if (orders.length === 0) return { successData, cancelData, categories: ['D1','D2','D3','D4','D5','D6','D7'] };

  // หา "วันที่ล่าสุด" ที่มีออเดอร์ในระบบ (เพื่อแก้ปัญหาปี 2026)
  const dates = orders.map(o => new Date(o.createdAt || o.date).getTime()).filter(d => !isNaN(d));
  if (dates.length === 0) return { successData, cancelData, categories };
  
  const maxDate = new Date(Math.max(...dates));
  maxDate.setHours(23, 59, 59, 999); // จบวันที่ล่าสุด

  // สร้าง Label แกน X ย้อนหลัง 7 วันจากวันล่าสุด
  const tempDate = new Date(maxDate);
  for (let i = 0; i < 7; i++) {
      categories.unshift(tempDate.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })); // e.g., "Mon 20"
      tempDate.setDate(tempDate.getDate() - 1);
  }

  // วนลูปออเดอร์เพื่อหยอดลงถัง 7 วัน
  orders.forEach(order => {
    const d = new Date(order.createdAt || order.date);
    if (isNaN(d.getTime())) return;

    // คำนวณระยะห่างจากวันล่าสุด
    const diffTime = maxDate - d;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 0 && diffDays < 7) {
       const index = 6 - diffDays; // index 6 = วันล่าสุด
       const amount = Number(order.total || 0);
       const status = (order.status || '').toLowerCase();

       // กลุ่มยอดเสีย (Cancelled)
       if (['cancelled', 'cancel', 'cancel requested', 'return_requested'].includes(status)) {
           cancelData[index] += amount;
       } 
       // กลุ่มยอดได้ (Completed/Shipped/Pending)
       // นับ Pending เป็น Income ไว้ก่อน (หรือจะกรองออกก็ได้ถ้าอยากได้แค่ Completed)
       else {
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
      type: "area", 
      toolbar: { show: false }, 
      fontFamily: 'Nunito, sans-serif' 
  },
  colors: ["#51bb25", "#f73164"], // สีเขียว (ได้) vs สีแดง (เสีย)
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 2 },
  xaxis: {
    categories: chartData.value.categories,
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
      labels: { formatter: (val) => val >= 1000 ? `${(val/1000).toFixed(1)}k` : val }
  },
  fill: { 
      type: "gradient", 
      gradient: { shadeIntensity: 1, opacityFrom: 0.5, opacityTo: 0.05, stops: [0, 100] } 
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