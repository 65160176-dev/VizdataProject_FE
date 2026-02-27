<template>
  <form class="auth-form" @submit.prevent="doLogin">
    <!-- Alerts -->
    <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
      {{ message }}
    </div>
    <div v-if="redirectUrl" class="alert alert-info">
      <small>กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</small>
    </div>

    <!-- Email -->
    <div class="form-group">
      <Icon name="mdi:account-outline" size="18" class="input-icon" />
      <input
        required
        type="email"
        v-model="email"
        class="form-control"
        placeholder="Username or Email"
        :disabled="loading"
      />
    </div>

    <!-- Password -->
    <div class="form-group">
      <Icon name="mdi:lock-outline" size="18" class="input-icon" />
      <input
        required
        v-model="password"
        :type="passwordType"
        class="form-control"
        placeholder="Password"
        :disabled="loading"
      />
      <div class="show-hide" @click="togglePassword">
        <Icon :name="passwordType === 'password' ? 'mdi:eye-outline' : 'mdi:eye-off-outline'" size="18" />
      </div>
    </div>

    <!-- Remember + Forgot -->
    <div class="form-terms">
      <div class="check-wrap">
        <input type="checkbox" id="rememberMe" v-model="rememberMe" />
        <label for="rememberMe">Remember me</label>
      </div>
      <NuxtLink to="/forgot-password" class="forgot-pass">Lost your password?</NuxtLink>
    </div>

    <!-- Submit -->
    <div class="form-button">
      <button class="btn-next" type="submit" :disabled="loading">
        {{ loading ? 'กำลังเข้าสู่ระบบ...' : 'NEXT' }}
      </button>
    </div>

    <!-- Social -->
    <div class="form-footer">
      <div class="divider">Login with Others</div>
      <a href="#" class="social-btn" @click.prevent="loginWithGoogle">
        <img
          class="social-logo"
          src="https://www.svgrepo.com/show/475656/google-color.svg"
          alt="Google"
        />
        Login with Google
      </a>
      <a href="#" class="social-btn fb-btn" @click.prevent="loginWithFacebook">
        <img
          class="social-logo"
          src="https://www.svgrepo.com/show/448224/facebook.svg"
          alt="Facebook"
        />
        Login with Facebook
      </a>
      <!-- Telegram Login Widget (real button rendered by Telegram) -->
      <div class="tg-widget-wrap">
        <div ref="telegramWidgetContainer" class="tg-widget-inner"></div>
      </div>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const passwordType = ref('password')
const loading = ref(false)
const message = ref('')
const messageType = ref('')
const redirectUrl = ref('')

onMounted(() => {
  redirectUrl.value = route.query.redirect || ''
  email.value = 'user@gmail.com'
  password.value = '123456'

  // Load Telegram Login Widget
  const config = useRuntimeConfig()
  const botName = config.public.telegramBotName || 'BDNShopBot'
  window.onTelegramAuth = handleTelegramAuth

  const script = document.createElement('script')
  script.src = 'https://telegram.org/js/telegram-widget.js?22'
  script.setAttribute('data-telegram-login', botName)
  script.setAttribute('data-size', 'large')
  script.setAttribute('data-radius', '8')
  script.setAttribute('data-onauth', 'onTelegramAuth(user)')
  script.setAttribute('data-request-access', 'write')
  script.async = true
  if (telegramWidgetContainer.value) {
    telegramWidgetContainer.value.appendChild(script)
  }
})

function togglePassword() {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}

