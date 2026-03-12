<template>
  <div class="container-fluid py-4 bg-light min-vh-100">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h4 class="fw-bold mb-1 text-dark">กระเป๋าตัง</h4>
        
      </div>
    </div>

    <div class="row g-4">
      <div class="col-12 col-lg-4 col-xl-4">
        <div class="card border-0 shadow-sm text-white overflow-hidden"
          style="background: linear-gradient(135deg, #ff9f43 0%, #ff6b6b 100%); border-radius: 20px;">
          <div class="card-body p-4 position-relative">
            <div class="position-absolute top-0 end-0 p-3 opacity-25">
              <Icon name="feather:dollar-sign" size="120"
                style="transform: rotate(15deg); margin-top:-20px; margin-right:-20px;" />
            </div>

            <h6 class="opacity-75 mb-1">ยอดเงินที่ถอนได้</h6>
            <h1 class="fw-bold mb-4 display-5 text-truncate" title="ยอดเงินสุทธิ">{{ formatCurrency(wallet.balance) }}</h1>

            <button class="btn btn-light text-orange fw-bold rounded-pill w-100 shadow-sm" @click="openWithdrawModal">
              <Icon name="feather:download" class="me-2" /> ถอนเงินเข้าบัญชี
            </button>
          </div>
        </div>

        <div class="card border-0 shadow-sm mt-3 rounded-4">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-center mb-3">
              <h6 class="fw-bold text-dark mb-0 small text-uppercase">บัญชีรับเงินของคุณ</h6>
              <button class="btn btn-sm btn-outline-orange rounded-pill py-1 px-3 d-flex align-items-center gap-1" data-bs-toggle="modal"
                data-bs-target="#addBankModal">
                <Icon name="feather:plus" size="14" /> เพิ่มบัญชี
              </button>
            </div>

            <div v-if="bankAccounts.length === 0" class="text-center py-4 bg-light rounded-3 border">
              <p class="text-muted small mb-0">ยังไม่มีบัญชีรับเงิน</p>
            </div>

            <div v-for="bank in bankAccounts" :key="bank.id"
              class="d-flex align-items-center p-3 bg-light rounded-3 border mb-2 transition-all">
              <div class="bg-white p-2 rounded border me-3 flex-shrink-0">
                <Icon name="feather:credit-card" size="24" class="text-secondary" />
              </div>
              <div class="min-w-0 flex-grow-1 pe-2">
                <div class="fw-bold text-dark text-truncate" style="font-size: 14px;">{{ bank.bankName }}</div>
                <div class="small text-muted text-truncate">{{ bank.accountNo }}</div>
              </div>
              <div class="ms-auto flex-shrink-0">
                <span v-if="bank.verified" class="badge bg-success-subtle text-success">Verified</span>
                <span v-else class="badge bg-warning-subtle text-warning">New</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-8 col-xl-8">
        <div class="card border-0 shadow-sm rounded-4 h-100 d-flex flex-column">
          
          <div class="card-header bg-white border-0 py-3 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
            <h6 class="fw-bold mb-0">ประวัติธุรกรรมล่าสุด</h6>

            <div class="d-flex flex-wrap align-items-center gap-2 w-100 w-sm-auto">
              <input type="date" class="form-control form-control-sm shadow-none border-secondary-subtle text-secondary flex-grow-1 flex-sm-grow-0"
                style="border-radius: 8px; min-width: 130px; max-width: 150px;" v-model="filterDate">

              <select class="form-select form-select-sm shadow-none border-secondary-subtle fw-bold text-secondary flex-grow-1 flex-sm-grow-0"
                style="border-radius: 8px; min-width: 110px; max-width: 130px;" v-model="transactionFilter">
                <option value="all">ทั้งหมด</option>
                <option value="income">รายรับ</option>
                <option value="withdraw">ถอนเงิน</option>
              </select>

              <button class="btn btn-sm btn-light rounded-pill flex-shrink-0" @click="resetFilters" title="ล้างตัวกรอง"
                v-if="filterDate || transactionFilter !== 'all'">
                <Icon name="feather:x-circle" class="text-danger" />
              </button>
              <button class="btn btn-sm btn-light rounded-pill flex-shrink-0" @click="fetchWallet" title="รีเฟรช">
                <Icon name="feather:refresh-cw" />
              </button>
            </div>
          </div>

          <div class="card-body p-0 flex-grow-1">
            <div class="table-responsive">
              <table class="table align-middle mb-0" style="white-space: nowrap;">
                <thead class="bg-light text-secondary small">
                  <tr>
                    <th class="ps-4 py-3 border-0">รายการ</th>
                    <th class="py-3 border-0">วัน / เวลา</th>
                    <th class="py-3 border-0 text-end pe-4">จำนวนเงิน</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="paginatedTransactions.length === 0">
                    <td colspan="3" class="text-center py-5 text-muted">ไม่พบรายการที่ค้นหา</td>
                  </tr>
                  <tr v-for="tx in paginatedTransactions" :key="tx._id" class="border-bottom-dashed">
                    <td class="ps-4 py-3">
                      <div class="d-flex align-items-center">
                        <div class="rounded-circle p-2 me-3 d-flex align-items-center justify-content-center flex-shrink-0"
                          :class="tx.type === 'income' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'"
                          style="width: 40px; height: 40px;">
                          <Icon :name="tx.type === 'income' ? 'feather:arrow-down-left' : 'feather:arrow-up-right'"
                            size="18" />
                        </div>
                        <div class="min-w-0 pe-3" style="white-space: normal; min-width: 180px;">
                          <div class="fw-bold text-dark small">{{ tx.description }}</div>
                          <div class="text-xs" :class="tx.status === 'Completed' ? 'text-success' : 'text-muted'">{{
                            tx.status }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="py-3">
                      <div class="small fw-bold text-dark">{{ formatDateStr(tx.createdAt) }}</div>
                      <div class="text-xs text-secondary mt-1">
                        <Icon name="feather:clock" size="10" class="me-1" />{{ formatTimeStr(tx.createdAt) }}
                      </div>
                    </td>
                    <td class="text-end pe-4 fw-bold" :class="tx.type === 'income' ? 'text-success' : 'text-danger'">
                      {{ tx.type === 'income' ? '+' : '-' }}{{ formatCurrency(tx.amount) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="card-footer bg-white border-top-0 py-3 d-flex flex-column flex-md-row justify-content-between align-items-center gap-3"
            v-if="totalPages > 1">
            <div class="small text-muted text-center text-md-start">
              แสดงรายการที่ {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage,
              filteredTransactions.length) }} จากทั้งหมด {{ filteredTransactions.length }}
            </div>
            <nav aria-label="Page navigation">
              <ul class="pagination pagination-sm mb-0 flex-wrap justify-content-center">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <button class="page-link" @click="prevPage">ก่อนหน้า</button>
                </li>
                <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
                  <button class="page-link" @click="goToPage(page)">{{ page }}</button>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <button class="page-link" @click="nextPage">ถัดไป</button>
                </li>
              </ul>
            </nav>
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
                <h2 class="fw-bold text-orange text-truncate">{{ formatCurrency(wallet.balance) }}</h2>
              </div>

              <div class="mb-3">
                <label class="form-label small fw-bold">จำนวนเงินที่ต้องการถอน</label>
                <input type="number" class="form-control form-control-lg border-orange-focus fw-bold"
                  v-model="withdrawAmount" placeholder="0.00" min="100" @keydown="preventNegativeInput">
                <div class="text-end mt-1">
                  <small class="text-muted cursor-pointer hover-underline"
                    @click="withdrawAmount = wallet.balance">ถอนทั้งหมด</small>
                </div>
              </div>

              <div class="mb-4">
                <label class="form-label small fw-bold">เลือกบัญชีรับเงิน</label>
                <select class="form-select shadow-none" v-model="selectedBank">
                  <option value="" disabled>-- โปรดเลือกบัญชี --</option>
                  <option v-for="bank in bankAccounts" :key="bank.id" :value="bank.bankName + ' - ' + bank.accountNo">
                    {{ bank.bankName }} ({{ bank.accountNo }})
                  </option>
                </select>
                <div v-if="bankAccounts.length === 0" class="text-danger small mt-1">* กรุณาเพิ่มบัญชีธนาคารก่อนถอนเงิน
                </div>
              </div>

              <button class="btn btn-primary w-100 rounded-pill py-2 fw-bold shadow-sm" @click="confirmWithdraw"
                :disabled="!isValidWithdraw || !selectedBank">
                ยืนยันการถอนเงิน
              </button>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>

    <ClientOnly>
      <div class="modal fade" id="addBankModal" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
            <div class="modal-header border-0 bg-light">
              <h5 class="modal-title fw-bold text-dark d-flex align-items-center">
                <Icon name="feather:plus-circle" class="me-2 text-orange" /> เพิ่มบัญชีธนาคาร
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body p-4">
              <form @submit.prevent="saveNewBank">
                <div class="mb-3">
                  <label class="form-label small fw-bold">ธนาคาร</label>
                  <select class="form-select border-orange-focus shadow-none" v-model="newBank.bankName" required>
                    <option value="" disabled>-- เลือกธนาคาร --</option>
                    <option value="ธนาคารกสิกรไทย">ธนาคารกสิกรไทย (KBank)</option>
                    <option value="ธนาคารไทยพาณิชย์">ธนาคารไทยพาณิชย์ (SCB)</option>
                    <option value="ธนาคารกรุงเทพ">ธนาคารกรุงเทพ (BBL)</option>
                    <option value="ธนาคารกรุงไทย">ธนาคารกรุงไทย (KTB)</option>
                    <option value="ธนาคารกรุงศรีอยุธยา">ธนาคารกรุงศรีอยุธยา (BAY)</option>
                  </select>
                </div>
                <div class="mb-4">
                  <label class="form-label small fw-bold">หมายเลขบัญชี</label>
                  <input type="text" class="form-control border-orange-focus shadow-none" v-model="newBank.accountNo"
                    placeholder="เลขบัญชี 10-12 หลัก" required pattern="[0-9-]+" title="กรุณากรอกเฉพาะตัวเลข">
                </div>
                <div class="d-flex gap-2 flex-column flex-sm-row">
                  <button type="button" class="btn btn-light w-100 rounded-pill fw-bold mb-2 mb-sm-0"
                    data-bs-dismiss="modal">ยกเลิก</button>
                  <button type="submit" class="btn btn-primary w-100 rounded-pill fw-bold shadow-sm"
                    :disabled="!newBank.bankName || !newBank.accountNo">เพิ่มบัญชี</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import Swal from 'sweetalert2'

let bootstrap; // เพิ่มการตรวจสอบ Bootstrap ฝั่ง Client เหมือนไฟล์ก่อนๆ

definePageMeta({ layout: 'seller' })

// --- State ---
const wallet = ref({
  balance: 0,
  transactions: []
})

const withdrawAmount = ref('')
const selectedBank = ref('')
const transactionFilter = ref('all')
const filterDate = ref('')

// Pagination State
const currentPage = ref(1)
const itemsPerPage = 8

// รายการบัญชีธนาคาร
const bankAccounts = ref([
  { id: 1, bankName: 'ธนาคารกสิกรไทย', accountNo: 'xxx-x-xx890-1', verified: true }
])

const newBank = ref({
  bankName: '',
  accountNo: ''
})

// --- Computed ---
const isValidWithdraw = computed(() => {
  const amt = parseFloat(withdrawAmount.value)
  return amt > 0 && amt <= wallet.value.balance
})

// คัดกรองข้อมูลทั้งหมด
const filteredTransactions = computed(() => {
  if (!wallet.value.transactions) return []
  let list = wallet.value.transactions

  if (transactionFilter.value !== 'all') {
    if (transactionFilter.value === 'withdraw') {
      list = list.filter(tx => tx.type === 'withdraw' || tx.type === 'expense')
    } else {
      list = list.filter(tx => tx.type === transactionFilter.value)
    }
  }

  if (filterDate.value) {
    list = list.filter(tx => {
      const date = new Date(tx.createdAt)
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const localDateStr = `${year}-${month}-${day}`
      return localDateStr === filterDate.value
    })
  }

  return list
})

// จำนวนหน้าทั้งหมด
const totalPages = computed(() => {
  return Math.ceil(filteredTransactions.value.length / itemsPerPage) || 1
})

// หั่นข้อมูลแสดงผลตามหน้า (Pagination)
const paginatedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredTransactions.value.slice(start, end)
})

