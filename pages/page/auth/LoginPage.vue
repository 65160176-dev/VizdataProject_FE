<template>
  <div class="auth-wrapper">
    <!-- Decorative accent -->
    <div class="deco-star">✳</div>

    <!-- LEFT: Illustration -->
    <div class="auth-left">
      <NuxtLink to="/" class="back-btn">
        <Icon name="mdi:arrow-left" size="16" />
        <span>กลับหน้าหลัก</span>
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
          <h1 class="welcome-title">Welcome</h1>
          <p class="welcome-sub">We are glad to see you back with us</p>
        </div>

        <!-- Tabs -->
        <div class="auth-tabs">
          <button
            class="auth-tab-btn"
            :class="{ active: activeTab === 'login' }"
            @click="activeTab = 'login'"
          >เข้าสู่ระบบ</button>
          <button
            class="auth-tab-btn"
            :class="{ active: activeTab === 'register' }"
            @click="activeTab = 'register'"
          >สมัครสมาชิก</button>
        </div>

        <!-- Tab Content -->
        <div class="tab-body">
          <AuthLogin v-if="activeTab === 'login'" />
          <AuthRagister v-else />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import AuthLogin from "./AuthLogin.vue"
import AuthRagister from "./AuthRegister.vue"

const activeTab = ref<'login' | 'register'>('login')

definePageMeta({
  layout: "landing"
})
</script>
<style scoped lang="scss">
/* ─── Wrapper ──────────────────────────────────────────────── */
.auth-wrapper {
  position: relative;
  display: flex;
  width: 100vw;
  min-height: 100vh;
  background: #ffffff;
  overflow: hidden;
}

/* Starburst decoration */
.deco-star {
  position: absolute;
  left: -10px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 80px;
  color: #f97316;
  opacity: 0.1;
  pointer-events: none;
  z-index: 0;
  line-height: 1;
}

/* ─── LEFT: Illustration ───────────────────────────────────── */
.auth-left {
  flex: 1;
  display: flex;
  align-items: stretch;
  justify-content: center;
  padding: 0;
  position: relative;
  z-index: 1;
  background: #fff7f0;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 10%;
    height: 80%;
    width: 1px;
    background: #ffddcc;
  }
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
    border-radius: 0;
    display: block;
  }
}

/* ─── RIGHT: Form ──────────────────────────────────────────── */
.auth-right {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  position: relative;
  z-index: 1;
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

  .welcome-title {
    font-size: 40px;
    font-weight: 800;
    color: #111;
    margin: 0 0 6px;
    line-height: 1.1;
  }

  .welcome-sub {
    font-size: 14px;
    color: #aaa;
    margin: 0;
  }
}

/* ─── Tabs ─────────────────────────────────────────────────── */
.auth-tabs {
  display: flex;
  gap: 0;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 28px;
}

.auth-tab-btn {
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #ccc;
  cursor: pointer;
  transition: all 0.25s;

  &.active {
    color: #f97316;
    border-bottom-color: #f97316;
  }

  &:hover:not(.active) {
    color: #f97316;
    opacity: 0.7;
  }
}

/* ─── Deep form overrides ──────────────────────────────────── */
:deep(.auth-form) {
  .form-group {
    margin-bottom: 16px;
    position: relative;

    .input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: #bbb;
      pointer-events: none;
    }

    .form-control {
      width: 100%;
      border: 1.5px solid #ffddcc;
      border-radius: 10px;
      padding: 13px 14px 13px 42px;
      font-size: 14px;
      color: #333;
      background: #fff7f0;
      transition: all 0.25s;
      outline: none;

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
      color: #ccc;
      font-size: 13px;
      z-index: 5;

      span::before { content: '👁'; }
      span.show::before { content: '🙈'; }
    }
  }

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
        width: 16px;
        height: 16px;
        accent-color: #f97316;
        cursor: pointer;
      }

      label {
        font-size: 13px;
        color: #777;
        cursor: pointer;
      }
    }

    .forgot-pass {
      font-size: 13px;
      color: #ff6b35;
      text-decoration: none;
      font-weight: 500;

      &:hover { text-decoration: underline; }
    }
  }

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

  .form-footer {
    .divider {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
      color: #ccc;
      font-size: 13px;

      &::before,
      &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: #eee;
      }
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

      img.social-logo {
        width: 20px;
        height: 20px;
        object-fit: contain;
      }

      &:hover {
        border-color: #f97316;
        background: #fff7f0;
        transform: translateY(-1px);
      }

      &.fb-btn {
        color: #1877f2;
        border-color: #d0e4ff;
        background: #f5f8ff;

        &:hover { background: #edf2ff; border-color: #1877f2; }
      }
    }
  }
}

/* Alert messages */
:deep(.alert) {
  padding: 10px 14px;
  border-radius: 8px;
  margin-bottom: 16px;
  font-size: 13px;

  &.alert-success { background: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
  &.alert-danger  { background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
  &.alert-info    { background: #e7f3ff; color: #0c5460; border: 1px solid #bee5eb; }
}

/* ─── Responsive ───────────────────────────────────────────── */
@media (max-width: 900px) {
  .auth-wrapper { flex-direction: column; }
  .auth-left { display: none; }
  .auth-right { padding: 80px 24px 40px; flex: none; min-height: 100vh; }
  .auth-form-wrap { max-width: 100%; }
}
</style>
