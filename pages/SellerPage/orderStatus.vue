<template>
  <div class="container py-4">
    <h4>จัดการคำสั่งซื้อ</h4>

    <div class="mb-3">
      <ul class="nav nav-pills">
        <li class="nav-item" v-for="s in statuses" :key="s.key">
          <a
            class="nav-link"
            :class="{ active: currentStatus === s.key }"
            href="#"
            @click.prevent="currentStatus = s.key"
          >{{ s.label }} <span class="badge bg-light text-dark ms-2">{{ countByStatus(s.key) }}</span></a>
        </li>
      </ul>
    </div>

    <div class="row">
      <div class="col-12" v-if="filtered.length===0">ยังไม่มีคำสั่งซื้อในสถานะนี้</div>
      <div class="col-12" v-for="order in filtered" :key="order.id">
        <div class="card mb-3 order-card" @click="openDetail(order)">
          <div class="card-body d-flex align-items-center">
            <img :src="order.items[0]?.image" class="order-thumb me-3" />
            <div style="flex:1">
              <div class="fw-semibold">{{ order.customerName }}</div>
              <div class="text-muted small">Order #{{ order.id }} · {{ order.date }}</div>
              <div class="mt-1"><span :class="['status-badge','status-'+order.status]">{{ mapStatusLabel(order.status) }}</span></div>
            </div>
            <div class="text-end ms-3">
              <div class="fw-semibold">{{ formatCurrency(order.total) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail dialog -->
    <div v-if="showDetail" class="order-detail-backdrop" @click.self="closeDetail">
      <div class="order-detail">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <h5 class="m-0">Order #{{ detail.id }} — {{ detail.customerName }}</h5>
          <small class="text-muted">{{ detail.date }}</small>
        </div>

        <div class="mb-3">
          <div v-for="(it, idx) in detail.items" :key="idx" class="d-flex align-items-center mb-2">
            <img :src="it.image" style="width:60px;height:60px;object-fit:cover;border-radius:6px;margin-right:12px" />
            <div style="flex:1">
              <div class="fw-semibold">{{ it.name }}</div>
              <div class="small text-muted">x{{ it.qty }} · {{ formatCurrency(it.price) }}</div>
            </div>
            <div class="fw-semibold">{{ formatCurrency(it.price * it.qty) }}</div>
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center border-top pt-2">
          <div>
            <div class="small text-muted">การชำระเงิน: {{ detail.payment }}</div>
            <div class="small text-muted">ที่อยู่: {{ detail.address }}</div>
          </div>
          <div class="text-end">
            <div class="fw-bold">รวม: {{ formatCurrency(detail.total) }}</div>
            <div class="mt-2">
              <button v-if="canMoveNext(detail.status)" class="btn btn-primary btn-sm" @click="moveNext(detail)">เปลี่ยนสถานะเป็น '{{ nextStatusLabel(detail.status) }}'</button>
              <button v-else class="btn btn-secondary btn-sm" disabled>ไม่มีสถานะถัดไป</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({ layout: 'seller' })

// statuses order: pending -> preparing -> shipped -> completed -> cancelled
const statuses = [
  { key: 'pending', label: 'ยังไม่ได้จัดส่ง' },
  { key: 'preparing', label: 'กำลังจัดเตรียมสินค้า' },
  { key: 'shipped', label: 'สินค้าถูกจัดส่งแล้ว' },
  { key: 'completed', label: 'ออร์เดอร์เสร็จสิ้น' },
  { key: 'cancelled', label: 'ออร์เดอร์ยกเลิก' }
]

// mock data (in real app fetch from API)
const orders = ref(JSON.parse(localStorage.getItem('sellerOrders') || '[]'))
if (!orders.value || orders.value.length === 0) {
  orders.value = [
    { id: 1001, customerName: 'คุณเอ', date: '2025-12-17', status: 'pending', payment: 'โอน/Bank', address: 'กรุงเทพ', total: 1290, items: [ { name: 'กระเป๋า', qty:1, price: 890, image: '/images/img.jpg' }, { name: 'ผ้าเช็ดหน้า', qty:2, price:200, image: '/images/cat1.png' } ] },
    { id: 1002, customerName: 'คุณบี', date: '2025-12-15', status: 'preparing', payment: 'COD', address: 'นนทบุรี', total: 450, items: [ { name: 'รองเท้า', qty:1, price:450, image: '/images/2.jpg' } ] },
    { id: 1003, customerName: 'คุณซี', date: '2025-12-10', status: 'shipped', payment: 'บัตรเครดิต', address: 'เชียงใหม่', total: 1590, items: [ { name: 'นาฬิกา', qty:1, price:1590, image: '/images/20.jpg' } ] }
  ]
  localStorage.setItem('sellerOrders', JSON.stringify(orders.value))
}

const currentStatus = ref('pending')

const filtered = computed(() => orders.value.filter(o => o.status === currentStatus.value))

function countByStatus(k) { return orders.value.filter(o => o.status === k).length }

// detail dialog
const showDetail = ref(false)
const detail = ref({ items: [] })

function openDetail(o) { detail.value = JSON.parse(JSON.stringify(o)); showDetail.value = true }
function closeDetail() { showDetail.value = false; detail.value = { items: [] } }

function formatCurrency(v){ return new Intl.NumberFormat('th-TH',{ style: 'currency', currency: 'THB' }).format(v) }

function mapStatusLabel(s){ const f = statuses.find(x=>x.key===s); return f?f.label:s }

function getNextStatus(s){ if(s==='pending') return 'preparing'; if(s==='preparing') return 'shipped'; if(s==='shipped') return 'completed'; return null }
function nextStatusLabel(s){ const n=getNextStatus(s); return n?mapStatusLabel(n):'' }
function canMoveNext(s){ return !!getNextStatus(s) }

function persistOrders(){ localStorage.setItem('sellerOrders', JSON.stringify(orders.value)) }

function moveNext(o){ const idx = orders.value.findIndex(x=>x.id===o.id); const n = getNextStatus(orders.value[idx].status); if(n){ orders.value[idx].status = n; persistOrders(); detail.value.status = n; } }

</script>

<style scoped>
.order-card{ cursor:pointer }
.order-detail-backdrop{ position:fixed; inset:0; background:rgba(0,0,0,0.35); display:flex; align-items:center; justify-content:center; z-index:400 }
.order-detail{ width:760px; max-width:96%; background:#fff; padding:20px; border-radius:10px; box-shadow:0 8px 30px rgba(10,20,40,0.12) }
.order-thumb{ width:64px; height:64px; object-fit:cover; border-radius:8px }
.status-badge{ display:inline-block; padding:4px 8px; border-radius:999px; font-size:12px; font-weight:600 }
.status-pending{ background:#fff6e6; color:#b86b00; border:1px solid #ffd7a8 }
.status-preparing{ background:#e8f7ff; color:#0b69ff; border:1px solid #bfe1ff }
.status-shipped{ background:#eefef1; color:#1b8a3e; border:1px solid #c9f3d0 }
.status-completed{ background:#f0f4ff; color:#2d2d9f; border:1px solid #d6dbff }
.status-cancelled{ background:#fff0f3; color:#b00036; border:1px solid #ffd6e6 }

.order-card{ transition:transform .12s ease, box-shadow .12s ease }
.order-card:hover{ transform:translateY(-4px); box-shadow:0 8px 20px rgba(10,20,40,0.06) }

</style>
