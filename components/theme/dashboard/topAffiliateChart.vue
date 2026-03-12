<template>
  <div class="card shadow-sm border-0 h-100 w-100 overflow-hidden">
    <div class="card-body pb-0">
      <div class="d-flex justify-content-between align-items-start">
        <div>
<<<<<<< HEAD
          <p class="text-muted mb-1 text-uppercase small fw-bold">สินค้าที่แชร์ด้วย Affiliate Link มากที่สุด</p>
          <h4 class="fw-bolder mb-0">{{ totalAffiliateItems }} ชิ้น</h4>
          <small class="text-muted" style="font-size: 10px;">(ยอดขายจากลิงก์ Affiliate ทั้งหมด)</small>
=======
          <p class="text-muted mb-1 text-uppercase small fw-bold">Affiliate Products</p>
          <h4 class="fw-bolder mb-0">{{ totalSoldItems }} ชิ้น</h4>
          <small class="text-muted" style="font-size: 10px;">(ยอดขายสินค้าที่ Affiliate แชร์ลิงก์แล้วขายได้)</small>
>>>>>>> 38adb285b9cac67106233b10cf60793532a02a2b
        </div>
        <Icon name="feather:award" class="text-orange" size="20" />
      </div>
    </div>
    
    <div class="chart-area mt-3">
      <div v-if="chartData.length === 0" class="text-center text-muted small pb-3">
        ยังไม่มีสินค้าในร้าน
      </div>
      <template v-else>
        <!-- 🖼️ แถวรูปภาพสินค้าเรียงตาม bar -->
        <div class="product-images-row">
          <div
            v-for="(item, idx) in chartData"
            :key="idx"
            class="product-img-wrapper"
            :style="{ width: barSlotWidth }"
          >
            <img
              :src="item.image"
              :alt="item.name"
              class="product-thumb"
              :title="item.name"
              @error="onImgError"
            />
            <span class="product-name-label">{{ truncateName(item.name) }}</span>
          </div>
        </div>
        <apexchart type="bar" height="120" :options="chartOptions" :series="series"></apexchart>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useOrderStore } from '~/store/orders';
import { useAuthStore } from '~/store/auth';
import { useProductStore } from '~/store/products';
import { useProductImage } from '~/composables/useProductImage';

const orderStore = useOrderStore();
const authStore = useAuthStore();
const productStore = useProductStore();
const { getProductImage } = useProductImage();

const DEFAULT_IMG = 'https://placehold.co/80?text=No+Image';

onMounted(() => {
    productStore.fetchProducts();
});

// 1. ดึงสินค้าของร้านเรา จาก product store โดยใช้ userId
const myProducts = computed(() => {
    const myId = authStore.user?._id || authStore.user?.id || '';
    if (!myId) return [];
    return (productStore.products || []).filter(p => {
        const pUserId = typeof p.userId === 'object' ? p.userId?._id : p.userId;
        return pUserId === myId;
    });
});

// 2. ดึงเฉพาะออเดอร์ที่มาจาก Affiliate (affiliateCommission > 0)
const myValidOrders = computed(() => {
    const all = orderStore.allOrders || [];
    const myId = authStore.user?._id || authStore.user?.id || '';
    if (!myId) return [];
    return all.filter(order => {
        const sellerId = typeof order.seller === 'object' ? order.seller?._id : order.seller;
        return sellerId === myId
            && order.status !== 'cancelled'
            && order.status !== 'cancel'
            && Number(order.affiliateCommission || 0) > 0;
    });
});

// 3. นับจำนวนขายได้ต่อสินค้า จาก order
const salesCountMap = computed(() => {
    const map = {};
    myValidOrders.value.forEach(order => {
        (order.item || []).forEach(item => {
            const productId = item.productId?._id || item.productId || item._id || '';
            const name = item.name || '';
            const qty = Number(item.qty || item.quantity || 1);
            const key = productId || name;
            if (!key) return;
            if (!map[key]) map[key] = 0;
            map[key] += qty;
        });
    });
    return map;
});

// 4. รวม product store + sales data = chartData (เรียงตามยอดขาย)
const chartData = computed(() => {
    const list = myProducts.value.map(p => {
        const pid = p._id || p.id || '';
        const name = p.name || p.title || 'สินค้าไม่มีชื่อ';
        const sold = salesCountMap.value[pid] || salesCountMap.value[name] || 0;
        const image = getProductImage(p) || DEFAULT_IMG;
        return { name, sold, image, id: pid };
    }).filter(item => item.sold > 0);
    // เรียงจากมากไปน้อย แล้วจำกัดแค่ 10 อันดับ
    return list.sort((a, b) => b.sold - a.sold).slice(0, 10);
});

// 5. ยอดรวมชิ้นทั้งหมดที่จะโชว์ตรงหัวข้อ
const totalSoldItems = computed(() => {
    return chartData.value.reduce((sum, item) => sum + item.sold, 0);
});

// 6. เตรียมข้อมูลส่งให้ ApexCharts
const series = computed(() => [{
    name: 'ขายได้',
    data: chartData.value.map(item => item.sold)
}]);

// คำนวณความกว้างของแต่ละช่อง bar สำหรับจัดวางรูป
const barSlotWidth = computed(() => {
    const count = chartData.value.length;
    if (count === 0) return '0%';
    return (100 / count) + '%';
});

// ตัดชื่อสินค้าให้สั้น
function truncateName(name) {
    if (!name) return '';
    return name.length > 10 ? name.substring(0, 10) + '…' : name;
}

// fallback ถ้ารูปโหลดไม่ได้
function onImgError(e) {
    e.target.src = DEFAULT_IMG;
}

// 7. ตั้งค่ากราฟ bar chart พร้อมแสดง data labels (จำนวนชิ้น) บนแท่ง
const chartOptions = computed(() => ({
    chart: {
        type: 'bar',
        height: 120,
        sparkline: { enabled: true },
        fontFamily: 'Nunito, sans-serif'
    },
    plotOptions: {
        bar: {
            borderRadius: 4,
            columnWidth: '50%',
            distributed: false,
            dataLabels: { position: 'top' }
        }
    },
    dataLabels: {
        enabled: true,
        formatter: (val) => val > 0 ? val + ' ชิ้น' : '',
        offsetY: -16,
        style: { fontSize: '10px', colors: ['#555'], fontWeight: 600 },
        background: { enabled: false }
    },
    colors: ['#ff9f40'],
    tooltip: {
        fixed: { enabled: false },
        x: {
            formatter: function(val, { dataPointIndex }) {
                return chartData.value[dataPointIndex]?.name || '';
            }
        },
        marker: { show: false },
        y: { formatter: (val) => `${val} ชิ้น` }
    },
    grid: { padding: { top: 20, bottom: 10, left: 0, right: 0 } }
}));
</script>

<style scoped>
.product-images-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-around;
  padding: 4px 10px 0 10px;
}

.product-img-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
}

.product-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid #ffe0b2;
  box-shadow: 0 1px 4px rgba(255, 159, 64, 0.15);
  background: #fff;
  transition: transform 0.18s ease;
}

.product-thumb:hover {
  transform: scale(1.18);
  border-color: #ff9f40;
  box-shadow: 0 2px 8px rgba(255, 159, 64, 0.35);
}

.product-name-label {
  font-size: 9px;
  color: #888;
  text-align: center;
  max-width: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}
</style>