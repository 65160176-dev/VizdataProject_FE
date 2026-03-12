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
import { useAuthStore } from '~/store/auth'

export default {
    setup() {
        const authStore = useAuthStore()
        return { authStore }
    },
    data() {
        return {
            notifications: [] // เริ่มต้นเป็น array ว่าง
        }
    },
    methods: {
        getImgUrl(path) {
            // ถ้า path เป็น URL เต็มๆ (เช่น https://...) ให้ใช้เลย
            if (path && path.startsWith('http')) return path;
            // ถ้าไม่มี path ใช้รูป default
            if (!path) return '/images/icon/logo.jpg';
            // ถ้าเป็น path รูปในโปรเจกต์
            return ('/images/' + path)
        },
        async fetchNotifications() {
            try {
                // 1. ดึง User ID จาก Store
                const userId = this.authStore.user?._id || this.authStore.user?.id;
                if (!userId) return;

                // 2. ยิง API ไปที่ Backend
                const response = await fetch(`https://vizdataprojectbe-production.up.railway.app/notifications/user/${userId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch notifications');
                }

                const rawData = await response.json();

                // 3. แปลงข้อมูลให้ตรงกับที่ Template ต้องการ
                this.notifications = rawData.map(item => ({
                    ...item,
                    // แปลงวันที่ (createdAt) เป็นรูปแบบที่อ่านง่าย
                    date: new Date(item.createdAt).toLocaleString('en-GB', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                    }),
                    // จัดการเรื่องรูปภาพ
                    image: item.image || ''
                }));

            } catch (error) {
                console.error("Error loading notifications:", error);
            }
        }
    },
    async mounted() {
        // เช็คว่ามี User Login หรือยัง ถ้ามีให้ดึงข้อมูลเลย
        if (this.authStore.user) {
            await this.fetchNotifications();
        } else {
            // ถ้า Store ยังไม่พร้อม ลอง initAuth ก่อน (ถ้ามีฟังก์ชันนี้)
            if (this.authStore.initAuth) await this.authStore.initAuth();
            if (this.authStore.user) await this.fetchNotifications();
        }
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