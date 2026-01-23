<template>
    <div class="col-xl-6 xl-100">
        <div class="card shadow-sm border-0 h-100">
            <div class="card-header bg-transparent border-0">
                <h5 class="fw-bold mb-0">Latest Orders 📦</h5>
            </div>
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light">
                            <tr>
                                <th class="ps-4">ID</th>
                                <th>Customer</th>
                                <th>Status</th>
                                <th class="text-end pe-4">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="order in latestOrders" :key="order._id">
                                <td class="ps-4 fw-bold">#{{ order.orderId ? order.orderId : String(order._id).slice(-6) }}</td>
                                <td>{{ order.customer || 'Unknown' }}</td>
                                <td>
                                    <span class="badge rounded-pill" :class="getStatusColor(order.status)">
                                        {{ order.status }}
                                    </span>
                                </td>
                                <td class="text-end pe-4 fw-bold">{{ formatCurrency(order.total) }}</td>
                            </tr>
                            <tr v-if="latestOrders.length === 0">
                                <td colspan="4" class="text-center py-4 text-muted">ยังไม่มีคำสั่งซื้อ</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { useOrderStore } from '~/store/orders'

const orderStore = useOrderStore()

const latestOrders = computed(() => {
    // ใช้ allOrders
    const all = orderStore.allOrders || []
    return [...all].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
})

const getStatusColor = (status) => {
    const s = (status || '').toLowerCase()
    if (['completed', 'success'].includes(s)) return 'bg-success text-white'
    if (['pending', 'preparing'].includes(s)) return 'bg-warning text-dark'
    if (['shipped'].includes(s)) return 'bg-info text-white'
    if (['cancelled', 'cancel requested'].includes(s)) return 'bg-danger text-white'
    return 'bg-secondary text-white'
}

const formatCurrency = (val) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(val || 0)
</script>