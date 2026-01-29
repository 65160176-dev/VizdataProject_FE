<template>
  <Header />
  <div>
    <WidgetsBreadcrumbs title="Dashboard" />
    <section class="dashboard-section section-b-space user-dashboard-section">
      <div class="container-fluid" style="padding-left: 3rem; padding-right: 3rem;">
        <div class="row g-3">
          <div class="col-lg-3">
            <div class="dashboard-sidebar">
              <div class="faq-tab">
                <ul class="nav nav-tabs flex-column" id="top-tab" role="tablist">
                  <li class="nav-item">
                    <a class="nav-link" :class="{ active: activeMainTab === 'info' }" data-bs-toggle="tab"
                      data-bs-target="#info" @click="updateTab('info')">
                      Account Info
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" :class="{ active: activeMainTab === 'address' }" data-bs-toggle="tab"
                      data-bs-target="#address" @click="updateTab('address')">
                      Address Book
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" :class="{ active: activeMainTab === 'orders' }" data-bs-toggle="tab"
                      data-bs-target="#orders" @click="updateTab('orders'); selectedOrder = null">
                      My Orders
                    </a>
                  </li>
                  <li class="nav-item">
                    <a class="nav-link" data-bs-toggle="tab" data-bs-target="#profile">
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div class="col-lg-9">
            <div class="faq-content tab-content" id="top-tabContent">

              <div class="tab-pane fade" :class="{ 'show active': activeMainTab === 'info' }" id="info">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title">
                      <h2>Account INFO</h2>
                    </div>
                    <div class="welcome-msg">
                      <div v-if="isAuthenticated" class="d-flex align-items-center gap-3">
                        <img :src="avatarSrc" alt="avatar" class="rounded-circle"
                          style="width:72px;height:72px;object-fit:cover;border:1px solid #e9ecef;">
                        <div>
                          <p class="mb-1">Hello,</p>
                          <div class="d-flex align-items-center gap-2">
                            <div v-if="!editingName">
                              <strong>{{ editableName || userName || userEmail }}</strong>
                              <button class="btn btn-link btn-sm" @click="editingName = true">Edit</button>
                            </div>
                            <div v-else class="d-flex gap-2">
                              <input v-model="editableName" type="text" class="form-control form-control-sm"
                                style="min-width:180px;" />
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
                              <img :src="pendingAvatarPreview" alt="preview"
                                style="width:56px;height:56px;object-fit:cover;border-radius:50%;border:1px solid #e9ecef;" />
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
                    </div>
                </div>
              </div>

              <div class="tab-pane fade" :class="{ 'show active': activeMainTab === 'address' }" id="address">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title d-flex justify-content-between align-items-center mb-3">
                      <h2 class="mb-0">My Address</h2>
                      <button v-if="isAuthenticated" class="btn btn-solid btn-sm"
                        style="padding: 8px 16px; font-weight: 600;" @click="openModal(null)">
                        <i class="fa fa-plus mr-1"></i> Add New Address
                      </button>
                    </div>

                    <div v-if="addressStore.loading" class="text-center py-5">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                      </div>
                      <p class="mt-2">กำลังโหลดข้อมูล...</p>
                    </div>

                    <div v-else-if="isAuthenticated" class="box-account box-info mt-3">
                      <div class="row">
                        <template v-if="addressList && addressList.length > 0">
                          <div class="col-12 mb-3" v-for="(item, index) in addressList" :key="item._id || index">
                            <div class="box h-100" style="border: 1px solid #ddd; padding: 20px; position: relative;"
                              :style="item.isDefault ? 'border-color: #28a745; background-color: #f9fff9;' : ''">
                              <div class="box-title d-flex justify-content-between align-items-center mb-2">
                                <div class="d-flex align-items-center">
                                  <label class="custom-radio d-flex align-items-center mb-0" style="cursor: pointer;">
                                    <input type="radio" name="defaultAddress" :checked="item.isDefault"
                                      @change="setDefaultAddress(item)"
                                      style="transform: scale(1.5); margin-right: 10px; cursor: pointer;">
                                    <h4 class="m-0 font-weight-bold">
                                      {{ item.name || item.firstName }} {{ item.lastName }}
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
                                  {{ item.address }}<br>
                                  {{ item.subDistrict }} {{ item.district }}<br>
                                  {{ item.province }} {{ item.zipCode }}
                                </address>
                                <div class="mt-2 text-muted">
                                  <span class="mr-3"><strong>Mobile:</strong> {{ item.phone }}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </template>

                        <div v-else class="col-12 text-center py-5">
                          <i class="fa fa-map-marker-alt text-muted mb-3" style="font-size: 48px; opacity: 0.3;"></i>
                          <h4 class="text-muted">ไม่พบข้อมูลที่อยู่</h4>
                          <p class="text-danger mt-2">กรุณาเพิ่มที่อยู่</p>
                        </div>
                      </div>
                    </div>
                    <div v-else class="welcome-msg">
                      <p class="text-danger">กรุณาเข้าสู่ระบบเพื่อดูข้อมูลที่อยู่</p>
                    </div>
                  </div>
                </div>
              </div>

              <div class="tab-pane fade" :class="{ 'show active': activeMainTab === 'orders' }" id="orders">
                <div class="dashboard-right">
                  <div class="dashboard">
                    <div class="page-title mb-3" v-if="!selectedOrder">
                      <h2 class="mb-0">My Orders</h2>
                    </div>
                    <template v-if="isAuthenticated">
                      <div v-if="!selectedOrder">
                        <div v-if="isLoadingOrders" class="text-center py-5">
                          <div class="spinner-border text-primary" role="status"></div>
                          <p class="mt-2 text-muted">กำลังโหลดรายการคำสั่งซื้อ...</p>
                        </div>

                        <div v-else>
                          <div
                            class="d-flex w-100 overflow-auto mb-4 pb-2 border-bottom text-nowrap custom-scrollbar gap-2">
                            <button v-for="tab in tabs" :key="tab.value" class="btn rounded-pill px-3 flex-fill"
                              :class="activeTab === tab.value ? 'btn-dark' : 'btn-outline-secondary border-0'"
                              @click="updateOrderFilter(tab.value)">
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
                                <span class="badge rounded-pill text-uppercase" :class="getStatusClass(order.status)">
                                  {{ formatStatus(order.status) }}
                                </span>
                              </div>
                              <div class="card-body p-3">
                                <div class="row align-items-center">
                                  <div class="col-md-2 text-center">
                                    <NuxtLink
                                      :to="`/product/three-column/thumbnail-left?id=${order.items[0]?.productId?._id || order.items[0]?.productId || '1'}`"
                                      class="bg-light rounded d-flex align-items-center justify-content-center"
                                      style="width: 80px; height: 80px; margin: 0 auto; overflow: hidden; text-decoration: none;"
                                      @click.stop>
                                      <img v-if="order.items[0]?.image" :src="order.items[0].image"
                                        class="w-100 h-100 rounded" style="object-fit: cover;">
                                      <i v-else class="fa fa-shopping-bag text-secondary"
                                        style="font-size: 24px;"></i>
                                    </NuxtLink>
                                  </div>
                                  <div class="col-md-6 d-flex flex-column justify-content-center"
                                    style="min-height: 100px;">
                                    <div class="mb-1 text-muted" style="font-size: 0.85rem;">
                                      ร้านค้า:
                                      <NuxtLink :to="`/seller/${order.shopId || 'official-store'}`"
                                        class="fw-bold text-dark text-decoration-none hover-underline" @click.stop>
                                        {{ order.shopName }}
                                      </NuxtLink>
                                    </div>
                                    <NuxtLink
                                      :to="`/product/three-column/thumbnail-left?id=${order.items[0]?.productId?._id || order.items[0]?.productId || '1'}`"
                                      class="mb-1 text-dark text-truncate text-decoration-none hover-underline"
                                      style="max-width: 100%; font-weight: 600;" @click.stop>
                                      {{ order.items[0]?.name || 'สินค้า' }}
                                    </NuxtLink>
                                    <div class="text-muted small" v-if="order.items.length > 1">
                                      และสินค้าอื่นๆ อีก {{ order.items.length - 1 }} รายการ
                                    </div>

                                    <div v-if="order.note && shouldShowNote(order.status)"
                                      class="mt-2 p-2 rounded border border-danger shadow-sm"
                                      style="background-color: #ffebee; max-width: 95%;">
                                      <div class="d-flex align-items-center text-danger mb-1"
                                        style="font-size: 0.75rem;">
                                        <i class="fa fa-exclamation-circle me-1"></i>
                                        <span class="fw-bold">{{ getNoteHeader(order.status) }}</span>
                                      </div>
                                      <div class="text-dark text-truncate" style="font-size: 0.8rem;"
                                        :title="order.note">
                                        {{ order.note }}
                                      </div>
                                    </div>
                                    </div>
                                  <div class="col-md-4 text-end">
                                    <div class="mb-2 fw-bold text-primary">฿{{ order.total.toLocaleString() }}</div>
                                    <button class="btn btn-outline-secondary btn-sm" style="min-width: 120px;"
                                      @click.stop="openOrder(order)">ดูรายละเอียด</button>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div class="d-flex justify-content-center mt-4 mb-3" v-if="totalPages > 1">
                              <nav aria-label="Page navigation">
                                <ul class="pagination">
                                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                                    <button class="page-link" @click.stop="changePage(currentPage - 1)"
                                      aria-label="Previous">
                                      <span aria-hidden="true">&laquo;</span>
                                    </button>
                                  </li>
                                  <li class="page-item" v-for="page in totalPages" :key="page"
                                    :class="{ active: currentPage === page }">
                                    <button class="page-link" @click.stop="changePage(page)">{{ page }}</button>
                                  </li>
                                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                                    <button class="page-link" @click.stop="changePage(currentPage + 1)"
                                      aria-label="Next">
                                      <span aria-hidden="true">&raquo;</span>
                                    </button>
                                  </li>
                                </ul>
                              </nav>
                            </div>
                          </div>

                          <div v-else class="text-center py-5">
                            <i class="fa fa-clipboard-list text-muted mb-3"
                              style="font-size: 48px; opacity: 0.3;"></i>
                            <p class="text-muted">ไม่มีรายการคำสั่งซื้อในสถานะนี้</p>
                          </div>
                        </div>
                      </div>

                      <div v-else>
                        <OrderDetail :order="selectedOrder" @back="closeOrder" @cancel="handleOrderCancel"
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
import { computed, onMounted, ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { useAddressStore } from '~/store/address'
import { useRuntimeConfig } from '#imports'

import addAddressPop from './Address/addAddressPop.vue'
import delAddrPop from './Address/delAddrPop.vue'
import OrderDetail from './orders/orderDetail.vue'

const auth = useAuthStore()
const addressStore = useAddressStore()
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()
const API_BASE = config.public?.apiBase || 'http://localhost:3001/api'
const BACKEND_URL = 'http://localhost:3001'
const isAuthenticated = computed(() => !!auth.isLoggedIn || (!!auth.user && Object.keys(auth.user).length > 0))

const activeMainTab = ref('info')

const updateTab = (tabName) => {
  activeMainTab.value = tabName
  const newQuery = { ...route.query }
  newQuery.tab = tabName
  delete newQuery.orderId
  router.replace({ query: newQuery })
  if (tabName !== 'orders') {
    selectedOrder.value = null
  }
}

// ... (Address & Account Logic code same as before, omitted to save space) ...
// (ส่วนจัดการ Address และรูปโปรไฟล์ ใช้โค้ดเดิมได้เลยครับ)

const addressList = computed(() => addressStore.addresses)
const defaultAddress = computed(() => addressStore.defaultAddress)
const showAddModal = ref(false)
const selectedAddress = ref(null)
const showDeleteModal = ref(false)
const addressToDelete = ref(null)
const selectedOrder = ref(null)
const orders = ref([])
const isLoadingOrders = ref(false)

// ... (Lifecycle & Watchers same as before) ...
onMounted(async () => {
  if (import.meta.client) {
    if (!auth.isLoggedIn) {
      const storedUser = localStorage.getItem('user')
      const storedToken = localStorage.getItem('token')
      if (storedUser && storedToken) {
        try {
          auth.user = JSON.parse(storedUser)
          auth.token = storedToken
          auth.isLoggedIn = true
        } catch (e) { }
      }
    }
    if (typeof auth.initAuth === 'function') await auth.initAuth()
    await nextTick()
    if (isAuthenticated.value) {
      initAvatarAndName()
      await addressStore.fetchAddresses()
      await fetchOrders()
    }
    if (route.query.tab) activeMainTab.value = route.query.tab
    if (route.query.filter) activeTab.value = route.query.filter
  }
})

watch(() => auth.user, async (newUser, oldUser) => {
  if (newUser && newUser !== oldUser) {
    initAvatarAndName()
    await addressStore.fetchAddresses()
    await fetchOrders()
  } else if (!newUser) orders.value = []
})

// --- Function Fetch Orders ---
const fetchOrders = async () => {
  if (!auth.isLoggedIn) return;
  isLoadingOrders.value = true;
  try {
    const token = auth.token || localStorage.getItem('token');
    if (!token) return;

    const response = await $fetch(`${API_BASE}/order`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const currentUserId = auth.user?._id || auth.user?.id;
    let myOrders = response;

    if (currentUserId) {
      myOrders = response.filter(o => {
        const orderUserId = (o.user && typeof o.user === 'object') ? o.user._id : o.user;
        return String(orderUserId) === String(currentUserId);
      });
    }

    orders.value = myOrders.map(order => {
      let displayDate = order.date;
      if (!displayDate && order.createdAt) {
        displayDate = new Date(order.createdAt).toLocaleString('en-GB', {
          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
        });
      }

      let shopName = 'Official Store';
      let shopId = null;
      const firstItem = order.item && order.item[0];
      if (firstItem && firstItem.productId && firstItem.productId.userId) {
        shopName = firstItem.productId.userId.shopName || firstItem.productId.userId.username || 'Shop';
        shopId = firstItem.productId.userId._id || firstItem.productId.userId;
      }

      return {
        ...order,
        items: order.item || [],
        date: displayDate,
        shopName: shopName,
        shopId: shopId,
        shippingFee: order.shippingCost || order.shippingFee || 0
      };
    });

    orders.value.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
    checkUrlAndOpenOrder()

  } catch (error) {
    console.error("Failed to fetch orders:", error);
    useNuxtApp().$showToast({ msg: "โหลดข้อมูลคำสั่งซื้อไม่สำเร็จ", type: "error" });
  } finally {
    isLoadingOrders.value = false;
  }
}

// ... (Address Modal Functions) ...
const openModal = (item = null) => { if (item) selectedAddress.value = { ...item }; else selectedAddress.value = null; showAddModal.value = true }
const closeModal = () => { showAddModal.value = false; selectedAddress.value = null }
const handleSaveAddress = async (formData) => { /* logicเดิม */ try { const id = formData._id || formData.id; const cleanPayload = { name: formData.name || formData.firstName, phone: formData.phone.replace(/[^0-9]/g, ''), address: formData.address, subDistrict: formData.subDistrict, district: formData.district || formData.city, province: formData.province || formData.state, zipCode: formData.zipCode || formData.pincode, isDefault: formData.isDefault }; if (id) { await addressStore.updateAddress(id, cleanPayload); useNuxtApp().$showToast({ msg: "อัปเดตที่อยู่สำเร็จ", type: "success" }); } else { await addressStore.addAddress(cleanPayload); useNuxtApp().$showToast({ msg: "เพิ่มที่อยู่สำเร็จ", type: "success" }); } closeModal(); } catch (err) { console.error(err); useNuxtApp().$showToast({ msg: "บันทึกไม่สำเร็จ", type: "error" }); } }
const deleteAddress = (item) => { addressToDelete.value = item; showDeleteModal.value = true }
const confirmDeleteAddress = async () => { /* logicเดิม */ if (addressToDelete.value) { try { const id = addressToDelete.value._id || addressToDelete.value.id; await addressStore.deleteAddress(id); useNuxtApp().$showToast({ msg: "ลบที่อยู่สำเร็จ", type: "success" }); addressToDelete.value = null; showDeleteModal.value = false; } catch (err) { useNuxtApp().$showToast({ msg: "ลบไม่สำเร็จ", type: "error" }); } } }
const setDefaultAddress = async (item) => { /* logicเดิม */ try { const id = item._id || item.id; const payload = { name: item.name || item.firstName, phone: (item.phone || '').replace(/[^0-9]/g, ''), address: item.address, subDistrict: item.subDistrict || '-', district: item.district || item.city, province: item.province || item.state, zipCode: item.zipCode || item.pincode, isDefault: true }; await addressStore.updateAddress(id, payload); useNuxtApp().$showToast({ msg: "ตั้งค่าเริ่มต้นสำเร็จ", type: "success" }); await addressStore.fetchAddresses(); } catch (err) { useNuxtApp().$showToast({ msg: "ตั้งค่าไม่สำเร็จ", type: "error" }); } }

// ... (Avatar & Name Logic) ...
const editableName = ref(''); const editingName = ref(false); const avatarSrc = ref('/images/default-avatar.png'); const pendingAvatarFile = ref(null); const pendingAvatarPreview = ref(null);
const initAvatarAndName = () => { if (auth.user && auth.user.avatar) { avatarSrc.value = auth.user.avatar.startsWith('http') ? auth.user.avatar : (`${BACKEND_URL}${auth.user.avatar}`) } editableName.value = auth.userName || (auth.user?.username || '') }
const updateLocalAuth = (u) => { if (!u) return; auth.user = u; auth.userName = u.username || auth.userName; if (import.meta.client) { try { localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('userName', auth.userName) } catch (e) { } } }
const cancelEditName = () => { editingName.value = false; editableName.value = auth.userName || (auth.user?.username || '') }
const saveName = async () => { /* logicเดิม */ if (!editableName.value || !isAuthenticated.value) return; const userId = auth.user?.id || auth.user?._id; if (!userId) return; try { const res = await $fetch(`${API_BASE}/users/${userId}`, { method: 'PATCH', body: { username: editableName.value }, headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {} }); if (res) { updateLocalAuth(res); editingName.value = false; useNuxtApp().$showToast({ msg: "เปลี่ยนชื่อสำเร็จ", type: "success" }); } } catch (e) { useNuxtApp().$showToast({ msg: "เปลี่ยนชื่อไม่สำเร็จ", type: "error" }); } }
const onAvatarSelected = (e) => { const file = e.target.files && e.target.files[0]; if (!file) return; pendingAvatarFile.value = file; const reader = new FileReader(); reader.onload = () => { pendingAvatarPreview.value = reader.result }; reader.readAsDataURL(file) }
const cancelAvatar = () => { pendingAvatarFile.value = null; pendingAvatarPreview.value = null }
const saveAvatar = async () => { /* logicเดิม */ const file = pendingAvatarFile.value; if (!file) return; const form = new FormData(); form.append('file', file); const endpoint = Number(auth.userType) === 0 ? `${API_BASE}/sellers/upload-avatar` : `${API_BASE}/users/upload-avatar`; try { const uploadRes = await fetch(endpoint, { method: 'POST', headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {}, body: form }); if (!uploadRes.ok) throw new Error('Upload failed'); const data = await uploadRes.json(); if (data && data.success && data.data) { const fullUrl = data.data.fullUrl || (BACKEND_URL + data.data.avatar); avatarSrc.value = fullUrl; if (auth.user) auth.user.avatar = data.data.avatar; updateLocalAuth(auth.user); cancelAvatar(); useNuxtApp().$showToast({ msg: "อัปโหลดรูปสำเร็จ", type: "success" }); } } catch (err) { useNuxtApp().$showToast({ msg: "อัปโหลดรูปไม่สำเร็จ", type: "error" }); } }

// --- Order Logic ---
const activeTab = ref('all')
const currentPage = ref(1)
const itemsPerPage = 5
const tabs = [{ label: 'ทั้งหมด', value: 'all' }, { label: 'รอยืนยัน', value: 'pending' }, { label: 'กำลังเตรียมสินค้า', value: 'processing' }, { label: 'ที่ต้องได้รับ', value: 'shipping' }, { label: 'สำเร็จ', value: 'completed' }, { label: 'ยกเลิก', value: 'cancelled' }]

const checkStatus = (orderStatus, tab) => {
  const s = (orderStatus || '').toLowerCase();
  switch (tab) {
    case 'pending': return s === 'pending' || s === 'pending review';
    case 'processing': return s === 'preparing' || s === 'processing' || s === 'accepted';
    case 'shipping': return s === 'shipped' || s === 'shipping' || s === 'arrived';
    case 'completed': return s === 'completed' || s === 'delivered';
    case 'cancelled': return s === 'cancelled' || s === 'cancel requested' || s === 'cancel' || s === 'return_requested' || s === 'return requested';
    default: return false;
  }
}

// ✅✅ ฟังก์ชันเช็คว่าควรโชว์ Note หรือไม่ (ซ่อนถ้าเป็น User เขียนเอง)
const shouldShowNote = (status) => {
  if (!status) return false;
  const s = status.toLowerCase();
  
  // ถ้าเป็นสถานะ 'คำร้องขอ' (User เป็นคนเขียน Note) -> ซ่อน
  if (s.includes('request') || s === 'pending') {
    return false;
  }
  
  // ถ้าเป็นสถานะ 'Preparing/Processing' ที่มี Note (แปลว่าร้านปฏิเสธ) -> โชว์
  // ถ้าเป็นสถานะ 'Cancelled' (ยกเลิกสำเร็จ) -> โชว์
  return true;
}

// ✅✅ ฟังก์ชันสร้างหัวข้อ Note ตามสถานะ
const getNoteHeader = (status) => {
  const s = (status || '').toLowerCase();
  if (s === 'preparing' || s === 'processing') return 'ร้านค้าปฏิเสธคำขอ';
  if (s === 'cancelled' || s === 'cancel') return 'เหตุผลการยกเลิก';
  return 'หมายเหตุจากร้านค้า';
}

const filteredOrders = computed(() => { if (activeTab.value === 'all') return orders.value; return orders.value.filter(o => checkStatus(o.status, activeTab.value)) })
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage))
const paginatedOrders = computed(() => { const start = (currentPage.value - 1) * itemsPerPage; return filteredOrders.value.slice(start, start + itemsPerPage) })
const changePage = (page) => { if (page >= 1 && page <= totalPages.value) currentPage.value = page }
watch(activeTab, () => { currentPage.value = 1 })
const getCount = (tabValue) => { if (tabValue === 'all') return orders.value.length; return orders.value.filter(o => checkStatus(o.status, tabValue)).length }
const getStatusClass = (s) => { const status = (s || '').toLowerCase(); if (status === 'accepted' || status === 'completed') return 'bg-success text-white'; if (status === 'pending') return 'bg-warning text-dark'; if (status === 'preparing' || status === 'processing') return 'bg-info text-dark'; if (status === 'shipped') return 'bg-primary text-white'; if (status.includes('cancel') || status.includes('return')) return 'bg-danger text-white'; return 'bg-light text-dark border' }