// --- Watchers ---
// เมื่อตัวกรองเปลี่ยน ให้กลับไปหน้าแรกเสมอ
watch([transactionFilter, filterDate], () => {
  currentPage.value = 1
})

// --- Functions ---
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const goToPage = (page) => { currentPage.value = page }

const resetFilters = () => {
  transactionFilter.value = 'all'
  filterDate.value = ''
}

const preventNegativeInput = (e) => {
  if (['-', 'e', '+'].includes(e.key)) {
    e.preventDefault()
  }
}

const safeCloseModal = (id) => {
  const modalEl = document.getElementById(id)
  if (modalEl) {
    const closeBtn = modalEl.querySelector('[data-bs-dismiss="modal"]')
    if (closeBtn) closeBtn.click()
    else {
      if (bootstrap) {
        const modalInstance = bootstrap.Modal.getInstance(modalEl)
        if (modalInstance) modalInstance.hide()
      }
    }
  }
  setTimeout(() => {
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove())
    document.body.classList.remove('modal-open')
    document.body.style = ''
  }, 300)
}

const fetchWallet = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch('https://vizdataprojectbe-production.up.railway.app/api/wallet/my-wallet', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    wallet.value = res
  } catch (e) {
    console.error('Fetch wallet error:', e)
  }
}

