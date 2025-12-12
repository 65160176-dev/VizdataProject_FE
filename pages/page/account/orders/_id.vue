<template>
    <div>
        <Header />

        <div class="container py-5">

            <div class="bg-white p-3 mb-3 shadow-sm d-flex justify-content-between align-items-center">
                <nuxt-link to="/page/account/dashboard?tab=test"
                    class="btn btn-link text-dark text-decoration-none p-0">
                    <i class="fa fa-chevron-left"></i> ย้อนกลับ
                </nuxt-link>
                <div class="text-end">
                    <span class="me-3">Order ID: {{ $route.params.id }}</span>
                    <span class="text-uppercase" style="color: #ee4d2d; font-weight: bold;">{{ mockData.status }}</span>
                </div>
            </div>

            <div class="card border-0 shadow-sm mb-3 p-4">
                <div class="stepper-wrapper">
                    <div class="stepper-item completed">
                        <div class="step-counter"><i class="fa fa-file-text-o"></i></div>
                        <div class="step-name">สั่งซื้อ</div>
                        <div class="step-date">21-09-20xx</div>
                    </div>
                    <div class="stepper-item completed">
                        <div class="step-counter"><i class="fa fa-money"></i></div>
                        <div class="step-name">ชำระเงิน</div>
                        <div class="step-date">21-09-20xx</div>
                    </div>
                    <div class="stepper-item completed">
                        <div class="step-counter"><i class="fa fa-truck"></i></div>
                        <div class="step-name">จัดส่ง</div>
                        <div class="step-date">22-09-20xx</div>
                    </div>
                    <div class="stepper-item completed">
                        <div class="step-counter"><i class="fa fa-dropbox"></i></div>
                        <div class="step-name">รอรับสินค้า</div>
                        <div class="step-date">23-09-20xx</div>
                    </div>
                    <div class="stepper-item completed">
                        <div class="step-counter"><i class="fa fa-star-o"></i></div>
                        <div class="step-name">สำเร็จ</div>
                        <div class="step-date">24-09-20xx</div>
                    </div>
                </div>
            </div>

            <div class="row mb-3">
                <div class="col-md-12">
                    <div class="card border-0 shadow-sm p-4 h-100">
                        <div class="d-flex justify-content-between mb-2">
                            <h5 class="mb-0"><i class="fa fa-map-marker text-danger me-2"></i> ที่อยู่ในการจัดส่ง</h5>
                            <div class="text-end">
                                <span class="badge bg-light text-dark border">Kerry Express</span>
                                <span class="ms-2 text-muted">Tracking: <strong>KERDO123456789</strong></span>
                            </div>
                        </div>
                        <hr style="opacity: 0.1">
                        <div>
                            <strong>{{ mockData.customerName }}</strong>
                            <span class="text-muted ms-2">{{ mockData.phone }}</span>
                            <p class="mb-0 text-muted mt-1">{{ mockData.address }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm mb-3">
                <div class="card-header bg-white border-bottom-0 pt-3">
                    <strong>{{ mockData.shopName }}</strong>
                    <!-- <button class="btn btn-sm btn-outline-secondary ms-2 py-0" style="font-size: 12px;">แชทเลย</button> -->
                </div>
                <div class="card-body p-0">
                    <div v-for="(item, index) in mockData.items" :key="index" class="p-3 border-top">
                        <div class="d-flex">
                            <div class="flex-shrink-0 bg-light border d-flex align-items-center justify-content-center text-muted"
                                style="width: 80px; height: 80px; font-size: 12px;">
                                No Image
                            </div>
                            <div class="flex-grow-1 ms-3">
                                <h6 class="mb-1">{{ item.name }}</h6>
                                <div class="text-muted small">ตัวเลือก: {{ item.variant }}</div>
                                <div class="text-muted small">x{{ item.quantity }}</div>
                            </div>
                            <div class="text-end">
                                <div class="text-decoration-line-through text-muted small" v-if="item.originalPrice">฿{{
                                    item.originalPrice }}</div>
                                <div>฿{{ item.price }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm mb-3">
                <div class="card-body">
                    <div class="row justify-content-end">
                        <div class="col-md-4">
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">รวมยอดสั่งซื้อ</span>
                                <span>฿{{ mockData.subtotal }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">ค่าจัดส่ง</span>
                                <span>฿{{ mockData.shippingFee }}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span class="text-muted">ส่วนลดจากร้านค้า</span>
                                <span>-฿{{ mockData.discount }}</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between align-items-center">
                                <span class="fw-bold">ยอดรวมสุทธิ</span>
                                <span style="font-size: 22px; font-weight: bold;">฿{{ mockData.total
                                }}</span>
                            </div>
                            <div class="text-end mt-2">
                                <span class="text-muted small"><i class="fa fa-credit-card"></i> ช่องทางชำระเงิน: {{
                                    mockData.paymentMethod }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="card border-0 shadow-sm p-3 mb-3">
                <div class="d-flex justify-content-end gap-2">
                    <button class="btn btn-outline-secondary">ขอคืนเงิน/คืนสินค้า</button>
                    <button class="btn btn-primary"
                        style="background-color: #ee4d2d; border-color: #ee4d2d;">ซื้ออีกครั้ง</button>
                </div>
            </div>

        </div>
        <Footer />
    </div>
</template>

<script>
import { Footer } from '#components';

export default {
    data() {
        return {
            orderId: this.$route.params.id,
            // Mock Data จำลองข้อมูลรายละเอียดออเดอร์
            mockData: {
                status: "คำสั่งซื้อสำเร็จแล้ว",
                shopName: "Shop Name ",
                customerName: "Mark Jecno",
                phone: "081-234-5678",
                address: "123/45 คอนโด ABC ถนนสุขุมวิท แขวงคลองตัน เขตคลองเตย กรุงเทพมหานคร 10110",
                items: [
                    { name: "ฝาปิดจอยสติ๊ก สำหรับ PS5/PS4", variant: "Black White", quantity: 1, price: 139, originalPrice: 193 },
                    { name: "สายชาร์จ Type-C Fast Charge", variant: "2 Meter", quantity: 1, price: 99, originalPrice: 150 }
                ],
                subtotal: 238,
                shippingFee: 45,
                discount: 15,
                total: 268,
                paymentMethod: "เก็บเงินปลายทาง (COD)"
            }
        }
    }
}
</script>

<style scoped>
/* CSS Stepper เดิมของคุณ (ครบถ้วนแล้ว) */
.stepper-wrapper {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    position: relative;
}

.stepper-item {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    text-align: center;
}

.stepper-item::before {
    position: absolute;
    content: "";
    border-bottom: 4px solid #ccc;
    width: 100%;
    top: 25px;
    left: -50%;
    z-index: 2;
}

.stepper-item::after {
    position: absolute;
    content: "";
    border-bottom: 4px solid #ccc;
    width: 100%;
    top: 25px;
    left: 50%;
    z-index: 2;
}

.stepper-item .step-counter {
    position: relative;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #fff;
    border: 4px solid #ccc;
    margin-bottom: 10px;
    font-size: 20px;
    color: #ccc;
}

.stepper-item.completed .step-counter {
    border-color: #26aa99;
    color: #26aa99;
}

.stepper-item.completed::before,
.stepper-item.completed::after {
    border-bottom-color: #26aa99;
}

.stepper-item:first-child::before {
    content: none;
}

.stepper-item:last-child::after {
    content: none;
}

.step-name {
    font-size: 14px;
    font-weight: bold;
    color: #555;
    margin-bottom: 5px;
}

.step-date {
    font-size: 12px;
    color: #999;
}
</style>