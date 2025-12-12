<template>
  <Breadcrumbs title="Dashboard" />
  <div class="container-fluid">
    <div class="row">
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
</template>
<script setup>
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
    