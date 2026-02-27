<template>
  <div class="auth-wrapper">
    <!-- LEFT: Illustration -->
    <div class="auth-left">
      <NuxtLink to="/page/auth/LoginPage" class="back-btn">
        <Icon name="mdi:arrow-left" size="16" />
        <span>กลับสู่หน้าแรก</span>
      </NuxtLink>
      <div class="illus-inner">
        <img src="~/assets/images/MainPage2.jpg" alt="illustration" class="illus-img" />
      </div>
    </div>

    <!-- RIGHT: Form -->
    <div class="auth-right">

      <div class="auth-form-wrap">
        <!-- Header -->
        <div class="form-header">
          <div class="form-icon">
            <Icon name="mdi:lock-reset" size="28" />
          </div>
          <h1 class="form-title">Reset Password</h1>
          <p class="form-sub">Enter your email and new password below</p>
        </div>

        <!-- Alert -->
        <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
          {{ message }}
        </div>

        <form @submit.prevent="onSubmit">
          <!-- Email -->
          <div class="form-group">
            <Icon name="mdi:email-outline" size="18" class="input-icon" />
            <input
              required
              type="email"
              v-model="email"
              class="form-control"
              placeholder="Email address"
              :disabled="loading"
            />
          </div>

          <!-- New Password -->
          <div class="form-group">
            <Icon name="mdi:lock-outline" size="18" class="input-icon" />
            <input
              required
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="New password"
              :disabled="loading"
              minlength="6"
            />
            <div class="show-hide" @click="showPassword = !showPassword">
              <Icon :name="showPassword ? 'mdi:eye-off-outline' : 'mdi:eye-outline'" size="18" />
            </div>
          </div>

          <!-- Confirm Password -->
          <div class="form-group">
            <Icon name="mdi:lock-check-outline" size="18" class="input-icon" />
            <input
              required
              v-model="confirmPassword"
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              placeholder="Confirm new password"
              :disabled="loading"
              minlength="6"
            />
          </div>

          <!-- Submit -->
          <button class="btn-next" type="submit" :disabled="loading">
            {{ loading ? 'Processing...' : 'RESET PASSWORD' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '~/services/authService'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const showPassword = ref(false)
const loading = ref(false)
const message = ref('')
const messageType = ref('')

async function onSubmit() {
  message.value = ''
  messageType.value = ''

  if (!email.value) {
    message.value = 'Please enter your email.'
    messageType.value = 'error'
    return
  }
  if (!password.value || password.value.length < 6) {
    message.value = 'Password must be at least 6 characters.'
    messageType.value = 'error'
    return
  }
  if (password.value !== confirmPassword.value) {
    message.value = 'Passwords do not match.'
    messageType.value = 'error'
    return
  }

  loading.value = true
  try {
    const payload = { email: email.value, password: password.value, confirmPassword: confirmPassword.value }
    const res: any = await authService.resetPassword(payload)
    if (res && res.success) {
      message.value = res.message || 'Password changed successfully.'
      messageType.value = 'success'
      setTimeout(() => { router.push('/page/auth/LoginPage') }, 1200)
    } else {
      message.value = (res && res.message) || 'Failed to reset password.'
      messageType.value = 'error'
    }
  } catch {
    message.value = 'An error occurred while resetting password.'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

definePageMeta({ layout: 'landing' })
</script>

<style scoped lang="scss">
/* â”€â”€â”€ Wrapper â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.auth-wrapper {
  display: flex;
  width: 100vw;
  min-height: 100vh;
  background: #fff;
  overflow: hidden;
}

/* â”€â”€â”€ LEFT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.auth-left {
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 0;
  background: #fff7f0;
  position: relative;
  overflow: hidden;
}

.illus-inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  .illus-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

/* â”€â”€â”€ RIGHT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
.auth-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  background: #fff;
}

/* Back button */
.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 10;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.35);
  padding: 6px 14px;
  border-radius: 20px;
  backdrop-filter: blur(4px);
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: #f97316;
    color: #fff;
  }
}

/* Form container */
.auth-form-wrap {
  width: 100%;
  max-width: 380px;
}

/* Header */
.form-header {
  margin-bottom: 28px;

  .form-icon {
    width: 52px;
    height: 52px;
    background: #fff7f0;
    border: 1.5px solid #ffddcc;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f97316;
    margin-bottom: 16px;
  }

  .form-title {
    font-size: 32px;
    font-weight: 800;
    color: #111;
    margin: 0 0 6px;
    line-height: 1.1;
  }

  .form-sub {
    font-size: 14px;
    color: #aaa;
    margin: 0;
  }
}

/* Alert */
.alert {
  padding: 10px 14px;
  border-radius: 10px;
  margin-bottom: 16px;
  font-size: 13px;
  &.alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
  &.alert-danger  { background: #fff0eb; color: #c0392b; border: 1px solid #ffb8a0; }
}

/* Inputs */
.form-group {
  margin-bottom: 14px;
  position: relative;

  .input-icon {
    position: absolute;
    left: 14px; top: 50%;
    transform: translateY(-50%);
    color: #f9a57a;
    pointer-events: none;
  }

  .form-control {
    width: 100%;
    border: 1.5px solid #ffddcc;
    border-radius: 10px;
    padding: 13px 44px 13px 42px;
    font-size: 14px;
    color: #333;
    background: #fff7f0;
    outline: none;
    transition: all 0.25s;

    &:focus {
      border-color: #f97316;
      background: #fff;
      box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.1);
    }
    &::placeholder { color: #d0b8a8; }
  }

  .show-hide {
    position: absolute;
    right: 14px; top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    color: #d0b8a8;
    display: flex;
    align-items: center;
    transition: color 0.2s;
    &:hover { color: #f97316; }
  }
}

/* Button */
.btn-next {
  width: 100%;
  margin-top: 8px;
  padding: 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 1.5px;
  background: #f97316;
  color: #fff;
  border: none;
  cursor: pointer;
  transition: background 0.25s, transform 0.2s;

  &:hover:not(:disabled) { background: #ea6c0a; transform: translateY(-1px); }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
}

/* â”€â”€â”€ Responsive â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
@media (max-width: 900px) {
  .auth-wrapper { flex-direction: column; }
  .auth-left { display: none; }
  .auth-right { padding: 80px 24px 40px; flex: none; min-height: 100vh; }
  .auth-form-wrap { max-width: 100%; }
}
</style>

