<template>
    <div class="dashboard-card">
        <div class="card-header-custom">
            <h3><i class="fa fa-user-circle me-2"></i>ข้อมูลส่วนตัว</h3>
        </div>

        <div class="card-body-custom">
            <template v-if="isAuthenticated">
                <div class="welcome-msg">
                    <div class="d-flex align-items-center gap-4">
                        <div class="avatar-wrapper">
                            <img v-if="avatarSrc && !imageError" :src="avatarSrc" alt="avatar" class="profile-avatar"
                                @error="handleImageError">
                            <div v-else class="profile-avatar avatar-placeholder-large">
                                {{ userInitial }}
                            </div>

                            <label class="edit-avatar-btn">
                                <i class="fa fa-camera"></i>
                                <input type="file" accept="image/*" @change="onAvatarSelected" style="display:none" />
                            </label>
                        </div>

                        <div class="profile-info flex-grow-1">
                            <p class="mb-1 text-muted">ชื่อผู้ใช้งาน</p>
                            <div class="d-flex align-items-center gap-2">
                                <div v-if="!editingName" class="d-flex align-items-center gap-3">
                                    <h4 class="mb-0 fw-bold">{{ editableName || userName || userEmail }}</h4>
                                    <button class="btn-icon-circle" @click="editingName = true" title="แก้ไขชื่อ">
                                        <i class="fa fa-pencil"></i>
                                    </button>
                                </div>
                                <div v-else class="d-flex gap-2 align-items-center">
                                    <input v-model="editableName" type="text" class="form-control form-control-sm"
                                        style="min-width:200px;" />
                                    <button class="btn btn-sm btn-theme" @click="saveName">บันทึก</button>
                                    <button class="btn btn-sm btn-outline-secondary"
                                        @click="cancelEditName">ยกเลิก</button>
                                </div>
                            </div>

                            <div v-if="pendingAvatarPreview"
                                class="mt-3 p-2 bg-light rounded d-flex gap-3 align-items-center border">
                                <img :src="pendingAvatarPreview" class="rounded-circle"
                                    style="width:40px;height:40px;object-fit:cover;" />
                                <div class="d-flex gap-2">
                                    <span class="small text-muted align-self-center">เปลี่ยนรูปโปรไฟล์?</span>
                                    <button class="btn btn-sm btn-theme" @click="saveAvatar">ยืนยัน</button>
                                    <button class="btn btn-sm btn-outline-secondary"
                                        @click="cancelAvatar">ยกเลิก</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="divider"></div>

                <div class="box-account box-info">
                    <div class="box-title d-flex justify-content-between align-items-center mb-3">
                        <h4 class="text-secondary mb-0">ที่อยู่จัดส่งเริ่มต้น</h4>
                        <button class="btn-text-theme" @click="$emit('change-tab', 'address')">จัดการที่อยู่</button>
                    </div>
                    <div class="address-preview-card" v-if="defaultAddress">
                        <div class="icon-side">
                            <i class="fa fa-home"></i>
                        </div>
                        <div class="text-side">
                            <strong>{{ defaultAddress.name || defaultAddress.firstName }} {{ defaultAddress.lastName
                            }}</strong>
                            <p class="mb-1 text-muted">{{ defaultAddress.address }} {{ defaultAddress.subDistrict }} {{
                                defaultAddress.district }} {{ defaultAddress.province }} {{ defaultAddress.zipCode }}
                            </p>
                            <p class="mb-0 text-muted"><i class="fa fa-phone me-1"></i> {{ defaultAddress.phone }}</p>
                        </div>
                    </div>
                    <div v-else class="empty-address-state">
                        <i class="fa fa-map-marked-alt mb-2"></i>
                        <p>คุณยังไม่ได้ตั้งค่าที่อยู่เริ่มต้น</p>
                    </div>
                </div>
            </template>

            <div v-else class="text-center py-5">
                <p class="text-danger">กรุณาเข้าสู่ระบบเพื่อดูข้อมูล</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/store/auth'
import { useAddressStore } from '~/store/address'
import { useRuntimeConfig } from '#imports'

defineEmits(['change-tab'])

const auth = useAuthStore()
const addressStore = useAddressStore()
const config = useRuntimeConfig()
const API_BASE = config.public?.apiBase || 'https://vizdataprojectbe-production.up.railway.app/api'
const BACKEND_URL = 'https://vizdataprojectbe-production.up.railway.app'

const isAuthenticated = computed(() => !!auth.isLoggedIn || (!!auth.user && Object.keys(auth.user).length > 0))
const userName = computed(() => auth.userName || auth.user?.username || 'User')
const userEmail = computed(() => auth.user?.email)
const defaultAddress = computed(() => addressStore.defaultAddress)

const editableName = ref('')
const editingName = ref(false)
const pendingAvatarFile = ref(null)
const pendingAvatarPreview = ref(null)

const imageError = ref(false)

const avatarSrc = computed(() => {
    imageError.value = false
    if (auth.user && auth.user.avatar) {
        return auth.user.avatar.startsWith('http') ? auth.user.avatar : `${BACKEND_URL}${auth.user.avatar}`
    }
    return null
})

