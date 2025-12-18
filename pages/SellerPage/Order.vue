<template>
  <div class="col-sm-12">
    <div class="card border-0 shadow-none bg-transparent">
      <div class="card-header bg-transparent p-0 pb-3 border-0 d-flex justify-content-between align-items-center">
        <h5 class="mb-0">Incoming Orders</h5>
        
        <ul class="nav nav-pills">
          <li class="nav-item" v-for="tab in tabs" :key="tab">
            <a 
              class="nav-link" 
              :class="{ active: currentTab === tab }" 
              style="cursor: pointer;"
              @click="currentTab = tab"
            >
              {{ tab }}
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="row">
      <div class="col-xxl-3 col-xl-4 col-md-6 mb-4" v-for="order in filteredOrders" :key="order.id">
        <div class="card h-100 order-card" @click="openOrderDetails(order)">
          <div class="card-body">
            
            <div class="d-flex justify-content-between mb-3">
              <span class="badge bg-light text-dark border">#{{ order.orderId }}</span>
              <span class="badge" :class="getStatusColor(order.status)">{{ order.status }}</span>
            </div>

            <div class="mb-3">
              <h6 class="fw-bold mb-1">{{ order.customer }}</h6>
              <p class="text-muted small mb-0">
                <Icon name="feather:clock" size="12" /> {{ order.date }}
              </p>
            </div>

            <div class="d-flex justify-content-between align-items-end mt-4">
              <div>
                <span class="text-muted small">Items: {{ order.items.length }}</span>
              </div>
              <div class="text-end">
                <span class="text-muted small">Total</span>
                <h5 class="mb-0 text-primary">฿{{ order.total.toLocaleString() }}</h5>
              </div>
            </div>

          </div>
          
          <div class="card-footer py-2 text-center bg-light border-top-0 cursor-pointer">
             <small class="text-primary fw-bold">Click to Manage</small>
          </div>
        </div>
      </div>

      <div v-if="filteredOrders.length === 0" class="col-12 text-center py-5">
        <div class="text-muted">
          <Icon name="feather:inbox" size="48" />
          <p class="mt-2">No orders found in this status.</p>
        </div>
      </div>
    </div>

    <ClientOnly>
      <div class="modal fade" id="orderModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content" v-if="selectedOrder">
            
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title fw-bold">Manage Order #{{ selectedOrder.orderId }}</h5>
              <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
            </div>

            <div class="modal-body">
              <div class="alert text-center mb-3" :class="getStatusAlertClass(selectedOrder.status)">
                Current Status: <strong>{{ selectedOrder.status }}</strong>
              </div>

              <div class="row">
                <div class="col-md-5 border-end">
                  <h6 class="fw-bold mb-3">Customer Details</h6>
                  <p class="mb-1 fw-bold">{{ selectedOrder.customer }}</p>
                  <p class="mb-1 small text-muted"><Icon name="feather:mail" size="12"/> {{ selectedOrder.email }}</p>
                  <p class="mb-1 small text-muted"><Icon name="feather:map-pin" size="12"/> {{ selectedOrder.address }}</p>
                  <hr>
                  <p class="mb-1 small text-muted">Order Date: {{ selectedOrder.date }}</p>
                  <p class="mb-1 small text-muted">Payment: {{ selectedOrder.paymentMethod }}</p>
                </div>

                <div class="col-md-7">
                  <h6 class="fw-bold mb-3">Order Items</h6>
                  <div class="table-responsive" style="max-height: 200px; overflow-y: auto;">
                    <table class="table table-sm table-borderless">
                      <tbody>
                        <tr v-for="(item, i) in selectedOrder.items" :key="i">
                          <td>
                            <div class="d-flex align-items-center">
                              <div class="bg-light rounded me-2" style="width: 40px; height: 40px;"></div> 
                              <div>
                                <p class="mb-0 small fw-bold">{{ item.name }}</p>
                                <small class="text-muted">x{{ item.qty }}</small>
                              </div>
                            </div>
                          </td>
                          <td class="text-end align-middle">฿{{ item.price.toLocaleString() }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="d-flex justify-content-between border-top pt-2 mt-2">
                    <span class="fw-bold">Total Amount</span>
                    <span class="fw-bold text-primary fs-5">฿{{ selectedOrder.total.toLocaleString() }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="modal-footer justify-content-center border-0 pt-0 pb-4">
              <div v-if="selectedOrder.status === 'Pending Review'" class="d-flex gap-3 w-100 px-3">
                <button class="btn btn-outline-danger w-50 py-2" @click="handleAction('Cancelled')">
                  <Icon name="feather:x-circle" class="me-1"/> Reject Order
                </button>
                <button class="btn btn-success w-50 py-2" @click="handleAction('Accepted')">
                  <Icon name="feather:check-circle" class="me-1"/> Accept Order
                </button>
              </div>
              <div v-else class="text-center w-100">
                <p class="text-muted small mb-2">This order has already been processed.</p>
                <button class="btn btn-secondary px-5" data-bs-dismiss="modal">Close</button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ClientOnly>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'
// Import ไฟล์ JSON เข้ามา
import ordersData from '~/data/order.json'

definePageMeta({ layout: 'seller' })

// ใช้ข้อมูลจาก JSON
const orders = ref(ordersData.data)

// --- Tabs Logic ---
const tabs = ['All', 'Pending Review', 'Accepted', 'Cancelled']
const currentTab = ref('All')

const filteredOrders = computed(() => {
  if (currentTab.value === 'All') return orders.value
  return orders.value.filter(o => o.status === currentTab.value)
})

// --- Helper Functions ---
const getStatusColor = (status) => {
  switch(status) {
    case 'Pending Review': return 'bg-warning text-dark'
    case 'Accepted': return 'bg-success'
    case 'Cancelled': return 'bg-danger'
    default: return 'bg-secondary'
  }
}

const getStatusAlertClass = (status) => {
  switch(status) {
    case 'Pending Review': return 'alert-warning'
    case 'Accepted': return 'alert-success'
    case 'Cancelled': return 'alert-danger'
    default: return 'alert-secondary'
  }
}

// --- Interaction Logic ---
const selectedOrder = ref(null)

const openOrderDetails = (order) => {
  selectedOrder.value = { ...order }
  const modal = new bootstrap.Modal(document.getElementById('orderModal'))
  modal.show()
}

const handleAction = (action) => {
  if (!confirm(`Are you sure you want to mark this order as ${action}?`)) return;

  const index = orders.value.findIndex(o => o.id === selectedOrder.value.id)
  if (index !== -1) {
    orders.value[index].status = action
    selectedOrder.value.status = action 
  }

  const modal = bootstrap.Modal.getInstance(document.getElementById('orderModal'))
  modal.hide()
}
</script>

<style scoped>
.order-card {
  transition: transform 0.2s, box-shadow 0.2s;
  cursor: pointer;
  border: 1px solid #eee;
}

.order-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.05);
  border-color: #0d6efd;
}

.nav-pills .nav-link {
  color: #666;
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 14px;
}
.nav-pills .nav-link.active {
  background-color: #0d6efd;
  color: #fff;
}
</style>