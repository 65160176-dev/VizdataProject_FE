<template>
  <div class="container">
    <div class="row justify-content-center mt-5">
      <div class="col-md-6 text-center">
        <div v-if="loading" class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div v-else-if="error" class="alert alert-danger">
          <h4>เกิดข้อผิดพลาด</h4>
          <p>{{ error }}</p>
          <NuxtLink to="/page/auth/login" class="btn btn-primary">กลับไปหน้าเข้าสู่ระบบ</NuxtLink>
        </div>
        <div v-else class="alert alert-success">
          <h4>เข้าสู่ระบบสำเร็จ!</h4>
          <p>กำลังเปลี่ยนเส้นทาง...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    // Get token and user data from URL query parameters
    const token = route.query.token
    const userString = route.query.user

    if (!token || !userString) {
      throw new Error('ไม่พบข้อมูลการเข้าสู่ระบบ')
    }

    // Parse user data
    const user = JSON.parse(decodeURIComponent(userString))

    // Save token and user to store
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    localStorage.setItem('userType', user.userType || '1')

    // Update auth store
    authStore.user = user
    authStore.token = token
    authStore.isAuthenticated = true
    authStore.userType = user.userType

    // Redirect based on user type
    setTimeout(() => {
      if (user.userType === 0) {
        router.replace('/SellerPage/dashboard')
      } else {
        router.replace('/')
      }
    }, 1000)

  } catch (err) {
    loading.value = false
    error.value = err.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ'
  }
})
</script>

<style scoped>
.container {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
