<template>
  <div class="page-wrapper">
    <div class="authentication-box">
      <div class="container">
        <div class="row">
          <CardLeft />
          <div class="col-md-7 p-0 card-right">
            <div class="card tab2-card">
              <div class="card-body">
                <div class="tab-content" id="top-tabContent">
                  <div class="tab-pane fade show active" id="forgot-panel">
                    <form class="form-horizontal auth-form" @submit.prevent="onSubmit">
                      <h3 class="mb-3">Forgot / Reset Password</h3>

                      <div v-if="message" class="alert" :class="messageType === 'success' ? 'alert-success' : 'alert-danger'">
                        {{ message }}
                      </div>

                      <div class="form-group">
                        <input
                          required
                          type="email"
                          v-model="email"
                          class="form-control"
                          placeholder="Email"
                          :disabled="loading"
                        />
                      </div>

                      <div class="form-group">
                        <input
                          required
                          v-model="password"
                          type="password"
                          class="form-control"
                          placeholder="New password"
                          :disabled="loading"
                          minlength="6"
                        />
                      </div>

                      <div class="form-group">
                        <input
                          required
                          v-model="confirmPassword"
                          type="password"
                          class="form-control"
                          placeholder="Confirm password"
                          :disabled="loading"
                          minlength="6"
                        />
                      </div>

                      <div class="form-button">
                        <button class="btn btn-primary" type="submit" :disabled="loading">
                          <span v-if="loading">Processing...</span>
                          <span v-else>Reset Password</span>
                        </button>
                      </div>

                      <div class="form-terms">
                        <div class="form-check mesm-2">
                          <!-- intentionally left blank; back button moved below card -->
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NuxtLink to="/page/auth/LoginPage" class="btn btn-primary back-btn">
          <Icon name="mdi:arrow-left"></Icon>back
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import CardLeft from './page/auth/CardLeft.vue'
import { authService } from '~/services/authService'

const router = useRouter()
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
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
      setTimeout(() => {
        router.push('/page/auth/LoginPage')
      }, 1200)
    } else {
      message.value = (res && res.message) || 'Failed to reset password.'
      messageType.value = 'error'
    }
  } catch (err) {
    message.value = 'An error occurred while resetting password.'
    messageType.value = 'error'
  } finally {
    loading.value = false
  }
}

definePageMeta({ layout: 'default' })
</script>

<style scoped lang="scss">
/* Copy of LoginPage layout/styles to match compact card theme */
.page-wrapper {
  min-height: 100vh;
  background: #f8f9fa;
}

/* Back Button placement under the card (matches LoginPage) */
.authentication-box .back-btn {
  float: right;
  margin: 20px 0 0 0;
  font-size: 14px;
  position: relative;
  padding: 10px 20px 10px 45px !important;
  border-radius: 25px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(-5px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
}

.authentication-box .back-btn svg,
.authentication-box .back-btn .icon {
  position: absolute;
  left: 20px;
  height: 18px;
  width: 18px;
  top: 50%;
  transform: translateY(-50%);
}

.authentication-box {
  min-width: 100vw;
  min-height: 100vh;
  width: auto;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
  padding: 20px;
}

.authentication-box .container {
  max-width: 900px;
}

.authentication-box .row {
  display: flex;
  align-items: stretch;
  min-height: 500px;
}

.card-right {
  margin-left: -15px;
  z-index: 2;
}

.card-right .card {
  padding-left: 15px;
  border: none;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  height: 100%;
  position: relative; /* allow absolute children like small-back */
}

.card-right .card-body { padding: 30px; }

/* Form Styles (copied from LoginPage.vue) */
:deep(.auth-form) {
  .form-group {
    margin-bottom: 20px;
    position: relative;
  }
  .form-control {
    border-radius: 25px;
    padding: 12px 25px;
    border: 1px solid #eaeaea;
    font-size: 14px;
    transition: all 0.3s ease;
    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    &::placeholder { color: #aaa; }
  }
  .show-hide {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    span {
      &::before { content: '\f06e'; font-family: 'FontAwesome'; color: #999; }
      &.show::before { content: '\f070'; }
    }
  }
}

:deep(.form-terms) {
  margin-bottom: 20px;
  .form-check { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; }
  .form-check-input { margin-top: 0; cursor: pointer; &:checked { background-color: #667eea; border-color: #667eea; } }
  .form-check-label { color: #666; font-size: 14px; }
}

:deep(.forgot-pass) {
  padding: 0;
  float: right;
  color: #ff8084;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.3s ease;
  &:hover { color: #e85c60; text-decoration: underline; }
}

:deep(.form-button) {
  margin-bottom: 25px;
  .btn-primary {
    width: 100%;
    padding: 12px 30px;
    border-radius: 25px;
    font-weight: 600;
    font-size: 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    transition: all 0.3s ease;
    &:hover { transform: translateY(-2px); box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4); }
  }
}

:deep(.form-footer) {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
  span { color: #888; font-size: 13px; display: block; margin-bottom: 15px; }
  .social { list-style: none; padding: 0; margin: 0; display: flex; justify-content: center; gap: 12px; li { a { display:flex; align-items:center; justify-content:center; width:40px; height:40px; border-radius:50%; background:#f5f5f5; color:#666; text-decoration:none!important; transition: all 0.3s ease; font-size:16px; &:hover{ background:#667eea; color:#fff; transform: translateY(-3px);} } } }
}

/* Responsive (copied) */
@media only screen and (max-width: 991px) {
  .authentication-box { padding: 30px; }
  .authentication-box .container .bg-primary { padding: 40px; }
  .authentication-box .row { flex-direction: column; }
  :deep(.form-footer), :deep(.form-button) { text-align: center; }
}

@media only screen and (max-width: 767px) {
  .card-right { margin-left: 0; margin-top: -30px; }
  .card-right .card-body { padding: 25px 20px; }
}

@media only screen and (max-width: 575px) {
  .authentication-box { padding: 15px; }
  .authentication-box .btn-primary { margin-top: 10px; }
  .card-right { margin-left: 0; }
  .tab2-card .nav-item .nav-link { padding: 10px 15px; font-size: 14px; span { font-size: 16px; } }
  :deep(.form-footer), :deep(.form-button) { text-align: center; }
}

/* Small back button variant used inside the card */
.small-back {
  position: absolute !important;
  right: 18px !important;
  bottom: 18px !important;
  z-index: 20 !important;
  padding: 8px 16px 8px 40px !important;
  font-size: 13px !important;
  display: inline-flex !important;
  align-items: center;
  gap: 8px;
  border-radius: 25px !important;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

.small-back .icon,
.small-back svg {
  position: absolute;
  left: 12px;
  height: 16px;
  width: 16px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
