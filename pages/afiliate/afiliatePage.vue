<template>
  <div class="col-sm-12">
    
    <div class="card bg-white shadow-sm mb-4">
      <div class="card-body text-center p-5">
        <h3 class="text-start mb-4 fw-bold">รายได้ทั้งหมด</h3>
        
        <div class="py-4" style="background-color: #fff0f3; border-radius: 20px;">
          <h1 class="display-1 fw-bold text-dark mb-2">
            {{ formatNumber(totalIncome) }}
          </h1>

          <div class="d-flex justify-content-center align-items-center gap-2 mt-3">
             <input type="date" class="form-control border-0 bg-white shadow-sm" style="width: 160px; text-align: center;" v-model="startDate">
             <span class="text-muted fw-bold">-</span>
             <input type="date" class="form-control border-0 bg-white shadow-sm" style="width: 160px; text-align: center;" v-model="endDate">
          </div>
          <small class="text-muted mt-2 d-block" v-if="!startDate && !endDate">(แสดงข้อมูลทั้งหมด)</small>

        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>Affiliate Report</h5>
        <button v-if="startDate || endDate" @click="clearDate" class="btn btn-sm btn-outline-danger">
            ล้างวันที่
        </button>
      </div>

      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped text-center align-middle">
            <thead class="table-light">
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th class="text-start">สินค้า</th>
                <th>หมวดหมู่</th>
                <th>ราคาสินค้า</th>
                <th>ส่วนแบ่งสินค้า</th>
                <th>สถานะ</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in filteredAffiliateData" :key="index">
                <td>{{ item.orderId }}</td>
                <td>{{ item.date }}</td>
                <td class="text-start">{{ item.productName }}</td>
                <td><span class="badge bg-light text-dark border">{{ item.category }}</span></td>
                <td>{{ formatCurrency(item.price) }}</td>
                
                <td class="text-success fw-bold">+{{ formatCurrency(item.commission) }}</td>

                <td>
                  <span 
                    :class="[
                      'badge', 
                      { 
                        'bg-success': item.status === 'สำเร็จแล้ว', 
                        'bg-primary': item.status === 'รอชำระ', 
                        'bg-danger': item.status === 'ยกเลิก' 
                      }
                    ]"
                  >
                    {{ item.status }}
                  </span>
                </td>
              </tr>
              
              <tr v-if="filteredAffiliateData.length === 0">
                  <td colspan="7" class="text-muted py-3">ไม่พบข้อมูลในช่วงวันที่เลือก</td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>

      <ClientOnly>
        <div class="modal fade" id="affiliateModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">จัดการข้อมูล Affiliate</h5>
                <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form class="needs-validation">
                   <div class="row">
                      <div class="col-6 form-group mb-3">
                        <label class="mb-1">Order ID :</label>
                        <input class="form-control" type="text" placeholder="Auto Gen">
                      </div>
                      <div class="col-6 form-group mb-3">
                        <label class="mb-1">Date :</label>
                        <input class="form-control" type="date">
                      </div>
                  </div>
                  <div class="form-group mb-3">
                    <label class="mb-1">ชื่อสินค้า :</label>
                    <input class="form-control" type="text">
                  </div>
                   <div class="row">
                      <div class="col-6 form-group mb-3">
                        <label class="mb-1">ราคาสินค้า :</label>
                        <input class="form-control" type="number">
                      </div>
                      <div class="col-6 form-group mb-3">
                        <label class="mb-1">ส่วนแบ่ง :</label>
                        <input class="form-control" type="number">
                      </div>
                  </div>
                   <div class="form-group mb-3">
                    <label class="mb-1">หมวดหมู่ :</label>
                    <select class="form-select">
                      <option>Skincare</option>
                      <option>Electronics</option>
                      <option>Fashion</option>
                      <option>Home & Living</option>
                    </select>
                  </div>
                  <div class="form-group mb-3">
                    <label class="mb-1">สถานะ :</label>
                    <select class="form-select">
                      <option value="รอชำระ">รอชำระ</option>
                      <option value="สำเร็จแล้ว">สำเร็จแล้ว</option>
                      <option value="ยกเลิก">ยกเลิก</option>
                    </select>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-bs-dismiss="modal">บันทึก</button>
                <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">ปิด</button>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue"
import affiliateDataFile from "~/data/affiliate.json"

definePageMeta({ layout: "default" })

const affiliateData = ref(affiliateDataFile.data)

// 1. สร้างตัวแปรเก็บวันที่
const startDate = ref('')
const endDate = ref('')

// 2. ฟังก์ชันกรองข้อมูล (Computed)
const filteredAffiliateData = computed(() => {
  return affiliateData.value.filter(item => {
    // ถ้ายังไม่ได้เลือกวันที่เลย ให้แสดงทั้งหมด
    if (!startDate.value && !endDate.value) return true
    
    // แปลงวันที่เพื่อเปรียบเทียบ
    const itemDate = new Date(item.date)
    const start = startDate.value ? new Date(startDate.value) : null
    const end = endDate.value ? new Date(endDate.value) : null

    // กรองตามเงื่อนไข
    if (start && itemDate < start) return false
    if (end && itemDate > end) return false
    
    return true
  })
})

// 3. คำนวณรายได้ (แก้ให้คำนวณจากข้อมูลที่กรองแล้ว)
const totalIncome = computed(() => {
  return filteredAffiliateData.value
    .filter(item => item.status === 'สำเร็จแล้ว') 
    .reduce((sum, item) => sum + Number(item.commission), 0)
})

const clearDate = () => {
    startDate.value = ''
    endDate.value = ''
}

// ฟอร์แมตตัวเลข (เหมือนเดิม)
const formatNumber = (value) => {
  return new Intl.NumberFormat('th-TH', { minimumFractionDigits: 0 }).format(value);
}

// ฟอร์แมตสกุลเงิน (เหมือนเดิม)
const formatCurrency = (value) => {
  return new Intl.NumberFormat('th-TH', { 
    style: 'currency', 
    currency: 'THB',
    minimumFractionDigits: 0 
  }).format(value);
}

const deleteOrder = (index) => {
  if (confirm("คุณต้องการลบรายการนี้หรือไม่?")) affiliateData.value.splice(index, 1)
}

const editOrder = (orderId) => {
  alert(`กำลังแก้ไข Order ID: ${orderId}`)
}
</script>