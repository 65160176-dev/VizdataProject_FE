// services/affiliate.service.ts

const API_BASE = 'http://localhost:3001/api'

export const affiliateService = {
  // สมัคร affiliate
  async register(userId: string) {
    const response = await fetch(`${API_BASE}/affiliate/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    if (!response.ok) throw new Error('Failed to register affiliate')
    return response.json()
  },

  // ดึงข้อมูล affiliate ของ user
  async getMyAffiliate(userId: string) {
    const response = await fetch(`${API_BASE}/affiliate/my-affiliate?userId=${userId}`)
    if (!response.ok) throw new Error('Not an affiliate yet')
    return response.json()
  },

  // ดึง dashboard (สรุป + รายการออร์เดอร์)
  async getDashboard(userId: string) {
    const response = await fetch(`${API_BASE}/affiliate/dashboard?userId=${userId}`)
    if (!response.ok) throw new Error('Failed to load dashboard')
    return response.json()
  },

  // ดึงรายการ orders แบบ paginated
  async getOrders(userId: string, page = 1, limit = 20) {
    const response = await fetch(`${API_BASE}/affiliate/orders?userId=${userId}&page=${page}&limit=${limit}`)
    if (!response.ok) throw new Error('Failed to load orders')
    return response.json()
  }
}
