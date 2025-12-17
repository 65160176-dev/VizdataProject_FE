<template>
    <Header />
    <div>
        <WidgetsBreadcrumbs title="Notifications" />

        <section class="wishlist-section section-b-space">
            <div class="container">
                <div class="row">
                    <div class="col-12">
                        <div class="mb-4 d-flex justify-content-between align-items-center">
                            <a href="javascript:void(0)" @click="$router.back()" class="btn btn-link p-0"
                                style="color: #333; text-decoration: none; font-size: 16px;">
                                <i class="fa fa-chevron-left me-2"></i> ย้อนกลับ
                            </a>

                            <div class="text-end">
                                <div class="d-flex align-items-center gap-2">
                                    <span class="text-muted small">Total:</span>
                                    <strong>{{ notifications.length }}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="table-responsive">
                            <table class="table cart-table table-responsive" v-if="notifications.length">
                                <thead>
                                    <tr class="table-head">
                                        <th scope="col">Date</th>
                                        <th scope="col">Message</th>
                                        <!-- <th scope="col">Action</th> -->
                                    </tr>
                                </thead>
                                <tbody v-for="(item, index) in notifications" :key="index">
                                    <tr :class="{ 'unread-row': !item.isRead }">

                                        <td>
                                            <span class="text-muted">{{ item.date }}</span>
                                        </td>
                                        <td>
                                            <div class="d-flex align-items-center">

                                                <div class="me-3" style="min-width: 50px;">
                                                    <img v-if="item.image" :src="getImgUrl(item.image)"
                                                        @error="$event.target.src = '/images/icon/logo.png'" alt="icon"
                                                        style="width: 50px; height: 50px; object-fit: contain;">

                                                    <img v-else src="/images/icon/logo.png" alt="app logo"
                                                        style="width: 50px; height: 50px; object-fit: contain;">
                                                </div>

                                                <div class="text-start">
                                                    <h5 class="mb-1">{{ item.title }}</h5>
                                                    <p class="mb-0 text-muted">{{ item.message }}</p>
                                                </div>


                                            </div>
                                        </td>
                                        <!-- <td>
                                            <a href="javascript:void(0)" class="icon"
                                                @click="removeNotification(index)">
                                                <i class="ti-close"></i>
                                            </a>
                                        </td> -->

                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div class="col-sm-12 empty-cart-cls text-center" v-if="!notifications.length">
                    <img src='/images/empty-wishlist.png' class="img-fluid" alt="no notifications" />
                    <h3 class="mt-3 empty-text">
                        <strong>No Notifications Found</strong>
                    </h3>
                    <div class="col-12">
                        <nuxt-link :to="{ path: '/' }" class="btn btn-solid">continue shopping</nuxt-link>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <Footer />
</template>

<script>
import notification from "~/data/notificationData.json"
export default {
    data() {
        return {
            notifications: notification // กำหนดค่าจากไฟล์ JSON
        }
    }
    ,
    methods: {
        getImgUrl(path) {
            // เช็คว่า path มีค่าหรือไม่ เพื่อกัน error กรณีรูปเป็น null
            if (!path) return '/images/default-icon.png';
            return ('/images/' + path)
        },
        removeNotification(index) {
            this.notifications.splice(index, 1);
        }
    },
    setup() {
        // Logic อื่นๆ ถ้าจำเป็น
        return {}
    },
    mounted() {
        // ในการใช้งานจริง โหลดข้อมูลจาก LocalStorage หรือ API ตรงนี้
        // const savedNotis = JSON.parse(localStorage.getItem('notifications'))
        // if (savedNotis) this.notifications = savedNotis
    }
}
</script>

<style scoped>
/* เพิ่ม style เล็กน้อยเพื่อให้ text จัดเรียงสวยงาม */
.text-start {
    text-align: left !important;
}

.fw-bold {
    font-weight: 600;
}

.unread-row,
.unread-row>td {
    background-color: #f3f3f3 !important;
    /* ใช้ !important เพื่อทับค่าของ Bootstrap */
}

/* เมื่อเอาเมาส์ชี้ */
.unread-row:hover,
.unread-row:hover>td {
    background-color: #e9e9e9 !important;
}
</style>