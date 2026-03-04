import { defineStore } from 'pinia'
import { useRuntimeConfig } from '#imports'
import { useAuthStore } from '~/store/auth'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    allOrders: [],
    isLoading: false
  }),

  getters: {
    pendingOrders: (state) => state.allOrders.filter(o => o.status?.toLowerCase() === 'pending')
  },

  actions: {
    async fetchOrders() {
      this.isLoading = true
      try {
        const config = useRuntimeConfig()
        const apiBase = config.public?.apiBase || 'https://vizdataprojectbe-production.up.railway.app/api'
        const authStore = useAuthStore()
        const token = authStore.token || localStorage.getItem('token')
        const headers = token ? { Authorization: `Bearer ${token}` } : {}
        let userId = authStore.user?._id || authStore.user?.id
        if (!userId) {
          try {
            const savedUser = localStorage.getItem('user')
            if (savedUser) {
              const parsed = JSON.parse(savedUser)
              userId = parsed?._id || parsed?.id
            }
          } catch (e) {}
        }
        const storedType = localStorage.getItem('userType')
        const isSeller = Number(authStore.userType ?? storedType ?? 1) === 0
        const queryParts = []
        if (userId) {
          queryParts.push(isSeller ? `sellerId=${encodeURIComponent(userId)}` : `userId=${encodeURIComponent(userId)}`)
        }
        const query = queryParts.length ? `?${queryParts.join('&')}` : ''
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        )
        const fetchPromise = $fetch(`${apiBase}/order${query}`, { headers })
        const data = await Promise.race([fetchPromise, timeoutPromise])
        if (data) {
          this.allOrders = data.map(o => ({
            ...o,
            status: o.status ? o.status.toLowerCase() : 'pending',
            item: o.item || o.items || []
          }))
        }
      } catch (e) {
        console.error('Fetch error:', e)
      } finally {
        this.isLoading = false
      }
    },

    async placeOrder(payload) {
      this.isLoading = true;
      try {
        const token = localStorage.getItem('token');
        const data = await $fetch('https://vizdataprojectbe-production.up.railway.app/api/order', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: payload
        });
        return data;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateStatus(id, newStatus, note = null) {
      try {
        const token = localStorage.getItem('token');

        // ✅ แก้ไข: เพิ่ม role: 'seller' ลงใน payload
        const payload = {
          status: newStatus,
          role: 'seller'
        }
        if (note) payload.note = note

        await $fetch(`https://vizdataprojectbe-production.up.railway.app/api/order/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: payload
        })

        await this.fetchOrders()

      } catch (e) {
        console.error('Update status error:', e)
        throw e
      }
    }
  }
})