<template>
    <div class="custom-modal-overlay">
        <div class="custom-modal-content">
            <div class="modal-header mb-3">
                <h4 class="mb-0">เลือกวิธีการจัดส่ง</h4>
                <button type="button" class="btn-close" @click="$emit('close')">×</button>
            </div>

            <div class="modal-body">
                <div class="shipping-option-item" v-for="(option, index) in options" :key="index"
                    @click="tempSelected = option"
                    :class="{ 'selected': tempSelected && tempSelected.id === option.id }">

                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <input type="radio" :name="'popup-shipping'"
                                :checked="tempSelected && tempSelected.id === option.id">
                            <span class="ms-2 fw-bold">{{ option.name }}</span>
                            <div class="text-muted small ms-4">{{ option.time }}</div>
                        </div>
                        <div class="fw-bold">
                            {{ option.price === 0 ? 'Free' : (option.price * currency).toFixed(2) }}
                        </div>
                    </div>

                </div>
            </div>

            <div class="modal-footer mt-4 d-flex justify-content-end gap-2">
                <button class="btn btn-outline-secondary btn-sm" @click="$emit('close')">
                    ยกเลิก
                </button>

                <button class="btn btn-solid btn-sm btn-primary" @click="confirmSelection">
                    ยืนยัน
                </button>
            </div>

        </div>
    </div>
</template>

<script>
export default {
    props: {
        options: {
            type: Array,
            required: true
        },
        currentId: {
            type: String,
            default: ''
        },
        currency: {
            type: Number,
            default: 1
        }
    },
    data() {
        return {
            // ตัวแปรสำหรับเก็บค่าที่เลือกใน Popup (ยังไม่ save จริง)
            tempSelected: null
        }
    },
    mounted() {
        document.body.style.overflow = 'hidden';
        // เมื่อเปิด Popup ให้ตั้งค่าเริ่มต้นตามที่หน้าหลักส่งมา (currentId)
        if (this.currentId) {
            this.tempSelected = this.options.find(opt => opt.id === this.currentId) || null;
        }
    },
    beforeUnmount() {
        document.body.style.overflow = '';
    },
    methods: {
        confirmSelection() {
            // เมื่อกดยืนยัน ให้ส่งค่า tempSelected กลับไปให้หน้าหลัก
            if (this.tempSelected) {
                this.$emit('select-shipping', this.tempSelected);
            }
            this.$emit('close');
        }
    }
}
</script>

<style scoped>
.custom-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.custom-modal-content {
    background: white;
    padding: 25px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 10px;
}

.btn-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #666;
}

.shipping-option-item {
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 6px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: all 0.2s;
}

.shipping-option-item:hover {
    background-color: #f9f9f9;
    border-color: #aaa;
}

/* สีไฮไลท์เมื่อเลือก */
.shipping-option-item.selected {
    border-color: #ff4c3b;
    background-color: #fff5f5;
}

.shipping-option-item input[type="radio"] {
    cursor: pointer;
}

/* จัดระยะห่างระหว่างปุ่ม */
.gap-2 {
    gap: 10px;
}

.modal-footer .btn {
    padding: 8px 25px;
    /* จัด Padding บนล่าง-ซ้ายขวา ให้เท่ากัน */
    min-width: 100px;
    /* กำหนดความกว้างขั้นต่ำให้เท่ากัน (ดูสวยขึ้น) */
    height: 40px;
    /* บังคับความสูงให้เท่ากันเป๊ะ */
    display: inline-flex;
    /* จัดตัวหนังสือให้อยู่กึ่งกลาง */
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    /* ความมนของมุม */
    font-size: 14px;
    /* ขนาดตัวอักษร */
    line-height: 1;
    /* จัดบรรทัดให้เท่ากัน */
}
</style>