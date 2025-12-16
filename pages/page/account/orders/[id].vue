<template>
    <div>
        <Header />

        <div class="container py-5">
            <div class="mb-3 d-flex justify-content-between align-items-center">
                <nuxt-link to="/page/account/dashboard?tab=test" class="btn btn-link p-0">
                    <i class="fa fa-chevron-left"></i> ย้อนกลับ
                </nuxt-link>
                <div class="text-end">
                    <div class="small text-muted">Order ID</div>
                    <div class="d-flex align-items-center gap-2">
                        <strong>{{ orderId }}</strong>
                        <span class="badge" :class="statusBadgeClass">{{ mockData.status }}</span>
                    </div>
                </div>
            </div>

            <div class="row gx-4">
                <div class="col-lg-8">
                                        <div class="card p-3 mb-4 shadow-sm">
                                                <h5 class="mb-3">รายการสินค้า</h5>
                                                <div class="items-scroll">
                                                    <div v-for="(item, idx) in mockData.items" :key="idx" class="d-flex align-items-center py-3 border-bottom">
                            <div class="me-3 thumb">
                                <img v-if="item.image" :src="item.image" alt="item" class="img-fluid rounded" />
                                <div v-else class="placeholder rounded">No Image</div>
                            </div>
                            <div class="flex-grow-1">
                                <div class="d-flex justify-content-between">
                                    <div>
                                        <h6 class="mb-1">{{ item.name }}</h6>
                                        <div class="small text-muted">{{ item.variant }}</div>
                                        <div class="small text-muted">จำนวน: {{ item.quantity }}</div>
                                    </div>
                                    <div class="text-end">
                                        <div v-if="item.originalPrice" class="text-decoration-line-through text-muted small">฿{{ item.originalPrice }}</div>
                                        <div class="fw-bold">฿{{ item.price }}</div>
                                    </div>
                                </div>
                            </div>
                                                    </div>
                                                </div>
                    </div>

                    <div class="card p-3 shadow-sm">
                        <h5 class="mb-3">ข้อมูลการจัดส่ง</h5>
                        <div class="d-flex justify-content-between">
                            <div>
                                <strong>{{ mockData.customerName }}</strong>
                                <div class="small text-muted">{{ mockData.phone }}</div>
                                <div class="mt-2 small text-muted">{{ mockData.address }}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-4">
                    <div class="card p-3 shadow-sm sticky-summary summary-fixed">
                        <h6 class="mb-3">สรุปคำสั่งซื้อ</h6>
                        <div class="d-flex justify-content-between mb-2 small text-muted"><span>รวมยอดสินค้า</span><span>฿{{ mockData.subtotal }}</span></div>
                        <div class="d-flex justify-content-between mb-2 small text-muted"><span>ค่าจัดส่ง</span><span>฿{{ mockData.shippingFee }}</span></div>
                    
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <strong>ยอดสุทธิ</strong>
                            <div class="fs-5 fw-bold">฿{{ mockData.total }}</div>
                        </div>

                        <div class="d-grid gap-2">
                            <button class="btn btn-success" @click="acceptOrder">รับสินค้าแล้ว</button>
                            <button class="btn btn-outline-danger" @click="rejectOrder">ปฏิเสธการรับ</button>
                        </div>

                        <div class="mt-3 small text-muted">ช่องทางชำระเงิน: {{ mockData.paymentMethod }}</div>
                    </div>
                </div>
            </div>

        </div>
        <Footer />
    </div>
</template>

<script>
import { Footer } from '#components';
import ordersData from '~/data/orders.json'

export default {
    data() {
        const id = this.$route.params.id
        const found = (ordersData || []).find(o => String(o.id) === String(id))
        const order = found || (ordersData && ordersData.length ? ordersData[0] : null)
        return {
            orderId: id,
            mockData: order || {
                status: 'ไม่พบคำสั่งซื้อ',
                shopName: '-',
                customerName: '-',
                phone: '-',
                address: '-',
                items: [],
                subtotal: 0,
                shippingFee: 0,
                discount: 0,
                total: 0,
                paymentMethod: '-'
            }
        }
    },
    methods: {
        acceptOrder() {
            if (confirm('ยืนยันการรับสินค้า?')) {
                this.mockData.status = 'รับสินค้าแล้ว'
                alert('บันทึก: รับสินค้าเรียบร้อย')
            }
        },
        rejectOrder() {
            const ok = confirm('ต้องการปฏิเสธการรับสินค้าหรือไม่?')
            if (ok) {
                this.mockData.status = 'ปฏิเสธการรับ'
                alert('บันทึก: ปฏิเสธการรับสินค้า')
            }
        }
    },
    computed: {
        statusBadgeClass() {
            const s = (this.mockData && this.mockData.status || '').toLowerCase()
            if (s.includes('สำเร็จ') || s.includes('รับ')) return 'bg-success text-white'
            if (s.includes('รอ')) return 'bg-warning text-dark'
            if (s.includes('ปฏิเสธ')) return 'bg-danger text-white'
            return 'bg-secondary text-white'
        }
    }
}
</script>

<style scoped>
.thumb { width: 96px; height: 96px; overflow: hidden; }
.thumb img { width: 96px; height: 96px; object-fit: cover; }
.placeholder { width: 96px; height: 96px; display:flex; align-items:center; justify-content:center; background:#f5f5f5; color:#888; }
.sticky-summary { position: sticky; top: 20px; }
.summary-fixed { max-width: 340px; width: 100%; }
.items-scroll { max-height: 420px; overflow-y: auto; padding-right: 8px; }
.badge { font-size: 0.8rem; padding: 0.45rem 0.6rem; border-radius: 0.5rem; }

@media (max-width: 991px) {
    .sticky-summary { position: static; }
}
</style>