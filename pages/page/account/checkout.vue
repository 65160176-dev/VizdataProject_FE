<template>
<Header/>
  <div>
    <WidgetsBreadcrumbs title="Checkout" />
   <PaymentPage/>
  </div>
  <Footer />
</template>
<script setup>
// Check if user is logged in, redirect to login if not
definePageMeta({
  middleware: 'auth'
})
</script>
