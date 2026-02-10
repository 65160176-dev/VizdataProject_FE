<template>
    <div class="dashboard-card">
        <div class="card-header-custom d-flex justify-content-between align-items-center">
            <h3><i class="fa fa-map-marker me-2"></i>ที่อยู่</h3>
            <button v-if="isAuthenticated" class="btn btn-theme" @click="openModal(null)">
                <i class="fa fa-plus me-1"></i> เพิ่มที่อยู่ใหม่
            </button>
        </div>

        <div class="card-body-custom">
            <div v-if="addressStore.loading" class="text-center py-5">
                <div class="spinner-border text-orange" role="status"></div>
                <p class="mt-2 text-muted">กำลังโหลด...</p>
            </div>

            <div v-else-if="isAuthenticated">
                <div class="row">
                    <template v-if="addressList && addressList.length > 0">
                        <div class="col-12 mb-3" v-for="(item, index) in paginatedAddresses" :key="item._id || index">
                            <div class="box h-100"
                                style="border: 1px solid #ddd; padding: 20px; position: relative; border-radius: 8px;"
                                :style="item.isDefault ? 'border-color: #28a745; background-color: #f9fff9;' : ''">
                                <div class="box-title d-flex justify-content-between align-items-center mb-2">
                                    <div class="d-flex align-items-center">
                                        <label class="custom-radio d-flex align-items-center mb-0"
                                            style="cursor: pointer;">
                                            <input type="radio" name="defaultAddress" :checked="item.isDefault"
                                                @change="setDefaultAddress(item)"
                                                style="transform: scale(1.5); margin-right: 10px; cursor: pointer;">
                                            <h4 class="m-0 font-weight-bold" style="font-size: 1.1rem;">
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
                                <div class="box-content pl-4 ml-2"
                                    style="border-left: 3px solid #eee; padding-left: 1rem;">
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

                        <div class="col-12 mt-4" v-if="totalAddressPages > 1">
                            <div class="d-flex justify-content-center">
                                <nav aria-label="Address navigation">
                                    <ul class="pagination custom-pagination">
                                        <li class="page-item" :class="{ disabled: currentAddressPage === 1 }">
                                            <button class="page-link"
                                                @click="changeAddressPage(currentAddressPage - 1)">
                                                &laquo;
                                            </button>
                                        </li>
                                        <li class="page-item" v-for="page in totalAddressPages" :key="page"
                                            :class="{ active: currentAddressPage === page }">
                                            <button class="page-link" @click="changeAddressPage(page)">
                                                {{ page }}
                                            </button>
                                        </li>
                                        <li class="page-item"
                                            :class="{ disabled: currentAddressPage === totalAddressPages }">
                                            <button class="page-link"
                                                @click="changeAddressPage(currentAddressPage + 1)">
                                                &raquo;
                                            </button>
                                        </li>
                                    </ul>
                                </nav>
                            </div>
                        </div>
                    </template>

                    <div v-else class="col-12 text-center py-5">
                        <i class="fa fa-map-marked-alt text-muted mb-3" style="font-size: 48px; opacity: 0.3;"></i>
                        <h4 class="text-muted">ไม่พบข้อมูลที่อยู่</h4>
                        <p class="text-danger mt-2">กรุณาเพิ่มที่อยู่</p>
                    </div>
                </div>
            </div>

            <div v-else class="text-center py-5">
                <p class="text-danger">กรุณาเข้าสู่ระบบเพื่อดูข้อมูล</p>
            </div>
        </div>

        <addAddressPop :show="showAddModal" :edit-data="selectedAddress" @close="closeModal"
            @save="handleSaveAddress" />
        <delAddrPop v-if="showDeleteModal" @close="showDeleteModal = false" @confirm="confirmDeleteAddress" />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useAddressStore } from '~/store/address'
import addAddressPop from '../Address/addAddressPop.vue'
import delAddrPop from '../Address/delAddrPop.vue'

const auth = useAuthStore()
const addressStore = useAddressStore()
const isAuthenticated = computed(() => !!auth.isLoggedIn || (!!auth.user && Object.keys(auth.user).length > 0))

const addressList = computed(() => addressStore.addresses)
const showAddModal = ref(false)
const selectedAddress = ref(null)
const showDeleteModal = ref(false)
const addressToDelete = ref(null)

const currentAddressPage = ref(1)
const itemsPerAddressPage = 5

const paginatedAddresses = computed(() => {
    if (!addressList.value) return []
    const start = (currentAddressPage.value - 1) * itemsPerAddressPage
    const end = start + itemsPerAddressPage
    return addressList.value.slice(start, end)
})

