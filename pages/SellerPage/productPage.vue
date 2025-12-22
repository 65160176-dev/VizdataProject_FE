<template>
  <div class="col-sm-12">
    <div class="card">

      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>Products Category</h5>

        <div>
          <button 
            type="button" 
            class="btn btn-outline-secondary me-2 shadow-sm" 
            data-bs-toggle="modal" 
            data-bs-target="#categoryModal"
          >
            <Icon name="feather:list" size="16" class="me-1" style="margin-bottom:2px;"/> 
            Category
          </button>

          <button 
            type="button" 
            class="btn btn-success me-2 shadow-sm" 
            data-bs-toggle="modal" 
            data-bs-target="#addStockModal"
          >
            <Icon name="feather:box" size="16" class="me-1" style="margin-bottom:2px;"/> 
            Add Stock
          </button>

          <button 
            type="button" 
            class="btn btn-primary shadow-sm"
            data-bs-toggle="modal"
            data-bs-target="#addModal"
          >
            <Icon name="feather:plus" size="16" class="me-1" style="margin-bottom:2px;"/>
            Add Product
          </button>
        </div>
      </div>

      <div class="card-body">
        <div class="product-physical table-responsive">
          <div class="table-responsive">
            <table class="table table-striped text-center">
              <thead class="table-light">
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Commission (%)</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in data" :key="index">
                  <td>
                    <img class="img-40 me-2" :src="item.image" alt="">
                  </td>

                  <td>{{ item.name }}</td>
                  <td>{{ item.stock }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.commission }}</td>

                  <td>
                    <i 
                      class="fa fa-circle f-12" 
                      :class="'font-' + getStockStatus(item.stock)"
                    ></i>
                  </td>

                  <td>{{ item.category }}</td>

                  <td>
                    <Icon
                      name="feather:edit"
                      style="height:20px; cursor:pointer; margin-right:8px;"
                      @click="goEdit(item.id)"
                    />

                    <Icon
                      name="feather:trash"
                      style="height:20px; cursor:pointer; color:red;"
                      @click="deleteItem(index)"
                    />
                  </td>
                </tr>
              </tbody>

            </table>
          </div>
        </div>

        <ClientOnly>
          <div class="modal fade" id="addModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg"> 
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title f-w-600">Add Product</h5>
                  <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="row">
                      <div class="col-md-5 d-flex flex-column align-items-center justify-content-center mb-3">
                        <div class="upload-box" @click="triggerFileInput">
                          <img v-if="newItem.previewImage" :src="newItem.previewImage" class="img-preview" />
                          <div v-else class="text-center text-muted">
                            <Icon name="feather:image" size="48" style="color: #ccc;" />
                            <p class="mb-0 mt-2" style="font-size: 14px;">Click to Upload Image</p>
                          </div>
                          <input type="file" ref="fileInput" class="d-none" @change="onFileChange" accept="image/*">
                        </div>
                      </div>
                      <div class="col-md-7">
                        <div class="form-group mb-3">
                          <label class="mb-1">Product Name :</label>
                          <input class="form-control" v-model="newItem.name" type="text" placeholder="Enter product name">
                        </div>
                        <div class="row">
                          <div class="col-6 form-group mb-3">
                            <label class="mb-1">Stock :</label>
                            <input class="form-control" v-model="newItem.stock" type="number" min="0">
                          </div>
                          <div class="col-6 form-group mb-3">
                            <label class="mb-1">Price :</label>
                            <input class="form-control" v-model="newItem.price" type="number" min="0">
                          </div>
                        </div>
                        <div class="form-group mb-3">
                          <label class="mb-1">Category :</label>
                          <select class="form-select" v-model="newItem.category">
                            <option disabled value="">Select Category</option>
                            <option v-for="option in categoryOptions" :key="option" :value="option">
                              {{ option }}
                            </option>
                          </select>
                        </div>
                        <div class="form-group mb-3">
                          <label class="mb-1">Commission (%) :</label>
                          <input class="form-control" v-model="newItem.commission" type="number" min="0">
                        </div>
                        <div class="form-group mb-0">
                          <label class="mb-1">Description :</label>
                          <textarea class="form-control" rows="2"></textarea>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-primary" type="button" @click="saveNewItem">Save</button>
                  <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>

        <ClientOnly>
          <div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title f-w-600">Edit Product</h5>
                  <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="form-group mb-3">
                      <label class="mb-1">Product Name :</label>
                      <input class="form-control" v-model="editItem.name" type="text">
                    </div>
                    <div class="form-group mb-3">
                      <label class="mb-1">Stock :</label>
                      <input class="form-control" v-model="editItem.stock" type="number" min="0">
                    </div>
                    <div class="form-group mb-3">
                      <label class="mb-1">Category :</label>
                      <select class="form-select" v-model="editItem.category">
                        <option v-for="option in categoryOptions" :key="option" :value="option">
                          {{ option }}
                        </option>
                      </select>
                    </div>
                    <div class="form-group mb-3">
                      <label class="mb-1">Price :</label>
                      <input class="form-control" v-model="editItem.price" type="number" min="0">
                    </div>
                    <div class="form-group mb-3">
                      <label class="mb-1">Commission (%) :</label>
                      <input class="form-control" v-model="editItem.commission" type="number" min="0">
                    </div>
                    <div class="form-group mb-3">
                      <label class="mb-1">Product Image URL :</label>
                      <input class="form-control" v-model="editItem.image" type="text">
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-primary" type="button" @click="saveEdit">Save Changes</button>
                  <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>

        <ClientOnly>
          <div class="modal fade" id="addStockModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title f-w-600">Add Stock (Quick Update)</h5>
                  <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="form-group mb-3">
                      <label class="mb-1">Select Product :</label>
                      <select class="form-select" v-model="stockForm.id">
                        <option disabled value="">Select a product...</option>
                        <option v-for="item in data" :key="item.id" :value="item.id">
                          {{ item.name }} (Current: {{ item.stock }})
                        </option>
                      </select>
                    </div>
                    <div class="form-group mb-3">
                      <label class="mb-1">Quantity to Add :</label>
                      <input class="form-control" type="number" v-model="stockForm.quantity" min="1" placeholder="Enter amount to add">
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-success" type="button" @click="saveAddStock">Update Stock</button>
                  <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>

        <ClientOnly>
          <div class="modal fade" id="categoryModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title f-w-600">Manage Categories</h5>
                  <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                  <div class="input-group mb-3">
                    <input 
                      type="text" 
                      class="form-control" 
                      placeholder="New Category Name" 
                      v-model="newCategoryInput"
                      @keyup.enter="addNewCategory"
                    >
                    <button class="btn btn-primary" type="button" @click="addNewCategory">Add</button>
                  </div>
                  <hr>
                  <h6 class="mb-2">Current Categories:</h6>
                  <ul class="list-group">
                    <li 
                      class="list-group-item d-flex justify-content-between align-items-center"
                      v-for="(cat, index) in categoryOptions" 
                      :key="index"
                    >
                      {{ cat }}
                      <Icon 
                        name="feather:trash-2" 
                        class="text-danger" 
                        style="cursor: pointer; width: 18px; height: 18px;"
                        @click="removeCategory(index)"
                      />
                    </li>
                  </ul>
                </div>
                <div class="modal-footer">
                  <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </ClientOnly>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import productcategory from '~/data/productcategory.json' 
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

