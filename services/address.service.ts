import http from './http';
import type { Address, CreateAddressPayload } from '@/types/address';

export const addressService = {
    async getAll(): Promise<Address[]> {
        const response = await http.get('/api/address');
        return response.data;
    },

    // สร้างใหม่
    async create(data: CreateAddressPayload): Promise<Address> {
        const response = await http.post('/api/address', data);
        return response.data;
    },

    // อัปเดต
    async update(id: string, data: Partial<CreateAddressPayload>): Promise<Address> {
        const response = await http.patch(`/api/address/${id}`, data);
        return response.data;
    },

    // ลบ
    async delete(id: string): Promise<void> {
        await http.delete(`/api/address/${id}`);
    }
};