<template>
  <div class="page-wrapper">
    <div class="authentication-box">
      <div class="container">
        <div class="row">
          <CardLeft />
          <div class="col-md-7 p-0 card-right">
            <div class="card tab2-card">
              <div class="card-body">
                <ul
                  class="nav nav-tabs nav-material"
                  id="top-tab"
                  role="tablist"
                >
                  <li class="nav-item">
                    <a class="nav-link active" id="top-profile-tab" data-bs-toggle="tab" href="#top-profile" role="tab" aria-controls="top-profile" aria-selected="true" ><span class="icon-user me-2"></span>Login</a
                    >
                  </li>
                  <li class="nav-item">
                    <a  class="nav-link"  id="contact-top-tab"  data-bs-toggle="tab"  href="#top-contact"  role="tab"  aria-controls="top-contact"  aria-selected="false"  ><span class="icon-unlock me-2"></span>Register</a>
                  </li>
                </ul>
                <div class="tab-content" id="top-tabContent">
                    <AuthLogin/>
                    <AuthRagister/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <NuxtLink to="/" class="btn btn-primary back-btn"
          ><Icon name="mdi:arrow-left"></Icon>back</NuxtLink
        >
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import CardLeft from "./CardLeft.vue";
import AuthLogin from "./AuthLogin.vue"
import AuthRagister from "./AuthRegister.vue"

// Nuxt.js page metadata
definePageMeta({
  layout: "default"
})
</script>
<style scoped lang="scss">
/* Auth Page Main Styles */
.page-wrapper {
  min-height: 100vh;
  background: #f8f9fa;
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

/* Back Button */
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

/* Card Right Side */
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
}

.card-right .card-body {
  padding: 30px;
}

/* Tab Navigation */
.tab2-card .nav-tabs {
  border-bottom: 2px solid #eee;
  margin-bottom: 25px;
}

.tab2-card .nav-item {
  margin-bottom: -2px;
}

.tab2-card .nav-item .nav-link {
  display: flex !important;
  align-items: center;
  padding: 12px 20px;
  border: none;
  border-bottom: 2px solid transparent;
  color: #666;
  font-weight: 500;
  transition: all 0.3s ease;
  background: transparent;
  
  &:hover {
    color: #667eea;
    border-bottom-color: #667eea;
  }
  
  &.active {
    color: #667eea;
    border-bottom-color: #667eea;
    background: transparent;
  }
  
  span {
    font-size: 18px;
  }
}

/* Tab Content */
.tab-content {
  padding: 10px 0;
}

/* Form Styles */
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
    
    &::placeholder {
      color: #aaa;
    }
  }
  
  .show-hide {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    
    span {
      &::before {
        content: '\f06e';
        font-family: 'FontAwesome';
        color: #999;
      }
      
      &.show::before {
        content: '\f070';
      }
    }
  }
}

/* Form Terms & Checkbox */
:deep(.form-terms) {
  margin-bottom: 20px;
  
  .form-check {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .form-check-input {
    margin-top: 0;
    cursor: pointer;
    
    &:checked {
      background-color: #667eea;
      border-color: #667eea;
    }
  }
  
  .form-check-label {
    color: #666;
    font-size: 14px;
  }
}

/* Forgot Password Link */
:deep(.forgot-pass) {
  padding: 0;
  float: right;
  color: #ff8084;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.3s ease;
  
  &:hover {
    color: #e85c60;
    text-decoration: underline;
  }
}

/* Form Button */
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
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
    }
  }
}

/* Social Footer */
:deep(.form-footer) {
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
  
  span {
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
          background: #667eea;
          color: #fff;
          transform: translateY(-3px);
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
  .authentication-box {
    padding: 30px;
  }
  
  .authentication-box .container .bg-primary {
    padding: 40px;
  }
  
  .authentication-box .row {
    flex-direction: column;
  }
  
  :deep(.form-footer),
  :deep(.form-button) {
    text-align: center;
  }
}

@media only screen and (max-width: 767px) {
  .card-right {
    margin-left: 0;
    margin-top: -30px;
  }
  
  .card-right .card-body {
    padding: 25px 20px;
  }
}

@media only screen and (max-width: 575px) {
  .authentication-box {
    padding: 15px;
  }
  
  .authentication-box .btn-primary {
    margin-top: 10px;
  }
  
  .card-right {
    margin-left: 0;
  }
  
  .tab2-card .nav-item .nav-link {
    padding: 10px 15px;
    font-size: 14px;
    
    span {
      font-size: 16px;
    }
  }
  
  :deep(.form-footer),
  :deep(.form-button) {
    text-align: center;
  }
}
</style>
