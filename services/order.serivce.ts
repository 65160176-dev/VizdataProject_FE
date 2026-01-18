import http from './http'; // ใช้ axios instance ที่คุณมี

export const orderService = {
    async create(payload: any) {
        // ยิง POST ไปที่ Backend
        const response = await http.post('/order', payload);
        return response.data;
    },

    async getAll() {
        const response = await http.get('/order');
        return response.data;
    }
};