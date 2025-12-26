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
            <div class="dropdown-header">การแจ้งเตือน ({{ unreadCount }})</div>

            <ul class="notification-list">
                <li v-if="notifications.length === 0" class="p-3 text-center text-muted small">
                    ไม่มีการแจ้งเตือน
                </li>

                <li v-for="item in notifications.slice(0, 10)" :key="item.id" class="notification-item"
                    :class="{ 'item-unread': !item.isRead, 'item-read': item.isRead }" @mouseenter="markAsRead(item)">
                    <div class="notif-box">
                        <div class="notif-img">
                            <img v-if="item.image" :src="item.image" alt="icon">
                            <div v-else class="default-icon-bg">
                                <i class="fa fa-info" aria-hidden="true"></i>
                            </div>
                        </div>
                        <div class="notif-content">
                            <div class="notif-title">{{ item.title }}</div>
                            <div class="notif-message">{{ item.message }}</div>
                            <div class="notif-date">{{ item.date }}</div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </li>
</template>

<script>
export default {
    name: 'HeaderNotification',
    data() {
        return {
            notifications: []
        }
    },
    computed: {
        unreadCount() {
            if (!this.notifications) return 0;
            return this.notifications.filter(n => n.isRead === false).length;
        }
    },
    mounted() {
        this.loadNotifications();
        // [เพิ่ม] คอยฟัง event ชื่อ 'notification-updated'
        if (typeof window !== 'undefined') {
            window.addEventListener('notification-updated', this.loadNotifications);
        }
    },
    beforeUnmount() {
        // [เพิ่ม] ลบ listener เมื่อ component ถูกทำลาย
        if (typeof window !== 'undefined') {
            window.removeEventListener('notification-updated', this.loadNotifications);
        }
    },
    methods: {
        loadNotifications() {
            if (process.client) {
                const stored = localStorage.getItem('my_app_notifications');
                if (stored) {
                    this.notifications = JSON.parse(stored);
                } else {
                    this.notifications = [];
                }
            }
        }, markAsRead(item) {
            // ทำงานเฉพาะตอนที่ยังไม่ได้อ่าน (เพื่อไม่ให้เซฟซ้ำซ้อน)
            if (!item.isRead) {
                item.isRead = true; // เปลี่ยนสถานะเป็นอ่านแล้ว (สีพื้นหลังจะเปลี่ยนทันที)

                // บันทึกสถานะใหม่ลง LocalStorage
                if (process.client) {
                    localStorage.setItem('my_app_notifications', JSON.stringify(this.notifications));
                }
            }
        }
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
    width: 100%;
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
    overflow: hidden;
    width: 100%;
    cursor: default;
    height: 90px;
    box-sizing: border-box;
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
    justify-content: center;
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin-bottom: 4px;
    text-align: left !important;
    width: 100%;
}

.notif-date {
    font-size: 11px;
    color: #999;
    text-align: left !important;
    width: 100%;
}
</style>