definePageMeta({ layout: 'seller' })

// Data Initialization
const data = ref(productcategory.data)

const categoryOptions = ref([
  'Electronics', 'Jewellery', 'Fashion', 'Shoes', 'Watch', 'Beauty'
])

// --- Status Logic (NEW) ---
// ฟังก์ชันเช็คสต็อกและคืนค่า class สี
const getStockStatus = (stock) => {
  const s = parseInt(stock)
  if (s >= 100) {
    return 'success' // สีเขียว
  } else if (s >= 25) {
    return 'warning' // สีส้ม
  } else {
    return 'danger'  // สีแดง
  }
}

// --- Category Logic ---
const newCategoryInput = ref('')

const addNewCategory = () => {
  if (newCategoryInput.value.trim() !== '') {
    if (!categoryOptions.value.includes(newCategoryInput.value.trim())) {
      categoryOptions.value.push(newCategoryInput.value.trim())
      newCategoryInput.value = '' 
    } else {
      alert('This category already exists!')
    }
  }
}

const removeCategory = (index) => {
  if (confirm('Delete this category?')) {
    categoryOptions.value.splice(index, 1)
  }
}

// --- Add Product Logic ---
const newItem = ref({
  name: '', stock: '', price: '', commission: '', category: '', image: '', previewImage: null 
})
const fileInput = ref(null)

