import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    allOrders: [],
    isLoading: false
  }),

  getters: {
    // แก้: เปรียบเทียบแบบตัวพิมพ์เล็ก (toLowerCase) เพื่อให้เจอแน่นอน
    pendingOrders: (state) => state.allOrders.filter(o => o.status && o.status.toLowerCase() === 'pending'),
    
    ordersByStatus: (state) => (status) => state.allOrders.filter(o => o.status && o.status.toLowerCase() === status.toLowerCase()),
    
    countByStatus: (state) => (status) => state.allOrders.filter(o => o.status && o.status.toLowerCase() === status.toLowerCase()).length
  },

  actions: {
    async fetchOrders() {
      this.isLoading = true
      try {
        const { data, error } = await useFetch('http://localhost:3001/api/order')
        
        if (data.value) {
          // แปลงข้อมูลให้ format ตรงกันเป๊ะๆ
          this.allOrders = data.value.map(o => ({
             ...o,
             // แปลง status เป็นตัวพิมพ์เล็กทั้งหมด กันพลาด
             status: o.status ? o.status.toLowerCase() : 'pending',
             item: o.item || o.items || []
          }))
        }
      } catch (e) {
        console.error('Error fetching orders:', e)
      } finally {
        this.isLoading = false
      }
    },

    async updateStatus(id, newStatus) {
      try {
        // ส่งค่าไป update (ส่งแบบตัวพิมพ์เล็ก หรือใหญ่ก็ได้ Backend ส่วนใหญ่อ่านได้)
        await $fetch(`http://localhost:3001/api/order/${id}`, {
            method: 'PUT',
            body: { status: newStatus }
        })

        const index = this.allOrders.findIndex(o => o._id === id)
        if (index !== -1) {
          // อัปเดตใน Store เป็นตัวพิมพ์เล็กเพื่อให้ UI ทำงานต่อได้
          this.allOrders[index].status = newStatus.toLowerCase()
        }
        
      } catch (e) {
        alert('Error updating status: ' + e.message)
      }
    }
  }
})