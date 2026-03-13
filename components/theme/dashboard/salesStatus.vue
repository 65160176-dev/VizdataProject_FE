<template>
  <div class="card shadow-sm border-0 h-100 w-100">
    <div class="card-header bg-transparent border-0 pb-0">
      <h5 class="fw-bold">สินค้าขายดีสุดในร้าน 🏆</h5>
      <small class="text-muted">สินค้าที่มียอดขายสูงสุดของร้านคุณ</small>
      <!-- ช่วงเวลา -->
      <div class="d-flex flex-wrap gap-1 mt-2">
        <button
          v-for="d in dayOptions"
          :key="d"
          class="btn btn-period"
          :class="{ active: selectedDays === d }"
          @click="selectedDays = d"
        >{{ d }} วัน</button>
      </div>
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
                <div class="d-flex align-items-center gap-2" style="max-width: 75%;">
                   <span class="dot flex-shrink-0" :style="{ backgroundColor: getChartColor(idx) }"></span>
                   <img
                     v-if="resolveImage(productImages[idx])"
                     :src="resolveImage(productImages[idx])"
                     alt="product"
                     class="product-thumb flex-shrink-0"
                   />
                   <div v-else class="product-thumb-placeholder flex-shrink-0">
                     <Icon name="feather:image" size="16" class="text-muted" />
                   </div>
                   <h6 class="mb-0 fw-bold text-truncate">{{ chartOptions.labels[idx] }}</h6>
                </div>
                <div class="text-end flex-shrink-0">
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
import { computed, ref } from "vue";
import { useOrderStore } from '~/store/orders';
import { useAuthStore } from '~/store/auth'; // ✅ 1. เรียก Auth เพื่อแยกร้าน

const orderStore = useOrderStore();
const authStore = useAuthStore();

const dayOptions = [7, 14, 30, 45, 60, 90];
const selectedDays = ref(30);

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

// 3. Logic นับยอดขายสินค้าแต่ละตัว (กรองตามช่วงเวลา)
const productData = computed(() => {
    const stats = {};
    const cutoffTs = Date.now() - selectedDays.value * 86400000;
    
    myOrders.value.forEach(order => {
        // นับเฉพาะออเดอร์ที่เสร็จสิ้น (ลูกค้ากดรับสินค้าแล้ว)
        if ((order.status || '').toLowerCase() !== 'completed') return;
        // กรองตามช่วงเวลา
        if (order.createdAt && new Date(order.createdAt).getTime() < cutoffTs) return;

        // วนลูปสินค้าในแต่ละออเดอร์
        const items = order.item || order.items || [];
        items.forEach(item => {
            const name = item.name || 'Unknown Product';
            const qty = Number(item.qty || item.quantity || 1); // ถ้าไม่มี qty ให้นับเป็น 1
            
            if (!stats[name]) stats[name] = { qty: 0, image: item.image || null };
            stats[name].qty += qty;
            if (!stats[name].image && item.image) stats[name].image = item.image;
        });
    });

    // แปลง Object เป็น Array แล้วเรียงลำดับจาก มาก -> น้อย
    const sorted = Object.entries(stats)
        .sort(([, a], [, b]) => b.qty - a.qty)
        .slice(0, 5); // เอาแค่ Top 5

    return {
        labels: sorted.map(([name]) => name),
        series: sorted.map(([, data]) => data.qty),
        images: sorted.map(([, data]) => data.image)
    };
});

const series = computed(() => productData.value.series);
const productImages = computed(() => productData.value.images || []);

const resolveImage = (url) => {
  if (!url) return null;
  if (url.startsWith('data:')) return null;
  if (url.startsWith('http')) return url;
  if (url.startsWith('/')) return `https://vizdataprojectbe-production.up.railway.app${url}`;
  return `https://vizdataprojectbe-production.up.railway.app/${url}`;
};

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

.dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
.text-truncate { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.product-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}
.product-thumb-placeholder {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px dashed #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
}
</style>