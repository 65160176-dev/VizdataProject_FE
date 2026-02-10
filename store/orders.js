import { defineStore } from 'pinia'

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
        const data = await $fetch('http://localhost:3001/api/order')
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
        const data = await $fetch('http://localhost:3001/api/order', {
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

        await $fetch(`http://localhost:3001/api/order/${id}`, {
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