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
                  <li class="nav-item">
                    <a data-bs-toggle="tab" data-bs-target="#info" class="nav-link active">Account Info</a>
                  </li>
                  <li class="nav-item">
                    <a data-bs-toggle="tab" data-bs-target="#address" class="nav-link">Address Book</a>
                  </li>
                  <li class="nav-item">
                    <a data-bs-toggle="tab" data-bs-target="#orders" class="nav-link" @click="selectedOrder = null">
                      My Orders
                    </a>
                  </li>
                  <li class="nav-item">
                    <a data-bs-toggle="tab" data-bs-target="#profile" class="nav-link">Logout</a>
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
                      <h2>Account INFO</h2>
                    </div>
                    <div class="welcome-msg">
                      <p v-if="isAuthenticated">Hello, {{ userName || userEmail }} !</p>
                      <p v-else class="text-danger">กรุณาเข้าสู่ระบบเพื่อดูข้อมูล</p>
                    </div>
                    <div class="box-account box-info" v-if="isAuthenticated">
                      <div class="row">
                        <div class="col-sm-12"></div>
                      </div>
                      <div class="mt-3">
                        <div class="box">
                          <div class="box-title">
                            <h3>Address Book</h3>
                            <a href="javascript:void(0)" @click="changeTab('address')">Manage Addresses</a>
                          </div>
                          <div class="row">
                            <div class="col-sm-6">
                              <h6>Default Billing Address</h6>
                              <address v-if="defaultAddress">
                                {{ defaultAddress.firstName }} {{ defaultAddress.lastName }}<br>
                                {{ defaultAddress.address }} <br>
                                {{ defaultAddress.city }}, {{ defaultAddress.state }} {{ defaultAddress.pincode }}<br>
                                {{ defaultAddress.country }}<br>
                                Phone: {{ defaultAddress.phone }}<br>
                                <a href="javascript:void(0)" @click="openModal(defaultAddress)">Edit Address</a>
                              </address>
                              <address v-else>
                                You have not set a default billing address.<br />
                              </address>
                            </div>
                            <!-- <div class="col-sm-6">
                              <h6>Default Shipping Address</h6>
                              <address v-if="defaultAddress">
                                {{ defaultAddress.firstName }} {{ defaultAddress.lastName }}<br>
                                {{ defaultAddress.address }} <br>
                                {{ defaultAddress.city }}, {{ defaultAddress.state }} {{ defaultAddress.pincode }}<br>
                                {{ defaultAddress.country }}<br>
                                Phone: {{ defaultAddress.phone }}<br>
                                <a href="javascript:void(0)" @click="openModal(defaultAddress)">Edit Address</a>
                              </address>
                              <address v-else>
                                You have not set a default shipping address.<br />
                              </address>
                            </div> -->
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
                    <div class="page-title d-flex justify-content-between align-items-center mb-3">
                      <h2 class="mb-0">My Address</h2>
                      <button v-if="isAuthenticated" class="btn btn-solid btn-sm"
                        style="padding: 8px 16px; font-weight: 600;" @click="openModal(null)">
                        <i class="fa fa-plus mr-1"></i> Add New Address
                      </button>
                    </div>
                    <div v-if="isAuthenticated" class="box-account box-info mt-3">
                      <div class="row">
                        <div class="col-12 mb-3" v-for="(item, index) in addressList" :key="item.id || index">
                          <div class="box h-100" style="border: 1px solid #ddd; padding: 20px; position: relative;"
                            :style="item.isDefault ? 'border-color: #28a745; background-color: #f9fff9;' : ''">
                            <div class="box-title d-flex justify-content-between align-items-center mb-2">
                              <div class="d-flex align-items-center">
                                <label class="custom-radio d-flex align-items-center mb-0" style="cursor: pointer;">
                                  <input type="radio" name="defaultAddress" :checked="item.isDefault"
                                    @change="setDefaultAddress(item)"
                                    style="transform: scale(1.5); margin-right: 10px; cursor: pointer;">
                                  <h4 class="m-0 font-weight-bold">
                                    {{ item.firstName }} {{ item.lastName }}
                                    <span v-if="item.isDefault" class="badge badge-success ml-2"
                                      style="font-size: 11px; background-color: #28a745; color: white; padding: 3px 8px; border-radius: 4px; font-weight: normal;">Default</span>
                                  </h4>
                                </label>
                              </div>
                              <div class="d-flex align-items-center">
                                <a href="javascript:void(0)" class="text-secondary" style="margin-right: 15px;"
                                  @click="openModal(item)">Edit</a>
                                <a href="javascript:void(0)" class="text-danger" v-if="!item.isDefault"
                                  @click="deleteAddress(item)">Delete</a>
                              </div>
                            </div>
                            <div class="box-content pl-4 ml-2" style="border-left: 3px solid #eee;">
                              <address class="m-0 text-muted">
                                {{ item.address }}<br>{{ item.city }}, {{ item.state }} {{ item.pincode }}
                              </address>
                              <div class="mt-2 text-muted">
                                <span class="mr-3"><strong>Mobile:</strong> {{ item.phone }}</span>
                                <span><strong>Email:</strong> {{ item.email }}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else class="welcome-msg">
                      <p class="text-danger">กรุณาเข้าสู่ระบบเพื่อดูข้อมูลที่อยู่</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tab-pane fade" id="orders">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title mb-3" v-if="!selectedOrder">
                      <h2 class="mb-0">My Orders</h2>
                    </div>
                    <template v-if="isAuthenticated">
                      <div v-if="!selectedOrder">
                        <div v-if="orders && orders.length > 0">
                          <div v-for="(order, index) in orders" :key="index" class="card mb-3 border-0 shadow-sm">
                            <div
                              class="card-header bg-white border-bottom-0 d-flex justify-content-between align-items-center py-3">
                              <div>
                                <strong class="text-primary">{{ order.orderId }}</strong>
                                <span class="text-muted ms-2 small">{{ order.date }}</span>
                              </div>
                              <span class="badge rounded-pill" :class="getStatusClass(order.status)">
                                {{ order.status }}
                              </span>
                            </div>
                            <div class="card-body p-3">
                              <div class="row align-items-center">
                                <div class="col-md-2 text-center">
                                  <div class="bg-light rounded d-flex align-items-center justify-content-center"
                                    style="width: 80px; height: 80px; margin: 0 auto;">
                                    <i class="fa fa-shopping-bag text-secondary" style="font-size: 24px;"></i>
                                  </div>
                                </div>
                                <div class="col-md-7">
                                  <div class="mb-1 text-muted" style="font-size: 0.85rem;">
                                    ร้านค้า: <span class="fw-bold text-dark">{{ order.items[0].brand || 'Official Store'
                                    }}</span>
                                  </div>
                                  <h6 class="mb-1 text-dark">{{ order.items[0]?.name || 'สินค้า' }}</h6>
                                  <div class="text-muted small" v-if="order.items.length > 1">
                                    และสินค้าอื่นๆ อีก {{ order.items.length - 1 }} รายการ
                                  </div>
                                  <div class="text-muted small mt-1">ชำระโดย: {{ order.paymentMethod }}</div>
                                </div>
                                <div class="col-md-3 text-end">
                                  <div class="mb-2 fw-bold text-primary">฿{{ order.total.toLocaleString() }}</div>
                                  <button class="btn btn-outline-secondary btn-sm" style="min-width: 120px;"
                                    @click="selectedOrder = order">ดูรายละเอียด</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-else class="text-center py-5">
                          <p>ไม่พบประวัติการสั่งซื้อ</p>
                        </div>
                      </div>
                      <div v-else>
                        <OrderDetail :order="selectedOrder" @back="selectedOrder = null" />
                      </div>
                    </template>
                    <div v-else class="welcome-msg">
                      <p class="text-danger">กรุณาเข้าสู่ระบบเพื่อดูประวัติการสั่งซื้อ</p>
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
                      <p>คุณต้องการออกจากระบบหรือไม่?</p>
                      <button class="btn btn-solid btn-sm mt-3" @click="handleLogout">
                        Log Out
                      </button>
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

  <addAddressPop :show="showAddModal" :edit-data="selectedAddress" @close="closeModal" @save="handleSaveAddress" />
  <Footer />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'

