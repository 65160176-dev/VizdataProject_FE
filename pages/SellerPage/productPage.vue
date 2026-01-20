<template>
  <div class="col-sm-12">
    <div class="card shadow-sm border-0">
      
      <div class="card-header d-flex justify-content-between align-items-center bg-white py-3">
        <h5 class="fw-bold mb-0">Products Management 📦</h5>
        <div>
          <button type="button" class="btn btn-outline-secondary me-2 shadow-sm" data-bs-toggle="modal" data-bs-target="#categoryModal">
            <Icon name="feather:list" size="16" class="me-1" style="margin-bottom:2px;"/> Category
          </button>
          <button type="button" class="btn btn-success me-2 shadow-sm" data-bs-toggle="modal" data-bs-target="#addStockModal">
            <Icon name="feather:box" size="16" class="me-1" style="margin-bottom:2px;"/> Add Stock
          </button>
          <button type="button" class="btn btn-primary shadow-sm" data-bs-toggle="modal" data-bs-target="#addModal">
            <Icon name="feather:plus" size="16" class="me-1" style="margin-bottom:2px;"/> Add Product
          </button>
        </div>
      </div>

      <div class="card-body">
        <div class="product-physical table-responsive">
          <table class="table table-striped text-center align-middle">
            <thead class="table-light">
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Commission (%)</th>
                <th>Weight (kg)</th>
                <th>Shipping Option</th>
                <th>Status</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            
            <tbody v-if="products && products.length > 0">
              <tr v-for="item in products" :key="item._id">
                <td><img class="img-40 me-2" :src="item.image || 'https://placehold.co/400'"></td>
                <td>{{ item.name }}</td>
                <td>{{ item.stock }}</td>
                <td>{{ item.price }}</td>
                <td>{{ item.commission }}</td>
                <td>{{ item.weight || 0 }}</td>
                <td>
                  <span class="badge border text-dark" :class="getBadgeColor(item.shippingCost)" style="font-weight: normal; font-size: 13px;">
                    {{ formatShippingCost(item.shippingCost) }}
                  </span>
                </td>
                <td><i class="fa fa-circle f-12" :class="'font-' + getStockStatus(item.stock)"></i></td>
                <td>{{ item.category }}</td>
                <td>
                  <Icon name="feather:edit" style="height:20px; cursor:pointer; margin-right:8px;" @click="goEdit(item._id)" />
                  <Icon name="feather:trash" style="height:20px; cursor:pointer; color:red;" @click="deleteItem(item._id)" />
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr><td colspan="10" class="text-center py-4 text-muted">No products found.</td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1060;">
        <div id="liveToast" class="toast align-items-center text-white bg-success border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body d-flex align-items-center">
              <Icon name="feather:check-circle" size="20" class="me-2" />
              {{ toastMessage }}
            </div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      </div>

      <ClientOnly>
        <div class="modal fade" id="categoryModal" tabindex="-1">
          <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow">
              <div class="modal-header border-0 pb-0">
                <h5 class="modal-title fw-bold">จัดการหมวดหมู่สินค้า</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body py-4">
                <p class="text-muted small mb-3">ติ๊กเพื่อเลือกหมวดหมู่ที่ใช้งานอยู่:</p>
                <div class="category-list-wrapper border rounded-3 p-2 bg-light mb-4" style="max-height: 300px; overflow-y: auto;">
                  <div v-for="(cat, index) in allCategories" :key="index" class="form-check p-3 mb-2 bg-white rounded-3 shadow-sm d-flex justify-content-between align-items-center transition-all">
                    <div class="d-flex align-items-center w-100" style="cursor: pointer;" @click="toggleCategory(cat)">
                      <input class="form-check-input me-3 ms-0 mt-0" type="checkbox" :checked="selectedCategories.includes(cat)" style="pointer-events: none;">
                      <label class="form-check-label fw-bold mb-0 text-dark" style="cursor: pointer;">{{ cat }}</label>
                    </div>
                    <Icon name="feather:trash-2" class="text-danger ms-2" style="cursor: pointer;" @click.stop="openConfirmDelete(index)" />
                  </div>
                </div>
                <div class="mt-4">
                  <label class="form-label small fw-bold">เพิ่มหมวดหมู่ใหม่:</label>
                  <div class="input-group">
                    <input type="text" class="form-control rounded-start-pill ps-3" placeholder="ระบุชื่อ..." v-model="newCategoryInput" @keyup.enter="addNewCategoryToSystem">
                    <button class="btn btn-primary rounded-end-pill px-4" @click="addNewCategoryToSystem">เพิ่ม</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>

      <ClientOnly>
        <div class="modal fade" id="confirmDeleteModal" tabindex="-1">
          <div class="modal-dialog modal-sm modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg text-center">
              <div class="modal-body pt-5 pb-4">
                <Icon name="feather:alert-triangle" size="48" class="text-warning mb-3" />
                <h5 class="fw-bold">ยืนยันการลบ?</h5>
                <p class="text-muted small">หมวดหมู่ "{{ categoryToDelete?.name }}" จะถูกลบถาวร</p>
                <div class="d-flex gap-2 mt-4 justify-content-center">
                  <button class="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">ยกเลิก</button>
                  <button class="btn btn-danger rounded-pill px-4" @click="executeDeleteCategory">ยืนยัน</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>

      <ClientOnly>
        <div class="modal fade" id="addModal" tabindex="-1">
          <div class="modal-dialog modal-lg border-0">
            <div class="modal-content border-0 shadow">
              <div class="modal-header border-0 shadow-sm"><h5 class="modal-title fw-bold">Add Product</h5><button class="btn-close" type="button" data-bs-dismiss="modal"></button></div>
              <div class="modal-body py-4">
                <form>
                  <div class="row">
                    <div class="col-md-5 d-flex flex-column align-items-center justify-content-center mb-3">
                      <div class="upload-box" @click="triggerFileInput('add')">
                        <img v-if="newItem.previewImage" :src="newItem.previewImage" class="img-preview" />
                        <div v-else class="text-center text-muted">
                          <Icon name="feather:image" size="48" />
                          <p class="mb-0 mt-2 small">Click to Upload</p>
                        </div>
                        <input type="file" id="addFileInput" class="d-none" @change="(e) => onFileChange(e, 'add')" accept="image/*">
                      </div>
                    </div>
                    <div class="col-md-7">
                      <div class="form-group mb-3"><label class="small fw-bold">Product Name :</label><input class="form-control" v-model="newItem.name" type="text"></div>
                      <div class="row">
                        <div class="col-6 form-group mb-3"><label class="small fw-bold">Stock :</label><input class="form-control" v-model="newItem.stock" type="number"></div>
                        <div class="col-6 form-group mb-3"><label class="small fw-bold">Price :</label><input class="form-control" v-model="newItem.price" type="number"></div>
                      </div>
                      <div class="row">
                        <div class="col-6 form-group mb-3"><label class="small fw-bold">Commission (%) :</label><input class="form-control" v-model="newItem.commission" type="number"></div>
                        <div class="col-6 form-group mb-3">
                          <label class="text-primary fw-bold small">Weight (kg) :</label>
                          <input class="form-control border-primary" v-model="newItem.weight" type="number" step="0.1">
                          
                          <div class="mt-2" v-if="newItem.weight >= 0">
                             <small class="text-muted w-100 mb-1 d-block" style="font-size: 11px;">Select Shipping Cost:</small>
                             <div class="d-flex flex-wrap gap-2">
                               <button v-for="(option, index) in availableOptionsAdd" :key="index" type="button" class="btn btn-sm badge-btn" 
                                  :class="[newItem.shippingCost === option.value ? 'btn-' + option.colorName + ' active-badge' : 'btn-outline-secondary']" 
                                  @click="newItem.shippingCost = option.value">
                                  {{ option.text }}
                                  <Icon v-if="newItem.shippingCost === option.value" name="feather:check" size="12" />
                               </button>
                             </div>
                          </div>
                        </div>
                      </div>
                      <div class="form-group mb-3"><label class="small fw-bold">Category :</label><select class="form-select" v-model="newItem.category"><option disabled value="">Select Category</option><option v-for="opt in selectedCategories" :key="opt" :value="opt">{{ opt }}</option></select></div>
                      <div class="form-group mb-0"><label class="small fw-bold">Description :</label><textarea class="form-control" rows="3" v-model="newItem.description"></textarea></div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer border-0"><button class="btn btn-primary px-4 shadow-sm" @click="saveNewItem">Save</button><button class="btn btn-secondary px-4 shadow-sm" data-bs-dismiss="modal" @click="resetNewItemForm">Close</button></div>
            </div>
          </div>
        </div>
      </ClientOnly>

      <ClientOnly>
        <div class="modal fade" id="editModal" tabindex="-1">
          <div class="modal-dialog modal-lg border-0">
            <div class="modal-content border-0 shadow">
              <div class="modal-header border-0 shadow-sm"><h5 class="modal-title fw-bold">Edit Product</h5><button class="btn-close" type="button" data-bs-dismiss="modal"></button></div>
              <div class="modal-body py-4">
                <form>
                  <div class="row">
                    <div class="col-md-5 d-flex flex-column align-items-center justify-content-center mb-3">
                      <div class="upload-box" @click="triggerFileInput('edit')">
                        <img v-if="editItem.previewImage" :src="editItem.previewImage" class="img-preview" />
                        <img v-else-if="editItem.image" :src="editItem.image" class="img-preview" />
                        <div v-else class="text-center text-muted"><Icon name="feather:image" size="48" /></div>
                        <input type="file" id="editFileInput" class="d-none" @change="(e) => onFileChange(e, 'edit')" accept="image/*">
                      </div>
                    </div>
                    <div class="col-md-7">
                        <div class="form-group mb-3"><label class="small fw-bold">Product Name :</label><input class="form-control" v-model="editItem.name"></div>
                        <div class="row">
                          <div class="col-6 form-group mb-3"><label class="small fw-bold">Stock :</label><input class="form-control" v-model="editItem.stock" type="number"></div>
                          <div class="col-6 form-group mb-3"><label class="small fw-bold">Price :</label><input class="form-control" v-model="editItem.price" type="number"></div>
                        </div>
                        <div class="row">
                          <div class="col-6 form-group mb-3"><label class="small fw-bold">Commission (%) :</label><input class="form-control" v-model="editItem.commission" type="number"></div>
                          <div class="col-6 form-group mb-3">
                            <label class="text-primary fw-bold small">Weight (kg) :</label>
                            <input class="form-control border-primary" v-model="editItem.weight" type="number" step="0.1">
                            
                            <div class="mt-2" v-if="editItem.weight >= 0">
                                <small class="text-muted w-100 mb-1 d-block" style="font-size: 11px;">Select Shipping Cost:</small>
                                <div class="d-flex flex-wrap gap-2">
                                  <button v-for="(option, index) in availableOptionsEdit" :key="index" type="button" class="btn btn-sm badge-btn" 
                                      :class="[editItem.shippingCost === option.value ? 'btn-' + option.colorName + ' active-badge' : 'btn-outline-secondary']" 
                                      @click="editItem.shippingCost = option.value">
                                      {{ option.text }}
                                      <Icon v-if="editItem.shippingCost === option.value" name="feather:check" size="12" />
                                  </button>
                                </div>
                            </div>
                          </div>
                        </div>
                        <div class="form-group mb-3"><label class="small fw-bold">Category :</label><select class="form-select" v-model="editItem.category"><option v-for="opt in selectedCategories" :key="opt" :value="opt">{{ opt }}</option></select></div>
                        <div class="form-group mb-3"><label class="small fw-bold">Description :</label><textarea class="form-control" rows="3" v-model="editItem.description"></textarea></div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer border-0"><button class="btn btn-primary px-4 shadow-sm" @click="saveEdit">Save Changes</button><button class="btn btn-secondary px-4 shadow-sm" data-bs-dismiss="modal">Close</button></div>
            </div>
          </div>
        </div>
      </ClientOnly>

      <ClientOnly>
        <div class="modal fade" id="addStockModal" tabindex="-1">
          <div class="modal-dialog border-0">
            <div class="modal-content border-0 shadow">
              <div class="modal-header border-0"><h5 class="modal-title fw-bold">Add Stock</h5><button class="btn-close" type="button" data-bs-dismiss="modal"></button></div>
              <div class="modal-body py-4">
                <form>
                  <div class="form-group mb-3">
                    <label class="small fw-bold text-muted">Filter by Category :</label>
                    <select class="form-select shadow-none border-secondary-subtle" v-model="stockCategoryFilter">
                      <option value="">All Categories</option>
                      <option v-for="cat in activeCategories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                  </div>

                  <div class="form-group mb-3">
                    <label class="small fw-bold">Select Product :</label>
                    <select class="form-select shadow-none" v-model="stockForm.id" :disabled="filteredStockProducts.length === 0">
                      <option disabled value="">
                        {{ filteredStockProducts.length === 0 ? 'No products in this category' : 'Select Product...' }}
                      </option>
                      <option v-for="item in filteredStockProducts" :key="item._id" :value="item._id">
                        {{ item.name }} (Current: {{ item.stock }})
                      </option>
                    </select>
                  </div>

                  <div class="form-group mb-3"><label class="small fw-bold">Quantity :</label><input class="form-control shadow-none" type="number" v-model="stockForm.quantity" min="1"></div>
                </form>
              </div>
              <div class="modal-footer border-0">
                <button class="btn btn-success px-4" @click="saveAddStock" :disabled="!stockForm.id || !stockForm.quantity">Update</button>
                <button class="btn btn-secondary px-4 shadow-sm" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