const openWithdrawModal = () => {
  withdrawAmount.value = ''
  if (bankAccounts.value.length > 0 && !selectedBank.value) {
    selectedBank.value = bankAccounts.value[0].bankName + ' - ' + bankAccounts.value[0].accountNo
  }
  if (bootstrap) new bootstrap.Modal(document.getElementById('withdrawModal')).show()
}

const saveNewBank = () => {
  if (newBank.value.bankName && newBank.value.accountNo) {
    bankAccounts.value.push({
      id: Date.now(),
      bankName: newBank.value.bankName,
      accountNo: newBank.value.accountNo,
      verified: false
    })

    selectedBank.value = newBank.value.bankName + ' - ' + newBank.value.accountNo
    newBank.value = { bankName: '', accountNo: '' }
    safeCloseModal('addBankModal')

    Swal.fire({
      icon: 'success',
      title: 'เพิ่มบัญชีสำเร็จ!',
      showConfirmButton: false,
      timer: 1500
    })
  }
}

const confirmWithdraw = async () => {
  safeCloseModal('withdrawModal')

  const result = await Swal.fire({
    title: 'ยืนยันการถอนเงิน?',
    html: `คุณต้องการถอนเงินจำนวน <b class="text-orange">${formatCurrency(withdrawAmount.value)}</b><br><span class="small text-muted">เข้าบัญชี: ${selectedBank.value}</span>`,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'ยืนยัน',
    cancelButtonText: 'ยกเลิก',
    confirmButtonColor: '#fd7e14',
    reverseButtons: true
  })

  if (result.isConfirmed) {
    try {
      Swal.fire({
        title: 'กำลังดำเนินการ...',
        didOpen: () => Swal.showLoading()
      })

      const token = localStorage.getItem('token')
      await $fetch('https://vizdataprojectbe-production.up.railway.app/api/wallet/withdraw', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: { amount: parseFloat(withdrawAmount.value), bankInfo: selectedBank.value }
      })

      await fetchWallet()
      withdrawAmount.value = ''

      Swal.fire({
        icon: 'success',
        title: 'ถอนเงินสำเร็จ!',
        text: 'ยอดเงินได้ถูกหักออกจากระบบเรียบร้อยแล้ว',
        confirmButtonColor: '#fd7e14'
      })

    } catch (e) {
      Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: e.data?.message || 'ไม่สามารถถอนเงินได้' })
    }
  } else {
    setTimeout(() => { openWithdrawModal() }, 300)
  }
}

