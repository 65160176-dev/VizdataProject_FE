<template>
  <form class="auth-form" @submit.prevent="doRegister">
    <!-- Alert -->
    <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
      {{ message }}
    </div>

    <!-- Register as -->
    <div class="register-type">
      <label class="type-label">สมัครเป็น</label>
      <div class="type-options">
        <label class="type-option" :class="{ active: userType == 1 }">
          <input type="radio" value="1" v-model="userType" :disabled="loading" />
          <Icon name="mdi:account-outline" size="16" />
          ผู้ซื้อ
        </label>
        <label class="type-option" :class="{ active: userType == 0 }">
          <input type="radio" value="0" v-model="userType" :disabled="loading" />
          <Icon name="mdi:store-outline" size="16" />
          ผู้ขาย
        </label>
      </div>
    </div>

    <!-- Username / Shop Name -->
    <div class="form-group">
      <Icon name="mdi:store-outline" size="18" class="input-icon" />
      <input
        required
        type="text"
        v-model="username"
        class="form-control"
        :placeholder="userType == 0 ? 'ชื่อร้านค้า' : 'ชื่อผู้ใช้'"
        :disabled="loading"
      />
    </div>

    <!-- Email -->
    <div class="form-group">
      <Icon name="mdi:email-outline" size="18" class="input-icon" />
      <input
        required
        type="email"
        v-model="email"
        class="form-control"
        placeholder="อีเมล"
        :disabled="loading"
      />
    </div>

    <!-- Password -->
    <div class="form-group">
      <Icon name="mdi:lock-outline" size="18" class="input-icon" />
      <input
        required
        v-model="password"
        :type="showPassword ? 'text' : 'password'"
        class="form-control"
        placeholder="รหัสผ่าน"
        :disabled="loading"
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
        placeholder="ยืนยันรหัสผ่าน"
        :disabled="loading"
      />
    </div>

    <!-- Terms -->
    <div class="form-terms">
      <div class="check-wrap">
        <input type="checkbox" id="agreeTerms" v-model="agreeTerms" required />
        <label for="agreeTerms">
          ฉันยอมรับ <a href="#">ข้อกำหนดและเงื่อนไข</a>
        </label>
      </div>
    </div>

    <!-- Submit -->
    <div class="form-button">
      <button class="btn-next" type="submit" :disabled="loading || !agreeTerms">
        {{ loading ? 'กำลังสมัคร...' : 'สมัครสมาชิก' }}
      </button>
    </div>

    <!-- Social -->
    <div class="form-footer">
      <div class="divider">หรือสมัครด้วยบัญชีอื่น</div>
      <a href="#" class="social-btn" @click.prevent="loginWithGoogle">
        <img class="social-logo" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
        สมัครด้วย Google
      </a>
      <a href="#" class="social-btn fb-btn" @click.prevent="loginWithFacebook">
        <img class="social-logo" src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" />
        สมัครด้วย Facebook
      </a>
    </div>
  </form>
</template>

<script setup>
import { ref } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const userType = ref(1)
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const showPassword = ref(false)

const loading = ref(false)
const message = ref('')
const messageType = ref('')

function loginWithFacebook() {
  const apiUrl = useRuntimeConfig().public.apiUrl || 'https://vizdataprojectbe-production.up.railway.app'
  window.location.href = `${apiUrl}/api/auth/facebook`
}

function loginWithGoogle() {
  const apiUrl = useRuntimeConfig().public.apiUrl || 'https://vizdataprojectbe-production.up.railway.app'
  window.location.href = `${apiUrl}/api/auth/google`
}

async function doRegister() {
  message.value = ''
  loading.value = true
  try {
    if (!agreeTerms.value) {
      message.value = 'Please agree to the Terms & Conditions'
      messageType.value = 'error'
      return
    }
    const result = await authStore.register(username.value, email.value, password.value, confirmPassword.value, Number(userType.value))
    if (result.success) {
      message.value = result.message
      messageType.value = 'success'
      setTimeout(() => {
        const redirectUrl = route.query.redirect
        if (redirectUrl) {
          try { router.replace(decodeURIComponent(String(redirectUrl))) } catch { router.replace(String(redirectUrl)) }
          return
        }
        router.replace(Number(userType.value) === 0 ? '/SellerPage/dashboard' : '/')
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
</script>

<style scoped lang="scss">
.auth-form {
  .form-group {
    margin-bottom: 14px;
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
      padding: 12px 44px 12px 42px;
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
    margin-bottom: 14px;
    font-size: 13px;
    &.alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
    &.alert-danger  { background: #fff0eb; color: #c0392b; border: 1px solid #ffb8a0; }
  }

  /* Register type selector */
  .register-type {
    margin-bottom: 14px;

    .type-label {
      font-size: 12px;
      color: #aaa;
      display: block;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .type-options {
      display: flex;
      gap: 10px;
    }

    .type-option {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px;
      border: 1.5px solid #ffddcc;
      border-radius: 10px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      color: #aaa;
      background: #fff7f0;
      transition: all 0.2s;

      input[type='radio'] { display: none; }

      &.active {
        border-color: #f97316;
        color: #f97316;
        background: #fff;
      }

      &:hover:not(.active) { border-color: #f9a57a; color: #f97316; }
    }
  }

  /* Terms */
  .form-terms {
    margin-bottom: 18px;

    .check-wrap {
      display: flex;
      align-items: center;
      gap: 8px;

      input[type='checkbox'] {
        width: 16px; height: 16px;
        accent-color: #f97316;
        cursor: pointer;
        flex-shrink: 0;
      }

      label {
        font-size: 13px;
        color: #999;
        cursor: pointer;
        a { color: #f97316; text-decoration: none; &:hover { text-decoration: underline; } }
      }
    }
  }

  /* Register button */
  .form-button {
    margin-bottom: 20px;

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

      &:hover:not(:disabled) { background: #ea6c0a; transform: translateY(-1px); }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }
  }

  /* Social */
  .form-footer {
    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
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
      padding: 11px;
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
    }
  }
}
</style>