definePageMeta({ layout: 'seller' })

const products = ref([])
const newCategoryInput = ref('')

const defaultCats = [
  'Fashion (Women)', 'Fashion (Men)', 'Electronics', 'Mobile & Gadgets',
  'Beauty & Personal Care', 'Health & Wellness', 'Home & Living', 
  'Home Appliances', 'Shoes', 'Watches & Accessories', 'Jewellery', 
  'Bags & Luggage', 'Sports & Outdoors', 'Automotive', 'Toys & Games', 
  'Mom & Baby', 'Pets', 'Food & Beverages', 'Books & Stationery', 
  'Computers & Laptops', 'Gaming', 'Furniture'
]

const allCategories = ref([...defaultCats])
const selectedCategories = ref([...defaultCats])
const categoryToDelete = ref({ index: null, name: '' })

// --- Toast Logic (New) ---
const toastMessage = ref('')
const showToast = (message) => {
  toastMessage.value = message
  const toastEl = document.getElementById('liveToast')
  const toast = new bootstrap.Toast(toastEl) // สร้าง Toast instance
  toast.show() // สั่งแสดง
}
// -------------------------

// --- Category Logic ---
const toggleCategory = (cat) => {
  const index = selectedCategories.value.indexOf(cat)
  if (index > -1) selectedCategories.value.splice(index, 1)
  else selectedCategories.value.push(cat)
}

