import { defineStore } from 'pinia'
import { addressService } from '~/services/address.service'

export const useAddressStore = defineStore('address', {
    state: () => ({
        addresses: [],
        loading: false,
        error: null
    }),

    getters: {
        // หาที่อยู่ Default (ถ้าไม่มีเอาอันแรก)
        defaultAddress: (state) => state.addresses.find(a => a.isDefault) || state.addresses[0] || null
    },

    actions: {
        // 1. ดึงข้อมูลทั้งหมด
        async fetchAddresses() {
            this.loading = true
            try {
                const data = await addressService.getAll()
                this.addresses = data
            } catch (err) {
                this.error = err.message
                console.error('Fetch Address Error:', err)
            } finally {
                this.loading = false
            }
        },

        // 2. เพิ่มที่อยู่
        async addAddress(payload) {
            try {
                await addressService.create(payload)
                await this.fetchAddresses() // ดึงใหม่ให้ข้อมูลอัปเดต
            } catch (err) {
                console.error('Add Address Error:', err)
                throw err
            }
        },

        // 3. แก้ไขที่อยู่
        async updateAddress(id, payload) {
            try {
                await addressService.update(id, payload)
                await this.fetchAddresses()
            } catch (err) {
                console.error('Update Address Error:', err)
                throw err
            }
        },

        // 4. ลบที่อยู่
        async removeAddress(id) {
            try {
                await addressService.delete(id)
                // ลบออกจาก state โดยไม่ต้องยิง API ใหม่ (เพื่อให้ UI เร็วขึ้น)
                this.addresses = this.addresses.filter(a => a._id !== id)
            } catch (err) {
                console.error('Delete Address Error:', err)
                throw err
            }
        },

        // 5. ตั้งค่า Default
        async setDefault(item) {
            try {
                // Backend เราจัดการเคลียร์ค่า false ให้อัตโนมัติอยู่แล้ว แค่ส่ง true ไปก็พอ
                await addressService.update(item._id, { isDefault: true })
                await this.fetchAddresses() // ดึงใหม่เพื่อให้ UI เรียงลำดับถูกต้อง
            } catch (err) {
                console.error('Set Default Error:', err)
            }
        }
    }
})