<template>
  <div class="col-sm-12">
    <div class="card">
      
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>Products Category 📦</h5>
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
          <div class="table-responsive">
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
                <tr v-for="(item, index) in products" :key="item._id">
                  <td>
                    <img class="img-40 me-2" :src="item.image || 'https://placehold.co/400'" alt="">
                  </td>
                  <td>{{ item.name }}</td>
                  <td>{{ item.stock }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.commission }}</td>
                  
                  <td>{{ item.weight || 0 }}</td>
                  
                  <td>
                    <span 
                      class="badge border text-dark"
                      :class="getBadgeColor(item.shippingCost)"
                      style="font-weight: normal; font-size: 13px;"
                    >
                      {{ formatShippingCost(item.shippingCost) }}
                    </span>
                  </td>

                  <td>
                    <i class="fa fa-circle f-12" :class="'font-' + getStockStatus(item.stock)"></i>
                  </td>
                  <td>{{ item.category }}</td>
                  <td>
                    <Icon name="feather:edit" style="height:20px; cursor:pointer; margin-right:8px;" @click="goEdit(item._id)" />
                    <Icon name="feather:trash" style="height:20px; cursor:pointer; color:red;" @click="deleteItem(item._id)" />
                  </td>
                </tr>
              </tbody>
              <tbody v-else>
                <tr>
                  <td colspan="10" class="text-center py-4 text-muted">No products found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ClientOnly>
        <div class="modal fade" id="addModal" tabindex="-1">
          <div class="modal-dialog modal-lg">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Add Product</h5>
                <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form>
                  <div class="row">
                    <div class="col-md-5 d-flex flex-column align-items-center justify-content-center mb-3">
                      <div class="upload-box" @click="triggerFileInput('add')">
                        <img v-if="newItem.previewImage" :src="newItem.previewImage" class="img-preview" />
                        <div v-else class="text-center text-muted">
                          <Icon name="feather:image" size="48" style="color: #ccc;" />
                          <p class="mb-0 mt-2">Click to Upload</p>
                        </div>
                        <input type="file" id="addFileInput" class="d-none" @change="(e) => onFileChange(e, 'add')" accept="image/*">
                      </div>
                    </div>
                    <div class="col-md-7">
                      <div class="form-group mb-3">
                        <label>Product Name :</label>
                        <input class="form-control" v-model="newItem.name" type="text">
                      </div>
                      
                      <div class="row">
                        <div class="col-6 form-group mb-3">
                          <label>Stock :</label>
                          <input class="form-control" v-model="newItem.stock" type="number" min="0">
                        </div>
                        <div class="col-6 form-group mb-3">
                          <label>Price :</label>
                          <input class="form-control" v-model="newItem.price" type="number" min="0">
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-6 form-group mb-3">
                          <label>Commission (%) :</label>
                          <input class="form-control" v-model="newItem.commission" type="number" min="0">
                        </div>
                        
                        <div class="col-6 form-group mb-3">
                          <label class="text-primary fw-bold">Weight (kg) :</label>
                          <input class="form-control border-primary" v-model="newItem.weight" type="number" step="0.1" min="0" placeholder="Enter weight">
                          
                          <div class="mt-2" v-if="newItem.weight >= 0">
                             <small class="text-muted w-100 mb-1 d-block" style="font-size: 11px;">Select Shipping Cost:</small>
                             <div class="d-flex flex-wrap gap-2">
                               <button 
                                  v-for="(option, index) in availableOptionsAdd" 
                                  :key="index"
                                  type="button"
                                  class="btn btn-sm badge-btn"
                                  :class="[
                                    newItem.shippingCost === option.value 
                                      ? 'btn-' + option.colorName + ' active-badge' 
                                      : 'btn-outline-secondary'
                                  ]"
                                  @click="newItem.shippingCost = option.value"
                               >
                                  {{ option.text }}
                                  <Icon v-if="newItem.shippingCost === option.value" name="feather:check" size="12" />
                               </button>
                             </div>
                          </div>
                        </div>
                      </div>

                      <div class="form-group mb-3">
                        <label>Category :</label>
                        <select class="form-select" v-model="newItem.category">
                          <option disabled value="">Select Category</option>
                          <option v-for="opt in categoryOptions" :key="opt" :value="opt">{{ opt }}</option>
                        </select>
                      </div>

                      <div class="form-group mb-0">
                        <label>Description :</label>
                        <textarea class="form-control" rows="3" v-model="newItem.description" placeholder="Product details..."></textarea>
                      </div>

                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" @click="saveNewItem">Save</button>
                <button class="btn btn-secondary" data-bs-dismiss="modal" @click="resetNewItemForm">Close</button>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>

      <ClientOnly>
        <div class="modal fade" id="editModal" tabindex="-1">
          <div class="modal-dialog modal-lg"> <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title">Edit Product</h5>
                <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body">
                <form>
                   <div class="row">
                    <div class="col-md-5 d-flex flex-column align-items-center justify-content-center mb-3">
                      <div class="upload-box" @click="triggerFileInput('edit')">
                        <img v-if="editItem.previewImage" :src="editItem.previewImage" class="img-preview" />
                        <img v-else-if="editItem.image" :src="editItem.image" class="img-preview" />
                        <div v-else class="text-center text-muted">
                          <Icon name="feather:image" size="48" style="color: #ccc;" />
                        </div>
                         <input type="file" id="editFileInput" class="d-none" @change="(e) => onFileChange(e, 'edit')" accept="image/*">
                      </div>
                      <small class="text-muted mt-2">Click image to change</small>
                    </div>

                    <div class="col-md-7">
                        <div class="form-group mb-3">
                          <label>Product Name :</label>
                          <input class="form-control" v-model="editItem.name">
                        </div>
                        
                        <div class="row">
                          <div class="col-6 form-group mb-3">
                            <label>Stock :</label>
                            <input class="form-control" v-model="editItem.stock" type="number">
                          </div>
                          <div class="col-6 form-group mb-3">
                            <label>Price :</label>
                            <input class="form-control" v-model="editItem.price" type="number">
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-6 form-group mb-3">
                            <label>Commission :</label>
                            <input class="form-control" v-model="editItem.commission" type="number">
                          </div>
                          
                          <div class="col-6 form-group mb-3">
                            <label class="text-primary fw-bold">Weight (kg) :</label>
                            <input class="form-control border-primary" v-model="editItem.weight" type="number" step="0.1">
                            
                            <div class="mt-2" v-if="editItem.weight >= 0">
                                <small class="text-muted w-100 mb-1 d-block" style="font-size: 11px;">Select Shipping Cost:</small>
                                <div class="d-flex flex-wrap gap-2">
                                  <button 
                                      v-for="(option, index) in availableOptionsEdit" 
                                      :key="index"
                                      type="button"
                                      class="btn btn-sm badge-btn"
                                      :class="[
                                        editItem.shippingCost === option.value 
                                          ? 'btn-' + option.colorName + ' active-badge' 
                                          : 'btn-outline-secondary'
                                      ]"
                                      @click="editItem.shippingCost = option.value"
                                  >
                                      {{ option.text }}
                                      <Icon v-if="editItem.shippingCost === option.value" name="feather:check" size="12" />
                                  </button>
                                </div>
                            </div>
                          </div>
                        </div>

                        <div class="form-group mb-3">
                          <label>Category :</label>
                          <select class="form-select" v-model="editItem.category">
                            <option v-for="opt in categoryOptions" :key="opt" :value="opt">{{ opt }}</option>
                          </select>
                        </div>

                          <div class="form-group mb-3">
                            <label>Description :</label>
                            <textarea class="form-control" rows="3" v-model="editItem.description"></textarea>
                          </div>
                    </div>
                   </div>
                </form>
              </div>
              <div class="modal-footer">
                <button class="btn btn-primary" @click="saveEdit">Save Changes</button>
                <button class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>

      <ClientOnly>
        <div class="modal fade" id="addStockModal" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Add Stock</h5><button class="btn-close" type="button" data-bs-dismiss="modal"></button></div><div class="modal-body"><form><div class="form-group mb-3"><label>Select Product :</label><select class="form-select" v-model="stockForm.id"><option disabled value="">Select...</option>
          <option v-for="item in products" :key="item._id" :value="item._id">{{ item.name }} (Current: {{ item.stock }})</option>
        </select></div><div class="form-group mb-3"><label>Quantity :</label><input class="form-control" type="number" v-model="stockForm.quantity" min="1"></div></form></div><div class="modal-footer"><button class="btn btn-success" @click="saveAddStock">Update</button><button class="btn btn-secondary" data-bs-dismiss="modal">Close</button></div></div></div></div>
      </ClientOnly>

       <ClientOnly>
        <div class="modal fade" id="categoryModal" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">Manage Categories</h5><button class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><div class="input-group mb-3"><input type="text" class="form-control" placeholder="New Category" v-model="newCategoryInput" @keyup.enter="addNewCategory"><button class="btn btn-primary" @click="addNewCategory">Add</button></div><hr><ul class="list-group"><li class="list-group-item d-flex justify-content-between" v-for="(cat, index) in categoryOptions" :key="index">{{ cat }} <Icon name="feather:trash-2" class="text-danger" style="cursor: pointer;" @click="removeCategory(index)"/></li></ul></div><div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">Close</button></div></div></div></div>
      </ClientOnly>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

