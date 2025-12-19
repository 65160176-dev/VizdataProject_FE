<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1 text-dark">Order Management</h4>
        <p class="text-secondary small mb-0">จัดการและติดตามสถานะคำสั่งซื้อทั้งหมดของคุณ</p>
      </div>
    </div>

    <div class="card mb-4 border-0 shadow-sm rounded-4">
      <div class="card-body p-2">
        <ul class="nav nav-pills nav-fill custom-tabs">
          <li class="nav-item" v-for="s in statuses" :key="s.key">
            <a
              class="nav-link d-flex align-items-center justify-content-center gap-2"
              :class="{ active: currentStatus === s.key }"
              href="#"
              @click.prevent="currentStatus = s.key"
            >
              <Icon :name="s.icon" size="18" />
              <span>{{ s.label }}</span>
              <span 
                class="badge rounded-pill ms-2" 
                :class="currentStatus === s.key ? 'bg-white ' + getTextClass(s.key) : 'bg-light text-dark'"
              >
                {{ countByStatus(s.key) }}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="row g-3">
      <div class="col-12 text-center py-5" v-if="filtered.length === 0">
        <div class="empty-state">
          <Icon name="feather:inbox" size="64" class="text-muted mb-3 opacity-25" />
          <h5 class="text-muted">ไม่มีคำสั่งซื้อในสถานะนี้</h5>
        </div>
      </div>

      <div class="col-xl-4 col-md-6" v-for="order in filtered" :key="order.id">
        <div class="card h-100 order-card border-0 shadow-sm rounded-4 overflow-hidden" @click="openDetail(order)">
          
          <div :class="['card-header border-0 py-3 d-flex justify-content-between align-items-center text-white', 'header-' + order.status]">
            <div class="d-flex align-items-center gap-2">
               <span class="fw-bold fs-6">Order #{{ order.id }}</span>
            </div>
            <div class="d-flex align-items-center gap-1 opacity-90 small bg-white-glass px-2 py-1 rounded">
               <Icon name="feather:clock" size="12" /> {{ order.date }}
            </div>
          </div>
          
          <div class="card-body">
            <div class="d-flex align-items-center mb-3">
              <div class="position-relative">
                <img :src="order.items[0]?.image || '/images/dashboard/default.png'" class="rounded-3 border" style="width: 70px; height: 70px; object-fit: cover;">
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" v-if="order.items.length > 1">
                  +{{ order.items.length - 1 }}
                </span>
              </div>
              <div class="ms-3 flex-grow-1">
                <h6 class="fw-bold mb-1 text-truncate text-dark" style="max-width: 200px;">{{ order.customerName }}</h6>
                <p class="text-muted small mb-0 text-truncate">{{ order.items[0]?.name }}</p>
                <p class="text-secondary x-small mb-0 text-truncate" v-if="order.shopName">
                   <Icon name="feather:shopping-bag" size="10"/> {{ order.shopName }}
                </p>
                
                <div class="mt-2 text-xs fw-bold d-flex align-items-center gap-1">
                    <span :class="getTextClass(order.status)">
                      ● {{ mapStatusLabel(order.status) }} 
                    </span>
                </div>
              </div>
            </div>
          </div>

          <div class="card-footer bg-white border-top-0 d-flex justify-content-between align-items-center pb-3 pt-0">
             <div class="text-secondary small d-flex align-items-center gap-1">
                <Icon name="feather:credit-card" size="14" /> {{ order.payment }}
             </div>
             <div class="fw-bolder text-dark fs-5">
                {{ formatCurrency(order.total) }}
             </div>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <div v-if="showDetail" class="modal-backdrop-custom" @click.self="closeDetail">
        <div class="modal-content-custom p-0 overflow-hidden shadow-lg">
          
          <div :class="['px-4 py-3 d-flex justify-content-between align-items-center text-white', 'header-' + detail.status]">
            <div>
              <h5 class="fw-bold mb-0">Order #{{ detail.id }}</h5>
              <small class="opacity-75">{{ mapStatusLabel(detail.status) }}</small>
            </div>
            <button class="btn btn-icon btn-white-glass rounded-circle text-white" @click="closeDetail">
              <Icon name="feather:x" size="20" />
            </button>
          </div>

          <div class="p-4 bg-white">
             <div class="row mb-4 g-3">
                 <div class="col-md-6">
                    <div class="p-3 bg-light rounded-3 h-100 border border-light">
                      <h6 class="text-muted small mb-2 text-uppercase fw-bold">Customer</h6>
                      <div class="fw-bold mb-1 text-dark"><Icon name="feather:user" size="14" class="me-1"/> {{ detail.customerName }}</div>
                      <div class="small text-secondary mb-1"><Icon name="feather:phone" size="14" class="me-1"/> {{ detail.phone }}</div>
                      <div class="small text-secondary"><Icon name="feather:map-pin" size="14" class="me-1"/> {{ detail.address }}</div>
                    </div>
                 </div>
                 <div class="col-md-6">
                    <div class="p-3 bg-light rounded-3 h-100 border border-light">
                      <h6 class="text-muted small mb-2 text-uppercase fw-bold">Payment info</h6>
                        <div class="fw-bold mb-1 text-dark">{{ detail.payment }}</div>
                        <div class="small text-secondary">Date: {{ detail.date }}</div>
                        <div class="small text-secondary mt-1" v-if="detail.note">Note: {{ detail.note }}</div>
                    </div>
                 </div>
             </div>

             <h6 class="fw-bold mb-3 text-dark">Order Items ({{ detail.items.length }})</h6>
             <div class="table-responsive mb-4 border rounded-3">
               <table class="table table-borderless mb-0 align-middle">
                 <thead class="bg-light">
                   <tr class="small text-muted">
                     <th class="ps-3">Product</th>
                     <th class="text-end">Price</th>
                     <th class="text-end">Qty</th>
                     <th class="text-end pe-3">Total</th>
                   </tr>
                 </thead>
                 <tbody>
                   <tr v-for="(it, idx) in detail.items" :key="idx" class="border-bottom last:border-0">
                     <td class="ps-3">
                       <div class="d-flex align-items-center">
                         <img :src="it.image || '/images/dashboard/default.png'" class="rounded border me-2" style="width: 40px; height: 40px; object-fit: cover;">
                         <div>
                           <div class="fw-semibold small text-dark">{{ it.name }}</div>
                           <div class="text-muted x-small" v-if="it.variant">{{ it.variant }}</div>
                         </div>
                       </div>
                     </td>
                     <td class="text-end text-muted small">{{ formatCurrency(it.price) }}</td>
                     <td class="text-end fw-bold text-dark">x{{ it.qty }}</td>
                     <td class="text-end pe-3 fw-bold text-dark">{{ formatCurrency(it.price * it.qty) }}</td>
                   </tr>
                 </tbody>
               </table>
             </div>

             <div class="d-flex justify-content-between align-items-center pt-2">
               <div>
                 <span class="text-secondary small">Grand Total</span>
                 <h4 class="fw-bolder m-0" :class="getTextClass(detail.status)">{{ formatCurrency(detail.total) }}</h4>
               </div>
               
               <div>
                 <button v-if="canMoveNext(detail.status)" class="btn text-white px-4 py-2 shadow-sm rounded-pill" :class="'btn-status-' + detail.status" @click="moveNext(detail)">
                   
                   <span v-if="detail.status === 'shipped'" class="d-flex align-items-center gap-2">
                       Finish <Icon name="feather:check" />
                   </span>
                   
                   <span v-else class="d-flex align-items-center gap-2">
                       Next Step <Icon name="feather:arrow-right" />
                   </span>

                 </button>
               </div>

             </div>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import rawOrdersData from '~/data/orderStatus.json' 

