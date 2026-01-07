import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    allOrders: [],
    isLoading: false
  }),

  getters: {
    pendingOrders: (state) => state.allOrders.filter(o => o.status === 'pending'),
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
             item: o.item || o.items || [] // ดักไว้ทั้งสองชื่อ
          }))
        }
      } catch (e) {
        console.error('Fetch error:', e)
      } finally {
        this.isLoading = false
      }
    },

    async updateStatus(id, newStatus) {
      try {
        await $fetch(`http://localhost:3001/api/order/${id}`, {
            method: 'PUT',
            body: { status: newStatus }
        })
        await this.fetchOrders() // รีโหลดข้อมูลใหม่
      } catch (e) {
        console.error('Update error:', e)
      }
    }
  }
})