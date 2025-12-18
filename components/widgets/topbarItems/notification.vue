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
                <li v-for="item in notifications" :key="item.id" class="notification-item"
                    :class="{ 'item-unread': !item.isRead, 'item-read': item.isRead }">

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

            <!-- <div class="dropdown-footer">
                <nuxt-link to="/page/account/notification">ดูทั้งหมด</nuxt-link>
            </div> -->
        </div>
    </li>
</template>

<script>
import notificationData from "~/data/notificationData.json"
export default {
    name: 'HeaderNotification',
    data() {
        return {
            notifications: notificationData
        }
    },
    computed: {
        unreadCount() {
            if (!this.notifications) return 0;
            return this.notifications.filter(n => n.isRead === false).length;
        }
    }
}
</script>


<style scoped>
/* จัดตำแหน่ง wrapper ให้เป็น relative เพื่อให้ badge อ้างอิงตำแหน่งได้ */
.notification-icon-wrapper {
    position: relative;
    display: inline-block;
    margin-right: 5px;
    /* เว้นระยะห่างจากคำว่า Notification เล็กน้อย */
}

/* ดีไซน์ตัวเลขแจ้งเตือน */
.badge-count {
    position: absolute;
    top: -8px;
    /* ปรับขึ้นลงตรงนี้ */
    right: -6px;
    /* ปรับซ้ายขวาตรงนี้ */

    background-color: #ff4c3b;
    /* สีแดง (หรือเปลี่ยนตาม Theme ร้าน) */
    color: white;
    border-radius: 50%;
    /* ทำเป็นวงกลม */

    font-size: 10px;
    font-weight: bold;

    /* กำหนดขนาดวงกลม */
    min-width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2px;
    border: 1px solid #fff;
    /* ขอบขาวเล็กน้อยเพื่อให้ตัดกับพื้นหลัง */
}

/* --- โครงสร้าง Dropdown (เหมือนเดิม) --- */
.notification-wrapper {
    position: relative;
}

.notification-dropdown {
    display: none;
    position: absolute;
    top: 100%;
    right: 0;
    /* หรือ left:0 ตามดีไซน์ */
    width: 400px;
    /* ขยายความกว้างนิดหน่อยเพื่อให้ข้อความไม่เบียด */
    background: white;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    z-index: 999;
    overflow: hidden;
}

.notification-wrapper:hover .notification-dropdown {
    display: block;
}

/* --- ส่วน Header & Footer --- */
.dropdown-header {
    padding: 12px 15px;
    font-weight: bold;
    border-bottom: 1px solid #eee;
    background: #fff;
}

.dropdown-footer {
    text-align: center;
    padding: 10px;
    background: #f9f9f9;
    font-size: 0.9em;
    border-top: 1px solid #eee;
}

/* --- รายการ Notification --- */
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
    /* จัดเรียงซ้ายขวา */
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

/* .notification-item .notif-box:hover {
    background-color: #e4e6eb;
} */
.notification-item:hover {
    background-color: #e4e6eb;
}


/* --- Logic สีพื้นหลัง (โจทย์หลัก) --- */
/* ยังไม่อ่าน: พื้นหลังสีเทาเข้ม/ฟ้าอ่อน เพื่อให้เด่น */
.item-unread {
    background-color: #f0f2f5;
}

/* อ่านแล้ว: พื้นหลังสีขาว */
.item-read {
    background-color: #ffffff;
}

/* Hover: เปลี่ยนสีเล็กน้อยเมื่อชี้ */
.notification-item a:hover {
    background-color: #e4e6eb;
    /* เข้มขึ้นอีกนิดตอนชี้ */
}

/* --- การจัดการรูปภาพ (Left Side) --- */
.notif-img {
    margin-right: 12px;
    flex-shrink: 0;
    /* ไม่ให้รูปหด */
}

.notif-img img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    /* ป้องกันรูปบิดเบี้ยว */
    border-radius: 50%;
    /* รูปวงกลม */
}

/* กรณีไม่มีรูป (Default Icon) */
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

/* ถ้ายังไม่อ่าน title จะหนากว่าปกติ หรือเปลี่ยนสีก็ได้ */
.item-unread .notif-title {
    color: #000;
}

.notif-message {
    font-size: 13px;
    color: #555;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    /* ตัดคำยาวๆ เป็น ... */
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