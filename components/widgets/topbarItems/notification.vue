<template>
    <li class="notification-wrapper">
        <a href="javascript:void(0)" class="notification-trigger" style="color: inherit;">
            <div class="notification-icon-wrapper">
                <i class="fa fa-bell" aria-hidden="true"></i>
                <span v-if="unreadCount > 0" class="badge-count">{{ unreadCount }}</span>
            </div>
            Notification
        </a>

        <div class="notification-dropdown">
            <div class="dropdown-header">
                <span>การแจ้งเตือน ({{ unreadCount }})</span>
                <div class="header-actions">
                    <a href="javascript:void(0)" class="action-link" v-if="unreadCount > 0" @click.stop="markAllRead">
                        อ่านทั้งหมด
                    </a>
                    <span class="divider" v-if="unreadCount > 0 && notifications.length > 0">|</span>
                    <a href="javascript:void(0)" class="action-link text-danger" v-if="notifications.length > 0"
                        @click.stop="clearAll">
                        ลบทั้งหมด
                    </a>
                </div>
            </div>

            <ul class="notification-list">
                <li v-if="notifications.length === 0" class="p-3 text-center text-muted small">
                    ไม่มีการแจ้งเตือน
                </li>

                <li v-for="item in notifications" :key="item._id" class="notification-item"
                    :class="{ 'item-unread': !item.isRead, 'item-read': item.isRead }" @mouseenter="markAsRead(item)">

                    <div class="notif-box" @click="handleNotificationClick(item)">

                        <div class="notif-dot" :class="{ 'active': !item.isRead }"></div>

                        <div class="notif-img">
                            <img v-if="resolvedImage(item.image)" :src="resolvedImage(item.image)"
                                @error="$event.target.style.display = 'none'; $event.target.nextElementSibling.style.display = 'flex'"
                                alt="icon">
                            <div :style="resolvedImage(item.image) ? 'display:none' : ''" class="default-icon-bg">
                                <i class="fa fa-info" aria-hidden="true"></i>
                            </div>
                        </div>

                        <div class="notif-content">
                            <div class="notif-title">{{ item.title }}</div>
                            <div class="notif-message">{{ item.message }}</div>
                            <div class="notif-date">{{ formatDate(item.createdAt) }}</div>
                        </div>

                        <div class="delete-action" @click.stop="deleteItem(item._id)">
                            <i class="fa fa-trash-o" aria-hidden="true" title="ลบการแจ้งเตือน"></i>
                        </div>

                    </div>
                </li>
            </ul>
        </div>
    </li>
</template>

<script>
import { useAuthStore } from '~/store/auth'
import { useNotificationStore } from '~/store/notification'
import { onMounted, onUnmounted, watch } from 'vue'

export default {
    name: 'HeaderNotification',
    setup() {
        const authStore = useAuthStore()
        const notiStore = useNotificationStore()
        let intervalId = null;

        const refreshNotifications = async () => {
            if (authStore.user && (authStore.user._id || authStore.user.id)) {
                await notiStore.fetchNotifications();
            }
        };

        onMounted(() => {
            intervalId = setInterval(refreshNotifications, 15000);
        });

        onUnmounted(() => {
            if (intervalId) clearInterval(intervalId);
            notiStore.disconnectSocket();
        });

        return { authStore, notiStore }
    },
    computed: {
        notifications() {
            return this.notiStore.notifications
        },
        unreadCount() {
            return this.notiStore.unreadCount
        }
    },
    watch: {
        'authStore.user': {
            handler(newUser) {
                if (newUser && (newUser._id || newUser.id)) {
                    console.log("User loaded, initializing real-time notifications...");
                    this.notiStore.fetchNotifications();
                    this.notiStore.initSocket();
                }
            },
            immediate: true,
            deep: true
        }
    },
    methods: {
        markAllRead() {
            this.notiStore.markAllAsRead();
        },
        clearAll() {
            this.notiStore.deleteAllNotifications();
        },
        markAsRead(item) {
            if (!item.isRead) {
                this.notiStore.markAsRead(item)
            }
        },
        handleNotificationClick(item) {
            this.markAsRead(item);
            const orderId = item.data?.orderId || item.orderId;

            if (orderId) {
                this.$router.push({
                    path: '/page/account/userdashboard',
                    query: {
                        tab: 'orders',
                        orderId: orderId
                    }
                });
            } else {
                this.$router.push({
                    path: '/page/account/userdashboard',
                    query: { tab: 'orders' }
                });
            }
        },
        // 🚨 นำ Logic จาก getItemImage มาใส่แทนของเดิม
        resolvedImage(url) {
            const BACKEND = 'https://vizdataprojectbe-production.up.railway.app'
            const LOCAL_FALLBACKS = ['/images/dashboard/default.png', '/images/icon/logo.png', '/images/placeholder.png']

            // กรอง path ที่เป็น local fallback หรือว่าง ออกไปเลย → แสดง default icon แทน
            if (!url || url.trim() === '' || LOCAL_FALLBACKS.includes(url)) return null

            // เช็ค Base64 จาก MongoDB
            if (url.startsWith('data:')) return null

            // เช็ค Full URL (http/https)
            if (url.startsWith('http')) return url

            // เช็คและต่อ URL ของ Backend
            if (url.startsWith('/')) return `${BACKEND}${url}`
            return `${BACKEND}/${url}`
        },
        formatDate(dateString) {
            if (!dateString) return '';
            const date = new Date(dateString);
            return date.toLocaleString('th-TH', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
            });
        },
        async deleteItem(id) {
            try {
                await this.notiStore.deleteNotification(id);
            } catch (error) {
                console.error("Failed to delete notification:", error);
            }
        },
    }
}
</script>