definePageMeta({ layout: 'seller' })

const products = ref([])

// --- Fetch Products ---
const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      products.value = []
      return
    }
    const response = await $fetch('http://localhost:3001/api/product/my-products', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    products.value = response || []
  } catch (error) {
    console.error('Error fetching products:', error)
    products.value = []
  }
}

const refresh = fetchProducts
onMounted(() => { fetchProducts() })

const categoryOptions = ref(['Electronics', 'Jewellery', 'Fashion', 'Shoes', 'Watch', 'Beauty'])

// --- Helper Functions ---
const getStockStatus = (stock) => {
  const s = parseInt(stock)
  if (s >= 100) return 'success'
  else if (s >= 25) return 'warning'
  else return 'danger'
}

// 🟢 Logic แสดงสีตามตัวเลข (0 = Free)
const getBadgeColor = (cost) => {
  const c = parseInt(cost)
  if (c === 0) return 'bg-success text-white'
  if (c <= 40) return 'bg-info text-dark'
  if (c <= 80) return 'bg-warning text-dark'
  return 'bg-danger text-white'
}

// 🟢 Logic แปลงตัวเลขเป็นข้อความ (0 -> 'Free')
const formatShippingCost = (cost) => {
  return parseInt(cost) === 0 ? 'Free' : `${cost} บ.`
}

