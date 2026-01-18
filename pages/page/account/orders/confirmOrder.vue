<template>
    <div class="modal-backdrop">
        <div class="modal-content text-center">
            <div class="modal-header">
                <h3>ยืนยันการรับสินค้า</h3>
                <!-- <span class="close-btn" @click="$emit('close')">&times;</span> -->
            </div>

            <div class="modal-body">
                <div class="mb-3">
                    <i class="fa fa-check-circle text-success" style="font-size: 3.5rem;"></i>
                </div>
                <p class="confirm-text">
                    ยืนยันว่าได้รับสินค้าครบถ้วนถูกต้องแล้ว?<br>
                    <small class="text-muted"
                        style="font-size: 0.85rem;">(เมื่อยืนยันแล้วจะไม่สามารถขอคืนเงินได้)</small>
                </p>

                <div class="d-flex gap-2 flex-column">
                    <button @click="$emit('confirm')" class="btn-theme-primary bg-success text-white">
                        ยืนยัน
                    </button>
                    <button @click="$emit('close')" class="btn-theme-secondary">
                        ยกเลิก
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['close', 'confirm'])
</script>

<style scoped>
/* Theme กลาง */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1060;
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
    max-width: 380px;
    border: none;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    position: relative;
}

.modal-header {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 700;
    color: #333;
}

.close-btn {
    position: absolute;
    top: 15px;
    right: 20px;
    font-size: 1.5rem;
    cursor: pointer;
    color: #999;
    line-height: 1;
}

.close-btn:hover {
    color: #333;
}

.confirm-text {
    font-size: 1rem;
    color: #555;
    margin-bottom: 25px;
    line-height: 1.6;
}

/* Buttons */
.btn-theme-primary,
.btn-theme-secondary {
    width: 100%;
    padding: 12px;
    border-radius: 50px;
    /* ปุ่มรี */
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: 0.2s;
    font-size: 1rem;
}

.btn-theme-secondary {
    background-color: #fff;
    border: 1px solid #dee2e6;
    color: #6c757d;
}

.btn-theme-secondary:hover {
    background-color: #f8f9fa;
}

.btn-theme-primary:hover {
    opacity: 0.9;
}
</style>