<style scoped>
/* CSS ทุกอย่างเหมือนเดิม ไม่มีการเปลี่ยนแปลง */
.notification-icon-wrapper {
    position: relative;
    display: inline-block;
    margin-right: 5px;
}

.badge-count {
    position: absolute;
    top: -8px;
    right: -6px;
    background-color: #ff4c3b;
    color: white;
    border-radius: 50%;
    font-size: 10px;
    font-weight: bold;
    min-width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    border: 1px solid #fff;
}

.notification-wrapper {
    position: relative;
}

.notification-dropdown {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    width: 400px;
    background: white;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    z-index: 999;
    overflow: hidden;
}

.notification-wrapper:hover .notification-dropdown {
    display: block;
}

.dropdown-header {
    padding: 12px 15px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #ff4c3b;
    color: #ffffff;
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.header-actions .divider {
    color: rgba(255, 255, 255, 0.5);
    margin: 0 5px;
}

.header-actions .text-danger {
    color: #ffe6e6 !important;
}

.action-link {
    font-size: 12px;
    color: #ffffff !important;
    text-decoration: none;
    cursor: pointer;
    font-weight: normal;
    opacity: 0.9;
}

.action-link:hover {
    text-decoration: underline;
    opacity: 1;
}

.notification-list {
    list-style: none;
    padding-left: 0;
    margin-left: 0;
    max-height: 350px;
    overflow-y: auto;
    cursor: default;
    padding-bottom: 0;
    margin-bottom: 0;
}

.notification-item {
    position: relative;
    text-align: left;
    cursor: pointer;
    width: 100%;
    border-bottom: 1px solid #f1f1f1;
    margin: 0;
    padding: 0;
}

.notification-item:last-child {
    border-bottom: none;
}

.notification-item .notif-box {
    display: flex;
    align-items: flex-start;
    padding: 12px 10px 12px 10px;
    padding-right: 45px;
    text-decoration: none;
    color: #333;
    transition: 0.2s;
    width: 100%;
    min-height: 80px;
    box-sizing: border-box;
    margin: 0;
}

.notification-item:hover {
    background-color: #f9f9f9;
}

.item-unread {
    background-color: #f0f2f5;
}

.item-read {
    background-color: #ffffff;
}

.notif-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: transparent;
    margin-right: 8px;
    margin-top: 6px;
    flex-shrink: 0;
}

.notif-dot.active {
    background-color: #ff4c3b;
    box-shadow: 0 0 4px rgba(255, 76, 59, 0.4);
}

.notif-img {
    margin-right: 10px;
    flex-shrink: 0;
    line-height: 0;
}

.notif-img img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
    display: block;
}

.default-icon-bg {
    width: 40px;
    height: 40px;
    background-color: #ddd;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
}

.notif-content {
    flex-grow: 1;
    overflow: hidden;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start !important;
    text-align: left !important;
    padding-top: 2px;
}

.notif-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 2px;
    color: #222;
    text-align: left !important;
    width: 100%;
    line-height: 1.2;
}

.item-unread .notif-title {
    color: #000;
}

.notif-message {
    font-size: 13px;
    color: #555;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: normal;
    text-overflow: ellipsis;
    margin-bottom: 4px;
    text-align: left !important;
    width: 100%;
    line-height: 1.3;
}

.notif-date {
    font-size: 11px;
    color: #999;
    text-align: left !important;
    width: 100%;
}

.delete-action {
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ff4c3b;
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.2s ease;
    background-color: transparent;
}

.delete-action:hover {
    color: #d32f2f;
    background-color: rgba(255, 76, 59, 0.1);
}

/* ==========================================
   CSS จัดตำแหน่งกระดิ่งในมือถือให้อยู่ "ซ้ายบน"
============================================= */
@media (max-width: 577px) {

    /* 1. กระชากกระดิ่งจากฝั่งขวา ให้ไปล็อคติดซ้ายบนสุดของจอ */
    .notification-wrapper {
        position: absolute !important;
        left: 15px !important;
        /* ห่างจากขอบซ้าย */
        top: 35px !important;
        /* ปรับความสูงให้ตรงกับโลโก้/เมนู */
        right: auto !important;
        /* ยกเลิกการชิดขวา */
        margin: 0 !important;
        padding: 0 !important;
        z-index: 9999 !important;
    }

    /* 2. ซ่อนคำว่า "Notification" ให้เหลือแต่ไอคอนกระดิ่ง */
    .notification-trigger {
        font-size: 0 !important;
        color: transparent !important;
        display: flex;
        align-items: center;
    }

    /* 3. ปรับขนาดไอคอนกระดิ่งให้ใหญ่ชัดเจน */
    .notification-icon-wrapper {
        margin: 0 !important;
    }

    .notification-icon-wrapper i {
        font-size: 24px !important;
        color: #333 !important;
        /* เปลี่ยนสีถ้าต้องการ */
    }

    /* 4. ปรับขนาดตัวเลขแจ้งเตือน (Badge) */
    .badge-count {
        font-size: 10px !important;
    }

    /* 5. 🚨 บังคับให้กล่องแจ้งเตือนเวลากด กางออกไปทางขวา (ไม่งั้นจะทะลุจอซ้าย) */
    .notification-dropdown {
        left: 0 !important;
        right: auto !important;
        width: 300px !important;
        /* ขนาดกล่อง popup ในมือถือ */
        top: 40px !important;
    }
}
</style>