const addNewCategoryToSystem = () => {
  const trimmed = newCategoryInput.value?.trim()
  if (trimmed && !allCategories.value.includes(trimmed)) {
    allCategories.value.push(trimmed); selectedCategories.value.push(trimmed); newCategoryInput.value = ''
  }
}

const openConfirmDelete = (index) => {
  categoryToDelete.value = { index, name: allCategories.value[index] }
  new bootstrap.Modal(document.getElementById('confirmDeleteModal')).show()
}

const executeDeleteCategory = () => {
  const { index, name } = categoryToDelete.value
  if (index !== null) {
    allCategories.value.splice(index, 1)
    const selIndex = selectedCategories.value.indexOf(name)
    if (selIndex > -1) selectedCategories.value.splice(selIndex, 1)
    bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal')).hide()
  }
}

// --- Fetch & Helpers ---
const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await $fetch('http://localhost:3001/api/product/my-products', { headers: { 'Authorization': `Bearer ${token}` } })
    products.value = res || []
  } catch (e) { console.error(e) }
}
onMounted(() => fetchProducts())
const refresh = fetchProducts

const getStockStatus = (s) => (s >= 100 ? 'success' : s >= 25 ? 'warning' : 'danger')
const getBadgeColor = (c) => {
  const cost = parseInt(c)
  if (cost === 0) return 'bg-success text-white'
  if (cost <= 40) return 'bg-info text-dark'
  if (cost <= 80) return 'bg-warning text-dark'
  return 'bg-danger text-white'
}
const formatShippingCost = (c) => (parseInt(c) === 0 ? 'Free' : `${c} บ.`)
const calculateOptions = (w) => {
  const weight = parseFloat(w) || 0
  const options = [{ value: 0, text: 'Free', colorName: 'success' }]
  if (weight >= 1) options.push({ value: 30, text: '30 บ.', colorName: 'info' })
  if (weight >= 10) options.push({ value: 60, text: '60 บ.', colorName: 'warning' })
  if (weight >= 20) options.push({ value: 120, text: '120 บ.', colorName: 'danger' })
  return options
}
const safeCloseModal = (id) => {
  const el = document.getElementById(id)
  if (el) (bootstrap.Modal.getInstance(el) || new bootstrap.Modal(el)).hide()
  document.querySelectorAll('.modal-backdrop').forEach(b => b.remove())
}

