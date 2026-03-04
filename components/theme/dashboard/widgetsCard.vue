<template>
  <div class="row g-3 mb-4">
    <div class="col-xl-3 col-md-6" title="รายได้เฉพาะรายการที่สำเร็จแล้ว">
      <div
        class="card widget-card bg-theme-orange text-white h-100"
        style="
          cursor: default;
          transform: none;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        "
      >
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-2 opacity-90">My Earnings</h6>
              <h3 class="fw-bold mb-0">{{ formatCurrency(totalEarnings) }}</h3>
            </div>
            <div class="bg-white-glass p-3 rounded-circle">
              <Icon name="feather:dollar-sign" size="24" />
            </div>
          </div>
          <small class="mt-3 d-block opacity-90">
            รายได้ทั้งหมด (เฉพาะสำเร็จ)
          </small>
        </div>
      </div>
    </div>

    <div
      class="col-xl-3 col-md-6"
      @click="goToProducts"
      style="cursor: pointer"
      title="จัดการสินค้า"
    >
      <div class="card widget-card bg-theme-dark text-white h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-2 opacity-90">My Products</h6>
              <h3 class="fw-bold mb-0">{{ totalProducts }}</h3>
            </div>
            <div class="bg-white-glass p-3 rounded-circle">
              <Icon name="feather:box" size="24" />
            </div>
          </div>
          <small class="mt-3 d-block opacity-90"
            >สินค้าในร้านของคุณ <Icon name="feather:chevron-right" size="14"
          /></small>
        </div>
      </div>
    </div>

    <div
      class="col-xl-3 col-md-6"
      @click="goToOrders('preparing')"
      style="cursor: pointer"
      title="ดูรายการที่ต้องเตรียม"
    >
      <div class="card widget-card bg-theme-amber text-white h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-2 opacity-90 fw-bold">Preparing Orders</h6>
              <h3 class="fw-bold mb-0">{{ pendingCount }}</h3>
            </div>
            <div class="bg-white-glass p-3 rounded-circle shadow-sm">
              <Icon name="feather:clock" size="24" />
            </div>
          </div>
          <small class="mt-3 d-block fw-bold opacity-90"
            >กำลังเตรียม <Icon name="feather:chevron-right" size="14"
          /></small>
        </div>
      </div>
    </div>

    <div class="col-xl-3 col-md-6">
      <div class="card widget-card bg-theme-coral text-white h-100">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <h6 class="mb-2 opacity-90 fw-bold">Total Orders</h6>
              <h3 class="fw-bold mb-0">{{ allOrdersCount }}</h3>
            </div>
            <div class="bg-white-glass p-3 rounded-circle shadow-sm">
              <Icon name="feather:shopping-bag" size="24" />
            </div>
          </div>
          <small class="mt-3 d-block opacity-90"
            >คำสั่งซื้อทั้งหมดของร้าน</small
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useOrderStore } from "~/store/orders";
import { useProductStore } from "~/store/products";
import { useAuthStore } from "~/store/auth";
import { navigateTo } from "#app";

const orderStore = useOrderStore();
const productStore = useProductStore();
const authStore = useAuthStore();

// --- โหลดข้อมูลจาก API เมื่อหน้าเว็บเปิดขึ้นมา ---
onMounted(async () => {
  if (orderStore.allOrders.length === 0) {
    await orderStore.fetchOrders();
  }
  if (productStore.products.length === 0) {
    await productStore.fetchProducts();
  }
});

const goToProducts = () => {
  navigateTo("/SellerPage/productPage");
};
const goToOrders = (tabName) => {
  navigateTo({ path: "/SellerPage/orderStatus", query: { status: tabName } });
};

// 1. กรองออเดอร์เฉพาะของร้านเรา
const myOrders = computed(() => {
  const all = orderStore.allOrders || [];
  const myId = String(authStore.user?._id || authStore.user?.id || "");
  if (!myId) return [];

  return all.filter((order) => String(order.seller) === myId);
});

// 2. Helper คำนวณรายได้ (ดึงจาก sellerEarnings หรือคำนวณสดถ้าไม่มีฟิลด์)
const calculateSellerEarnings = (order) => {
  if (order.sellerEarnings && Number(order.sellerEarnings) > 0) {
    return Number(order.sellerEarnings);
  }
  const items = order.item || order.items || [];
  return items.reduce((sum, i) => sum + Number(i.price) * Number(i.qty), 0);
};

// 3. รายได้ที่สำเร็จแล้ว (เช็คสถานะ 'completed')
const earningsSuccess = computed(() => {
  const orders = myOrders.value.filter(
    (o) => (o.status || "").toLowerCase() === "completed",
  );
  return orders.reduce((sum, o) => sum + calculateSellerEarnings(o), 0);
});

const totalEarnings = computed(() => earningsSuccess.value);

// สถิติอื่นๆ
const myProducts = computed(() => {
  const all = productStore.products || [];
  const myId = String(authStore.user?._id || authStore.user?.id || "");
  return all.filter((p) => {
    const ownerId = typeof p.userId === "object" ? p.userId?._id : p.userId;
    return String(ownerId) === myId;
  });
});

const totalProducts = computed(() => myProducts.value.length);
const pendingCount = computed(
  () =>
    myOrders.value.filter((o) =>
      ["pending", "preparing", "cancel requested", "return_requested"].includes(
        (o.status || "").toLowerCase(),
      ),
    ).length,
);
const allOrdersCount = computed(() => myOrders.value.length);

const formatCurrency = (val) =>
  new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(val || 0);
</script>

<style scoped>
.bg-theme-orange {
  background: linear-gradient(135deg, #ff6b6b 0%, #ff8e53 100%);
}
.bg-theme-dark {
  background: linear-gradient(135deg, #2d3436 0%, #535c68 100%);
}
.bg-theme-amber {
  background: linear-gradient(135deg, #f39c12 0%, #fbd786 100%);
}
.bg-theme-coral {
  background: linear-gradient(135deg, #e17055 0%, #ffc3a0 100%);
}

.widget-card {
  border: none;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
  overflow: hidden;
}
.widget-card[style*="cursor: pointer"]:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}
.bg-white-glass {
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white !important;
}
.text-white h3,
.text-white h6,
.text-white small {
  color: #fff !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}
</style>
