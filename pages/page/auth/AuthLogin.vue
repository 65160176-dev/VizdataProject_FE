<template>
  <div class="tab-pane fade show active" id="top-profile" role="tabpanel" aria-labelledby="top-profile-tab">
    <form class="form-horizontal auth-form" @submit.prevent="doLogin">
      <!-- Error/Success Message -->
      <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
        {{ message }}
      </div>
      
      <!-- Redirect Notice -->
      <div v-if="redirectUrl" class="alert alert-info">
        <small>กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ</small>
      </div>
      
      <div class="form-group">
        <input 
          required 
          type="email" 
          v-model="email" 
          class="form-control" 
          placeholder="Email"
          :disabled="loading"
        >
      </div>
      <div class="form-group">
        <input 
          required 
          v-model="password" 
          :type="passwordType" 
          class="form-control" 
          placeholder="Password"
          :disabled="loading"
        >
        <div class="show-hide">
          <span :class="passwordType === 'password' ? 'show' : ''" @click="togglePassword"></span>
        </div>
      </div>
      <div class="form-terms">
        <div class="form-check mesm-2">
          <input type="checkbox" class="form-check-input" id="rememberMe" v-model="rememberMe">
          <label class="form-check-label ps-2" for="rememberMe">Remember me</label>
          <a href="#" class="btn btn-default forgot-pass">Lost your password?</a>
        </div>
      </div>
      <div class="form-button">
        <button class="btn btn-primary" type="submit" :disabled="loading">
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </div>
      <div class="form-footer">
        <span>Or Login with social platforms</span>
        <ul class="social">
          <li><a class="ti-facebook" href="#" @click.prevent="loginWithFacebook"></a></li>
          <li><a class="ti-google" href="#" @click.prevent="loginWithGoogle"></a></li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { useCartStore } from '~/store/cart'

// Router & Route
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Form data
const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const passwordType = ref('password')

// UI state
const loading = ref(false)
const message = ref('')
const messageType = ref('')
const redirectUrl = ref('')

// Check for redirect URL on mount
onMounted(() => {
  redirectUrl.value = route.query.redirect || ''
  
  // Pre-fill demo credentials for convenience
  email.value = 'user@gmail.com'
  password.value = '123456'
})

// Toggle password visibility
function togglePassword() {
  passwordType.value = passwordType.value === 'password' ? 'text' : 'password'
}