// --- Formatters ---
const formatCurrency = (v) => new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(v || 0)

const formatDateStr = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })
}

const formatTimeStr = (d) => {
  if (!d) return '-'
  return new Date(d).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
}

onMounted(async () => {
  // ดึง Bootstrap มาใช้แบบไดนามิกเพื่อกันพังบน Server Side Rendering (SSR)
  const bsModule = await import('bootstrap/dist/js/bootstrap.bundle.min.js')
  bootstrap = bsModule.default || bsModule

  fetchWallet()
})
</script>

<style scoped>
.bg-gradient-orange {
  background: linear-gradient(135deg, #ff9f43 0%, #fd7e14 100%);
}

.text-orange {
  color: #fd7e14 !important;
}

.btn-outline-orange {
  color: #fd7e14;
  border-color: #fd7e14;
  background-color: transparent;
}

.btn-outline-orange:hover {
  color: #fff;
  background-color: #fd7e14;
}

.border-orange-focus:focus {
  border-color: #fd7e14;
  box-shadow: 0 0 0 0.25rem rgba(253, 126, 20, 0.25);
}

.hover-underline:hover {
  text-decoration: underline;
}

.border-bottom-dashed {
  border-bottom: 1px dashed #dee2e6;
}

.text-xs {
  font-size: 0.75rem;
}

.btn-primary {
  background-color: #fd7e14 !important;
  border-color: #fd7e14 !important;
  color: white !important;
}

.btn-primary:hover {
  background-color: #e36a0d !important;
  border-color: #e36a0d !important;
}

/* Pagination Customization (Orange Theme) */
.pagination .page-link {
  color: #fd7e14;
  border-color: #dee2e6;
  cursor: pointer;
}

.pagination .active .page-link {
  background-color: #fd7e14;
  border-color: #fd7e14;
  color: white;
}

.pagination .page-link:focus {
  box-shadow: 0 0 0 0.25rem rgba(253, 126, 20, 0.25);
}

.pagination .disabled .page-link {
  color: #6c757d;
  cursor: not-allowed;
}

/* Scrollbar สำหรับหน้าจอเล็ก */
.table-responsive::-webkit-scrollbar {
  height: 6px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #eee;
  border-radius: 4px;
}

/* เพิ่ม Utility Classes สำหรับจัดการ Responsive ในจอเล็กมาก (sm) */
.w-sm-auto {
  width: auto !important;
}
@media (max-width: 576px) {
  .w-sm-auto {
    width: 100% !important;
  }
}
</style>