const handleOrderCancel = (cancelledOrder) => { if (cancelledOrder) saveOrderChanges(cancelledOrder); selectedOrder.value = null }
const saveOrderChanges = async (updatedOrder) => { /* logicเดิม */ try { const token = auth.token || localStorage.getItem('token'); const id = updatedOrder._id || updatedOrder.id; if (!id) return; await $fetch(`${API_BASE}/order/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` }, body: { status: updatedOrder.status, cancelReason: updatedOrder.cancelReason } }); const index = orders.value.findIndex(o => o.orderId === updatedOrder.orderId); if (index !== -1) { orders.value[index] = { ...updatedOrder }; orders.value = [...orders.value] } useNuxtApp().$showToast({ msg: "อัปเดตสถานะสำเร็จ", type: "success" }); } catch (error) { console.error("Failed to update order status:", error); useNuxtApp().$showToast({ msg: "บันทึกสถานะไม่สำเร็จ", type: "error" }); fetchOrders(); } }
const checkUrlAndOpenOrder = () => { const orderIdFromUrl = route.query.orderId; if (orders.value.length > 0) { if (orderIdFromUrl) { const targetOrder = orders.value.find(o => o.orderId === orderIdFromUrl); if (targetOrder) { selectedOrder.value = targetOrder; if (activeMainTab.value !== 'orders') { activeMainTab.value = 'orders' } } } else { selectedOrder.value = null } } }
watch(() => route.query, () => { if (route.query.tab && route.query.tab !== activeMainTab.value) activeMainTab.value = route.query.tab; if (route.query.filter && route.query.filter !== activeTab.value) activeTab.value = route.query.filter; checkUrlAndOpenOrder() })
const changeTab = (tabId) => { if (import.meta.client) { const triggerEl = document.querySelector(`#top-tab a[data-bs-target="#${tabId}"]`); if (triggerEl) triggerEl.click() } }
const handleLogout = () => { if (confirm('Are you sure you want to log out?')) { if (typeof auth.logout === 'function') auth.logout(); else { auth.user = null; auth.isLoggedIn = false } router.push('/') } }
const formatStatus = (status) => { if (!status) return ''; const s = status.toLowerCase(); if (s === 'return_requested' || s === 'return requested') { return 'Cancel Requested' } return status }
const updateOrderFilter = (filterVal) => { activeTab.value = filterVal; router.replace({ query: { ...route.query, tab: 'orders', filter: filterVal } }) }
const openOrder = (order) => { selectedOrder.value = order; router.push({ query: { ...route.query, tab: 'orders', orderId: order.orderId } }) }
const closeOrder = () => { selectedOrder.value = null; const newQuery = { ...route.query }; delete newQuery.orderId; router.replace({ query: newQuery }) }
</script>

<style scoped>
.custom-radio input[type="radio"] { accent-color: #28a745; }
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e9ecef; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #ced4da; }
.custom-scrollbar { scrollbar-width: thin; scrollbar-color: #e9ecef transparent; }
.cursor-pointer { cursor: pointer; transition: all 0.2s; }
.cursor-pointer:hover { transform: translateY(-2px); box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important; }
.pagination .page-link { color: #333; border: 1px solid #dee2e6; margin: 0 2px; border-radius: 5px; }
.pagination .page-item.active .page-link { background-color: #28a745; border-color: #28a745; color: white; }
.pagination .page-item.disabled .page-link { color: #6c757d; pointer-events: none; background-color: #fff; border-color: #dee2e6; }
.hover-underline:hover { text-decoration: underline !important; }
</style>