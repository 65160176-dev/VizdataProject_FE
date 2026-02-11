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
                        <div v-for="(reason, index) in dynamicReasons" :key="index"
                            class="form-check custom-radio mb-2">
                            <input class="form-check-input" type="radio" name="cancelReason" :id="'reason-' + index"
                                :value="reason" v-model="selectedReason">
                            <label class="form-check-label ms-2" :for="'reason-' + index" style="cursor: pointer;">
                                {{ reason }}
                            </label>
                        </div>
                    </div>

                    <transition name="fade">
                        <textarea v-if="selectedReason === 'อื่นๆ (โปรดระบุ)'" v-model="otherReason"
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

// ✅ 1. เพิ่ม props รับ status
const props = defineProps({
    status: {
        type: String,
        default: 'pending' // ค่าเริ่มต้น
    }
})

const emit = defineEmits(['close', 'confirm'])
const selectedReason = ref('')
const otherReason = ref('')

// ✅ 2. แยกชุดเหตุผลตามสถานะ
const reasonSets = {
    pending: [
        "ต้องการแก้ไขที่อยู่จัดส่ง หรือเบอร์โทรศัพท์",
        "ต้องการเปลี่ยนวิธีการชำระเงิน",
        "สั่งซื้อสินค้าผิด (ผิดสี, ผิดไซส์, ผิดจำนวน)",
        "เปลี่ยนใจ / พบสินค้าอื่นที่ต้องการมากกว่า",
        "อื่นๆ (โปรดระบุ)"
    ],
    preparing: [
        "ผู้ขายใช้เวลาเตรียมพัสดุนานกว่าที่คาดไว้",
        "ผู้ขายแจ้งว่าสินค้าหมดสต็อก",
        "พบสินค้าที่ราคาถูกกว่าในร้านอื่น",
        "อื่นๆ (โปรดระบุ)"
    ],
    shipped: [
        "ได้รับสินค้าไม่ตรงตามที่สั่ง (ผิดสี, ผิดรุ่น)",
        "สินค้าชำรุด / เสียหายจากการขนส่ง",
        "ได้รับสินค้าไม่ครบตามจำนวน",
        "สินค้าไม่ตรงตามรายละเอียด (ไม่ตรงปก)",
        "อื่นๆ (โปรดระบุ)"
    ]
}

// ✅ 3. สร้าง Computed เพื่อเลือกชุดเหตุผลอัตโนมัติ
const dynamicReasons = computed(() => {
    // แปลง status เป็นตัวพิมพ์เล็กเพื่อเทียบ
    const currentStatus = (props.status || 'pending').toLowerCase()

    // ถ้าสถานะเป็น shipping หรือ shipped ให้ใช้ชุดเดียวกัน
    if (currentStatus === 'shipping' || currentStatus === 'shipped') {
        return reasonSets.shipped
    }
    // ถ้าสถานะเป็น preparing หรือ processing ให้ใช้ชุดเดียวกัน
    if (currentStatus === 'preparing' || currentStatus === 'processing') {
        return reasonSets.preparing
    }

    // ค่า default เป็น pending
    return reasonSets.pending
})

const isFormValid = computed(() => {
    if (!selectedReason.value) return false
    if (selectedReason.value === 'อื่นๆ (โปรดระบุ)') {
        return otherReason.value && otherReason.value.trim().length >= 3
    }
    return true
})

const submit = () => {
    let finalReason = selectedReason.value
    if (finalReason === 'อื่นๆ (โปรดระบุ)') { finalReason = `อื่นๆ: ${otherReason.value}` }
    emit('confirm', finalReason)
}
</script>

<style scoped>
/* (ใช้ Style เดิมของคุณทั้งหมด ไม่ต้องแก้) */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
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

.modal-footer {
    width: 100%;
}

.btn-theme-primary,
.btn-theme-secondary {
    width: 100%;
    padding: 12px;
    border-radius: 50px;
    border: none;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: 0.2s;
}

.btn-theme-primary:hover {
    background-color: #c82333;
}

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