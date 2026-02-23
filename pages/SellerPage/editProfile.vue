<template>
    <div class="container py-4">
        <div class="card mx-auto" style="max-width:640px;">
            <div class="card-body">
                <h5 class="card-title">แก้ไขโปรไฟล์ร้าน</h5>

                <div class="mb-3 text-center">
                    <img :src="avatarDisplay" class="rounded-circle border" style="width:96px;height:96px;object-fit:cover" @error="handleImageError" />
                    <div class="mt-1" style="font-size:10px;color:#666;">
                        Debug: {{ avatarSrc }}
                    </div>
                </div>

                <div class="mb-3">
                    <label class="form-label">รูปโปรไฟล์</label>
                    <input type="file" class="form-control" accept="image/*" @change="onFileChange" :disabled="isUploading" />
                </div>

                <div class="mb-3">
                    <label class="form-label">ชื่อร้าน</label>
                    <input class="form-control" v-model="name" />
                </div>

                <div class="d-flex justify-content-end" style="gap:8px">
                    <button class="btn btn-secondary" @click="cancel" :disabled="isUploading">ยกเลิก</button>
                    <button class="btn btn-primary" @click="save" :disabled="isUploading">
                        {{ isUploading ? 'กำลังบันทึก...' : 'บันทึก' }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { useRuntimeConfig } from '#app'
import { useNuxtApp } from '#app'
import { useSellerStore } from '~/store/sellers'
import { useProductStore } from '~/store/products'

// Layout
definePageMeta({ layout: 'seller' })

const router = useRouter()
const auth = useAuthStore()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'https://vizdataprojectbe-production.up.railway.app'

const name = ref('')
const selectedFile = ref(null)
const previewAvatar = ref(null)
const isUploading = ref(false)
const avatarSrc = ref('/images/avtar.jpg')

// ✅ Logic แสดงรูปภาพที่ถูกต้อง
const avatarDisplay = computed(() => {
    // A. ถ้ามีรูปที่เพิ่งเลือก (Preview) ใช้เลย
    if (previewAvatar.value) {
        console.log('🔍 [editProfile] avatarDisplay using preview:', previewAvatar.value)
        return previewAvatar.value
    }
    
    // B. ใช้รูปจาก avatarSrc (ที่ถูก watch อัพเดท)
    console.log('🔍 [editProfile] avatarDisplay using avatarSrc:', avatarSrc.value)
    return avatarSrc.value
})

const initAvatarFromAuth = () => {
    console.log('🔍 [editProfile] initAvatarFromAuth called')
    console.log('🔍 [editProfile] auth.user:', auth.user)
    
    const userAvatar = auth.user?.avatar || null
    console.log('🔍 [editProfile] userAvatar:', userAvatar)
    
    if (!userAvatar) {
        console.log('🔍 [editProfile] No avatar found, using default')
        // Only set default if we don't already have a server avatar URL
        if (!avatarSrc.value.includes('localhost:3001')) {
            avatarSrc.value = '/images/avtar.jpg'
        }
        return
    }

    // ถ้าเป็น Base64 หรือ http (รูปภายนอก) ใช้ได้เลย
    if (userAvatar.startsWith('data:') || userAvatar.startsWith('blob:') || userAvatar.startsWith('http')) {
        console.log('🔍 [editProfile] Using external URL:', userAvatar)
        avatarSrc.value = userAvatar
        return
    }

    // ถ้าเป็น Path จาก Server ต้องเติม https://vizdataprojectbe-production.up.railway.app
    const cleanPath = userAvatar.startsWith('/') ? userAvatar : `/${userAvatar}`
    const finalUrl = `${API_BASE}${cleanPath}`
    console.log('🔍 [editProfile] Building server URL:', finalUrl)
    avatarSrc.value = finalUrl
    console.log('🔍 [editProfile] avatarSrc.value after set:', avatarSrc.value)
}

const initNameFromAuth = () => {
    if (auth.userName) name.value = auth.userName
    else if (auth.user?.username) name.value = auth.user.username
}

onMounted(() => {
    console.log('🔍 [editProfile] onMounted called')
    if (auth.initAuth) auth.initAuth()
    initNameFromAuth()
    // Remove initAvatarFromAuth() here since watch will handle it
})

// Watch auth.user to update name and avatar when it changes (after initAuth completes)
watch(() => auth.user, (newUser) => {
    console.log('🔍 [editProfile] watch triggered, newUser:', newUser)
    if (newUser) {
        initNameFromAuth()
        initAvatarFromAuth()
    }
}, { immediate: true })

// ✅ เมื่อเลือกไฟล์ (เก็บไฟล์จริงไว้เตรียมส่ง)
function onFileChange(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    
    // เช็คขนาดไฟล์ (ไม่เกิน 5MB)
    if (f.size > 5 * 1024 * 1024) {
        useNuxtApp().$showToast({ msg: 'ไฟล์ใหญ่เกินไป (กรุณาใช้รูปไม่เกิน 5MB)', type: 'error', time: 3000 })
        return
    }

    selectedFile.value = f

    // สร้าง Preview
    const r = new FileReader()
    r.onload = (ev) => {
        previewAvatar.value = ev.target.result
    }
    r.readAsDataURL(f)
}

// ✅ ฟังก์ชัน Save (ส่งข้อมูลเข้า Backend และเซฟลง DB)
async function save() {
    isUploading.value = true
    try {
        const token = localStorage.getItem('token')
        const userId = auth.user?.id || auth.user?._id
        
        if (!userId) {
            useNuxtApp().$showToast({ msg: 'ไม่พบข้อมูลผู้ใช้', type: 'error' })
            return
        }

        // --- 1. อัปโหลดรูปภาพ (ถ้ามีการเลือกรูปใหม่) -> เซฟลง DB ---
        if (selectedFile.value) {
            const formData = new FormData()
            formData.append('file', selectedFile.value)

            // ยิง API Upload (จะเซฟลง DB โดยอัตโนมัติ)
            const res = await $fetch(`${API_BASE}/api/sellers/upload-avatar`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            })

            if (res.success && res.data.avatar) {
                // Update auth store with new avatar
                auth.user.avatar = res.data.avatar
                // Update avatarSrc to reflect the change immediately
                avatarSrc.value = res.data.avatar.startsWith('http') ? res.data.avatar : `${API_BASE}${res.data.avatar}`
                // Update localStorage
                try {
                    const userLS = JSON.parse(localStorage.getItem('user') || '{}')
                    userLS.avatar = res.data.avatar
                    localStorage.setItem('user', JSON.stringify(userLS))
                } catch (e) {}
            }
        }

        // --- 2. อัปเดตชื่อร้าน -> PATCH ไปที่ Backend เพื่อเซฟลง DB ---
        if (name.value && name.value !== auth.userName) {
            const updateRes = await $fetch(`${API_BASE}/api/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: name.value })
            })

            if (updateRes.success) {
                // Update auth store
                auth.userName = name.value
                if (auth.user) auth.user.username = name.value
                // Update localStorage
                localStorage.setItem('userName', name.value)
                try {
                    const userLS = JSON.parse(localStorage.getItem('user') || '{}')
                    userLS.username = name.value
                    localStorage.setItem('user', JSON.stringify(userLS))
                } catch (e) {}
            }

                // If this account is a seller, also update the seller profile so seller collection stays in sync
                try {
                    if (auth.userType === 0) {
                        await $fetch(`${API_BASE}/api/sellers/by-user/${userId}`, {
                            method: 'PATCH',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ display_name: name.value, name: name.value.toLowerCase() })
                        })
                    }
                } catch (e) {
                    console.warn('Failed to update seller profile:', e)
                }

                    // Refresh auth and fetch updated seller/products so UI updates immediately
                    try {
                        if (auth.initAuth) await auth.initAuth()
                    } catch (e) { console.warn('auth.initAuth failed:', e) }

                    // Fetch updated seller and update local seller store so UI updates immediately
                    try {
                        if (auth.userType === 0) {
                            const sellerStore = useSellerStore()
                            const productStore = useProductStore()
                            const sellerRes = await $fetch(`${API_BASE}/api/sellers/by-user/${userId}`)
                            if (sellerRes && sellerRes.success && sellerRes.data) {
                                const s = sellerRes.data
                                // Map server seller to frontend store shape
                                const mapped = {
                                    id: s._id || s.id,
                                    name: s.name || s.display_name,
                                    display_name: s.display_name || s.name,
                                    rating: s.rating || '-',
                                    followers: s.followers || 0,
                                    description: s.description || ''
                                }

                                const idx = sellerStore.sellers.findIndex(x => (x.id && String(x.id) === String(mapped.id)) || (x.name && x.name.toLowerCase() === (mapped.name || '').toLowerCase()))
                                if (idx >= 0) sellerStore.sellers[idx] = { ...sellerStore.sellers[idx], ...mapped }
                                else sellerStore.sellers.push(mapped)

                                // Refresh product list so embedded seller names update across product views
                                try { await productStore.fetchProducts() } catch (e) { console.warn('productStore.fetchProducts failed:', e) }
                            }
                        }
                    } catch (e) {
                        console.warn('Failed to refresh seller store:', e)
                    }
        }

        useNuxtApp().$showToast({ msg: 'บันทึกข้อมูลเรียบร้อย', type: 'success' })
        
        // Reset preview
        selectedFile.value = null
        previewAvatar.value = null
        
        router.push('/SellerPage/dashboard')

    } catch (error) {
        console.error(error)
        useNuxtApp().$showToast({ msg: 'เกิดข้อผิดพลาด: ' + (error.data?.message || error.message), type: 'error', time: 5000 })
    } finally {
        isUploading.value = false
    }
}

function handleImageError(e) {
    e.target.src = '/images/avtar.jpg'
}

function cancel() {
    router.back()
}
</script>

<style scoped>
.card { border-radius:8px }
</style>