const triggerFileInput = () => fileInput.value.click()

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    newItem.value.previewImage = URL.createObjectURL(file)
    newItem.value.image = newItem.value.previewImage 
  }
}

const saveNewItem = () => {
  const newId = data.value.length > 0 ? Math.max(...data.value.map(i => i.id)) + 1 : 1
  data.value.push({
    id: newId,
    name: newItem.value.name,
    stock: newItem.value.stock,
    price: newItem.value.price,
    commission: newItem.value.commission,
    category: newItem.value.category,
    status: 'success', // ค่าเริ่มต้น (แต่มันจะถูกทับด้วยการคำนวณจริงในหน้าจอ)
    image: newItem.value.image || '/images/dashboard/product/1.png'
  })
  newItem.value = { name: '', stock: '', price: '', commission: '', category: '', image: '', previewImage: null }
  
  const modalEle = document.getElementById('addModal')
  const modal = bootstrap.Modal.getInstance(modalEle) || new bootstrap.Modal(modalEle)
  modal.hide()
}

// --- Edit Logic ---
const editItem = ref({ id: null, name: '', stock: '', price: '', commission: '', category: '', status: '', image: '' })

function goEdit(id) {
  const found = data.value.find((x) => x.id === id)
  if (!found) return
  editItem.value = { ...found }
  const modal = new bootstrap.Modal(document.getElementById('editModal'))
  modal.show()
}

function saveEdit() {
  const index = data.value.findIndex((x) => x.id === editItem.value.id)
  if (index !== -1) {
    data.value[index] = { ...editItem.value }
  }
  const modal = bootstrap.Modal.getInstance(document.getElementById('editModal'))
  modal.hide()
}

const deleteItem = (index) => {
  if (confirm('คุณต้องการลบรายการนี้หรือไม่ ?')) {
    data.value.splice(index, 1)
  }
}

// --- Add Stock Logic ---
const stockForm = ref({ id: '', quantity: '' })

const saveAddStock = () => {
  const targetProduct = data.value.find(p => p.id === stockForm.value.id)
  
  if (targetProduct && stockForm.value.quantity > 0) {
    targetProduct.stock = parseInt(targetProduct.stock) + parseInt(stockForm.value.quantity)
    stockForm.value = { id: '', quantity: '' }
    const modalEle = document.getElementById('addStockModal')
    const modal = bootstrap.Modal.getInstance(modalEle) || new bootstrap.Modal(modalEle)
    modal.hide()
  } else {
    alert('Please select a product and enter a valid quantity.')
  }
}
</script>

<style scoped>
/* กำหนดสีของวงกลมสถานะ */
.font-success {
  color: #28c76f !important; /* สีเขียว */
}
.font-warning {
  color: #ff9f43 !important; /* สีส้ม */
}
.font-danger {
  color: #ea5455 !important; /* สีแดง */
}

/* --- CSS เดิม --- */
.img-40 {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.upload-box {
  width: 100%;
  height: 250px;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: #f8f9fa;
  overflow: hidden;
  position: relative;
  transition: all 0.2s ease-in-out;
}

.upload-box:hover {
  border-color: #0d6efd;
  background-color: #e9ecef;
}

.img-preview {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: #fff;
}

/* Button Styling */
.btn {
  border-radius: 6px; 
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

.btn-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
  color: white;
}

.btn-primary {
  background: linear-gradient(135deg, #0d6efd 0%, #4facfe 100%);
  color: white;
}

.btn-outline-secondary {
  border: 1px solid #6c757d;
  color: #555;
  background: transparent;
}

.btn-outline-secondary:hover {
  background-color: #6c757d;
  color: white;
  transform: translateY(-2px);
}
</style>