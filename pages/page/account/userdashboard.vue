<template>
  <Header />
  <div>
    <WidgetsBreadcrumbs title="Dashboard" />
    <section class="dashboard-section section-b-space user-dashboard-section">
      <div class="container">
        <div class="row g-3">
          <div class="col-lg-3">
            <div class="dashboard-sidebar">
              <div class="faq-tab">
                <ul class="nav nav-tabs flex-column" id="top-tab" role="tablist">
                  <li class="nav-item"><a data-bs-toggle="tab" data-bs-target="#info" class="nav-link active">Account Info</a></li>
                  <li class="nav-item"><a data-bs-toggle="tab" data-bs-target="#address" class="nav-link">Address Book</a></li>
                  <li class="nav-item"><a data-bs-toggle="tab" data-bs-target="#orders" class="nav-link">My Orders</a></li>
                  <li class="nav-item"><a data-bs-toggle="tab" data-bs-target="#wishlist" class="nav-link">Newsletter</a></li>
                  <li class="nav-item"><a data-bs-toggle="tab" data-bs-target="#payment" class="nav-link">Change Password</a></li>
                  <li class="nav-item"><a data-bs-toggle="tab" data-bs-target="#profile" class="nav-link">Logout</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div class="col-lg-9">
            <div class="faq-content tab-content" id="top-tabContent">

              <div class="tab-pane fade show active" id="info">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>Account INFO</h2>
                    </div>
                    <div class="welcome-msg">
                      <p v-if="isAuthenticated">Hello, {{ userName || userEmail }} !</p>
                      <p v-else class="text-danger">กรุณาเข้าสู่ระบบเพื่อดูข้อมูล</p>
                    </div>
                    <div class="box-account box-info">
                      <div class="row">
                        <div class="col-sm-12">
                          
                        </div>
                      </div>
                      <div class="mt-3">
                        <div class="box">
                          <div class="box-title">
                            <h3>Address Book</h3>
                            <a href="#">Manage Addresses</a>
                          </div>
                          <div class="row">
                            <div class="col-sm-6">
                              <h6>Default Billing Address</h6>
                              <address>
                                You have not set a default billing address.<br />
                                <a href="#">Edit Address</a>
                              </address>
                            </div>
                            <div class="col-sm-6">
                              <h6>Default Shipping Address</h6>
                              <address>
                                You have not set a default shipping address.<br />
                                <a href="#">Edit Address</a>
                              </address>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tab-pane fade" id="address">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>My Dashboard</h2>
                    </div>
                    <div class="welcome-msg">
                      <p v-if="isAuthenticated">Hello, {{ userName || userEmail }} !</p>
                    </div>
                    <div class="box-account box-info">
                        <div class="box-head"><h2>Address Book</h2></div>
                        <div class="row">
                            <div class="col-sm-6">
                                <div class="box">
                                    <div class="box-title"><h3>Default Billing Address</h3><a href="#">Edit</a></div>
                                    <div class="box-content"><address>You have not set a default billing address.</address></div>
                                </div>
                            </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tab-pane fade" id="orders">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>My Orders</h2>
                    </div>
                    
                    <div v-if="orders && orders.length > 0">
                      <div v-for="(order, index) in orders" :key="index" class="card mb-3 border-0 shadow-sm" style="background: #fff;">
                        
                        <div class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center py-3">
                          <div class="d-flex align-items-center gap-2">
                            <strong style="font-size: 14px;">{{ order.shopName || 'Shop Unknown' }}</strong>
                          </div>
                          <div class="d-flex align-items-center gap-2" style="font-size: 14px;">
                            <span class="text-muted">Status: </span>
                            <span :class="order.statusClass" style="margin-left:6px">{{ order.status }}</span>
                          </div>
                        </div>

                        <div class="card-body p-3">
                          <div class="row align-items-center">
                            
                            <div class="col-md-2 d-flex gap-2">
                              <img 
                                :src="order.items?.[0]?.image || '/images/placeholder.png'" 
                                alt="thumb" 
                                style="width:80px; height:80px; object-fit:cover; border-radius:6px;" 
                              />
                              <div class="d-flex flex-column gap-2">
                                <div v-for="(it, t) in (order.items || []).slice(0,3)" :key="t" style="width:48px; height:48px; overflow:hidden; border-radius:4px;">
                                  <img :src="it.image || '/images/placeholder.png'" style="width:100%; height:100%; object-fit:cover;" />
                                </div>
                              </div>
                            </div>

                            <div class="col-md-7">
                              <h6 class="mb-1">{{ order.items?.[0]?.name || 'สินค้าไม่ระบุชื่อ' }}</h6>
                              <div class="text-muted small">
                                {{ order.items?.length || 0 }} รายการ — {{ order.note || '' }}
                              </div>
                            </div>

                            <div class="col-md-3 text-end">
                              <div class="mb-2">฿{{ order.totalPrice }}</div>
                              <div class="d-flex justify-content-end gap-2">
                                <nuxt-link :to="`/page/account/orders/${order.id}`" class="btn btn-outline-secondary" style="font-size:14px; min-width:120px;">
                                  ดูรายละเอียด
                                </nuxt-link>
                              </div>
                            </div>

                          </div>
                        </div> </div>
                    </div>
                    
                    <div v-else class="text-center py-5">
                        <p>ไม่พบประวัติการสั่งซื้อ</p>
                    </div>

                  </div>
                </div>
              </div>

              <div class="tab-pane fade" id="wishlist">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>Newsletter</h2>
                    </div>
                    <div class="welcome-msg">
                        <p>You are currently not subscribed to any newsletter.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tab-pane fade" id="payment">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>Change password</h2>
                    </div>
                    <div class="box-account box-info">
                        <div class="box-head">
                            <h2>Account Information</h2>
                        </div>
                        <div class="row">
                             <div class="col-sm-6">
                                
                             </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tab-pane fade" id="profile">
                 <div class="dashboard-right">
                    <div class="dashboard">
                         <div class="page-title"><h2>Log Out</h2></div>
                         <div class="welcome-msg"><p>Log out From your Account Dashboard.</p></div>
                    </div>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Footer />
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useAuthStore } from '~/store/auth'

// *** ตรวจสอบชื่อไฟล์ให้ดีว่ามี 's' หรือไม่ (order.json หรือ orders.json) ***
// ถ้าไฟล์จริงชื่อ orders.json ให้แก้บรรทัดด้านล่างเป็น '~/data/orders.json'
import ordersData from '~/data/order.json'

const auth = useAuthStore()

// Sync store with localStorage
onMounted(() => {
  if (import.meta.client && typeof auth.initAuth === 'function') auth.initAuth()
})

const isAuthenticated = computed(() => !!auth.isLoggedIn)
const userEmail = computed(() => auth.user || '')
const userName = computed(() => auth.userName || '')

// ใช้ fallback empty array เผื่อ import ไม่เจอ
const orders = ref(ordersData || [])
</script>

<style scoped>
/* ใส่ style ที่ต้องการ หรือปล่อยว่างไว้ถ้ารับจาก global css */
</style>