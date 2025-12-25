<template>
  <div class="tab-pane fade" id="top-contact" role="tabpanel" aria-labelledby="contact-top-tab">
    <form class="form-horizontal auth-form" @submit.prevent="doRegister">
      <!-- Error/Success Message -->
      <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
        {{ message }}
      </div>
      <div class="form-group">
        <input 
          required 
          type="text" 
          v-model="username" 
          class="form-control" 
          placeholder="Username"
          :disabled="loading"
        >
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
      </div>
      <div class="form-group">
        <input 
          required 
          v-model="confirmPassword" 
          :type="passwordType" 
          class="form-control" 
          placeholder="Confirm Password"
          :disabled="loading"
        >
      </div>
      <div class="form-group">
            <label class="d-block">Register as</label>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="userTypeUser" value="1" v-model="userType" :disabled="loading">
              <label class="form-check-label" for="userTypeUser">User</label>
            </div>
            <div class="form-check form-check-inline">
              <input class="form-check-input" type="radio" id="userTypeSeller" value="0" v-model="userType" :disabled="loading">
              <label class="form-check-label" for="userTypeSeller">Seller</label>
            </div>
          </div>
      <div class="form-terms">
        <div class="form-check mesm-2">
          <input type="checkbox" class="form-check-input" id="agreeTerms" v-model="agreeTerms" required>
          <label class="form-check-label ps-2" for="agreeTerms">
            <span>I agree to all statements in <a href="#" class="pull-right">Terms &amp; Conditions</a></span>
          </label>
        </div>
      </div>
      <div class="form-button">
        <button class="btn btn-primary" type="submit" :disabled="loading || !agreeTerms">
          <span v-if="loading">Registering...</span>
          <span v-else>Register</span>
        </button>
      </div>
      <div class="form-footer">
        <span>Or Sign up with social platforms</span>
        <ul class="social">
          <li><a class="ti-facebook" href="#"></a></li>
          <li><a class="ti-twitter" href="#"></a></li>
          <li><a class="ti-instagram" href="#"></a></li>
          <li><a class="ti-pinterest" href="#"></a></li>
        </ul>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/store/auth'

// Router & Route
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// userType: default to user (1). seller = 0
const userType = ref(1)
const username = ref('')

// Form data
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const agreeTerms = ref(false)
const passwordType = ref('password')

// UI state
const loading = ref(false)
const message = ref('')
const messageType = ref('')

// Register function
async function doRegister() {
  // Reset message
  message.value = ''
  loading.value = true
  
  try {
    // Validate terms agreement
    if (!agreeTerms.value) {
      message.value = 'Please agree to the Terms & Conditions'
      messageType.value = 'error'
      loading.value = false
      return
    }
    
    console.log('Registering with:', {
      username: username.value,
      email: email.value,
      userType: Number(userType.value)
    })
    
    // Call auth store register (username, email, password, confirmPassword, userType)
    const result = await authStore.register(username.value, email.value, password.value, confirmPassword.value, Number(userType.value))
    
    console.log('Register result:', result)
    
    if (result.success) {
      message.value = result.message
      messageType.value = 'success'
      
      // Small delay to show success message
      setTimeout(() => {
        // Check for redirect URL
        const redirectUrl = route.query.redirect
        if (redirectUrl) {
          // redirectUrl may be encoded by middleware, decode it first
          try {
            const decoded = decodeURIComponent(String(redirectUrl))
            router.replace(decoded)
          } catch (e) {
            router.replace(String(redirectUrl))
          }
          return
        }

        // If userType is seller (0) send to seller dashboard
        if (Number(userType.value) === 0) {
          router.replace('/SellerPage/dashboard')
          return
        }

        router.replace('/')
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
}

/* Auth Register Form Styles */
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
}

/* Form Terms */
.form-terms {
  margin-bottom: 20px;
  
  .form-check {
    display: flex;
    align-items: flex-start;
  }
  
  .form-check-input {
    margin-top: 3px;
    cursor: pointer;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    
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
    line-height: 1.5;
    
    span {
      display: inline;
    }
    
    a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.3s ease;
      
      &:hover {
        color: #764ba2;
        text-decoration: underline;
      }
    }
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
        &.ti-twitter:hover { background: #1da1f2; }
        &.ti-instagram:hover { background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); }
        &.ti-pinterest:hover { background: #bd081c; }
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
  
  .form-terms .form-check-label {
    font-size: 13px;
  }
}
</style>