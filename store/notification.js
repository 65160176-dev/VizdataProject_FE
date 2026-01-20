// store/notification.js
import { defineStore } from 'pinia'
import { useAuthStore } from './auth' // เรียกใช้ Auth เพื่อเอา UserID
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
        // Action 1: โหลดข้อมูล
        async fetchNotifications() {
            const authStore = useAuthStore()
            const userId = authStore.user?._id || authStore.user?.id
            if (!userId) return

            try {
                const res = await fetch(`http://localhost:3001/api/notifications/user/${userId}`)
                if (res.ok) {
                    this.notifications = await res.json()
                }
            } catch (e) {
                console.error("Store Fetch Error:", e)
            }
        },

        // Action 2: อ่านแล้ว
        async markAsRead(item) {
            if (item.isRead) return

            // Update UI ทันที (Optimistic Update)
            const target = this.notifications.find(n => n._id === item._id)
            if (target) target.isRead = true

            // ยิงบอก Backend
            try {
                await fetch(`http://localhost:3001/api/notifications/${item._id}/read`, { method: 'PATCH' })
            } catch (e) {
                console.error("Mark read failed")
            }
        },

        // Action 3: เริ่มระบบ Real-time
        initSocket() {
            const authStore = useAuthStore()
            const userId = authStore.user?._id || authStore.user?.id
            if (!userId || this.socket) return

            // ต่อ Socket ไปที่ Port Backend
            this.socket = io('http://localhost:3001', { query: { userId } })

            this.socket.on('receive_notification', (newNoti) => {
                this.notifications.unshift(newNoti) // แทรกตัวใหม่บนสุด
            })
        },

        disconnectSocket() {
            if (this.socket) {
                this.socket.disconnect()
                this.socket = null
            }
        },
        // ✅✅ เพิ่มฟังก์ชันนี้
        async markAllAsRead() {
            const auth = useAuthStore()
            const userId = auth.user?._id || auth.user?.id

            if (!userId) return

            try {
                // 1. อัปเดต State ฝั่งหน้าเว็บทันที (เพื่อให้ UI เร็ว ไม่ต้องรอ Server)
                this.notifications.forEach(n => {
                    n.isRead = true
                })

                // 2. ยิง API ไปบอก Server
                const config = useRuntimeConfig()
                const API_BASE_URL = config.public.apiBase || 'http://localhost:3001'

                await $fetch(`${API_BASE_URL}/api/notifications/read-all/${userId}`, {
                    method: 'PATCH'
                    // ถ้ามี Token ต้องใส่ headers ด้วย
                    // headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                })

            } catch (error) {
                console.error('Failed to mark all as read:', error)
                // ถ้า Error อาจจะโหลดข้อมูลใหม่มาทับเพื่อคืนค่าเดิม
                // this.fetchNotifications() 
            }
        }
    }
})