// 🟢 Logic คำนวณ Option (Return object {value: int, text: string})
const calculateOptions = (weight) => {
  const w = parseFloat(weight) || 0
  const options = []
  
  options.push({ value: 0, text: 'Free', colorName: 'success' })
  if (w >= 1) options.push({ value: 30, text: '30 บ.', colorName: 'info' })
  if (w >= 10) options.push({ value: 60, text: '60 บ.', colorName: 'warning' })
  if (w >= 20) options.push({ value: 120, text: '120 บ.', colorName: 'danger' })
  
  return options
}

const safeCloseModal = (modalId) => {
  const modalEle = document.getElementById(modalId)
  if (modalEle) {
    const modalInstance = bootstrap.Modal.getInstance(modalEle) || new bootstrap.Modal(modalEle)
    modalInstance.hide()
  }
  document.querySelectorAll('.modal-backdrop').forEach(el => el.remove())
  document.body.classList.remove('modal-open')
  document.body.style = ''
}

// ================= ADD PRODUCT =================
const newItem = ref({ 
  name: '', stock: 0, price: 0, commission: 0, 
  weight: 0, shippingCost: 0, description: '', category: '', 
  image: '', previewImage: null, rawFile: null // 🟢 เพิ่ม rawFile
})
const availableOptionsAdd = ref([]) 

