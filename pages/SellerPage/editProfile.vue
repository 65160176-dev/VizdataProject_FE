<template>
    <div class="container py-4">
        <div class="card mx-auto" style="max-width:640px;">
            <div class="card-body">
                <h5 class="card-title">แก้ไขโปรไฟล์ร้าน</h5>

                <div class="mb-3 text-center">
                    <img :src="avatarDisplay" class="rounded-circle border" style="width:96px;height:96px;object-fit:cover" @error="handleImageError" />
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'
import { useRuntimeConfig } from '#app'

// Layout
definePageMeta({ layout: 'seller' })

const router = useRouter()
const auth = useAuthStore()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:3001'

const name = ref('')
const selectedFile = ref(null)    // เก็บไฟล์จริงที่จะอัปโหลด
const previewAvatar = ref(null)   // เก็บรูปพรีวิว (Base64) เพื่อแสดงผลทันที
const isUploading = ref(false)

// ✅ Logic แสดงรูปภาพที่ถูกต้อง
const avatarDisplay = computed(() => {
    // A. ถ้ามีรูปที่เพิ่งเลือก (Preview) ใช้เลย
    if (previewAvatar.value) return previewAvatar.value

    // B. ดึงรูปจาก Store หรือ LocalStorage
    const userAvatar = auth.user?.avatar || (process.client ? localStorage.getItem('sellerAvatar') : null)
    
    if (!userAvatar) return '/images/avtar.jpg'

    // C. ถ้าเป็น Base64 หรือ http (รูปภายนอก) ใช้ได้เลย
    if (userAvatar.startsWith('data:') || userAvatar.startsWith('blob:') || userAvatar.startsWith('http')) {
        return userAvatar
    }

    // D. ถ้าเป็น Path จาก Server ต้องเติม http://localhost:3001
    const cleanPath = userAvatar.startsWith('/') ? userAvatar : `/${userAvatar}`
    return `${API_BASE}${cleanPath}`
})

onMounted(() => {
    if (auth.initAuth) auth.initAuth()
    if (auth.userName) name.value = auth.userName
})

// ✅ เมื่อเลือกไฟล์ (เก็บไฟล์จริงไว้เตรียมส่ง)
function onFileChange(e) {
    const f = e.target.files && e.target.files[0]
    if (!f) return
    
    // เช็คขนาดไฟล์ (ไม่เกิน 5MB)
    if (f.size > 5 * 1024 * 1024) {
        alert('ไฟล์ใหญ่เกินไป (กรุณาใช้รูปไม่เกิน 5MB)')
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

// ✅ ฟังก์ชัน Save (ส่งข้อมูลเข้า Backend)
async function save() {
    isUploading.value = true
    try {
        const token = localStorage.getItem('token')
        
        // --- 1. อัปโหลดรูปภาพ (ถ้ามีการเลือกรูปใหม่) ---
        if (selectedFile.value) {
            const formData = new FormData()
            formData.append('file', selectedFile.value)

            // ยิง API Upload
            const res = await $fetch(`${API_BASE}/api/sellers/upload-avatar`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            })

            if (res.success) {
                auth.user.avatar = res.data.avatar
                updateLocalStorageUser(res.data.avatar)
            }
        }

        // --- 2. อัปเดตชื่อร้าน (ถ้า Backend มี API แก้ชื่อ เพิ่มตรงนี้) ---
        if (name.value) {
            auth.userName = name.value
            localStorage.setItem('userName', name.value)
        }

        alert('บันทึกข้อมูลเรียบร้อย')
        router.push('/SellerPage/dashboard')

    } catch (error) {
        console.error(error)
        alert('เกิดข้อผิดพลาด: ' + (error.data?.message || error.message))
    } finally {
        isUploading.value = false
    }
}

function updateLocalStorageUser(newAvatar) {
    const userLS = JSON.parse(localStorage.getItem('user') || '{}')
    userLS.avatar = newAvatar
    localStorage.setItem('user', JSON.stringify(userLS))
    localStorage.setItem('sellerAvatar', newAvatar)
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