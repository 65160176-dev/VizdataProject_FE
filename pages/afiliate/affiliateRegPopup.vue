<template>
    <div class="affiliate-modal-overlay">
        <div class="affiliate-modal-content text-center">
            <div class="modal-header">
                <h3>ยืนยันการสมัคร</h3>
                <span class="close-btn" @click="$emit('close')">&times;</span>
            </div>

            <div class="modal-body">
                <p class="confirm-text">ต้องการสมัคร Affiliate หรือไม่?</p>

                <div class="btn-group">
                    <button @click="$emit('confirm')" class="btn-confirm">ตกลง</button>
                    <button @click="$emit('close')" class="btn-cancel">ยกเลิก</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    // ไม่ต้องมี data หรือ methods ซับซ้อน แค่ส่ง event กลับไปก็พอ
}
</script>


<style scoped>
.affiliate-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
}

.affiliate-modal-content {
    background-color: white;
    padding: 25px;
    border-radius: 8px;
    width: 90%;
    max-width: 350px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    position: relative;
    text-align: center;
}

/* 1. จัดการที่ตัวกล่องแม่ (Header) */
.modal-header {
    position: relative;
    /* เพื่อให้ปุ่มปิด (absolute) อ้างอิงหากล่องนี้ได้ */
    display: flex;
    /* ใช้ Flexbox */
    justify-content: center;
    /* บังคับให้ลูก (h3) มาอยู่ตรงกลาง */
    align-items: center;
    /* จัดกลางแนวตั้ง */
    width: 100%;
    /* กว้างเต็ม */
    border-bottom: none;
    /* (แถม) ลบเส้นขีดด้านล่างถ้ามี */
    padding-bottom: 0;
    /* (แถม) ลดช่องว่างด้านล่างถ้าห่างไป */
}

/* 2. ตัวข้อความ h3 */
.modal-header h3 {
    margin: 0 0 15px 0;
    font-size: 20px;
    font-weight: bold;
    /* เพิ่มตัวหนาให้ดูเด่นขึ้น */
}

/* 3. ปุ่มปิด (เหมือนเดิมแต่ย้ำความชัวร์) */
.close-btn {
    position: absolute;
    /* ลอยอิสระ ไม่เกี่ยวกับเพื่อน */
    top: 10px;
    right: 15px;
    /* ชิดขวา */
    font-size: 28px;
    cursor: pointer;
    color: #aaa;
    line-height: 1;
    /* แก้ปัญหากากบาทลอยสูง/ต่ำเกินไป */
}

.close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 28px;
    cursor: pointer;
    color: #aaa;
}

.close-btn:hover {
    color: #333;
}

.confirm-text {
    font-size: 16px;
    margin-bottom: 25px;
    color: #555;
}

.btn-group {
    display: flex;
    justify-content: center;
    gap: 15px;
}

.btn-confirm {
    padding: 8px 25px;
    background-color: #ff4c3b;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bold;
}

.btn-cancel {
    padding: 8px 25px;
    background-color: #f1f1f1;
    color: #333;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
}
</style>
