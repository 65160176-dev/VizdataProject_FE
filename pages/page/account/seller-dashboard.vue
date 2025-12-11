<template>
  <div class="seller-dashboard container">
    <div class="row">
      <div class="col-12">
        <h1>Seller Dashboard (Mock)</h1>
        <p>Welcome, {{ userName }} — this is a simple mock seller dashboard.</p>
        <nuxt-link to="/" class="btn btn-primary">Go to Store</nuxt-link>
        <button class="btn btn-outline-secondary ms-2" @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/store/auth'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const userName = auth.userName || localStorage.getItem('userName') || ''

function logout() {
  auth.logout()
  router.replace('/')
}

definePageMeta({ middleware: 'auth' })
</script>

<style scoped>
.seller-dashboard {
  padding: 40px 0;
}
</style>
