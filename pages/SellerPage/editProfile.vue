<template>
	<div class="container py-4">
		<div class="card mx-auto" style="max-width:640px;">
			<div class="card-body">
				<h5 class="card-title">แก้ไขโปรไฟล์ร้าน</h5>

				<div class="mb-3 text-center">
					<img :src="avatar" class="rounded-circle" style="width:96px;height:96px;object-fit:cover" />
				</div>

				<div class="mb-3">
					<label class="form-label">รูปโปรไฟล์</label>
					<input type="file" class="form-control" accept="image/*" @change="onFileChange" />
				</div>

				<div class="mb-3">
					<label class="form-label">ชื่อร้าน</label>
					<input class="form-control" v-model="name" />
				</div>

				<div class="d-flex justify-content-end" style="gap:8px">
					<button class="btn btn-secondary" @click="cancel">ยกเลิก</button>
					<button class="btn btn-primary" @click="save">บันทึก</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/store/auth'

const router = useRouter()
const auth = useAuthStore()

const name = ref('')
const avatar = ref('/images/avtar.jpg')
let pendingAvatar = null

onMounted(() => {
	auth.initAuth && auth.initAuth()
	if (auth.userName) name.value = auth.userName
	const saved = localStorage.getItem('sellerAvatar')
	if (saved) avatar.value = saved
})

function onFileChange(e) {
	const f = e.target.files && e.target.files[0]
	if (!f) return
	const r = new FileReader()
	r.onload = (ev) => {
		pendingAvatar = ev.target.result
		avatar.value = pendingAvatar
	}
	r.readAsDataURL(f)
}

function save() {
	if (name.value) {
		auth.userName = name.value
		localStorage.setItem('userName', name.value)
	}
	if (pendingAvatar) {
		localStorage.setItem('sellerAvatar', pendingAvatar)
	}
	// navigate back to dashboard
	router.push('/SellerPage/dashboard')
}

function cancel() {
	router.back()
}
</script>

<style scoped>
.card { border-radius:8px }
</style>

