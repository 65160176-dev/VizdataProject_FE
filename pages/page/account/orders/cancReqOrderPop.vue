<template>
    <Teleport to="body">
        <div class="modal-backdrop">
            <div class="modal-content">
                <div class="modal-header">
                    <h3>ระบุเหตุผลที่ยกเลิก</h3>
                </div>

                <div class="modal-body text-start">
                    <label class="text-muted small mb-3 d-block">
                        กรุณาเลือกเหตุผลที่คุณต้องการยกเลิกคำสั่งซื้อ:
                    </label>

                    <div class="reason-list mb-3">
                        <div v-for="(reason, index) in reasons" :key="index" class="form-check custom-radio mb-2">
                            <input class="form-check-input" type="radio" name="cancelReason" :id="'reason-' + index"
                                :value="reason" v-model="selectedReason">
                            <label class="form-check-label ms-2" :for="'reason-' + index" style="cursor: pointer;">
                                {{ reason }}
                            </label>
                        </div>
                    </div>

                    <transition name="fade">
                        <textarea v-if="selectedReason === 'อื่นๆ'" v-model="otherReason"
                            class="form-control border-0 shadow-sm mt-2 bg-light" rows="3"
                            placeholder="ระบุเหตุผลอื่นๆ เพิ่มเติม...">
                        </textarea>
                    </transition>
                </div>

                <div class="modal-footer d-flex flex-column gap-2 pt-3 border-top mt-2">
                    <button class="btn-theme-primary bg-danger text-white" :disabled="!isFormValid" @click="submit">
                        ยืนยันการส่งคำขอ
                    </button>
                    <button class="btn-theme-secondary" @click="$emit('close')">
                        ยกเลิก
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, computed } from 'vue'

const emit = defineEmits(['close', 'confirm'])
const selectedReason = ref('')
const otherReason = ref('')

const reasons = [
    "เปลี่ยนใจ / ไม่ต้องการสินค้านี้แล้ว",
    "เจอสินค้าราคาถูกกว่าจากที่อื่น",
    "สั่งซื้อสินค้าผิด (ผิดสี, ผิดไซส์, ผิดรุ่น)",
    "ผู้ขายไม่ตอบ / ตอบช้า",
    "อื่นๆ"
]

const isFormValid = computed(() => {
    if (!selectedReason.value) return false
    if (selectedReason.value === 'อื่นๆ') {
        return otherReason.value && otherReason.value.trim().length >= 3
    }
    return true
})

const submit = () => {
    let finalReason = selectedReason.value
    if (finalReason === 'อื่นๆ') { finalReason = `อื่นๆ: ${otherReason.value}` }
    emit('confirm', finalReason)
}
</script>

<style scoped>
/* Theme กลาง */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    /* เต็มจอ */
    height: 100vh;
    /* เต็มจอ */
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 99999;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    backdrop-filter: blur(4px);
}

.modal-content {
    background-color: white;
    padding: 25px;
    border-radius: 16px;
    width: 90%;
    max-width: 400px;
    border: none;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
}

.modal-header {
    text-align: center;
    border-bottom: 1px solid #f0f0f0;
    padding-bottom: 15px;
    margin-bottom: 15px;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.2rem;
    font-weight: 700;
    color: #333;
}

/* Radio & Inputs */
.form-check-input {
    cursor: pointer;
    border-color: #ccc;
}

.form-check-input:checked {
    background-color: #dc3545;
    border-color: #dc3545;
}

textarea.form-control:focus {
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    border-color: #dc3545;
}

/* [แก้ไข] Buttons ให้เหมือนหน้ายืนยันรับสินค้า */
.modal-footer {
    width: 100%;
    /* ให้ Container กว้างเต็ม */
}

.btn-theme-primary,
.btn-theme-secondary {
    width: 100%;
    /* ปุ่มกว้างเต็ม */
    padding: 12px;
    border-radius: 50px;
    /* ปุ่มรี */
    border: none;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.2s;
}

.btn-theme-primary:hover {
    background-color: #c82333;
    /* แดงเข้มเมื่อ Hover */
}

/* ปุ่มรอง (สีขาวขอบเทา) */
.btn-theme-secondary {
    background-color: white;
    border: 1px solid #dee2e6;
    color: #6c757d;
}

.btn-theme-secondary:hover {
    background-color: #f8f9fa;
    border-color: #c1c9d0;
    color: #495057;
}

.btn-theme-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>