import addressData from '~/data/address.json'
import ordersFile from '~/data/order.json'
import addAddressPop from './Address/addAddressPop.vue'
import OrderDetail from './orders/orderDetail.vue'

const auth = useAuthStore()
const router = useRouter()

const addressList = ref([])
const showAddModal = ref(false)
const selectedAddress = ref(null)
const selectedOrder = ref(null)
const orders = ref(ordersFile.data || [])

const getStatusClass = (status) => {
  switch (status) {
    case 'Accepted': return 'bg-success text-white'
    case 'Pending Review': return 'bg-warning text-dark'
    case 'Cancelled': return 'bg-danger text-white'
    default: return 'bg-secondary text-white'
  }
}

const changeTab = (tabId) => {
  if (import.meta.client) {
    const triggerEl = document.querySelector(`#top-tab a[data-bs-target="#${tabId}"]`)
    if (triggerEl) triggerEl.click()
  }
}

const defaultAddress = computed(() => {
  if (!addressList.value || addressList.value.length === 0) return null
  return addressList.value.find(item => item.isDefault) || addressList.value[0] || null
})

const isAuthenticated = computed(() => !!auth.isLoggedIn)
const userEmail = computed(() => auth.user || '')
const userName = computed(() => auth.userName || '')

onMounted(() => {
  if (import.meta.client) {
    if (typeof auth.initAuth === 'function') auth.initAuth()

    const storedAddresses = localStorage.getItem('my_app_addresses')
    if (storedAddresses) {
      addressList.value = JSON.parse(storedAddresses)
    } else {
      addressList.value = addressData || []
      localStorage.setItem('my_app_addresses', JSON.stringify(addressList.value))
    }
    sortAddresses()

    const storedOrders = localStorage.getItem('my_app_orders')
    const jsonOrders = ordersFile.data || []
    if (storedOrders) {
      try {
        const parsedStoredOrders = JSON.parse(storedOrders)
        orders.value = [...parsedStoredOrders, ...jsonOrders]
      } catch (e) { orders.value = jsonOrders }
    } else {
      orders.value = jsonOrders
    }
  }
})