async function doLogin() {
  message.value = ''
  loading.value = true
  try {
    if (!email.value || !password.value) {
      message.value = 'Please enter email and password'
      messageType.value = 'error'
      return
    }
    const result = await authStore.login(email.value, password.value)
    if (result.success) {
      message.value = result.message
      messageType.value = 'success'
      setTimeout(() => {
        const currentUserType = authStore.userType || Number(localStorage.getItem('userType') || 1)
        if (redirectUrl.value) {
          let decoded = String(redirectUrl.value)
          try { decoded = decodeURIComponent(decoded) } catch (e) {}
          const isSellerPath = (p) => p && (p.includes('/SellerPage') || p.includes('/seller') || p.includes('seller-dashboard') || p.includes('/page/account/seller'))
          if ((currentUserType === 0 && isSellerPath(decoded)) || (currentUserType !== 0 && !isSellerPath(decoded))) {
            router.replace(decoded); return
          }
        }
        router.replace(currentUserType === 0 ? '/SellerPage/dashboard' : '/')
      }, 500)
    } else {
      message.value = result.message
      messageType.value = 'error'
    }
  } catch {
    message.value = 'An error occurred. Please try again.'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

function loginWithFacebook() {
  const apiUrl = useRuntimeConfig().public.apiUrl || 'https://vizdataprojectbe-production.up.railway.app'
  window.location.href = `${apiUrl}/api/auth/facebook`
}

function loginWithGoogle() {
  const apiUrl = useRuntimeConfig().public.apiUrl || 'https://vizdataprojectbe-production.up.railway.app'
  window.location.href = `${apiUrl}/api/auth/google`
}

// Telegram Login Widget
const telegramWidgetContainer = ref(null)

async function handleTelegramAuth(telegramUser) {
  loading.value = true
  message.value = ''
  try {
    const apiUrl = useRuntimeConfig().public.apiUrl || 'https://vizdataprojectbe-production.up.railway.app'
    const res = await fetch(`${apiUrl}/api/auth/telegram`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramUser),
    })
    const data = await res.json()
    if (data.success) {
      await authStore.loginWithOAuth(data.data.user, data.data.token)
      message.value = 'เข้าสู่ระบบสำเร็จ'
      messageType.value = 'success'
      setTimeout(() => {
        const currentUserType = authStore.userType || Number(localStorage.getItem('userType') || 1)
        router.replace(currentUserType === 0 ? '/SellerPage/dashboard' : '/')
      }, 500)
    } else {
      message.value = data.message || 'Telegram login failed'
      messageType.value = 'error'
    }
  } catch (e) {
    message.value = 'เกิดข้อผิดพลาด กรุณาลองใหม่'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}


</script>

<style scoped lang="scss">
.auth-form {
  .form-group {
    margin-bottom: 16px;
    position: relative;

    .input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
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
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: #d0b8a8;
      display: flex;
      align-items: center;
      transition: color 0.2s;
      &:hover { color: #f97316; }
    }
  }

  /* Alerts */
  .alert {
    padding: 10px 14px;
    border-radius: 8px;
    margin-bottom: 16px;
    font-size: 13px;
    &.alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    &.alert-danger  { background: #fff0eb; color: #c0392b; border: 1px solid #ffb8a0; }
    &.alert-info    { background: #fff7f0; color: #c05000; border: 1px solid #ffddcc; }
  }

  /* Remember + Forgot */
  .form-terms {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;

    .check-wrap {
      display: flex;
      align-items: center;
      gap: 8px;
      input[type='checkbox'] {
        width: 16px; height: 16px;
        accent-color: #f97316;
        cursor: pointer;
      }
      label { font-size: 13px; color: #999; cursor: pointer; }
    }

    .forgot-pass {
      font-size: 13px;
      color: #f97316;
      text-decoration: none;
      font-weight: 500;
      &:hover { text-decoration: underline; opacity: 0.8; }
    }
  }

  /* NEXT button */
  .form-button {
    margin-bottom: 22px;

    .btn-next {
      width: 100%;
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

      &:hover { background: #ea6c0a; transform: translateY(-1px); }
      &:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
    }
  }

  /* Social */
  .form-footer {
    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 14px;
      font-size: 13px;
      color: #d0b8a8;
      &::before, &::after { content: ''; flex: 1; height: 1px; background: #ffddcc; }
    }

    .social-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 12px;
      border: 1.5px solid #ffddcc;
      border-radius: 10px;
      background: #fff;
      font-size: 14px;
      font-weight: 500;
      color: #555;
      cursor: pointer;
      transition: all 0.2s;
      margin-bottom: 10px;
      text-decoration: none;

      .social-logo { width: 20px; height: 20px; object-fit: contain; }

      &:hover { border-color: #f97316; background: #fff7f0; transform: translateY(-1px); }

      &.fb-btn {
        color: #1877f2;
        border-color: #d0e4ff;
        background: #f5f8ff;
        &:hover { background: #edf2ff; border-color: #1877f2; }
      }

      &.tg-btn {
        color: #229ED9;
        border-color: #c8e8f7;
        background: #f0f9ff;
        &:hover { background: #e0f4ff; border-color: #229ED9; }
      }
    }

    /* Telegram widget wrapper — centers the iframe button Telegram renders */
    .tg-widget-wrap {
      display: flex;
      justify-content: center;
      margin-top: 4px;

      .tg-widget-inner {
        display: flex;
        justify-content: center;
        width: 100%;
        min-height: 44px;

        /* Make the iframe Telegram renders fill/center nicely */
        :deep(iframe) {
          border-radius: 8px !important;
        }
      }
    }
  }
}
</style>