watch(() => newItem.value.weight, (newVal) => {
  const options = calculateOptions(newVal)
  availableOptionsAdd.value = options
  if (options.length > 0) {
    // Default เลือกตัวแพงสุด หรือ logic ตามต้องการ
    newItem.value.shippingCost = options[options.length - 1].value
  }
})

// 🟢 File handling function (รองรับทั้ง Add และ Edit)
const triggerFileInput = (mode) => {
    if(mode === 'add') document.getElementById('addFileInput').click()
    else document.getElementById('editFileInput').click()
}

const onFileChange = (e, mode) => {
  const file = e.target.files[0]
  if (file) {
    const preview = URL.createObjectURL(file)
    if (mode === 'add') {
        newItem.value.previewImage = preview
        newItem.value.rawFile = file // เก็บไฟล์จริง
    } else {
        editItem.value.previewImage = preview
        editItem.value.rawFile = file // เก็บไฟล์จริง
    }
  }
}

const resetNewItemForm = () => {
  newItem.value = { 
    name: '', stock: 0, price: 0, commission: 0, 
    weight: 0, shippingCost: 0, description: '', category: '', 
    image: '', previewImage: null, rawFile: null
  }
  availableOptionsAdd.value = []
  const input = document.getElementById('addFileInput')
  if(input) input.value = ''
}

const saveNewItem = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) { alert('Login required'); return }
    
    // 🟢 ใช้ FormData เพื่อส่งไฟล์
    const formData = new FormData()
    formData.append('name', newItem.value.name)
    formData.append('stock', parseInt(newItem.value.stock))
    formData.append('price', parseFloat(newItem.value.price))
    formData.append('commission', parseFloat(newItem.value.commission))
    formData.append('weight', parseFloat(newItem.value.weight))
    formData.append('shippingCost', parseInt(newItem.value.shippingCost))
    formData.append('description', newItem.value.description)
    formData.append('category', newItem.value.category)
    
    // แนบไฟล์ถ้ามี
    if (newItem.value.rawFile) {
        formData.append('file', newItem.value.rawFile)
    }

    await $fetch('http://localhost:3001/api/product', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData // Nuxt/Fetch จะจัดการ Content-Type multipart ให้อัตโนมัติ
    })
    
    await refresh()
    resetNewItemForm()
    safeCloseModal('addModal')
  } catch (error) {
    console.error(error)
    alert('Error: ' + (error.data?.message || error.message))
  }
}

// ================= EDIT PRODUCT =================
const editItem = ref({ 
  _id: null, name: '', stock: 0, price: 0, commission: 0, 
  weight: 0, shippingCost: 0, description: '', category: '', 
  image: '', previewImage: null, rawFile: null
})
const availableOptionsEdit = ref([])

function goEdit(id) {
  const found = products.value.find((x) => x._id === id)
  if (!found) return
  
  // Clone object
  editItem.value = { 
      ...found,
      shippingCost: parseInt(found.shippingCost) || 0, // แปลงให้มั่นใจว่าเป็น int
      previewImage: null,
      rawFile: null
  }
  
  availableOptionsEdit.value = calculateOptions(editItem.value.weight)
  const modalEle = document.getElementById('editModal')
  const modal = bootstrap.Modal.getInstance(modalEle) || new bootstrap.Modal(modalEle)
  modal.show()
}

