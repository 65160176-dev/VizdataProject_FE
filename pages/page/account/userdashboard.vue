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
                      <div v-if="isAuthenticated" class="d-flex align-items-center gap-3">
                        <img :src="avatarSrc" alt="avatar" class="rounded-circle" style="width:72px;height:72px;object-fit:cover;border:1px solid #e9ecef;">
                        <div>
                          <p class="mb-1">Hello,</p>
                          <div class="d-flex align-items-center gap-2">
                            <div v-if="!editingName">
                              <strong>{{ editableName || userName || userEmail }}</strong>
                              <button class="btn btn-link btn-sm" @click="editingName = true">Edit</button>
                            </div>
                            <div v-else class="d-flex gap-2">
                              <input v-model="editableName" type="text" class="form-control form-control-sm" style="min-width:180px;" />
                              <button class="btn btn-sm btn-primary" @click="saveName">Save</button>
                              <button class="btn btn-sm btn-secondary" @click="cancelEditName">Cancel</button>
                            </div>
                          </div>
                          <div class="mt-2">
                            <label class="btn btn-outline-secondary btn-sm mb-0" style="padding:6px 10px;">
                              Change Photo
                              <input type="file" accept="image/*" @change="onAvatarSelected" style="display:none" />
                            </label>

                            <div v-if="pendingAvatarPreview" class="mt-2 d-flex gap-2 align-items-center">
                              <img :src="pendingAvatarPreview" alt="preview" style="width:56px;height:56px;object-fit:cover;border-radius:50%;border:1px solid #e9ecef;" />
                              <div>
                                <button class="btn btn-sm btn-primary me-1" @click="saveAvatar">Save</button>
                                <button class="btn btn-sm btn-secondary" @click="cancelAvatar">Cancel</button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
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
                        <div
                          class="d-flex w-100 overflow-auto mb-4 pb-2 border-bottom text-nowrap custom-scrollbar gap-2">
                          <button v-for="tab in tabs" :key="tab.value" class="btn rounded-pill px-3 flex-fill"
                            :class="activeTab === tab.value ? 'btn-dark' : 'btn-outline-secondary border-0'"
                            @click="activeTab = tab.value">
                            {{ tab.label }}
                            <span class="small ms-1 opacity-75">({{ getCount(tab.value) }})</span>
                          </button>
                        </div>
                        <div v-if="filteredOrders && filteredOrders.length > 0">
                          <div v-for="(order, index) in paginatedOrders" :key="index"
                            class="card mb-3 border-0 shadow-sm">
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
                                  <NuxtLink
                                    :to="`/product/three-column/thumbnail-left?id=${order.items[0].id || order.items[0].productId || '1'}`"
                                    class="bg-light rounded d-flex align-items-center justify-content-center"
                                    style="width: 80px; height: 80px; margin: 0 auto; overflow: hidden; text-decoration: none;"
                                    @click.stop>
                                    <img v-if="order.items[0].image" :src="order.items[0].image"
                                      class="w-100 h-100 rounded" style="object-fit: cover;">
                                    <i v-else class="fa fa-shopping-bag text-secondary" style="font-size: 24px;"></i>
                                  </NuxtLink>
                                </div>
                                <div class="col-md-6 d-flex flex-column justify-content-center"
                                  style="min-height: 100px;">
                                  <div class="mb-1 text-muted" style="font-size: 0.85rem;">
                                    ร้านค้า:
                                    <NuxtLink
                                      :to="`/seller/${order.shopName || order.items[0].brand || 'official-store'}`"
                                      class="fw-bold text-dark text-decoration-none hover-underline" @click.stop>
                                      {{ order.shopName || order.items[0].brand || 'Official Store' }}
                                    </NuxtLink>
                                  </div>
                                  <NuxtLink
                                    :to="`/product/three-column/thumbnail-left?id=${order.items[0].id || order.items[0].productId || '1'}`"
                                    class="mb-1 text-dark text-truncate text-decoration-none hover-underline"
                                    style="max-width: 100%; font-weight: 600;" @click.stop>
                                    {{ order.items[0]?.name || 'สินค้า' }}
                                  </NuxtLink>
                                  <div class="text-muted small" v-if="order.items.length > 1">
                                    และสินค้าอื่นๆ อีก {{ order.items.length - 1 }} รายการ
                                  </div>
                                  <div class="text-muted small mt-1">ชำระโดย: {{ order.paymentMethod }}</div>
                                </div>
                                <div class="col-md-4 text-end">
                                  <div class="mb-2 fw-bold text-primary">฿{{ order.total.toLocaleString() }}</div>
                                  <button class="btn btn-outline-secondary btn-sm" style="min-width: 120px;"
                                    @click.stop="selectedOrder = order">ดูรายละเอียด</button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div class="d-flex justify-content-center mt-4 mb-3" v-if="totalPages > 1">
                            <nav aria-label="Page navigation">
                              <ul class="pagination">
                                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                  <button class="page-link" @click="changePage(currentPage - 1)" aria-label="Previous">
                                    <span aria-hidden="true">&laquo;</span>
                                  </button>
                                </li>
                                <li class="page-item" v-for="page in totalPages" :key="page"
                                  :class="{ active: currentPage === page }">
                                  <button class="page-link" @click="changePage(page)">{{ page }}</button>
                                </li>
                                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                  <button class="page-link" @click="changePage(currentPage + 1)" aria-label="Next">
                                    <span aria-hidden="true">&raquo;</span>
                                  </button>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        </div>
                        <div v-else class="text-center py-5">
                          <i class="fa fa-clipboard-list text-muted mb-3" style="font-size: 48px; opacity: 0.3;"></i>
                          <p class="text-muted">ไม่มีรายการคำสั่งซื้อในสถานะนี้</p>
                        </div>
                      </div>
                      <div v-else>
                        <OrderDetail :order="selectedOrder" @back="selectedOrder = null" @cancel="handleOrderCancel"
                          @update="saveOrderChanges" />
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
  <delAddrPop v-if="showDeleteModal" @close="showDeleteModal = false" @confirm="confirmDeleteAddress" />

  <Footer />
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { useRuntimeConfig } from '#imports'

