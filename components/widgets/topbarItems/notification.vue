<template>
    <li class="mobile-wishlist notification-wrapper">
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

                <li v-for="item in notifications.slice(0, 10)" :key="item._id" class="notification-item"
                    :class="{ 'item-unread': !item.isRead, 'item-read': item.isRead }" @mouseenter="markAsRead(item)">

                    <div class="notif-box" @click="handleNotificationClick(item)">

                        <div class="notif-dot" :class="{ 'active': !item.isRead }"></div>

                        <div class="notif-img">
                            <img v-if="item.image" :src="getImgUrl(item.image)"
                                @error="$event.target.src = '/images/icon/logo.png'" alt="icon">
                            <div v-else class="default-icon-bg">
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

export default {
    name: 'HeaderNotification',
    setup() {
        const authStore = useAuthStore()
        const notiStore = useNotificationStore()
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
                    console.log("User loaded, fetching notifications...");
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
        getImgUrl(path) {
            if (!path) return '/images/icon/logo.png';
            if (path.startsWith('http')) return path;
            return '/images/' + path;
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
    },
    beforeUnmount() {
        this.notiStore.disconnectSocket();
    }
}
</script>

<style scoped>
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
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 8px;
}

.action-link {
    font-size: 12px;
    color: #ff4c3b;
    text-decoration: none;
    cursor: pointer;
    font-weight: normal;
}

.action-link:hover {
    text-decoration: underline;
}


.notification-list {
    list-style: none;
    padding-left: 0;
    margin-left: 0;
    max-height: 350px;
    overflow-y: auto;
    cursor: default;
}

.notification-item {
    position: relative;
    text-align: left;
    cursor: default !important;
}

.notification-item .notif-box {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    text-decoration: none;
    color: #333;
    border-bottom: 1px solid #f1f1f1;
    transition: 0.2s;

    width: 90%;
    height: auto;
    min-height: 100px;
    box-sizing: border-box;

    cursor: pointer;
}

.notification-item:hover {
    background-color: #e4e6eb;
}

.item-unread {
    background-color: #f0f2f5;
}

.item-read {
    background-color: #ffffff;
}

/* --- จุดสีแดง (Dot) --- */
.notif-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: transparent;
    margin-right: 12px;
    flex-shrink: 0;
}

.notif-dot.active {
    background-color: #ff4c3b;
    /* แสดงสีแดงเมื่อยังไม่อ่าน */
    box-shadow: 0 0 4px rgba(255, 76, 59, 0.4);
}

.notif-img {
    margin-right: 12px;
    flex-shrink: 0;
}

.notif-img img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 50%;
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
    justify-content: flex-start;
    align-items: flex-start !important;
    text-align: left !important;
}

.notif-title {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 2px;
    color: #222;
    text-align: left !important;
    width: 100%;
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
    line-height: 1.4;
}

.notif-date {
    font-size: 11px;
    color: #999;
    text-align: left !important;
    width: 100%;
}

.delete-action {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 10;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ff4c3b;
    /* เปลี่ยนเป็นสีแดงตามรูป */
    cursor: pointer;
    border-radius: 50%;
    transition: all 0.2s ease;
    background-color: transparent;
}

/* เอฟเฟกต์เมื่อ Hover ที่ปุ่มถังขยะ */
.delete-action:hover {
    color: #d32f2f;
    background-color: rgba(255, 76, 59, 0.1);
    transform: translateY(-50%) scale(1.1);
    /* ขยายขนาดเล็กน้อย */
}
</style>