const totalAddressPages = computed(() => {
    if (!addressList.value) return 0
    return Math.ceil(addressList.value.length / itemsPerAddressPage)
})

const changeAddressPage = (page) => {
    if (page >= 1 && page <= totalAddressPages.value) {
        currentAddressPage.value = page
    }
}

const openModal = (item = null) => {
    if (item) selectedAddress.value = { ...item };
    else selectedAddress.value = null;
    showAddModal.value = true
}
const closeModal = () => { showAddModal.value = false; selectedAddress.value = null }

const handleSaveAddress = async (formData) => {
    try {
        const id = formData._id || formData.id;
        const cleanPayload = {
            name: formData.name || formData.firstName,
            phone: formData.phone.replace(/[^0-9]/g, ''),
            address: formData.address,
            subDistrict: formData.subDistrict,
            district: formData.district || formData.city,
            province: formData.province || formData.state,
            zipCode: formData.zipCode || formData.pincode,
            isDefault: formData.isDefault
        };
        if (id) {
            await addressStore.updateAddress(id, cleanPayload);
            useNuxtApp().$showToast({ msg: "อัปเดตที่อยู่สำเร็จ", type: "success" });
        } else {
            await addressStore.addAddress(cleanPayload);
            useNuxtApp().$showToast({ msg: "เพิ่มที่อยู่สำเร็จ", type: "success" });
        }
        closeModal();
    } catch (err) {
        console.error(err);
        useNuxtApp().$showToast({ msg: "บันทึกไม่สำเร็จ", type: "error" });
    }
}

const deleteAddress = (item) => { addressToDelete.value = item; showDeleteModal.value = true }

const confirmDeleteAddress = async () => {
    if (addressToDelete.value) {
        try {
            const id = addressToDelete.value._id || addressToDelete.value.id;
            await addressStore.deleteAddress(id);
            useNuxtApp().$showToast({ msg: "ลบที่อยู่สำเร็จ", type: "success" });
            addressToDelete.value = null;
            showDeleteModal.value = false;
        } catch (err) {
            useNuxtApp().$showToast({ msg: "ลบไม่สำเร็จ", type: "error" });
        }
    }
}

const setDefaultAddress = async (item) => {
    try {
        const id = item._id || item.id;
        const payload = {
            name: item.name || item.firstName,
            phone: (item.phone || '').replace(/[^0-9]/g, ''),
            address: item.address,
            subDistrict: item.subDistrict || '-',
            district: item.district || item.city,
            province: item.province || item.state,
            zipCode: item.zipCode || item.pincode,
            isDefault: true
        };
        await addressStore.updateAddress(id, payload);
        useNuxtApp().$showToast({ msg: "ตั้งค่าเริ่มต้นสำเร็จ", type: "success" });
        await addressStore.fetchAddresses();
    } catch (err) {
        useNuxtApp().$showToast({ msg: "ตั้งค่าไม่สำเร็จ", type: "error" });
    }
}

// ✅ 1. ฟังก์ชันโหลดข้อมูล
const loadAddressData = async () => {
    if (isAuthenticated.value) {
        await addressStore.fetchAddresses()
    }
}

// ✅ 2. เฝ้าดู User
watch(() => auth.user, (val) => {
    if (val) {
        loadAddressData()
    }
}, { immediate: true })

onMounted(async () => {
    loadAddressData()
})
</script>

<style scoped>
/* (Style คงเดิม) */
.dashboard-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
}

.card-header-custom {
    padding: 20px 24px;
    border-bottom: 1px solid #e2e8f0;
    background: white;
    min-height: 80px;
    display: flex;
    align-items: center;

}

.card-header-custom h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #ff5722;
}

.card-body-custom {
    padding: 24px;
    background: white;
}

.btn-theme {
    background: #ff5722;
    color: white;
    border: none;
    font-weight: 600;
    padding: 8px 16px;
    border-radius: 4px;
}

.text-orange {
    color: #ff5722 !important;
}

/* Custom Radio */
.custom-radio input[type="radio"] {
    accent-color: #28a745;
    width: 16px;
    height: 16px;
}

/* Pagination */
.custom-pagination .page-link {
    color: #4a5568;
    border-color: #e2e8f0;
    margin: 0 2px;
    border-radius: 4px;
}

.custom-pagination .page-link:hover {
    background: #f7fafc;
    color: #ff5722;
}

.custom-pagination .page-item.active .page-link {
    background: #ff5722;
    border-color: #ff5722;
    color: white;
}

.custom-pagination .page-item.disabled .page-link {
    color: #cbd5e0;
}

a.text-secondary:hover,
a.text-danger:hover {
    text-decoration: underline !important;
    cursor: pointer;
}
</style>