import addressData from '~/data/address.json'
import ordersFile from '~/data/order.json'
import addAddressPop from './Address/addAddressPop.vue'
import delAddrPop from './Address/delAddrPop.vue'
import OrderDetail from './orders/orderDetail.vue'

const auth = useAuthStore()
const router = useRouter()

const config = useRuntimeConfig()
const API_BASE = config.public?.apiBase || 'http://localhost:3001/api'
const BACKEND_URL = 'http://localhost:3001'

const addressList = ref([])
const showAddModal = ref(false)
const selectedAddress = ref(null)
const selectedOrder = ref(null)
const orders = ref(ordersFile.data || [])

// [เพิ่ม] ตัวแปรสำหรับ Popup ลบที่อยู่
const showDeleteModal = ref(false)
const addressToDelete = ref(null)

// --- ส่วน Pagination ---
// ... (code pagination เดิม) ...
const currentPage = ref(1)
const itemsPerPage = 5

const saveOrderChanges = (updatedOrder) => {
  const index = orders.value.findIndex(o => o.orderId === updatedOrder.orderId)
  if (index !== -1) {
    orders.value[index] = updatedOrder
    orders.value = [...orders.value]
  }
}

const totalPages = computed(() => {
  return Math.ceil(filteredOrders.value.length / itemsPerPage)
})

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredOrders.value.slice(start, end)
})

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
// --------------------

const activeTab = ref('all')

const tabs = [
  { label: 'ทั้งหมด', value: 'all' },
  { label: 'รอยืนยัน', value: 'pending' },
  { label: 'กำลังเตรียมสินค้า', value: 'processing' },
  { label: 'ที่ต้องได้รับ', value: 'shipping' },
  { label: 'สำเร็จ', value: 'completed' },
  { label: 'ยกเลิก', value: 'cancelled' },
]

