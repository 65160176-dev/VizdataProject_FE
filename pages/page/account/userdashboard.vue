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
                      <h2>Dashboard</h2>
                    </div>
                    <div class="welcome-msg">
                      <p v-if="isAuthenticated">Hello, {{ userName || userEmail }} !</p>
                      <p v-else class="text-danger">กรุณาเข้าสู่ระบบเพื่อดูข้อมูล</p>
                      <p class="mt-2">From your My Account Dashboard you have the ability to view a snapshot...</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tab-pane fade" id="address">
                <div class="dashboard-right">
                  <div class="dashboard">

                    <div class="page-title d-flex justify-content-between align-items-center">
                      <h2 class="m-0">My Address</h2>
                      <button class="btn btn-solid btn-sm" style="padding: 8px 16px; font-weight: 600;"
                        @click="openModal(null)">
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
                                      style="font-size: 11px; background-color: #28a745; color: white; padding: 3px 8px; border-radius: 4px; font-weight: normal;">
                                      Default
                                    </span>
                                  </h4>
                                </label>
                              </div>

                              <div class="d-flex align-items-center">
                                <a href="javascript:void(0)" class="text-secondary" style="margin-right: 15px;"
                                  @click="openModal(item)">
                                  Edit
                                </a>

                                <a href="javascript:void(0)" class="text-danger" v-if="!item.isDefault"
                                  @click="deleteAddress(item)">
                                  Delete
                                </a>
                              </div>
                            </div>

                            <div class="box-content pl-4 ml-2" style="border-left: 3px solid #eee;">
                              <address class="m-0 text-muted">
                                {{ item.address }}<br>
                                {{ item.city }}, {{ item.state }} {{ item.pincode }}
                              </address>
                              <div class="mt-2 text-muted">
                                <span class="mr-3"><strong>Mobile:</strong> {{ item.phone }}</span>
                                <span style="margin-left: 15px;"><strong>Email:</strong> {{ item.email }}</span>
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
                    <div class="page-title">
                      <h2>My Orders</h2>
                    </div>
                    <div class="text-center py-5">
                      <p>ไม่พบประวัติการสั่งซื้อ</p>
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
                  </div>
                </div>
              </div>
              <div class="tab-pane fade" id="profile">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>Log Out</h2>
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
import { useAuthStore } from '~/store/auth'
import addressData from '~/data/address.json'
import ordersData from '~/data/order.json'
import addAddressPop from './Address/addAddressPop.vue'

const auth = useAuthStore()

// State
const addressList = ref([])
const orders = ref(ordersData || [])
const showAddModal = ref(false)
const selectedAddress = ref(null)

// --- Load Data ---
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
  }
})

// --- Watcher ---
watch(addressList, (newVal) => {
  if (import.meta.client) {
    localStorage.setItem('my_app_addresses', JSON.stringify(newVal))
  }
}, { deep: true })

// --- Functions ---
const openModal = (item = null) => {
  if (item) {
    selectedAddress.value = { ...item }
  } else {
    selectedAddress.value = null
  }
  showAddModal.value = true
}

const closeModal = () => {
  showAddModal.value = false
  selectedAddress.value = null
}

const handleSaveAddress = (formData) => {
  if (formData.id) {
    const index = addressList.value.findIndex(item => item.id === formData.id)
    if (index !== -1) {
      addressList.value[index] = { ...formData }
    }
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
  addressList.value.sort((a, b) => {
    return (a.isDefault === b.isDefault) ? 0 : a.isDefault ? -1 : 1
  })
}

const setDefaultAddress = (selectedItem) => {
  // ปรับทุกตัวเป็น false ก่อน
  addressList.value.forEach(item => {
    item.isDefault = false
  })
  // ปรับตัวที่เลือกเป็น true
  selectedItem.isDefault = true

  // เรียงลำดับใหม่ (เอา Default ขึ้นบน)
  sortAddresses()
}

const isAuthenticated = computed(() => !!auth.isLoggedIn)
const userEmail = computed(() => auth.user || '')
const userName = computed(() => auth.userName || '')
</script>

<style scoped>
/* Optional style for radio button alignment */
.custom-radio input[type="radio"] {
  accent-color: #28a745;
  /* เปลี่ยนสีจุด Radio เป็นสีเขียว */
}
</style>