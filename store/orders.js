import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    allOrders: [],
    isLoading: false
  }),

  getters: {
    // กรองเฉพาะออเดอร์สถานะ Pending
    pendingOrders: (state) => state.allOrders.filter(o => o.status?.toLowerCase() === 'pending')
  },

  actions: {
    async fetchOrders() {
      this.isLoading = true
      try {
        // ✅ เช็ค Port ให้ตรงกับ Backend (3001)
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
        const data = await $fetch('http://localhost:3001/api/order', {
          method: 'POST',
          body: payload
        });
        return data;
      } catch (error) {
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async updateStatus(id, newStatus) {
      try {
        await $fetch(`http://localhost:3001/api/order/${id}`, {
          method: 'PUT',
          body: { status: newStatus }
        })
        await this.fetchOrders()
      } catch (e) {
        throw e
      }
    }
  }
})