// --- CRUD ---
const newItem = ref({ name: '', stock: 0, price: 0, commission: 0, weight: 0, shippingCost: 0, description: '', category: '', previewImage: null, rawFile: null })
const editItem = ref({ _id: null, name: '', stock: 0, price: 0, commission: 0, weight: 0, shippingCost: 0, category: '', description: '', previewImage: null, rawFile: null })

const availableOptionsAdd = ref([])
const availableOptionsEdit = ref([])

// --- Stock Logic (Active Filter) ---
const stockForm = ref({ id: '', quantity: '' })
const stockCategoryFilter = ref('')

const activeCategories = computed(() => {
  const used = products.value.map(p => p.category).filter(c => c)
  return [...new Set(used)].sort()
})

const filteredStockProducts = computed(() => {
  if (!stockCategoryFilter.value) {
    return products.value
  }
  return products.value.filter(p => p.category === stockCategoryFilter.value)
})

watch(stockCategoryFilter, () => {
  stockForm.value.id = '' 
})

// --- Watchers ---
watch(() => newItem.value.weight, (v) => {
  availableOptionsAdd.value = calculateOptions(v)
  if (availableOptionsAdd.value.length > 0) newItem.value.shippingCost = availableOptionsAdd.value[availableOptionsAdd.value.length - 1].value
})