definePageMeta({ layout: 'seller' })

// 5 สถานะ
const statuses = [
  { key: 'pending', label: 'ที่ต้องจัดส่ง', icon: 'feather:alert-circle' },
  { key: 'preparing', label: 'กำลังเตรียม', icon: 'feather:package' },
  { key: 'shipped', label: 'จัดส่งแล้ว', icon: 'feather:truck' },
  { key: 'completed', label: 'สำเร็จ', icon: 'feather:check-circle' },
  { key: 'cancelled', label: 'ยกเลิก', icon: 'feather:x-circle' }
]

// Map Data
const mappedOrders = rawOrdersData.map(o => {
    let mappedStatus = 'pending'; 

    if (o.status === 'ที่ต้องจัดส่ง') mappedStatus = 'pending';
    else if (o.status === 'กำลังเตรียมพัสดุ') mappedStatus = 'preparing';
    else if (o.status === 'กำลังจัดส่ง') mappedStatus = 'shipped';
    else if (o.status === 'สำเร็จ') mappedStatus = 'completed';
    else if (o.status === 'ยกเลิก') mappedStatus = 'cancelled';
    
    return {
        ...o,
        status: mappedStatus,
        originalStatus: o.status,
        payment: o.paymentMethod,
        total: Number(o.totalPrice) || 0, // Fix NaN
        date: '2025-12-19', 
        items: o.items.map(i => ({
            ...i,
            qty: i.quantity 
        }))
    }
})

