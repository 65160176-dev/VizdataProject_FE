<template>
    <div v-if="show" class="modal fade show d-block" tabindex="-1" role="dialog" aria-hidden="true"
        style="background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document" style="max-width: 800px;">
            <div class="modal-content border-0 p-3">

                <div class="modal-header border-0 pb-0">
                    <h5 class="modal-title fw-normal" style="font-size: 1.25rem;">
                        {{ isEditMode ? 'Edit Address' : 'Add New Address' }}
                    </h5>
                    <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
                </div>

                <div class="modal-body pt-3">
                    <form @submit.prevent="submitForm" class="theme-form">
                        <div class="row g-3">
                            <div class="col-md-6">
                                <label class="form-label text-muted mb-1">First Name</label>
                                <input type="text" class="form-control" v-model="form.firstName" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted mb-1">Last Name</label>
                                <input type="text" class="form-control" v-model="form.lastName" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted mb-1">Phone</label>
                                <input type="text" class="form-control" v-model="form.phone" required>
                            </div>
                            <!-- <div class="col-md-6">
                                <label class="form-label text-muted mb-1">Email</label>
                                <input type="email" class="form-control" v-model="form.email" required>
                            </div> -->
                            <div class="col-12">
                                <label class="form-label text-muted mb-1">Address</label>
                                <input type="text" class="form-control" v-model="form.address" required>
                            </div>
                            <div class="col-12">
                                <label class="form-label text-muted mb-1">City</label>
                                <input type="text" class="form-control" v-model="form.city" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted mb-1">State</label>
                                <input type="text" class="form-control" v-model="form.state" required>
                            </div>
                            <div class="col-md-6">
                                <label class="form-label text-muted mb-1">Pincode</label>
                                <input type="text" class="form-control" v-model="form.pincode" required>
                            </div>
                        </div>
                    </form>
                </div>

                <div class="modal-footer border-0 pt-0 justify-content-end gap-2">

                    <button type="button" class="btn btn-outline-secondary px-4"
                        style="min-width: 120px; height: 45px; display: flex; align-items: center; justify-content: center;"
                        @click="closeModal">
                        ยกเลิก
                    </button>

                    <button type="button" class="btn btn-solid px-4"
                        style="background-color: #ff4c3b; border-color: #ff4c3b; color: white; min-width: 120px; height: 45px; display: flex; align-items: center; justify-content: center;"
                        @click="submitForm">
                        {{ isEditMode ? 'อัปเดต' : 'บันทึก' }}
                    </button>

                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, watch, ref } from 'vue'

const props = defineProps({
    show: Boolean,
    editData: Object // รับข้อมูลที่จะแก้ไข (ถ้ามี)
})

const emit = defineEmits(['close', 'save'])

const isEditMode = ref(false) // ตัวแปรเช็คว่ากำลังแก้ไขอยู่ไหม

const form = reactive({
    id: null, // เพิ่ม ID เพื่อใช้เช็คตอนบันทึก
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
})

// เมื่อ Modal ถูกเปิด (props.show เปลี่ยนเป็น true)
watch(() => props.show, (newVal) => {
    if (newVal) {
        if (props.editData) {
            // โหมดแก้ไข: เอาข้อมูลเก่ามาใส่ Form
            isEditMode.value = true
            Object.assign(form, props.editData)
        } else {
            // โหมดเพิ่มใหม่: ล้าง Form
            isEditMode.value = false
            resetForm()
        }
    }
})

const resetForm = () => {
    form.id = null
    form.firstName = ''
    form.lastName = ''
    form.email = ''
    form.phone = ''
    form.address = ''
    form.city = ''
    form.state = ''
    form.pincode = ''
    form.isDefault = false
}

const closeModal = () => {
    emit('close')
}

const submitForm = () => {
    emit('save', { ...form }) // ส่งข้อมูลกลับไปให้ Parent
    // ไม่ต้อง Reset ที่นี่ เพราะจะ Reset ตอนเปิดใหม่อยู่แล้ว
}
</script>

<style scoped>
/* Style เดิม */
.form-label {
    font-weight: 400;
    font-size: 0.95rem;
    color: #666;
}

.form-control {
    border: 1px solid #eee;
    background-color: #fff;
    border-radius: 0.25rem;
    padding: 0.5rem 0.75rem;
}

.form-control:focus {
    border-color: #ff4c3b;
    box-shadow: none;
}

.btn-solid:hover {
    background-color: #e04434 !important;
}
</style>