watch(addressList, (newVal) => {
  if (import.meta.client) localStorage.setItem('my_app_addresses', JSON.stringify(newVal))
}, { deep: true })

const openModal = (item = null) => {
  if (item) selectedAddress.value = { ...item }
  else selectedAddress.value = null
  showAddModal.value = true
}
const closeModal = () => { showAddModal.value = false; selectedAddress.value = null }
const handleSaveAddress = (formData) => {
  if (formData.id) {
    const index = addressList.value.findIndex(item => item.id === formData.id)
    if (index !== -1) addressList.value[index] = { ...formData }
  } else {
    const newId = Date.now()
    addressList.value.push({ ...formData, id: newId })
  }
  closeModal()
}
const deleteAddress = (itemToDelete) => {
  if (confirm('Are you sure you want to delete this address?')) {
    addressList.value = addressList.value.filter(item => item.id !== itemToDelete.id)
  }
}
const sortAddresses = () => {
  addressList.value.sort((a, b) => (a.isDefault === b.isDefault) ? 0 : a.isDefault ? -1 : 1)
}
const setDefaultAddress = (selectedItem) => {
  addressList.value.forEach(item => item.isDefault = false)
  selectedItem.isDefault = true
  sortAddresses()
}

const handleLogout = () => {
  if (confirm('Are you sure you want to log out?')) {
    if (typeof auth.logout === 'function') auth.logout()
    else { auth.user = null; auth.isLoggedIn = false; }
    router.push('/')
  }
}
</script>

<style scoped>
.custom-radio input[type="radio"] {
  accent-color: #28a745;
}
</style>