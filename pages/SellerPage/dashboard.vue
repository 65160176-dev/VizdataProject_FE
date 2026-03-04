<template>
  <div>
    <Breadcrumbs title="Dashboard" />
    <div class="container-fluid">
      
      <div v-if="loading" class="d-flex flex-column align-items-center justify-content-center" style="min-height: 400px;">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
        <h5 class="mt-3 text-secondary fw-bold">กำลังโหลดข้อมูลร้านค้า...</h5>
      </div>

      <Transition name="fade">
        <div v-if="!loading" class="row g-3">
          
          <div class="col-12">
            <WidgetsCard />
          </div>

          <div class="col-12 col-xl-6">
            <MarketChart /> 
          </div>
          <div class="col-12 col-xl-6">
            <OrderTable />
          </div>

          <div class="col-12 col-md-6">
            <SalesChart />
          </div>
          <div class="col-12 col-md-6">
            <PurchaseChart />
          </div>

          <div class="col-12">
            <BuysellChart />
          </div>

          <div class="col-12">
            <SalesStatus />
          </div>

        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Import Store
import { useOrderStore } from '~/store/orders'
import { useProductStore } from '~/store/products' 

// Import Components
import WidgetsCard from '~/components/theme/dashboard/widgetsCard.vue'
import MarketChart from '~/components/theme/dashboard/marketChart.vue'
import OrderTable from '~/components/theme/dashboard/orderTable.vue'
import SalesChart from '~/components/theme/dashboard/salesChart.vue'
import PurchaseChart from '~/components/theme/dashboard/purchaseChart.vue'
import BuysellChart from '~/components/theme/dashboard/buysellChart.vue'
import SalesStatus from '~/components/theme/dashboard/salesStatus.vue'

definePageMeta({ layout: 'seller' })

const orderStore = useOrderStore()
const productStore = useProductStore()
const loading = ref(true)

onMounted(() => {
  // จำลองเวลาโหลด
  setTimeout(() => { loading.value = false }, 300)

  // ดึงข้อมูลจาก Store
  Promise.all([
    orderStore.fetchOrders(),
    productStore.fetchProducts()
  ]).catch(err => console.error('❌ Dashboard Error:', err))
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { 
  transition: opacity 0.5s ease; 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
}

.container-fluid {
  padding-bottom: 2rem;
}
</style>