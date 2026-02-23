import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import { io } from "socket.io-client";

export const useNotificationStore = defineStore('notification', {
    state: () => ({
        notifications: [],
        socket: null
    }),
    getters: {
        unreadCount: (state) => state.notifications.filter(n => !n.isRead).length
    },
    actions: {
        // ... (fetchNotifications, markAsRead, initSocket, disconnectSocket, markAllAsRead เดิม) ...

        async fetchNotifications() {
            const authStore = useAuthStore()
            const userId = authStore.user?._id || authStore.user?.id
            if (!userId) return

            try {
                // ✅ แก้ไข URL ให้ใช้ตัวแปร config หรือ hardcode ตามเดิม
                const res = await fetch(`https://vizdataprojectbe-production.up.railway.app/api/notifications/user/${userId}`)
                if (res.ok) {
                    this.notifications = await res.json()
                }
            } catch (e) {
                console.error("Store Fetch Error:", e)
            }
        },

        async markAsRead(item) {
            if (item.isRead) return
            const target = this.notifications.find(n => n._id === item._id)
            if (target) target.isRead = true

            try {
                await fetch(`https://vizdataprojectbe-production.up.railway.app/api/notifications/${item._id}/read`, { method: 'PATCH' })
            } catch (e) {
                console.error("Mark read failed")
            }
        },

        initSocket() {
            const authStore = useAuthStore()
            const userId = authStore.user?._id || authStore.user?.id
            if (!userId || this.socket) return

            this.socket = io('https://vizdataprojectbe-production.up.railway.app', { query: { userId } })

            this.socket.on('receive_notification', (newNoti) => {
                this.notifications.unshift(newNoti)
            })
        },

        disconnectSocket() {
            if (this.socket) {
                this.socket.disconnect()
                this.socket = null
            }
        },

        async markAllAsRead() {
            const auth = useAuthStore()
            const userId = auth.user?._id || auth.user?.id
            if (!userId) return

            this.notifications.forEach(n => { n.isRead = true })

            try {
                // ✅ ใช้ fetch แบบเดิมเพื่อความ Consistent
                await fetch(`https://vizdataprojectbe-production.up.railway.app/api/notifications/read-all/${userId}`, {
                    method: 'PATCH'
                })
            } catch (error) {
                console.error('Failed to mark all as read:', error)
            }
        },

        // ✅✅ เพิ่ม Action สำหรับลบแจ้งเตือน ✅✅
        async deleteNotification(id) {
            if (!id) return;

            // 1. จำค่าเดิมไว้เผื่อ error
            const originalNotifications = [...this.notifications];

            // 2. ลบออกจาก State ทันที (Optimistic UI Update)
            this.notifications = this.notifications.filter(n => n._id !== id);

            try {
                // 3. ยิง API ไปลบที่ Backend
                // (URL นี้ต้องตรงกับ Controller ที่คุณมีใน Backend)
                const res = await fetch(`https://vizdataprojectbe-production.up.railway.app/api/notifications/${id}`, {
                    method: 'DELETE'
                });

                if (!res.ok) {
                    throw new Error('Failed to delete');
                }
            } catch (error) {
                console.error('Delete notification failed:', error);
                // 4. ถ้า Error ให้คืนค่าเดิมกลับมา
                this.notifications = originalNotifications;
            }
        },
        async deleteAllNotifications() {
            const authStore = useAuthStore()
            const userId = authStore.user?._id || authStore.user?.id

            if (!userId) return
            if (this.notifications.length === 0) return

            // 1. ถามยืนยันก่อน (Optional)
            if (!confirm("คุณต้องการลบการแจ้งเตือนทั้งหมดใช่หรือไม่?")) return;

            // 2. จำค่าเดิมไว้เผื่อ Error
            const originalNotifications = [...this.notifications];

            // 3. ลบออกจากหน้าจอทันที (Optimistic UI)
            this.notifications = [];

            try {
                // 4. ยิง API ไปลบที่ Backend
                const config = useRuntimeConfig()
                const API_BASE_URL = config.public.apiBase || 'https://vizdataprojectbe-production.up.railway.app'

                const res = await fetch(`${API_BASE_URL}/api/notifications/delete-all/${userId}`, {
                    method: 'DELETE',
                    // ถ้า Backend ต้องใช้ Token ให้เปิด comment ด้านล่าง
                    // headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } 
                });

                if (!res.ok) throw new Error('Failed to delete all');

            } catch (error) {
                console.error("Delete all failed:", error);
                // 5. ถ้าพัง คืนค่าเดิมกลับมา
                this.notifications = originalNotifications;
            }
        },
    }
})