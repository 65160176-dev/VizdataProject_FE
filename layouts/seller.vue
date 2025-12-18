<template>
  <div class="page-wrapper">
    
    <SellerSidebar />

    <div class="page-body-wrapper">
      <div class="page-body">
        <slot />
      </div>
    </div>
    
  </div>
</template>

<script setup>

import SellerSidebar from '~/components/SellerSidebar.vue'
</script>

<style scoped>
.page-wrapper {
  display: flex;
  width: 100%;
}
.page-body-wrapper {
  flex-grow: 1;
  margin-left: 260px; 
  min-height: 100vh;
  background-color: #fcfcfc;
  transition: 0.3s;
  padding: 24px;
}
</style>