const userInitial = computed(() => {
    const name = userName.value || 'U'
    return name.charAt(0)
})

const handleImageError = () => {
    imageError.value = true
}

const initAvatarAndName = () => {
    editableName.value = auth.userName || (auth.user?.username || '')
}

const updateLocalAuth = (u) => { if (!u) return; auth.user = u; auth.userName = u.username || auth.userName; if (import.meta.client) { try { localStorage.setItem('user', JSON.stringify(u)); localStorage.setItem('userName', auth.userName) } catch (e) { } } }
const cancelEditName = () => { editingName.value = false; editableName.value = auth.userName || (auth.user?.username || '') }
const saveName = async () => { if (!editableName.value || !isAuthenticated.value) return; const userId = auth.user?.id || auth.user?._id; if (!userId) return; try { const res = await $fetch(`${API_BASE}/users/${userId}`, { method: 'PATCH', body: { username: editableName.value }, headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {} }); if (res) { updateLocalAuth(res); editingName.value = false; useNuxtApp().$showToast({ msg: "เปลี่ยนชื่อสำเร็จ", type: "success" }); } } catch (e) { useNuxtApp().$showToast({ msg: "เปลี่ยนชื่อไม่สำเร็จ", type: "error" }); } }
const onAvatarSelected = (e) => { const file = e.target.files && e.target.files[0]; if (!file) return; pendingAvatarFile.value = file; const reader = new FileReader(); reader.onload = () => { pendingAvatarPreview.value = reader.result }; reader.readAsDataURL(file) }
const cancelAvatar = () => { pendingAvatarFile.value = null; pendingAvatarPreview.value = null }
const saveAvatar = async () => { const file = pendingAvatarFile.value; if (!file) return; const form = new FormData(); form.append('file', file); const endpoint = Number(auth.userType) === 0 ? `${API_BASE}/sellers/upload-avatar` : `${API_BASE}/users/upload-avatar`; try { const uploadRes = await fetch(endpoint, { method: 'POST', headers: auth.token ? { Authorization: `Bearer ${auth.token}` } : {}, body: form }); if (!uploadRes.ok) throw new Error('Upload failed'); const data = await uploadRes.json(); if (data && data.success && data.data) { const fullUrl = data.data.fullUrl || (BACKEND_URL + data.data.avatar); if (auth.user) auth.user.avatar = data.data.avatar; updateLocalAuth(auth.user); cancelAvatar(); useNuxtApp().$showToast({ msg: "อัปโหลดรูปสำเร็จ", type: "success" }); } } catch (err) { useNuxtApp().$showToast({ msg: "อัปโหลดรูปไม่สำเร็จ", type: "error" }); } }

// ✅ 1. ฟังก์ชันโหลดข้อมูล
const loadProfileData = async () => {
    if (isAuthenticated.value) {
        initAvatarAndName()
        await addressStore.fetchAddresses()
    }
}

// ✅ 2. เฝ้าดู User
watch(() => auth.user, (val) => {
    if (val) {
        loadProfileData()
    }
}, { immediate: true })

onMounted(async () => {
    loadProfileData()
})
</script>

<style scoped>
/* (Style เดิม) */
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

.avatar-wrapper {
    position: relative;
    width: 100px;
    height: 100px;
}

/* ✅ Style รูปภาพและตัวอักษรย่อ */
.profile-avatar {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
    border: 4px solid #fff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background-color: #ff5722;
}

.avatar-placeholder-large {
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 2.5rem;
    background-color: #ff5722;
}

.edit-avatar-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #ff5722;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border: 2px solid white;
    font-size: 14px;
    transition: transform 0.2s;
}

.edit-avatar-btn:hover {
    transform: scale(1.1);
}

.btn-icon-circle {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    border: 1px solid #e2e8f0;
    background: white;
    color: #718096;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    cursor: pointer;
}

.btn-icon-circle:hover {
    background: #ff5722;
    color: white;
    border-color: #ff5722;
}

.btn-theme {
    background: #ff5722;
    color: white;
    border: none;
    font-weight: 600;
    padding: 6px 12px;
    border-radius: 4px;
}

.btn-text-theme {
    background: none;
    border: none;
    color: #ff5722;
    font-weight: 600;
    padding: 0;
    cursor: pointer;
}

.btn-text-theme:hover {
    text-decoration: underline;
}

.address-preview-card {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    background: #f7fafc;
    padding: 20px;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    margin-top: 10px;
}

.icon-side {
    width: 40px;
    height: 40px;
    background: #ffccbc;
    color: #bf360c;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.divider {
    height: 1px;
    background: #f0f0f0;
    margin: 24px 0;
}

.empty-address-state {
    text-align: center;
    padding: 20px;
    color: #a0aec0;
}

.empty-address-state i {
    font-size: 2rem;
    margin-bottom: 10px;
    color: #e2e8f0;
    display: block;
}

/* เพิ่มใน <style scoped> */
h4 {
    text-transform: none !important;
}
</style>