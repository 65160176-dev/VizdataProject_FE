<template>
  <div class="col-sm-12">
    <div class="card">

      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>รายการคำสั่งซื้อที่ต้องจัดส่ง (Shipping Queue)</h5>

        <button 
          type="button" 
          class="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#shippingModal"
        >
          เพิ่มรายการจัดส่งใหม่
        </button>
      </div>

      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped text-center">
            <thead class="table-light">
              <tr>
                <th>Order ID</th>
                <th>วันที่สั่งซื้อ</th>
                <th>ชื่อลูกค้า</th>
                <th>ยอดรวม</th>
                <th>สถานะจัดส่ง</th>
                <th>เลข Tracking</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in shippingData" :key="index">
                <td>{{ item.orderId }}</td>
                <td>{{ item.date }}</td>
                <td>{{ item.customerName }}</td>
                <td>{{ item.totalPrice }}</td>

                <td>
                  <span 
                    :class="[
                      'badge', 
                      { 
                        'bg-warning': item.status === 'Pending', 
                        'bg-info': item.status === 'Shipped', 
                        'bg-success': item.status === 'Delivered',
                        'bg-danger': item.status === 'Cancelled' 
                      }
                    ]"
                  >
                    {{ item.status }}
                  </span>
                </td>

                <td>{{ item.trackingNumber }}</td>

                <td>
                  <Icon
                    name="feather:truck"
                    style="height:20px; cursor:pointer; margin-right:8px; color: #007bff;"
                    @click="updateShipping(item.orderId)"
                  />

                  <Icon
                    name="feather:trash"
                    style="height:20px; cursor:pointer; color:red;"
                    @click="deleteShipping(index)"
                  />
                </td>
              </tr>
            </tbody>

          </table>
        </div>
      </div>

      <ClientOnly>
        <div class="modal fade" id="shippingModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">

              <div class="modal-header">
                <h5 class="modal-title f-w-600">เพิ่ม/แก้ไขข้อมูลการจัดส่ง</h5>
                <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
              </div>

              <div class="modal-body">
                <form class="needs-validation">

                  <div class="form-group mb-3">
                    <label class="mb-1">Order ID :</label>
                    <input class="form-control" type="text" readonly>
                  </div>

                  <div class="form-group mb-3">
                    <label class="mb-1">ชื่อลูกค้า :</label>
                    <input class="form-control" type="text">
                  </div>

                  <div class="form-group mb-3">
                    <label class="mb-1">เลข Tracking :</label>
                    <input class="form-control" type="text">
                  </div>

                  <div class="form-group mb-3">
                    <label class="mb-1">สถานะจัดส่ง :</label>
                    <select class="form-select">
                      <option>Pending</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                  
                  <div class="form-group mb-3">
                    <label class="mb-1">ที่อยู่จัดส่ง :</label>
                    <textarea class="form-control" rows="3"></textarea>
                  </div>

                </form>
              </div>

              <div class="modal-footer">
                <button class="btn btn-primary" type="button" data-bs-dismiss="modal">บันทึก</button>
                <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">ยกเลิก</button>
              </div>

            </div>
          </div>
        </div>
      </ClientOnly>

    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

// !!! สันนิษฐานว่าไฟล์ข้อมูลของคุณชื่อ 'shipping.json' และอยู่ในโฟลเดอร์ 'data'
import shippingDataFile from "~/data/shipping.json"

definePageMeta({
  layout: "seller"
})

// นำเข้าข้อมูลจากไฟล์ JSON และกำหนดให้เป็นตัวแปร reactive
const shippingData = ref(shippingDataFile.data) // หรืออาจจะเป็น shippingDataFile ตรงๆ ถ้าโครงสร้าง JSON ไม่ซับซ้อน

// ฟังก์ชันลบรายการจัดส่ง
const deleteShipping = (index) => {
  if (confirm("คุณต้องการลบรายการจัดส่งนี้หรือไม่ ?")) {
    shippingData.value.splice(index, 1)
  }
}

// ฟังก์ชันสำหรับอัปเดตสถานะการจัดส่ง
function updateShipping(orderId) {
  // ในการใช้งานจริง ฟังก์ชันนี้จะนำทางไปยังหน้าแก้ไข หรือเปิด Modal พร้อมโหลดข้อมูล
  alert(`กำลังดำเนินการแก้ไข/อัปเดตสถานะ Order ID: ${orderId}`)
  // ตัวอย่าง: navigateTo(`/edit-shipping/${orderId}`)
}
</script>