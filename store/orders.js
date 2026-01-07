import { defineStore } from 'pinia'

export const useOrderStore = defineStore('orders', {
  state: () => ({
    allOrders: [],
    isLoading: false
  }),

  getters: {
    // กรองออเดอร์ตามสถานะ (รองรับตัวพิมพ์เล็ก-ใหญ่)
    ordersByStatus: (state) => (status) => {
      return state.allOrders.filter(o => 
        o.status && o.status.toLowerCase() === status.toLowerCase()
      )
    },
    
    // นับจำนวนออเดอร์ในแต่ละสถานะ
    countByStatus: (state) => (status) => {
      return state.allOrders.filter(o => 
        o.status && o.status.toLowerCase() === status.toLowerCase()
      ).length
    },

    // เฉพาะ Pending สำหรับหน้าแรก
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
             // เก็บ status เป็นตัวพิมพ์เล็กเพื่อให้ Getter ทำงานง่าย
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

    async updateStatus(id, newStatus) {
      try {
        // ส่ง PUT ไปที่ Backend
        await $fetch(`http://localhost:3001/api/order/${id}`, {
            method: 'PUT',
            body: { status: newStatus } // Backend จะได้รับ { status: 'shipped' } เป็นต้น
        })
        // เมื่อสำเร็จ ให้โหลดข้อมูลใหม่ทั้งหมดเพื่อให้ UI อัปเดตตัวเลข Badge
        await this.fetchOrders() 
      } catch (e) {
        console.error('Update error:', e)
        throw e
      }
    }
  }
})