const filteredOrders = computed(() => {
  if (activeTab.value === 'all') return orders.value

  return orders.value.filter(o => {
    const s = o.status

    if (activeTab.value === 'pending') {
      return s === 'Pending Review' || s === 'Pending'
    }

    if (activeTab.value === 'processing') return s === 'Accepted' || s === 'Processing'
    if (activeTab.value === 'accepted') return s === 'Shipping'
    if (activeTab.value === 'shipping') return s === 'Shipped' || s === 'Arrived'
    if (activeTab.value === 'completed') return s === 'Completed' || s === 'Delivered'

    if (activeTab.value === 'cancelled') {
      return s === 'Cancelled' || s === 'Cancel Requested'
    }

    return false
  })
})

watch(activeTab, () => {
  currentPage.value = 1
})

const getCount = (tabValue) => {
  if (tabValue === 'all') return orders.value.length
  return orders.value.filter(o => {
    const s = o.status

    if (tabValue === 'pending') {
      return s === 'Pending Review' || s === 'Pending'
    }

    if (tabValue === 'processing') return s === 'Accepted' || s === 'Processing'
    if (tabValue === 'accepted') return s === 'Shipping'
    if (tabValue === 'shipping') return s === 'Shipped' || s === 'Arrived'
    if (tabValue === 'completed') return s === 'Completed' || s === 'Delivered'

    if (tabValue === 'cancelled') {
      return s === 'Cancelled' || s === 'Cancel Requested'
    }

    return false
  }).length
}

const getStatusClass = (status) => {
  switch (status) {
    case 'Accepted': return 'bg-success text-white'
    case 'Pending Review':
    case 'Pending':
      return 'bg-warning text-dark'
    case 'Shipping': return 'bg-info text-white'
    case 'Shipped': return 'bg-info text-white'
    case 'Arrived': return 'bg-info text-white'
    case 'Completed': return 'bg-secondary text-white'
    case 'Cancel Requested':
    case 'Cancelled': return 'bg-danger text-white'
    default: return 'bg-light text-dark border'
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

// Avatar & editable name
const editableName = ref('')
const editingName = ref(false)
const avatarSrc = ref('/images/default-avatar.png')

// pending avatar before save
const pendingAvatarFile = ref(null)
const pendingAvatarPreview = ref(null)

const updateLocalAuth = (updatedUser) => {
  if (!updatedUser) return
  // update auth store and localStorage
  auth.user = updatedUser
  auth.userName = updatedUser.username || auth.userName
  if (import.meta.client) {
    try {
      localStorage.setItem('user', JSON.stringify(updatedUser))
      localStorage.setItem('userName', auth.userName)
    } catch (e) {}
  }
}

const initAvatarAndName = () => {
  // prefer server-provided avatar (auth.user.avatar) -> default
  if (auth.user && auth.user.avatar) {
    avatarSrc.value = auth.user.avatar.startsWith('http') ? auth.user.avatar : (`${BACKEND_URL}${auth.user.avatar}`)
  }

  editableName.value = auth.userName || (auth.user?.username || '')
}

const cancelEditName = () => { editingName.value = false; editableName.value = auth.userName || (auth.user?.username || '') }

const saveName = async () => {
  if (!editableName.value || !isAuthenticated.value) return
  const userId = auth.user?.id || auth.user?._id
  if (!userId) return
  try {
    const res = await $fetch(`${API_BASE}/users/${userId}`, {
      method: 'PATCH',
      body: { username: editableName.value },
      headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {}
    })
    if (res) {
      updateLocalAuth(res)
      editingName.value = false
    }
  } catch (e) {
    console.error('Failed to update username', e)
    alert('ไม่สามารถเปลี่ยนชื่อได้ โปรดลองอีกครั้ง')
  }
}

const onAvatarSelected = (e) => {
  const file = e.target.files && e.target.files[0]
  if (!file) return
  if (!isAuthenticated.value) { alert('กรุณาเข้าสู่ระบบก่อนอัพโหลด'); return }

  // set pending file + preview; do not upload until user clicks Save
  pendingAvatarFile.value = file
  const reader = new FileReader()
  reader.onload = () => { pendingAvatarPreview.value = reader.result }
  reader.readAsDataURL(file)
}

const cancelAvatar = () => {
  pendingAvatarFile.value = null
  pendingAvatarPreview.value = null
}

const saveAvatar = async () => {
  const file = pendingAvatarFile.value
  if (!file) return
  const form = new FormData()
  form.append('file', file)

  const isSeller = Number(auth.userType) === 0
  const endpoint = isSeller ? `${API_BASE}/sellers/upload-avatar` : `${API_BASE}/users/upload-avatar`

  try {
    const uploadRes = await fetch(endpoint, {
      method: 'POST',
      headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {},
      body: form
    })
    if (!uploadRes.ok) throw new Error('Upload failed')
    const data = await uploadRes.json()
    if (data && data.success && data.data && data.data.fullUrl) {
      avatarSrc.value = data.data.fullUrl
      if (auth.user) auth.user.avatar = data.data.avatar || data.data.fullUrl
      updateLocalAuth(auth.user)
      cancelAvatar()
    } else {
      alert('ไม่สามารถอัปโหลดรูปได้')
    }
  } catch (err) {
    console.error('Avatar upload error', err)
    alert('ไม่สามารถอัปโหลดรูปได้')
  }
}

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
        const existingIds = new Set(parsedStoredOrders.map(o => o.orderId))
        const missingJsonOrders = jsonOrders.filter(o => !existingIds.has(o.orderId))
        orders.value = [...parsedStoredOrders, ...missingJsonOrders]
      } catch (e) {
        orders.value = jsonOrders
      }
    } else {
      orders.value = jsonOrders
    }
    // init avatar/name display (will also be called when auth.user changes via watch)
    initAvatarAndName()
  }
})

