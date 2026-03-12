<template>
  <div class="card shadow-sm border-0 h-100 w-100 overflow-hidden">
    <div class="card-body pb-0">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <p class="text-muted mb-1 text-uppercase small fw-bold">สินค้าที่แชร์ด้วย Affiliate Link มากที่สุด</p>
          <h4 class="fw-bolder mb-0">{{ totalAffiliateItems }} ชิ้น</h4>
          <small class="text-muted" style="font-size: 10px;">(ยอดขายจากลิงก์ Affiliate ทั้งหมด)</small>
        </div>
        <Icon name="feather:award" class="text-orange" size="20" />
      </div>
    </div>
    
    <div class="chart-area mt-3">
      <div v-if="series[0].data.length === 0" class="text-center text-muted small pb-3">
        ยังไม่มีข้อมูลการขายผ่าน Affiliate
      </div>
      <apexchart v-else type="bar" height="85" :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useOrderStore } from '~/store/orders';
import { useAuthStore } from '~/store/auth';

const orderStore = useOrderStore();
const authStore = useAuthStore();

// 1. ดึงออเดอร์ของร้านเรา
const myValidOrders = computed(() => {
    const all = orderStore.allOrders || [];
    const myId = authStore.user?._id || authStore.user?.id || '';
    if (!myId) return [];

    return all.filter(order => {
        const sellerId = typeof order.seller === 'object' ? order.seller?._id : order.seller;
        return sellerId === myId && order.status !== 'cancelled' && order.status !== 'cancel';
    });
});

// 2. คำนวณยอดรวมสินค้าและแยกตามชื่อ
const topProductsData = computed(() => {
    const productCounts = {};

    myValidOrders.value.forEach(order => {
        if (!order.affiliate && !(order.affiliateCommission > 0)) return; 

        (order.item || []).forEach(product => {
            const name = product.name || 'สินค้าไม่มีชื่อ';
            const qty = Number(product.qty || product.quantity || 1);
            
            if (!productCounts[name]) {
                productCounts[name] = 0;
            }
            productCounts[name] += qty;
        });
    });

    return Object.entries(productCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);
});

// 3. ยอดรวมชิ้นทั้งหมดที่จะโชว์ตรงหัวข้อ
const totalAffiliateItems = computed(() => {
    return topProductsData.value.reduce((sum, item) => sum + item.count, 0);
});

// 4. เตรียมข้อมูลส่งให้ ApexCharts
const series = computed(() => [{
    name: 'ขายได้',
    data: topProductsData.value.map(item => item.count)
}]);

// 5. ตั้งค่ากราฟให้เป็นแบบ Sparkline ชิดขอบ เหมือน My Revenue
const chartOptions = computed(() => ({
    chart: {
        type: 'bar',
        height: 85,
        sparkline: { enabled: true }, // ✅ เปิดโหมด Sparkline ให้เนียนไปกับกล่อง
        fontFamily: 'Nunito, sans-serif'
    },
    plotOptions: {
        bar: {
            borderRadius: 4,      // มุมมน
            columnWidth: '50%',   // ความอ้วนของแท่ง
            distributed: false    // ใช้สีเดียว
        }
    },
    colors: ['#ff9f40'], // ✅ สีส้มเหมือนฝั่งซ้าย
    tooltip: {
        fixed: { enabled: false },
        x: {
            // ดึงชื่อสินค้ามาโชว์ตอนเอาเมาส์ชี้
            formatter: function(val, { dataPointIndex }) {
                return topProductsData.value[dataPointIndex]?.name || '';
            }
        },
        marker: { show: false },
        y: { formatter: (val) => `${val} ชิ้น` }
    },
    grid: { padding: { top: 10, bottom: 10, left: 0, right: 0 } }
}));
</script>