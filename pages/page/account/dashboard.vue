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
                  <li class="nav-item"><a data-bs-toggle="tab" data-bs-target="#info" class="nav-link active">Account
                      Info</a></li>
                  <li class="nav-item"><a data-bs-toggle="tab" data-bs-target="#address" class="nav-link">ยังไม่ได้คิด</a></li>
                  <li class="nav-item"><a data-bs-toggle="tab" data-bs-target="#orders" class="nav-link">My Orders</a>
                  </li>
                  <li class="nav-item"><a data-bs-toggle="tab" data-bs-target="#payment" class="nav-link">Change
                      Password</a></li>
                  <li class="nav-item"><a data-bs-toggle="tab" data-bs-target="#profile" class="nav-link">Logout</a>
                  </li>
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
                      <h2>Account Information</h2>
                    </div>
                    <div class="welcome-msg">
                      <p>Hello, {{ userName || userEmail || 'Guest' }} !</p>
                      <p>From your My Account Dashboard you have the ability to view a snapshot of your recent account
                        activity and update your account information. Select a link below to view or edit information.
                      </p>
                    </div> -->
                    <div class="box-account box-info">
                      <!-- <div class="box-head">
                        <h2>Account Information</h2>
                      </div> -->

                      <div class="row">
                        <div class="col-sm-12">
                          <div class="box">
                            <div class="box-title">
                              <h3>Contact Information</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <h6>{{ userName || userEmail }}</h6>
                              <h6>{{ userEmail }}</h6>
                              <h6>
                                <a href="#">Change Password</a>
                              </h6>
                            </div>
                          </div>
                        </div>

                        <!-- <div class="col-sm-12 mt-3">
                          <div class="box">
                            <div class="box-title">
                              <h3>Newsletters</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <p>You are currently not subscribed to any newsletter.</p>
                            </div>
                          </div>
                        </div> -->

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
                      <p>Hello, {{ userName || userEmail || 'Guest' }} !</p>
                      <p>From your My Account Dashboard you have the ability to view a snapshot of your recent account
                        activity and update your account information. Select a link below to view or edit information.
                      </p>
                    </div>
                    <div class="box-account box-info">
                      <div class="box-head">
                        <h2>Account Information</h2>
                      </div>
                      <div class="row">
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Contact Information</h3>
                              <a href="javascript.void(0)">Edit</a>
                            </div>
                            <div class="box-content">
                              <h6>{{ userName || userEmail }}</h6>
                              <h6>{{ userEmail }}</h6>
                              <h6>
                                <a href="#">Change Password</a>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Newsletters</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <p>You are currently not subscribed to any newsletter.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="box">
                          <div class="box-title">
                            <h3>Address Book</h3>
                            <a href="#">Manage Addresses</a>
                          </div>
                          <div class="row">
                            <div class="col-sm-6">
                              <h6>Default Billing Address</h6>
                              <address>
                                You have not set a default billing address.
                                <br />
                                <a href="#">Edit Address</a>
                              </address>
                            </div>
                            <div class="col-sm-6">
                              <h6>Default Shipping Address</h6>
                              <address>
                                You have not set a default shipping address.
                                <br />
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
              <div class="tab-pane fade" id="test">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>My orders</h2>
                    </div>
                      <div class="welcome-msg">
                      <p>Hello, {{ userName || userEmail || 'Guest' }} !</p>
                      <p>From your Orders you have the ability to view your all orders and status of order.</p>
                    </div>
                    <div class="box-account box-info">
                      <div class="box-head">
                        <h2>Order Information</h2>
                      </div>
                      <div>
                        <div class="box">
                          <div class="box-title mb-3">
                            <h3>orders list</h3>
                            <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum
                              has been the industry's standard dummy text ever since the 1500s,</p>
                          </div>
                          <div class="row">
                            <div class="col-sm-6">
                              <h4>Order no: 2105</h4>
                              <h6>Slim Fit Cotton Shirt</h6>
                            </div>
                            <div class="col-sm-6">
                              <h4>Order no: 1032</h4>
                              <h6>Slim Fit Cotton Shirt</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="box mt-2">
                          <div class="row">
                            <div class="col-sm-6">
                              <h4>Order no: 2105</h4>
                              <h6>Slim Fit Cotton Shirt</h6>
                            </div>
                            <div class="col-sm-6">
                              <h4>Order no: 1032</h4>
                              <h6>Slim Fit Cotton Shirt</h6>
                            </div>
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

                    <div v-for="(order, index) in orders" :key="index" class="card mb-3 border-0 shadow-sm"
                      style="background: #fff;">

                      <div
                        class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center py-3">
                        <div class="d-flex align-items-center gap-2">
                          <strong style="font-size: 14px;">{{ order.shopName }}</strong>
                          <!-- <button class="btn btn-sm btn-outline-secondary py-0 px-2"
                            style="font-size: 12px;">แชทเลย</button>
                          <a href="#" class="btn btn-sm btn-outline-secondary py-0 px-2 text-decoration-none"
                            style="font-size: 12px;">ดูร้านค้า</a> -->
                        </div>
                        <div class="d-flex align-items-center gap-2" style="font-size: 14px;">
                          <span class="text-success" v-if="order.status === 'สำเร็จแล้ว'"><i class="fa fa-truck"></i>
                            พัสดุจัดส่งสำเร็จแล้ว | </span>
                          <span style="color: #ee4d2d;">{{ order.status }}</span>
                        </div>
                      </div>

                      <hr class="m-0" style="opacity: 0.1;">

                      <div class="card-body p-0">
                        <div v-for="(item, i) in order.items" :key="i" class="p-3 border-bottom">
                          <div class="d-flex">
                            <div
                              class="flex-shrink-0 bg-light border d-flex align-items-center justify-content-center text-muted"
                              style="width: 80px; height: 80px; font-size: 12px;">
                              No Image
                            </div>

                            <div class="flex-grow-1 ms-3">
                              <h6 class="mb-1" style="font-size: 14px; line-height: 1.4;">
                                {{ item.name }}
                              </h6>
                              <div class="text-muted" style="font-size: 12px;">ตัวเลือกสินค้า: {{ item.variant }}</div>
                              <div class="text-muted" style="font-size: 12px;">x{{ item.quantity }}</div>
                            </div>

                            <div class="text-end ps-3">
                              <div v-if="item.originalPrice" class="text-decoration-line-through text-muted"
                                style="font-size: 12px;">
                                ฿{{ item.originalPrice }}
                              </div>
                              <div style="font-size: 14px;">
                                ฿{{ item.price }}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="card-footer bg-white border-top-0 py-3">
                        <div class="d-flex justify-content-end align-items-center mb-3">
                          <span class="me-2" style="font-size: 14px;">ยอดคำสั่งซื้อทั้งหมด:</span>
                          <strong style="font-size: 20px;">฿{{ order.totalPrice }}</strong>
                        </div>

                        <div class="d-flex justify-content-end gap-2">
                          <nuxt-link :to="'/page/account/orders/_id'" class="btn btn-outline-secondary"
                            style="font-size: 14px; min-width: 120px;">
                            ดูรายละเอียด
                          </nuxt-link>
                        </div>
                      </div>

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
                      <p>Hello, MARK JECNO !</p>
                      <p>you how all this mistaken idea of denouncing pleasure and praising pain was born and I will
                        give you a complete account of the system, and expound the actual teachings.</p>
                      <p>Sed Ut Perspiciatis Unde Omnis Iste Natus Error Sit Voluptatem Accusantium Doloremque
                        Laudantium</p>
                      <p>On the other hand, we denounce with righteous indignation and dislike men who are so beguiled
                        and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot
                        foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail
                        in their duty through weakness of will, which is the same as saying through shrinking from toil
                        and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our
                        power of choice is untrammelled and when nothing prevents our being able to do what we like
                        best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and
                        owing to the claims of duty or the obligations of business it will frequently occur that
                        pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in
                        these matters to this principle of selection: he rejects pleasures to secure other greater
                        pleasures, or else he endures pains to avoid worse pains.</p>
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
                    <div class="welcome-msg">
                      <p>Hello, MARK JECNO !</p>
                      <p>you how all this mistaken idea of denouncing pleasure and praising pain was born and I will
                        give you a complete account of the system, and expound the actual teachings.</p>
                      <p>Sed Ut Perspiciatis Unde Omnis Iste Natus Error Sit Voluptatem Accusantium Doloremque
                        Laudantium</p>
                      <p>On the other hand, we denounce with righteous indignation and dislike men who are so beguiled
                        and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot
                        foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail
                        in their duty through weakness of will, which is the same as saying through shrinking from toil
                        and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our
                        power of choice is untrammelled and when nothing prevents our being able to do what we like
                        best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and
                        owing to the claims of duty or the obligations of business it will frequently occur that
                        pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in
                        these matters to this principle of selection: he rejects pleasures to secure other greater
                        pleasures, or else he endures pains to avoid worse pains.</p>
                    </div>
                    <div class="box-account box-info">
                      <div class="box-head">
                        <h2>Account Information</h2>
                      </div>
                      <div class="row">
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Contact Information</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <h6>{{ userName || userEmail }}</h6>
                              <h6>{{ userEmail }}</h6>
                              <h6>
                                <a href="#">Change Password</a>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Newsletters</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <p>You are currently not subscribed to any newsletter.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="profile">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>Log Out</h2>
                    </div>
                    <div class="welcome-msg">
                      <p>Hello, MARK JECNO !</p>
                      <p>Log out From your Account Dashboard. Select a link below to view or edit information.</p>
                    </div>
                    <div class="box-account box-info">
                      <div class="box-head">
                        <h2>Account Information</h2>
                      </div>
                      <div class="row">
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Contact Information</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <h6>MARK JECNO</h6>
                              <h6>MARk-JECNO@gmail.com</h6>
                              <h6>
                                <a href="#">Change Password</a>
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div class="col-sm-6">
                          <div class="box">
                            <div class="box-title">
                              <h3>Newsletters</h3>
                              <a href="#">Edit</a>
                            </div>
                            <div class="box-content">
                              <p>You are currently not subscribed to any newsletter.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="box">
                          <div class="box-title">
                            <h3>Address Book</h3>
                            <a href="#">Manage Addresses</a>
                          </div>
                          <div class="row">
                            <div class="col-sm-6">
                              <h6>Default Billing Address</h6>
                              <address>
                                You have not set a default billing address.
                                <br />
                                <a href="#">Edit Address</a>
                              </address>
                            </div>
                            <div class="col-sm-6">
                              <h6>Default Shipping Address</h6>
                              <address>
                                You have not set a default shipping address.
                                <br />
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
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Footer />
</template>
<script setup>
import { computed } from 'vue'
import { useAuthStore } from '~/store/auth'

const auth = useAuthStore()

const userEmail = computed(() => {
  if (auth.user) return auth.user
  if (import.meta.client) return localStorage.getItem('user') || ''
  return ''
})

const userName = computed(() => {
  // auth store does not define userName in state; prefer localStorage fallback
  if (auth.userName) return auth.userName
  if (import.meta.client) return localStorage.getItem('userName') || ''
  return ''
})
</script>