watch(() => editItem.value.weight, (v) => {
  availableOptionsEdit.value = calculateOptions(v)
})

const triggerFileInput = (m) => document.getElementById(`${m}FileInput`).click()
const onFileChange = (e, m) => {
  const f = e.target.files[0]
  if (f) {
    const p = URL.createObjectURL(f)
    if (m === 'add') { newItem.value.previewImage = p; newItem.value.rawFile = f }
    else { editItem.value.previewImage = p; editItem.value.rawFile = f }
  }
}

const resetNewItemForm = () => { newItem.value = { name: '', stock: 0, price: 0, commission: 0, weight: 0, shippingCost: 0, category: '', description: '', previewImage: null, rawFile: null } }

// --- SAVE FUNCTIONS (Using Toast) ---
const saveNewItem = async () => {
  const token = localStorage.getItem('token')
  const fd = new FormData()
  fd.append('name', newItem.value.name); fd.append('stock', newItem.value.stock); fd.append('price', newItem.value.price); fd.append('commission', newItem.value.commission); fd.append('weight', newItem.value.weight); fd.append('shippingCost', newItem.value.shippingCost); fd.append('description', newItem.value.description); fd.append('category', newItem.value.category)
  if (newItem.value.rawFile) fd.append('file', newItem.value.rawFile)
  
  await $fetch('http://localhost:3001/api/product', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd })
  
  showToast('เพิ่มสินค้าใหม่เรียบร้อยแล้ว') // ✅ แจ้งเตือนแบบไม่ต้องกด
  refresh(); resetNewItemForm(); safeCloseModal('addModal')
}