// Login function
async function doLogin() {
  // Reset message
  message.value = ''
  loading.value = true
  
  try {
    // Validate inputs
    if (!email.value || !password.value) {
      message.value = 'Please enter email and password'
      messageType.value = 'error'
      loading.value = false
      return
    }
    
    // Call auth store login (await in case it's async / API-backed)
    const result = await authStore.login(email.value, password.value)
    
    if (result.success) {
      message.value = result.message
      messageType.value = 'success'
      
      // Small delay to show success message
      setTimeout(() => {
        // If a redirect query is present (e.g., from checkout), only follow it
        // when it's appropriate for the logged-in userType. Otherwise prefer
        // userType-based default destinations.
        const currentUserType = authStore.userType || Number(localStorage.getItem('userType') || 1)

        if (redirectUrl.value) {
          // redirectUrl may be encoded by middleware, decode it first
          let decoded = String(redirectUrl.value)
          try { decoded = decodeURIComponent(decoded) } catch (e) {}

          // Helper to detect seller-only paths
          const isSellerPath = (p) => {
            if (!p) return false
            return p.includes('/SellerPage') || p.includes('/seller') || p.includes('seller-dashboard') || p.includes('/page/account/seller')
          }

          // Only follow the redirect if it makes sense for the userType
          if ((currentUserType === 0 && isSellerPath(decoded)) || (currentUserType !== 0 && !isSellerPath(decoded))) {
            router.replace(decoded)
            return
          }
          // otherwise fall through to userType defaults
        }

        // Redirect based on user type
        if (currentUserType === 0) {
          router.replace('/SellerPage/dashboard')
        } else {
          router.replace('/')
        }
      }, 500)
    } else {
      message.value = result.message
      messageType.value = 'error'
    }
  } catch (error) {
    message.value = 'An error occurred. Please try again.'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

// OAuth Login Functions
function loginWithFacebook() {
  const apiUrl = useRuntimeConfig().public.apiUrl || 'http://localhost:3001'
  window.location.href = `${apiUrl}/api/auth/facebook`
}

function loginWithGoogle() {
  const apiUrl = useRuntimeConfig().public.apiUrl || 'http://localhost:3001'
  window.location.href = `${apiUrl}/api/auth/google`
}

</script>
<style scoped lang="scss">
/* Alert Messages */
.alert {
  padding: 12px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
  
  &.alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
  }
  
  &.alert-danger {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
  }
  
  &.alert-info {
    background-color: #e7f3ff;
    color: #0c5460;
    border: 1px solid #bee5eb;
  }
}

/* Demo Credentials */
.demo-credentials {
  margin-top: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  
  p {
    margin: 0 0 5px 0;
    color: #666;
  }
  
  small {
    color: #888;
  }
}

/* Auth Login Form Styles */
.auth-form {
  .form-group {
    margin-bottom: 20px;
    position: relative;
  }
  
  .form-control {
    border-radius: 25px;
    padding: 12px 25px;
    border: 1px solid #eaeaea;
    font-size: 14px;
    height: auto;
    transition: all 0.3s ease;
    
    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      outline: none;
    }
    
    &::placeholder {
      color: #aaa;
    }
  }
  
  .show-hide {
    position: absolute;
    right: 20px;
    top: 12px;
    cursor: pointer;
    z-index: 5;
    
    span {
      color: #999;
      font-size: 14px;
      
      &::before {
        content: '👁';
      }
      
      &.show::before {
        content: '🙈';
      }
    }
  }
}

/* Form Terms */
.form-terms {
  margin-bottom: 20px;
  
  .form-check {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .form-check-input {
    margin-top: 0;
    cursor: pointer;
    width: 16px;
    height: 16px;
    
    &:checked {
      background-color: #667eea;
      border-color: #667eea;
    }
    
    &:focus {
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.2);
    }
  }
  
  .form-check-label {
    color: #666;
    font-size: 14px;
    margin-left: 5px;
  }
}

/* Forgot Password */
.forgot-pass {
  padding: 0;
  float: right;
  color: #ff8084;
  font-size: 13px;
  text-decoration: none;
  background: none;
  border: none;
  margin-left: auto;
  transition: color 0.3s ease;
  
  &:hover {
    color: #e85c60;
    text-decoration: underline;
  }
}

/* Form Button */
.form-button {
  margin-bottom: 25px;
  
  .btn-primary {
    width: 100%;
    padding: 12px 30px;
    border-radius: 25px;
    font-weight: 600;
    font-size: 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

/* Form Footer / Social */
.form-footer {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
  
  > span {
    color: #888;
    font-size: 13px;
    display: block;
    margin-bottom: 15px;
  }
  
  .social {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    gap: 12px;
    
    li {
      a {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: #f5f5f5;
        color: #666;
        text-decoration: none !important;
        transition: all 0.3s ease;
        font-size: 16px;
        
        &:hover {
          transform: translateY(-3px);
          color: #fff;
        }
        
        &.ti-facebook:hover { background: #3b5998; }
        &.ti-google:hover { background: #db4437; }
      }
    }
  }
}

/* Responsive */
@media only screen and (max-width: 991px) {
  .form-footer,
  .form-button {
    text-align: center;
  }
}

@media only screen and (max-width: 575px) {
  .auth-form .form-control {
    padding: 10px 20px;
  }
  
  .form-button .btn-primary {
    margin-top: 10px;
  }
  
  .form-terms .form-check {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .forgot-pass {
    float: none;
    margin-left: 0;
  }
}
</style>