watch(() => editItem.value.weight, (newVal) => {
  const options = calculateOptions(newVal)
  availableOptionsEdit.value = options
  const exists = options.find(o => o.value === editItem.value.shippingCost)
  if (!exists && options.length > 0) {
     editItem.value.shippingCost = options[options.length - 1].value
  }
})

async function saveEdit() {
  try {
    const token = localStorage.getItem('token')
    
    // 🟢 ใช้ FormData เช่นกันในหน้า Edit
    const formData = new FormData()
    formData.append('name', editItem.value.name)
    formData.append('stock', parseInt(editItem.value.stock))
    formData.append('price', parseFloat(editItem.value.price))
    formData.append('commission', parseFloat(editItem.value.commission))
    formData.append('weight', parseFloat(editItem.value.weight))
    formData.append('shippingCost', parseInt(editItem.value.shippingCost))
    formData.append('description', editItem.value.description || '')
    formData.append('category', editItem.value.category)
    
    // ถ้ามีรูปใหม่ค่อยส่ง
    if (editItem.value.rawFile) {
        formData.append('file', editItem.value.rawFile)
    }

    await $fetch(`http://localhost:3001/api/product/${editItem.value._id}`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    })

    await refresh()
    safeCloseModal('editModal')
  } catch (error) {
    alert('Error updating: ' + error.message)
  }
}

// ... Delete, Stock, Category เหมือนเดิม ...
async function deleteItem(id) {
  if (confirm('Are you sure you want to delete this product?')) {
    try {
      const token = localStorage.getItem('token')
      await $fetch(`http://localhost:3001/api/product/${id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      await refresh()
    } catch (error) {
      alert('Error deleting: ' + error.message)
    }
  }
}

const stockForm = ref({ id: '', quantity: '' })
const saveAddStock = async () => {
  const targetProduct = products.value.find(p => p._id === stockForm.value.id)
  if (targetProduct && stockForm.value.quantity > 0) {
    try {
      const newStock = parseInt(targetProduct.stock) + parseInt(stockForm.value.quantity)
      await $fetch(`http://localhost:3001/api/product/${stockForm.value.id}`, {
        method: 'PUT',
        body: { stock: newStock } // อันนี้ส่ง JSON ปกติได้ เพราะไม่ได้แก้รูป
      })
      await refresh()
      stockForm.value = { id: '', quantity: '' }
      safeCloseModal('addStockModal')
    } catch (error) { alert('Error updating stock: ' + error.message) }
  }
}

const newCategoryInput = ref('')
const addNewCategory = () => { if (newCategoryInput.value.trim() && !categoryOptions.value.includes(newCategoryInput.value.trim())) { categoryOptions.value.push(newCategoryInput.value.trim()); newCategoryInput.value = '' } }
const removeCategory = (index) => { if (confirm('Delete Category?')) categoryOptions.value.splice(index, 1) }
</script>

<style scoped>
.font-success { color: #28c76f !important; }
.font-warning { color: #ff9f43 !important; }
.font-danger { color: #ea5455 !important; }

.badge-btn { border-radius: 20px; padding: 4px 12px; font-size: 12px; transition: all 0.2s; display: flex; align-items: center; gap: 4px; }
.badge-btn:hover { transform: translateY(-1px); }
.active-badge { box-shadow: 0 0 0 2px rgba(0,0,0,0.1); font-weight: bold; }

.img-40 { width: 40px; height: 40px; object-fit: cover; border-radius: 4px; }
.upload-box { width: 100%; height: 250px; border: 2px dashed #dee2e6; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; background-color: #f8f9fa; overflow: hidden; position: relative; }
.upload-box:hover { border-color: #0d6efd; background-color: #e9ecef; }
.img-preview { width: 100%; height: 100%; object-fit: contain; }
.btn { border-radius: 6px; font-weight: 500; border: none; }
.btn-success { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; }
.btn-primary { background: linear-gradient(135deg, #0d6efd 0%, #4facfe 100%); color: white; }
</style>