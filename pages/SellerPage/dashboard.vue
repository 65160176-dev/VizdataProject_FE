<template>
  <div>
    <Breadcrumbs title="Dashboard" />
  <div class="container-fluid">
    <div class="row g-3">
        
        <WidgetsCard />
        <MarketChart />
        <OrderTable />
        <SalesChart />
        <PurchaseChart />
        <TransactionChart />
        <DepositeChart />
        <BuysellChart />
        <GoodReturn />
        <EmployStatus />
        <SalesStatus />
        
        </div>
    </div>
  </div>
</template>

<script setup>
// 1. กำหนด Layout ที่จะใช้กับหน้านี้
// 'default' คือไฟล์ layouts/default.vue (ที่มี Sidebar หลัก)
// ถ้าเป็นหน้า Seller ให้เปลี่ยนเป็น layout: 'seller'
definePageMeta({
  layout: 'seller'
})

// 2. Import Components
// (ใน Nuxt 3 ถ้าไฟล์อยู่ใน components/ อาจไม่ต้อง import ก็ได้ แต่ใส่ไว้เพื่อความชัวร์และถูกต้องตาม path ของคุณ)
import WidgetsCard from '~/components/theme/dashboard/widgetsCard.vue'
import MarketChart from '~/components/theme/dashboard/marketChart.vue'
import OrderTable from '~/components/theme/dashboard/orderTable.vue'
import SalesChart from '~/components/theme/dashboard/salesChart.vue'
import PurchaseChart from '~/components/theme/dashboard/purchaseChart.vue'
import TransactionChart from '~/components/theme/dashboard/transactionChart.vue'
import DepositeChart from '~/components/theme/dashboard/depositeChart.vue'
import BuysellChart from '~/components/theme/dashboard/buysellChart.vue'
import GoodReturn from '~/components/theme/dashboard/goodReturn.vue'
import EmployStatus from '~/components/theme/dashboard/employStatus.vue'
import SalesStatus from '~/components/theme/dashboard/salesStatus.vue'
import RevenueChart from '~/components/theme/dashboard/revenueChart.vue'
</script>

<style scoped>
/* ใส่ CSS เพิ่มเติมเฉพาะหน้านี้ถ้าต้องการ */
</style>