function goEdit(id) {
  const f = products.value.find(x => x._id === id)
  if (f) {
    editItem.value = { ...f, previewImage: null, rawFile: null }
    availableOptionsEdit.value = calculateOptions(editItem.value.weight)
    new bootstrap.Modal(document.getElementById('editModal')).show()
  }
}

async function saveEdit() {
  const token = localStorage.getItem('token')
  const fd = new FormData()
  fd.append('name', editItem.value.name); fd.append('stock', editItem.value.stock); fd.append('price', editItem.value.price); fd.append('commission', editItem.value.commission); fd.append('weight', editItem.value.weight); fd.append('shippingCost', editItem.value.shippingCost); fd.append('category', editItem.value.category); fd.append('description', editItem.value.description)
  if (editItem.value.rawFile) fd.append('file', editItem.value.rawFile)
  
  await $fetch(`http://localhost:3001/api/product/${editItem.value._id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: fd })
  
  showToast('แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว') // ✅ แจ้งเตือนแบบไม่ต้องกด
  refresh(); safeCloseModal('editModal')
}

async function deleteItem(id) {
  if (confirm('ลบสินค้า?')) {
    const token = localStorage.getItem('token')
    await $fetch(`http://localhost:3001/api/product/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
    
    showToast('ลบสินค้าเรียบร้อยแล้ว') // ✅ แจ้งเตือนแบบไม่ต้องกด
    refresh()
  }
}

async function saveAddStock() {
  const t = products.value.find(p => p._id === stockForm.value.id)
  if (t) {
    const n = parseInt(t.stock) + parseInt(stockForm.value.quantity)
    const token = localStorage.getItem('token')
    const fd = new FormData()
    fd.append('stock', n)
    
    await $fetch(`http://localhost:3001/api/product/${t._id}`, { 
      method: 'PUT', 
      headers: { 'Authorization': `Bearer ${token}` }, 
      body: fd 
    })
    
    showToast('เพิ่มสต็อกเรียบร้อยแล้ว') // ✅ แจ้งเตือนแบบไม่ต้องกด
    refresh(); safeCloseModal('addStockModal')
    stockForm.value = { id: '', quantity: '' }
  }
}
</script>

<style scoped>
.btn-primary { background-color: #0d6efd !important; border-color: #0d6efd !important; color: white !important; }
.form-check-input:checked { background-color: #0d6efd !important; border-color: #0d6efd !important; }
.badge-btn { border-radius: 20px; padding: 4px 12px; font-size: 12px; transition: all 0.2s; display: flex; align-items: center; gap: 4px; border: 1px solid #dee2e6; }
.active-badge { box-shadow: 0 0 0 2px rgba(0,0,0,0.1); font-weight: bold; color: white !important; border: none; }
.img-40 { width: 40px; height: 40px; object-fit: cover; border-radius: 6px; }
.upload-box { width: 100%; height: 220px; border: 2px dashed #dee2e6; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fbfbfb; overflow: hidden; }
.img-preview { width: 100%; height: 100%; object-fit: contain; }
.rounded-start-pill { border-top-left-radius: 50px !important; border-bottom-left-radius: 50px !important; }
.rounded-end-pill { border-top-right-radius: 50px !important; border-bottom-right-radius: 50px !important; }
.category-list-wrapper { border: 1px solid #eee !important; }
.form-check { border: 1px solid #f0f0f0; transition: all 0.2s; cursor: pointer; }
.font-success { color: #28c76f; } .font-warning { color: #ff9f43; } .font-danger { color: #ea5455; }
</style>