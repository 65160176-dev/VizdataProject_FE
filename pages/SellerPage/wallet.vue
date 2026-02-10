<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1 text-dark">My Wallet 💰</h4>
        <p class="text-secondary small mb-0">จัดการรายได้และถอนเงิน</p>
      </div>
    </div>

    <div class="row g-4">
      <div class="col-md-4">
        <div class="card border-0 shadow-sm text-white overflow-hidden" 
             style="background: linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%); border-radius: 20px;">
          <div class="card-body p-4 position-relative">
            <div class="position-absolute top-0 end-0 p-3 opacity-25">
              <Icon name="feather:dollar-sign" size="120" style="transform: rotate(15deg); margin-top:-20px; margin-right:-20px;"/>
            </div>

            <h6 class="opacity-75 mb-1">ยอดเงินที่ถอนได้</h6>
            <h1 class="fw-bold mb-4 display-5">{{ formatCurrency(wallet.balance) }}</h1>

            <button class="btn btn-light text-orange fw-bold rounded-pill w-100 shadow-sm" 
                    @click="openWithdrawModal">
              <Icon name="feather:download" class="me-2"/> ถอนเงินเข้าบัญชี
            </button>
          </div>
        </div>

        <div class="card border-0 shadow-sm mt-3 rounded-4">
          <div class="card-body">
            <h6 class="fw-bold text-dark mb-3 small text-uppercase">บัญชีรับเงินของคุณ</h6>
            <div class="d-flex align-items-center p-3 bg-light rounded-3 border">
              <div class="bg-white p-2 rounded border me-3">
                <Icon name="feather:credit-card" size="24" class="text-secondary"/>
              </div>
              <div>
                <div class="fw-bold text-dark">ธนาคารกสิกรไทย</div>
                <div class="small text-muted">xxx-x-xx890-1</div>
              </div>
              <div class="ms-auto">
                <span class="badge bg-success-subtle text-success">Verified</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-8">
        <div class="card border-0 shadow-sm rounded-4 h-100">
          <div class="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <h6 class="fw-bold mb-0">ประวัติธุรกรรมล่าสุด</h6>
            <button class="btn btn-sm btn-light rounded-pill" @click="fetchWallet"><Icon name="feather:refresh-cw"/></button>
          </div>
          <div class="card-body p-0">
            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead class="bg-light text-secondary small">
                  <tr>
                    <th class="ps-4 py-3 border-0">รายการ</th>
                    <th class="py-3 border-0">วันที่</th>
                    <th class="py-3 border-0 text-end pe-4">จำนวนเงิน</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="wallet.transactions.length === 0">
                    <td colspan="3" class="text-center py-5 text-muted">ยังไม่มีรายการเคลื่อนไหว</td>
                  </tr>
                  <tr v-for="tx in wallet.transactions" :key="tx._id" class="border-bottom-dashed">
                    <td class="ps-4 py-3">
                      <div class="d-flex align-items-center">
                        <div class="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center"
                             :class="tx.type === 'income' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
                             style="width: 40px; height: 40px;">
                          <Icon :name="tx.type === 'income' ? 'feather:arrow-down-left' : 'feather:arrow-up-right'" size="18"/>
                        </div>
                        <div>
                          <div class="fw-bold text-dark small">{{ tx.description }}</div>
                          <div class="text-xs text-muted">{{ tx.status }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="small text-secondary">{{ formatDate(tx.createdAt) }}</td>
                    <td class="text-end pe-4 fw-bold" :class="tx.type === 'income' ? 'text-success' : 'text-danger'">
                      {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ClientOnly>
      <div class="modal fade" id="withdrawModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="modal-header bg-gradient-orange text-white border-0">
              <h5 class="modal-title fw-bold">ถอนเงิน 💸</h5>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <div class="text-center mb-4">
                <p class="text-muted small mb-1">ยอดเงินที่ถอนได้</p>
                <h2 class="fw-bold text-orange">{{ formatCurrency(wallet.balance) }}</h2>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold">จำนวนเงินที่ต้องการถอน</label>
                <input type="number" class="form-control form-control-lg border-orange-focus fw-bold" 
                       v-model="withdrawAmount" placeholder="0.00" min="100">
                <div class="text-end mt-1">
                  <small class="text-muted cursor-pointer hover-underline" @click="withdrawAmount = wallet.balance">ถอนทั้งหมด</small>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label small fw-bold">โอนเข้าบัญชี</label>
                <select class="form-select" v-model="selectedBank">
                  <option value="KBank - xxx-x-xx890-1">กสิกรไทย - xxx-x-xx890-1</option>
                  <option value="SCB - xxx-x-xx123-4">ไทยพาณิชย์ - xxx-x-xx123-4</option>
                </select>
              </div>

              <button class="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm" 
                      @click="confirmWithdraw" :disabled="!isValidWithdraw">
                ยืนยันการถอนเงิน
              </button>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

definePageMeta({ layout: 'seller' })

const wallet = ref({
  balance: 0,
  transactions: []
})

const withdrawAmount = ref('')
const selectedBank = ref('KBank - xxx-x-xx890-1')

const isValidWithdraw = computed(() => {
  const amt = parseFloat(withdrawAmount.value)
  return amt > 0 && amt <= wallet.value.balance
})

const fetchWallet = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch('http://localhost:3001/api/wallet/my-wallet', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    wallet.value = res
  } catch (e) {
    console.error('Fetch wallet error:', e)
  }
}

const openWithdrawModal = () => {
  new bootstrap.Modal(document.getElementById('withdrawModal')).show()
}

const confirmWithdraw = async () => {
  const modalEl = document.getElementById('withdrawModal')
  const modal = bootstrap.Modal.getInstance(modalEl)
  modal.hide()

  const result = await Swal.fire({
    title: 'ยืนยันการถอนเงิน?',
    html: `คุณต้องการถอนเงินจำนวน <b>${formatCurrency(withdrawAmount.value)}</b><br>เข้าบัญชี ${selectedBank.value}`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#ff9f43',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    try {
      Swal.fire({
        title: 'กำลังดำเนินการ...',
        didOpen: () => Swal.showLoading()
      })

      const token = localStorage.getItem('token')
      await $fetch('http://localhost:3001/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: { amount: parseFloat(withdrawAmount.value), bankInfo: selectedBank.value }
      })

      await fetchWallet()
      withdrawAmount.value = ''
      
      Swal.fire({
        icon: 'success',
        title: 'ถอนเงินสำเร็จ!',
        text: 'ยอดเงินได้ถูกโอนเข้าบัญชีของคุณเรียบร้อยแล้ว',
        confirmButtonColor: '#ff9f43'
      })

    } catch (e) {
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: e.data?.message || 'ไม่สามารถถอนเงินได้' })
    }
  } else {
    modal.show()
  }
}

const formatCurrency = (v) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(v || 0)
const formatDate = (d) => new Date(d).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit' })

onMounted(() => {
  fetchWallet()
})
</script>

<style scoped>
.bg-gradient-orange { background: linear-gradient(135deg, #ff9f43 0%, #fd7e14 100%); }
.text-orange { color: #fd7e14 !important; }
.border-orange-focus:focus { border-color: #fd7e14; box-shadow: 0 0 0 0.25rem rgba(253, 126, 20, 0.25); }
.hover-underline:hover { text-decoration: underline; }
.border-bottom-dashed { border-bottom: 1px dashed #dee2e6; }
.text-xs { font-size: 0.75rem; }

.btn-primary { 
  background-color: #fd7e14 !important; 
  border-color: #fd7e14 !important; 
  color: white !important;
}
.btn-primary:hover { 
  background-color: #e36a0d !important; 
  border-color: #e36a0d !important; 
}
</style>