// Watch auth.user to update avatar when it changes (e.g., after initAuth completes)
watch(() => auth.user, (newUser) => {
  if (newUser) {
    initAvatarAndName()
  }
}, { immediate: true })

watch(addressList, (newVal) => {
  if (import.meta.client) localStorage.setItem('my_app_addresses', JSON.stringify(newVal))
}, { deep: true })

watch(orders, (newVal) => {
  if (import.meta.client) localStorage.setItem('my_app_orders', JSON.stringify(newVal))
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

// [แก้ไข] เปลี่ยนจาก confirm() เป็นเปิด Popup
const deleteAddress = (itemToDelete) => {
  addressToDelete.value = itemToDelete
  showDeleteModal.value = true
}

// [เพิ่ม] ฟังก์ชันทำงานเมื่อกดยืนยันใน Popup
const confirmDeleteAddress = () => {
  if (addressToDelete.value) {
    addressList.value = addressList.value.filter(item => item.id !== addressToDelete.value.id)
    addressToDelete.value = null
    showDeleteModal.value = false
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

const handleOrderCancel = (cancelledOrder) => {
  if (cancelledOrder) {
    saveOrderChanges(cancelledOrder)
  }
  selectedOrder.value = null
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
/* CSS เดิมของคุณ ... */
.custom-radio input[type="radio"] {
  accent-color: #28a745;
}

.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e9ecef;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #ced4da;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e9ecef transparent;
}

.cursor-pointer {
  cursor: pointer;
  transition: all 0.2s;
}

.cursor-pointer:hover {
  transform: translateY(-2px);
  box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important;
}

.pagination .page-link {
  color: #333;
  border: 1px solid #dee2e6;
  margin: 0 2px;
  border-radius: 5px;
}

.pagination .page-item.active .page-link {
  background-color: #28a745;
  border-color: #28a745;
  color: white;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}
</style>