const orders = ref(mappedOrders)
const currentStatus = ref('pending') 
const filtered = computed(() => orders.value.filter(o => o.status === currentStatus.value))

function countByStatus(k) { return orders.value.filter(o => o.status === k).length }

const showDetail = ref(false)
const detail = ref({ items: [] })

function openDetail(o) { detail.value = JSON.parse(JSON.stringify(o)); showDetail.value = true }
function closeDetail() { showDetail.value = false; setTimeout(() => { detail.value = { items: [] } }, 300) }

function formatCurrency(v){ 
    if (isNaN(v)) return '฿0'; 
    return new Intl.NumberFormat('th-TH',{ style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(v) 
}

function mapStatusLabel(s){ const f = statuses.find(x=>x.key===s); return f?f.label:s }
function getTextClass(status) { return 'text-status-' + status; }

// --- LOGIC ปุ่มถัดไป ---
function getNextStatus(s){ 
    if(s==='pending') return 'preparing'; 
    if(s==='preparing') return 'shipped'; 
    if(s==='shipped') return 'completed'; 
    return null; 
}

function canMoveNext(s){ return !!getNextStatus(s) }

function moveNext(o){ 
    const idx = orders.value.findIndex(x=>x.id===o.id); 
    if (idx !== -1) {
        const n = getNextStatus(orders.value[idx].status); 
        if(n){ 
            orders.value[idx].status = n; 
            detail.value.status = n; 
            if(n === 'completed') closeDetail();
        }
    }
}
</script>

<style scoped>
/* สไตล์ CSS เดิม คงไว้ตามต้องการ */
.header-pending { background: linear-gradient(135deg, #FF8F00 0%, #FFB300 100%); }
.text-status-pending { color: #F57F17; }
.btn-status-pending { background: #FF8F00; border: none; }
.btn-status-pending:hover { background: #F57C00; }

.header-preparing { background: linear-gradient(135deg, #0288D1 0%, #29B6F6 100%); }
.text-status-preparing { color: #0277BD; }
.btn-status-preparing { background: #0288D1; border: none; }
.btn-status-preparing:hover { background: #01579B; }

.header-shipped { background: linear-gradient(135deg, #5E35B1 0%, #7E57C2 100%); }
.text-status-shipped { color: #4527A0; }
.btn-status-shipped { background: #5E35B1; border: none; }
.btn-status-shipped:hover { background: #311B92; }

.header-completed { background: linear-gradient(135deg, #00897B 0%, #26A69A 100%); }
.text-status-completed { color: #00695C; }
.btn-status-completed { background: #00897B; border: none; }

.header-cancelled { background: linear-gradient(135deg, #D32F2F 0%, #EF5350 100%); }
.text-status-cancelled { color: #C62828; }

.custom-tabs .nav-link { color: #64748b; border-radius: 8px; padding: 10px 16px; font-weight: 600; transition: all 0.2s ease; }
.custom-tabs .nav-link:hover { background-color: #f1f5f9; color: #334155; }
.custom-tabs .nav-link.active { background: #fff; color: #0f172a; box-shadow: 0 2px 5px rgba(0,0,0,0.05); border: 1px solid #e2e8f0; }
.order-card { transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer; background: #fff; }
.order-card:hover { transform: translateY(-4px); box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important; }
.bg-white-glass { background: rgba(255,255,255,0.2); backdrop-filter: blur(4px); }
.btn-white-glass { background: rgba(255,255,255,0.25); border: none; transition: background 0.2s; }
.btn-white-glass:hover { background: rgba(255,255,255,0.4); }
.modal-backdrop-custom { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); backdrop-filter: blur(3px); display: flex; align-items: center; justify-content: center; z-index: 1050; padding: 20px; }
.modal-content-custom { background: #fff; width: 100%; max-width: 650px; border-radius: 16px; border: none; }
.x-small { font-size: 0.75rem; }
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>