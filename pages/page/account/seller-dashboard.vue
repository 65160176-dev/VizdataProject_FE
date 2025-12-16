<template>
  <div class="seller-dashboard container">
    <div class="row">
      <div class="col-12">
        <h1>Redirecting to Seller Dashboard…</h1>
        <p class="text-muted">If you are not redirected automatically, click the button below.</p>
        <nuxt-link to="/SellerPage/dashboard" class="btn btn-primary">Open Seller Dashboard</nuxt-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const auth = useAuthStore()
const router = useRouter()

function ensureAuthAndRedirect() {
  if (!auth.isLoggedIn && !localStorage.getItem('userName')) {
    router.replace('/')
    return
  }
  router.replace('/SellerPage/dashboard')
}

onMounted(() => {
  ensureAuthAndRedirect()
})

definePageMeta({ middleware: 'auth' })
</script>

<style scoped>
.seller-dashboard {
  padding: 40px 0;
}
</style>
