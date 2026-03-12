<template>
  <div class="card shadow-sm border-0 h-100 w-100">
    <div class="card-header bg-transparent border-0 pb-0">
      <h5 class="fw-bold">สินค้าขายดีสุดในร้าน 🏆</h5>
      <small class="text-muted">สินค้าที่มียอดขายสูงสุดของร้านคุณ</small>
    </div>
    <div class="card-body">
      <div class="row align-items-center h-100">
        <div class="col-xl-6 col-lg-6 d-flex justify-content-center">
           <apexchart v-if="series.length > 0" type="donut" width="380" :options="chartOptions" :series="series"></apexchart>
           <div v-else class="text-center py-5 text-muted opacity-50">
              <Icon name="feather:package" size="40" class="mb-2"/>
              <p>ยังไม่มีข้อมูลการขายสินค้า</p>
           </div>
        </div>
        <div class="col-xl-6 col-lg-6">
          <div class="sales-legend mt-4 mt-lg-0" style="max-height: 300px; overflow-y: auto;">
             <div v-for="(count, idx) in series" :key="idx" class="d-flex align-items-center justify-content-between mb-3 p-3 rounded-3 bg-light">
                <div class="d-flex align-items-center" style="max-width: 70%;">
                   <span class="dot me-3 flex-shrink-0" :style="{ backgroundColor: getChartColor(idx) }"></span>
                   <h6 class="mb-0 fw-bold text-truncate">{{ chartOptions.labels[idx] }}</h6>
                </div>
                <div class="text-end">
                   <span class="badge bg-white text-dark shadow-sm">{{ count }} ชิ้น</span>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useOrderStore } from '~/store/orders';
import { useAuthStore } from '~/store/auth'; // ✅ 1. เรียก Auth เพื่อแยกร้าน

const orderStore = useOrderStore();
const authStore = useAuthStore();

// สีของกราฟ (เตรียมไว้หลายๆ สี)
const colors = ["#7366ff", "#f73164", "#51bb25", "#ff9f40", "#544fff", "#6362e7", "#ffc107", "#e91e63"];
const getChartColor = (idx) => colors[idx % colors.length];

// 2. กรองเฉพาะออเดอร์ของร้านเรา
const myOrders = computed(() => {
    const all = orderStore.allOrders || []
    const myId = authStore.user?._id || authStore.user?.id || ''
    
    if (!myId) return []

    return all.filter(order => {
        const sellerId = typeof order.seller === 'object' ? order.seller?._id : order.seller
        return sellerId === myId
    })
})

// 3. Logic นับยอดขายสินค้าแต่ละตัว
const productData = computed(() => {
    const stats = {};
    
    myOrders.value.forEach(order => {
        // ไม่นับออเดอร์ที่ยกเลิก
        if (['cancelled', 'cancel'].includes((order.status || '').toLowerCase())) return;

        // วนลูปสินค้าในแต่ละออเดอร์
        const items = order.item || order.items || [];
        items.forEach(item => {
            const name = item.name || 'Unknown Product';
            const qty = Number(item.qty || item.quantity || 1); // ถ้าไม่มี qty ให้นับเป็น 1
            
            if (!stats[name]) stats[name] = 0;
            stats[name] += qty;
        });
    });

    // แปลง Object เป็น Array แล้วเรียงลำดับจาก มาก -> น้อย
    const sorted = Object.entries(stats)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5); // เอาแค่ Top 5 (ถ้าอยากได้หมดให้ลบ .slice ออก)

    return {
        labels: sorted.map(([name]) => name),
        series: sorted.map(([, qty]) => qty)
    };
});

const series = computed(() => productData.value.series);

const chartOptions = computed(() => ({
  chart: { type: "donut", fontFamily: 'Nunito, sans-serif' },
  labels: productData.value.labels,
  colors: colors,
  dataLabels: { enabled: false },
  legend: { show: false }, // เราทำ Legend เองสวยกว่า
  plotOptions: {
    pie: {
      donut: {
        size: "75%",
        labels: {
          show: true,
          total: {
            show: true,
            showAlways: true,
            label: 'Total Sold',
            fontSize: '16px',
            fontWeight: 600,
            color: '#373d3f',
            formatter: function (w) {
              return w.globals.seriesTotals.reduce((a, b) => a + b, 0) + " Pcs"
            }
          }
        }
      }
    }
  },
  tooltip: {
      y: { formatter: (val) => `${val} ชิ้น` }
  }
}));
</script>

<style scoped>
.dot { width: 12px; height: 12px; border-radius: 50%; display: block; }
.text-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
</style>