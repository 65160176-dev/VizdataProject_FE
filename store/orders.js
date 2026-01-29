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
        // ✅ เพิ่ม Header Token
        const token = localStorage.getItem('token'); 
        const data = await $fetch('http://localhost:3001/api/order', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`, // ส่ง Token
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

    // ✅✅ จุดที่แก้: เพิ่ม parameter 'note' และส่ง Token
    async updateStatus(id, newStatus, note = null) {
      try {
        const token = localStorage.getItem('token'); // ดึง Token จาก LocalStorage
        
        // เตรียมข้อมูลที่จะส่ง (Payload)
        const payload = { status: newStatus }
        if (note) payload.note = note // ถ้ามีเหตุผล ให้ใส่ไปด้วย

        await $fetch(`http://localhost:3001/api/order/${id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`, // ✅ ต้องมี Token
            'Content-Type': 'application/json'
          },
          body: payload // ✅ ส่ง payload ที่มี note
        })

        // โหลดข้อมูลใหม่หลังจากอัปเดตเสร็จ
        await this.fetchOrders()
        
      } catch (e) {
        console.error('Update status error:', e)
        throw e
      }
    }
  }
})