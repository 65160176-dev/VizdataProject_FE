<template>
    <Teleport to="body">
        <div class="modal-backdrop">
            <div class="modal-content text-center">
                <div class="modal-header">
                    <h3>ยืนยันการยกเลิก</h3>
                    <!-- <span class="close-btn" @click="$emit('close')">&times;</span> -->
                </div>

                <div class="modal-body">
                    <div class="mb-3">
                        <i class="fa fa-exclamation-circle text-danger" style="font-size: 3rem;"></i>
                    </div>

                    <p class="confirm-text">
                        คุณต้องการยกเลิกคำสั่งซื้อนี้ใช่หรือไม่?
                        <br>
                        <small class="text-muted">(การกระทำนี้ไม่สามารถย้อนกลับได้)</small>
                    </p>

                    <div class="btn-group">
                        <button @click="$emit('confirm')" class="btn-confirm">
                            ยืนยันการยกเลิก
                        </button>
                        <button @click="$emit('close')" class="btn-cancel">
                            ยกเลิก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
const emit = defineEmits(['close', 'confirm'])
</script>

<style scoped>
/* --- ก๊อปปี้สไตล์มาจาก confirmOrder.vue โดยตรง --- */

.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 1060;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    backdrop-filter: blur(2px);
}

.modal-content {
    background-color: white;
    padding: 25px;
    border-radius: 8px;
    width: 90%;
    max-width: 380px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    position: relative;
}

.modal-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 10px;
    position: relative;
}

.modal-header h3 {
    margin: 0;
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

.close-btn {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 28px;
    cursor: pointer;
    color: #aaa;
    line-height: 1;
}

.confirm-text {
    font-size: 16px;
    margin-bottom: 25px;
    color: #555;
    line-height: 1.5;
}

/* จุดสำคัญ: ต้องมี flex-direction: column เพื่อให้ปุ่มเรียงแนวตั้ง */
.btn-group {
    display: flex;
    gap: 10px;
    width: 100%;
    flex-direction: column;
}

.btn-confirm {
    width: 100%;
    padding: 10px;
    background-color: #dc3545;
    /* สีแดง */
    color: white;
    border: none;
    border-radius: 50px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.2s;
}

.btn-confirm:hover {
    background-color: #c82333;
    /* แดงเข้มตอนเอาเมาส์ชี้ */
}

.btn-cancel {
    width: 100%;
    padding: 10px;
    background-color: white;
    color: #666;
    border: 1px solid #ddd;
    border-radius: 50px;
    cursor: pointer;
}

.btn-cancel:hover {
    background-color: #f8f9fa;
}
</style>