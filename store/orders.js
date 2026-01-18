import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    allOrders: [],
    isLoading: false
  }),

  getters: {
    ordersByStatus: (state) => (status) => {
      return state.allOrders.filter(o =>
        o.status && o.status.toLowerCase() === status.toLowerCase()
      )
    },
    countByStatus: (state) => (status) => {
      return state.allOrders.filter(o =>
        o.status && o.status.toLowerCase() === status.toLowerCase()
      ).length
    },
    pendingOrders: (state) => {
      return state.allOrders.filter(o =>
        o.status && o.status.toLowerCase() === 'pending'
      )
    }
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

    // ✅✅ เพิ่มส่วนนี้เข้าไปครับ (สำคัญมาก)
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
        console.error('Update error:', e)
        throw e
      }
    }
  }
})