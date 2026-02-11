<template>
  <div class="col-sm-12">
    <div class="card shadow-sm border-0 overflow-hidden">
      
      <div class="card-header d-flex justify-content-between align-items-center py-3 bg-gradient-orange text-white">
        <h5 class="fw-bold mb-0 text-white" style="text-shadow: 0 1px 2px rgba(0,0,0,0.1);">
          Products Management 📦
        </h5>
        
        <div>
          <button type="button" class="btn btn-success me-2 shadow-sm border border-white" data-bs-toggle="modal" data-bs-target="#categoryModal">
            <Icon name="feather:list" size="16" class="me-1" style="margin-bottom:2px;"/> Category
          </button>
          
          <button type="button" class="btn btn-info text-white me-2 shadow-sm border border-white" data-bs-toggle="modal" data-bs-target="#addStockModal" @click="resetStockForm">
            <Icon name="feather:box" size="16" class="me-1" style="margin-bottom:2px;"/> Add Stock
          </button>
          
          <button type="button" class="btn btn-light text-orange fw-bold shadow-sm" data-bs-toggle="modal" data-bs-target="#addModal">
            <Icon name="feather:plus" size="16" class="me-1" style="margin-bottom:2px;"/> Add Product
          </button>
        </div>
      </div>

      <div class="card-body p-0">
        <div class="product-physical table-responsive">
          <table class="table table-hover text-center align-middle mb-0">
            <thead class="bg-light text-secondary">
              <tr>
                <th class="border-0 py-3 ps-4">Image</th>
                <th class="border-0 py-3 text-start">Name</th>
                <th class="border-0 py-3">Stock</th>
                <th class="border-0 py-3">Price</th>
                <th class="border-0 py-3">Commission (%)</th>
                <th class="border-0 py-3">Weight (kg)</th>
                <th class="border-0 py-3">Shipping Option</th>
                <th class="border-0 py-3">Status</th>
                <th class="border-0 py-3">Category</th>
                <th class="border-0 py-3 pe-4">Actions</th>
              </tr>
            </thead>
            
            <tbody v-if="products && products.length > 0">
              <tr v-for="item in products" :key="item._id" class="border-bottom">
                <td class="ps-4"><img class="img-40 me-2 shadow-sm" :src="item.image || 'https://placehold.co/400'" style="border-radius:8px;"></td>
                <td class="fw-bold text-dark text-start">{{ item.name }}</td>
                <td>
                  <span class="badge bg-light text-dark border fw-normal px-2 py-1">{{ item.stock }}</span>
                </td>
                <td class="text-orange fw-bold">{{ item.price }}</td>
                <td><span class="badge bg-success-subtle text-success border fw-normal px-2 py-1">{{ item.commission }}%</span></td>
                <td>{{ item.weight || 0 }}</td>
                <td>
                  <span class="badge border" :class="getBadgeColor(item.shippingCost)" style="font-weight: 500; font-size: 11px; padding: 6px 12px; border-radius: 6px;">
                    {{ formatShippingCost(item.shippingCost) }}
                  </span>
                </td>
                <td><i class="fa fa-circle f-10" :class="'font-' + getStockStatus(item.stock)"></i></td>
                <td><span class="badge bg-orange-subtle text-orange border-0 px-3 py-2" style="border-radius: 20px;">{{ item.category }}</span></td>
                <td class="pe-4">
                  <button class="btn btn-sm btn-light text-secondary me-1" @click="goEdit(item._id)" title="Edit"><Icon name="feather:edit-2" size="16"/></button>
                  <button class="btn btn-sm btn-light text-danger" @click="deleteItem(item._id)" title="Delete"><Icon name="feather:trash-2" size="16"/></button>
                </td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr><td colspan="10" class="text-center py-5 text-muted">No products found.</td></tr>
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
        <div id="errorToast" class="toast align-items-center text-white bg-danger border-0 shadow-lg" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div class="toast-body d-flex align-items-center">
              <Icon name="feather:alert-circle" size="20" class="me-2" />
              {{ errorMessage }}
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
                <h5 class="modal-title fw-bold text-orange">จัดการหมวดหมู่สินค้า</h5>
                <button class="btn-close" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body py-4">
                
                <div class="d-flex justify-content-between align-items-center mb-2">
                   <p class="text-muted small mb-0">หมวดหมู่ที่คุณเลือกใช้งาน:</p>
                   <button class="btn btn-sm btn-link text-decoration-none p-0 fw-bold text-orange" @click="showAllCategories = !showAllCategories" style="font-size: 13px;">
                     {{ showAllCategories ? 'ซ่อนหมวดหมู่ที่ไม่ใช้' : '+ แสดงหมวดหมู่ทั้งหมด' }}
                   </button>
                </div>

                <div class="category-list-wrapper border rounded-3 p-2 bg-light mb-4" style="max-height: 300px; overflow-y: auto;">
                  
                  <div v-if="displayModalCategories.length === 0" class="text-center text-muted py-5 small">
                      <Icon name="feather:inbox" size="32" class="mb-2 opacity-50"/>
                      <br>ยังไม่มีหมวดหมู่ที่เลือก
                      <br><span class="text-orange cursor-pointer" @click="showAllCategories = true">กดเพื่อเลือกหมวดหมู่จากระบบ</span>
                  </div>

                  <div v-for="cat in displayModalCategories" :key="cat.id" 
                       class="form-check p-3 mb-2 bg-white rounded-3 shadow-sm d-flex justify-content-between align-items-center transition-all"
                       :class="{'border-orange': cat.isSelected}">
                    
                    <div class="d-flex align-items-center w-100" style="cursor: pointer;" @click="toggleCategory(cat)">
                      <input class="form-check-input me-3 ms-0 mt-0" type="checkbox" :checked="cat.isSelected" style="pointer-events: none;">
                      <label class="form-check-label fw-bold mb-0 text-dark" style="cursor: pointer;">{{ cat.name }}</label>
                    </div>
                    
                    <Icon v-if="!cat.isSystem" name="feather:trash-2" class="text-danger ms-2" style="cursor: pointer;" @click.stop="openConfirmDelete(cat)" title="ลบถาวร" />
                  </div>

                </div>

                <div class="mt-4">
                  <label class="form-label small fw-bold">สร้างหมวดหมู่ใหม่:</label>
                  <div class="input-group">
                    <input type="text" class="form-control rounded-start-pill ps-3 border-orange-focus" placeholder="ชื่อหมวดหมู่..." v-model="newCategoryInput" @keyup.enter="addNewCategoryToSystem">
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
                <h5 class="fw-bold">ลบหมวดหมู่ถาวร?</h5>
                <p class="text-muted small">หมวดหมู่ "{{ categoryToDelete?.name }}" จะหายไปจากระบบถาวร</p>
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
              <div class="modal-header border-0 shadow-sm">
                <h5 class="modal-title fw-bold text-orange">Add Product</h5>
                <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body py-4">
                <form>
                  <div class="row">
                    <div class="col-md-5 d-flex flex-column align-items-center justify-content-center mb-3">
                      <div class="upload-box" @click="triggerFileInput('add')">
                        <img v-if="newItem.previewImage" :src="newItem.previewImage" class="img-preview" />
                        <div v-else class="text-center text-muted">
                          <Icon name="feather:image" size="48" class="text-orange-subtle"/>
                          <p class="mb-0 mt-2 small">Click to Upload</p>
                        </div>
                        <input type="file" id="addFileInput" class="d-none" @change="(e) => onFileChange(e, 'add')" accept="image/*">
                      </div>
                    </div>
                    <div class="col-md-7">
                      <div class="form-group mb-3"><label class="small fw-bold">Product Name :</label><input class="form-control" v-model="newItem.name" type="text"></div>
                      <div class="row">
                        <div class="col-6 form-group mb-3">
                            <label class="small fw-bold">Stock :</label>
                            <input class="form-control" v-model="newItem.stock" type="number" min="0" @keydown="preventNegativeInput" @input="newItem.stock < 0 ? newItem.stock = 0 : null">
                        </div>
                        <div class="col-6 form-group mb-3">
                            <label class="small fw-bold">Price :</label>
                            <input class="form-control" v-model="newItem.price" type="number" min="1" @keydown="preventNegativeInput">
                        </div>
                      </div>

                      <div class="row">
                        <div class="col-6 form-group mb-3">
                            <label class="small fw-bold">Commission (%) :</label>
                            <input class="form-control" v-model="newItem.commission" type="number" min="0.1" step="0.1" @keydown="preventNegativeInput">
                        </div>
                        <div class="col-6 form-group mb-3">
                          <label class="text-orange fw-bold small">Weight (kg) :</label>
                          <input class="form-control border-orange" v-model="newItem.weight" type="number" min="0" step="0.1" @keydown="preventNegativeInput">
                          
                          <div class="mt-2" v-if="newItem.weight >= 0">
                             <small class="text-muted w-100 mb-1 d-block" style="font-size: 11px;">Select Shipping Cost:</small>
                             <div class="d-flex flex-wrap gap-2">
                               <button v-for="(option, index) in availableOptionsAdd" :key="index" type="button" class="btn btn-sm badge-btn" 
                                  :class="[newItem.shippingCost === option.value ? 'btn-' + option.colorName + ' active-badge' : 'btn-outline-' + option.colorName]" 
                                  @click="newItem.shippingCost = option.value">
                                  {{ option.text }}
                                  <Icon v-if="newItem.shippingCost === option.value" name="feather:check" size="12" />
                               </button>
                             </div>
                          </div>
                        </div>
                      </div>
                      
                      <div class="form-group mb-3"><label class="small fw-bold">Category :</label>
                        <select class="form-select" v-model="newItem.category">
                          <option disabled value="">Select Category</option>
                          <option v-for="cat in activeCategories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                        </select>
                          <div v-if="activeCategories.length === 0" class="text-danger small mt-1">* กรุณาไปเลือกหมวดหมู่ที่ปุ่ม Category ก่อน</div>
                      </div>

                      <div class="form-group mb-0"><label class="small fw-bold">Description :</label><textarea class="form-control" rows="3" v-model="newItem.description"></textarea></div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer border-0">
                <button class="btn btn-primary px-4 shadow-sm" @click="saveNewItem">Save</button>
                <button class="btn btn-light px-4 shadow-sm text-secondary" data-bs-dismiss="modal" @click="resetNewItemForm">Close</button>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>

      <ClientOnly>
        <div class="modal fade" id="editModal" tabindex="-1">
          <div class="modal-dialog modal-lg border-0">
            <div class="modal-content border-0 shadow">
              <div class="modal-header border-0 shadow-sm">
                <h5 class="modal-title fw-bold text-orange">Edit Product</h5>
                <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
              </div>
              <div class="modal-body py-4">
                <form>
                  <div class="row">
                    <div class="col-md-5 d-flex flex-column align-items-center justify-content-center mb-3">
                      <div class="upload-box" @click="triggerFileInput('edit')">
                        <img v-if="editItem.previewImage" :src="editItem.previewImage" class="img-preview" />
                        <img v-else-if="editItem.image" :src="editItem.image" class="img-preview" />
                        <div v-else class="text-center text-muted"><Icon name="feather:image" size="48" class="text-orange-subtle"/></div>
                        <input type="file" id="editFileInput" class="d-none" @change="(e) => onFileChange(e, 'edit')" accept="image/*">
                      </div>
                    </div>
                    <div class="col-md-7">
                        <div class="form-group mb-3"><label class="small fw-bold">Product Name :</label><input class="form-control" v-model="editItem.name"></div>
                        <div class="row">
                          <div class="col-6 form-group mb-3">
                              <label class="small fw-bold">Stock :</label>
                              <input class="form-control" v-model="editItem.stock" type="number" min="0" @keydown="preventNegativeInput" @input="editItem.stock < 0 ? editItem.stock = 0 : null">
                          </div>
                          <div class="col-6 form-group mb-3">
                              <label class="small fw-bold">Price :</label>
                              <input class="form-control" v-model="editItem.price" type="number" min="1" @keydown="preventNegativeInput">
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-6 form-group mb-3">
                              <label class="small fw-bold">Commission (%) :</label>
                              <input class="form-control" v-model="editItem.commission" type="number" min="0.1" step="0.1" @keydown="preventNegativeInput">
                          </div>
                          <div class="col-6 form-group mb-3">
                            <label class="text-orange fw-bold small">Weight (kg) :</label>
                            <input class="form-control border-orange" v-model="editItem.weight" type="number" min="0" step="0.1" @keydown="preventNegativeInput">
                            
                            <div class="mt-2" v-if="editItem.weight >= 0">
                                <small class="text-muted w-100 mb-1 d-block" style="font-size: 11px;">Select Shipping Cost:</small>
                                <div class="d-flex flex-wrap gap-2">
                                  <button v-for="(option, index) in availableOptionsEdit" :key="index" type="button" class="btn btn-sm badge-btn" 
                                     :class="[editItem.shippingCost === option.value ? 'btn-' + option.colorName + ' active-badge' : 'btn-outline-' + option.colorName]" 
                                     @click="editItem.shippingCost = option.value">
                                     {{ option.text }}
                                     <Icon v-if="editItem.shippingCost === option.value" name="feather:check" size="12" />
                                   </button>
                                </div>
                            </div>
                          </div>
                        </div>

                        <div class="form-group mb-3"><label class="small fw-bold">Category :</label>
                          <select class="form-select" v-model="editItem.category">
                            <option v-for="cat in activeCategories" :key="cat.id" :value="cat.name">{{ cat.name }}</option>
                          </select>
                        </div>
                        <div class="form-group mb-3"><label class="small fw-bold">Description :</label><textarea class="form-control" rows="3" v-model="editItem.description"></textarea></div>
                    </div>
                  </div>
                </form>
              </div>
              <div class="modal-footer border-0">
                <button class="btn btn-primary px-4 shadow-sm" @click="saveEdit">Save Changes</button>
                <button class="btn btn-light px-4 shadow-sm text-secondary" data-bs-dismiss="modal">Close</button>
              </div>
            </div>
          </div>
        </div>
      </ClientOnly>

       <ClientOnly>
        <div class="modal fade" id="addStockModal" tabindex="-1">
          <div class="modal-dialog border-0">
            <div class="modal-content border-0 shadow">
              <div class="modal-header border-0">
                <h5 class="modal-title fw-bold text-info">Add Stock</h5>
                <button class="btn-close" type="button" data-bs-dismiss="modal" @click="resetStockForm"></button>
              </div>
              <div class="modal-body py-4">
                <form>
                  <div class="form-group mb-3">
                    <label class="small fw-bold text-muted">Filter by Category :</label>
                    <select class="form-select shadow-none border-secondary-subtle" v-model="stockCategoryFilter">
                      <option value="">All Categories</option>
                      <option v-for="catName in activeProductCategories" :key="catName" :value="catName">{{ catName }}</option>
                    </select>
                  </div>

                  <div class="form-group mb-3">
                    <label class="small fw-bold">Select Product :</label>
                    <select class="form-select shadow-none mb-2" v-model="stockForm.id" :disabled="filteredStockProducts.length === 0">
                      <option disabled value="">
                        {{ filteredStockProducts.length === 0 ? 'No products in this category' : 'Select Product...' }}
                      </option>
                      <option v-for="item in filteredStockProducts" :key="item._id" :value="item._id">
                        {{ item.name }}
                      </option>
                    </select>

                    <div v-if="selectedStockProduct" class="d-flex align-items-center p-2 border rounded-3 bg-white shadow-sm mt-2 transition-all">
                      <img :src="selectedStockProduct.image || 'https://placehold.co/400'" class="rounded-3 shadow-sm border" style="width: 50px; height: 50px; object-fit: cover;">
                      <div class="ms-3">
                        <div class="fw-bold text-dark mb-1" style="font-size: 14px; line-height: 1.2;">{{ selectedStockProduct.name }}</div>
                        <div class="small text-muted">
                          Current Stock: <span class="badge bg-light text-dark border">{{ selectedStockProduct.stock }}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="form-group mb-3 mt-4">
                      <label class="small fw-bold">Quantity to Add :</label>
                      <input class="form-control shadow-none" type="number" v-model="stockForm.quantity" min="1" placeholder="Enter quantity..." @keydown="preventNegativeInput" @input="stockForm.quantity < 1 ? stockForm.quantity = 1 : null">
                  </div>
                </form>
              </div>
              <div class="modal-footer border-0">
                <button class="btn btn-info text-white px-4" @click="saveAddStock" :disabled="!stockForm.id || !stockForm.quantity">Update Stock</button>
                <button class="btn btn-light px-4 shadow-sm text-secondary" data-bs-dismiss="modal" @click="resetStockForm">Close</button>
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
const allCategories = ref([])
const categoryToDelete = ref(null)

const preventNegativeInput = (e) => {
  if (['-', 'e', '+'].includes(e.key)) {
    e.preventDefault()
  }
}

const showAllCategories = ref(false)

const activeCategories = computed(() => {
  return allCategories.value.filter(cat => cat.isSelected)
})

const displayModalCategories = computed(() => {
  let list = allCategories.value
  if (!showAllCategories.value) {
     list = list.filter(cat => cat.isSelected)
  }
  return [...list].sort((a, b) => {
    if (a.isSelected !== b.isSelected) return b.isSelected ? 1 : -1;
    if (a.isSystem !== b.isSystem) return a.isSystem ? 1 : -1;
    return a.name.localeCompare(b.name);
  })
})

const toastMessage = ref('')
const errorMessage = ref('')

const showToast = (message) => {
  toastMessage.value = message
  const toastEl = document.getElementById('liveToast')
  if(toastEl) new bootstrap.Toast(toastEl).show()
}

const showError = (message) => {
  errorMessage.value = message
  const toastEl = document.getElementById('errorToast')
  if(toastEl) new bootstrap.Toast(toastEl).show()
}

const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('token')
    const res = await $fetch('http://localhost:3001/api/category', { 
       headers: { 'Authorization': `Bearer ${token}` } 
    })
    if (res) allCategories.value = res 
  } catch (e) { console.error('Error fetching categories:', e) }
}

const checkIsCategoryUsed = (categoryName) => {
  const found = products.value.find(p => p.category === categoryName)
  return !!found 
}

const toggleCategory = async (cat) => {
  const token = localStorage.getItem('token')
  if (cat.isSelected) {
    if (checkIsCategoryUsed(cat.name)) {
      showError(`ไม่สามารถซ่อนหมวดหมู่ "${cat.name}" ได้ เนื่องจากยังมีสินค้าในหมวดหมู่นี้`)
      return 
    }
    cat.isSelected = false 
    try {
      await $fetch(`http://localhost:3001/api/category/${cat.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
    } catch (e) { cat.isSelected = true; showError('เกิดข้อผิดพลาดในการยกเลิกหมวดหมู่') }
  } else {
    cat.isSelected = true
    try {
      await $fetch('http://localhost:3001/api/category', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: { name: cat.name } })
      if(!cat.isSystem) fetchCategories() 
    } catch (e) { cat.isSelected = false; showError('ไม่สามารถเลือกหมวดหมู่นี้ได้') }
  }
}

const addNewCategoryToSystem = async () => {
  const trimmed = newCategoryInput.value?.trim()
  if (!trimmed) return
  const existing = allCategories.value.find(c => c.name === trimmed)
  if (existing) {
     if (!existing.isSelected) { toggleCategory(existing); newCategoryInput.value = ''; showToast('เพิ่มหมวดหมู่เรียบร้อย'); return }
     showError('หมวดหมู่นี้มีอยู่แล้ว'); return
  }
  try {
    const token = localStorage.getItem('token')
    await $fetch('http://localhost:3001/api/category', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: { name: trimmed } })
    showToast('สร้างหมวดหมู่ใหม่สำเร็จ'); newCategoryInput.value = ''; fetchCategories() 
  } catch (e) { console.error(e); showError(e.data?.message || 'สร้างหมวดหมู่ไม่สำเร็จ') }
}

const openConfirmDelete = (catObj) => {
  if (catObj.isSystem) return
  if (checkIsCategoryUsed(catObj.name)) {
      showError(`ไม่สามารถลบหมวดหมู่ "${catObj.name}" ได้ เนื่องจากยังมีสินค้าอยู่`)
      return 
  }
  categoryToDelete.value = catObj
  new bootstrap.Modal(document.getElementById('confirmDeleteModal')).show()
}

const executeDeleteCategory = async () => {
  const item = categoryToDelete.value
  if (!item) return
  const modalInstance = bootstrap.Modal.getInstance(document.getElementById('confirmDeleteModal'))
  const token = localStorage.getItem('token')
  try {
    await $fetch(`http://localhost:3001/api/category/${item.id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
    allCategories.value = allCategories.value.filter(c => c.id !== item.id)
    showToast('ลบหมวดหมู่ถาวรเรียบร้อย')
  } catch (e) { console.error(e); showError(e.data?.message || 'ลบไม่สำเร็จ') }
  if (modalInstance) modalInstance.hide()
}

const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('token')
    if (!token) return
    const res = await $fetch('http://localhost:3001/api/product/my-products', { headers: { 'Authorization': `Bearer ${token}` } })
    products.value = res || []
  } catch (e) { console.error(e) }
}

onMounted(() => {
  fetchProducts()
  fetchCategories()
})

const refresh = fetchProducts

const getStockStatus = (s) => (s >= 100 ? 'success' : s >= 25 ? 'warning' : 'danger')

const getBadgeColor = (c) => {
  const cost = parseInt(c)
  if (cost === 0) return 'bg-ship-0-light'
  if (cost <= 40) return 'bg-ship-30-light'
  if (cost <= 80) return 'bg-ship-60-light'
  return 'bg-ship-120-light'
}

const formatShippingCost = (c) => (parseInt(c) === 0 ? 'Free' : `${c} บ.`)

const calculateOptions = (w) => {
  const weight = parseFloat(w) || 0
  const options = [{ value: 0, text: 'Free', colorName: 'ship-0' }]
  if (weight >= 1) options.push({ value: 30, text: '30 บ.', colorName: 'ship-30' })
  if (weight >= 10) options.push({ value: 60, text: '60 บ.', colorName: 'ship-60' })
  if (weight >= 20) options.push({ value: 120, text: '120 บ.', colorName: 'ship-120' })
  return options
}

const triggerFileInput = (m) => document.getElementById(`${m}FileInput`).click()
const onFileChange = (e, m) => {
  const f = e.target.files[0]
  if (f) {
    const p = URL.createObjectURL(f)
    if (m === 'add') { newItem.value.previewImage = p; newItem.value.rawFile = f }
    else { editItem.value.previewImage = p; editItem.value.rawFile = f }
  }
}

const newItem = ref({ name: '', stock: 0, price: 0, commission: 0, weight: 0, shippingCost: 0, category: '', description: '', previewImage: null, rawFile: null })
const editItem = ref({ _id: null, name: '', stock: 0, price: 0, commission: 0, weight: 0, shippingCost: 0, category: '', description: '', previewImage: null, rawFile: null })

const availableOptionsAdd = ref([])
const availableOptionsEdit = ref([])

watch(() => newItem.value.weight, (v) => {
  availableOptionsAdd.value = calculateOptions(v)
  if (availableOptionsAdd.value.length > 0) newItem.value.shippingCost = availableOptionsAdd.value[availableOptionsAdd.value.length - 1].value
})

watch(() => editItem.value.weight, (v) => {
  availableOptionsEdit.value = calculateOptions(v)
})

// ✅ วิธีที่ชัวร์ที่สุด: สั่งจำลองการคลิกที่ปุ่มกากบาทของ Modal นั้นๆ เลย
// เพื่อให้ Bootstrap รันกระบวนการทำลายหน้าจอเทาของมันเอง 100%
const safeCloseModal = (id) => {
  const modalEl = document.getElementById(id)
  if (modalEl) {
    const closeBtn = modalEl.querySelector('[data-bs-dismiss="modal"]')
    if (closeBtn) {
      closeBtn.click()
    } else {
      // แผนสำรอง เผื่อหาปุ่มไม่เจอ
      const modalInstance = bootstrap.Modal.getInstance(modalEl)
      if (modalInstance) modalInstance.hide()
    }
  }
  
  // กวาดล้างเผื่อเหนียวอีกชั้น
  setTimeout(() => {
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove())
    document.body.classList.remove('modal-open')
    document.body.style.overflow = ''
    document.body.style.paddingRight = ''
  }, 300)
}

const resetNewItemForm = () => { newItem.value = { name: '', stock: 0, price: 0, commission: 0, weight: 0, shippingCost: 0, category: '', description: '', previewImage: null, rawFile: null } }

const saveNewItem = async () => {
  if (!newItem.value.category) { showError('กรุณาเลือกหมวดหมู่'); return; }
  if (newItem.value.stock < 0) newItem.value.stock = 0;

  const token = localStorage.getItem('token')
  const fd = new FormData()
  fd.append('name', newItem.value.name); 
  fd.append('stock', newItem.value.stock); 
  fd.append('price', newItem.value.price); 
  fd.append('commission', newItem.value.commission); 
  fd.append('weight', newItem.value.weight); 
  fd.append('shippingCost', newItem.value.shippingCost); 
  fd.append('description', newItem.value.description); 
  fd.append('category', newItem.value.category)
  if (newItem.value.rawFile) fd.append('file', newItem.value.rawFile)
  
  try {
    await $fetch('http://localhost:3001/api/product', { method: 'POST', headers: { 'Authorization': `Bearer ${token}` }, body: fd })
    showToast('เพิ่มสินค้าใหม่เรียบร้อยแล้ว')
    refresh(); resetNewItemForm(); safeCloseModal('addModal')
  } catch(e) { console.error(e); showError('เพิ่มสินค้าไม่สำเร็จ'); }
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
  if (editItem.value.stock < 0) editItem.value.stock = 0;

  const token = localStorage.getItem('token')
  const fd = new FormData()
  fd.append('name', editItem.value.name); 
  fd.append('stock', editItem.value.stock); 
  fd.append('price', editItem.value.price); 
  fd.append('commission', editItem.value.commission); 
  fd.append('weight', editItem.value.weight); 
  fd.append('shippingCost', editItem.value.shippingCost);
  fd.append('category', editItem.value.category); 
  fd.append('description', editItem.value.description)
  if (editItem.value.rawFile) fd.append('file', editItem.value.rawFile)
  
  try {
    await $fetch(`http://localhost:3001/api/product/${editItem.value._id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: fd })
    showToast('แก้ไขข้อมูลสินค้าเรียบร้อยแล้ว')
    refresh(); safeCloseModal('editModal')
  } catch(e) { console.error(e); showError('แก้ไขไม่สำเร็จ'); }
}

async function deleteItem(id) {
  if (confirm('ลบสินค้า?')) {
    const token = localStorage.getItem('token')
    await $fetch(`http://localhost:3001/api/product/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } })
    showToast('ลบสินค้าเรียบร้อยแล้ว')
    refresh()
  }
}

const stockForm = ref({ id: '', quantity: '' })
const stockCategoryFilter = ref('')

const selectedStockProduct = computed(() => {
  if (!stockForm.value.id) return null
  return products.value.find(p => p._id === stockForm.value.id)
})

const activeProductCategories = computed(() => {
  const used = products.value.map(p => p.category).filter(c => c)
  return [...new Set(used)].sort()
})

const filteredStockProducts = computed(() => {
  if (!stockCategoryFilter.value) { return products.value }
  return products.value.filter(p => p.category === stockCategoryFilter.value)
})

watch(stockCategoryFilter, () => { stockForm.value.id = '' })

const resetStockForm = () => {
  stockCategoryFilter.value = ''
  stockForm.value.id = ''
  stockForm.value.quantity = ''
}

// ✅ อัปเดตการลำดับเหตุการณ์ ล้างก่อน ปิดตาม แล้วค่อยดึงข้อมูล
async function saveAddStock() {
  const t = products.value.find(p => p._id === stockForm.value.id)
  if (t) {
    const qtyToAdd = parseInt(stockForm.value.quantity)
    if (isNaN(qtyToAdd) || qtyToAdd <= 0) {
        showError('กรุณาระบุจำนวนที่ถูกต้อง (ต้องมากกว่า 0)');
        return;
    }

    const n = parseInt(t.stock) + qtyToAdd
    const token = localStorage.getItem('token')
    const fd = new FormData(); fd.append('stock', n)
    
    try {
      await $fetch(`http://localhost:3001/api/product/${t._id}`, { method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: fd })
      showToast('เพิ่มสต็อกเรียบร้อยแล้ว')
      
      // ดึงข้อมูลตารางใหม่
      refresh()
      
      // สั่งปิดด้วยการกระตุ้นปุ่มปิด
      safeCloseModal('addStockModal')
      
      // ล้างค่าในฟอร์มทิ้ง
      resetStockForm() 
      
    } catch(e) {
      console.error(e)
      showError('เพิ่มสต็อกไม่สำเร็จ')
    }
  }
}
</script>

<style scoped>
/* 🟠 Orange Gradient Header */
.bg-gradient-orange {
  background: linear-gradient(135deg, #ff9f43 0%, #fd7e14 100%);
  border-bottom: 1px solid #e67e22;
}

/* 🟠 Orange Theme Variables & Overrides */
:deep(.text-orange) { color: #fd7e14 !important; }
:deep(.text-orange-subtle) { color: #fcc495; }
:deep(.bg-orange-subtle) { background-color: #fff4e6 !important; }
:deep(.border-orange) { border-color: #fd7e14 !important; }
:deep(.border-orange-focus:focus) { border-color: #fd7e14 !important; box-shadow: 0 0 0 0.25rem rgba(253, 126, 20, 0.25); }

.btn-primary { 
  background-color: #fd7e14 !important; 
  border-color: #fd7e14 !important; 
  color: white !important; 
  font-weight: 500;
}
.btn-primary:hover { 
  background-color: #e36a0d !important; 
  border-color: #e36a0d !important; 
}

.img-40 { width: 40px; height: 40px; object-fit: cover; }
.upload-box { width: 100%; height: 220px; border: 2px dashed #fcc495; border-radius: 12px; display: flex; align-items: center; justify-content: center; cursor: pointer; background: #fffcf9; overflow: hidden; transition: 0.3s;}
.upload-box:hover { background-color: #fff4e6; border-color: #fd7e14; }
.img-preview { width: 100%; height: 100%; object-fit: contain; }

.rounded-start-pill { border-top-left-radius: 50px !important; border-bottom-left-radius: 50px !important; }
.rounded-end-pill { border-top-right-radius: 50px !important; border-bottom-right-radius: 50px !important; }

/* 📦 Shipping Badge Refinements */
.badge-btn { border-radius: 50px; padding: 4px 12px; font-size: 12px; transition: all 0.2s; display: flex; align-items: center; gap: 4px; border-width: 1px; border-style: solid; background: white;}
.active-badge { box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); font-weight: bold; color: white !important; border-color: transparent; }

/* 🎨 Custom Shipping Colors */
/* Free -> Green */
.btn-outline-ship-0 { color: #28c76f; border-color: #28c76f; }
.btn-ship-0 { background-color: #28c76f; border-color: #28c76f; }
.bg-ship-0-light { background-color: #e8f9ee !important; border-color: #28c76f !important; color: #28c76f !important; }

/* 30 บ. -> Light Yellow */
.btn-outline-ship-30 { color: #ffbc00; border-color: #ffbc00; }
.btn-ship-30 { background-color: #ffbc00; border-color: #ffbc00; }
.bg-ship-30-light { background-color: #fffbcc !important; border-color: #ffbc00 !important; color: #d49c00 !important; }

/* 60 บ. -> Main Orange */
.btn-outline-ship-60 { color: #fd7e14; border-color: #fd7e14; }
.btn-ship-60 { background-color: #fd7e14; border-color: #fd7e14; }
.bg-ship-60-light { background-color: #fff4e6 !important; border-color: #fd7e14 !important; color: #fd7e14 !important; }

/* 120 บ. -> Red / Coral */
.btn-outline-ship-120 { color: #ea5455; border-color: #ea5455; }
.btn-ship-120 { background-color: #ea5455; border-color: #ea5455; }
.bg-ship-120-light { background-color: #fceaea !important; border-color: #ea5455 !important; color: #ea5455 !important; }

.font-success { color: #28c76f; } .font-warning { color: #ff9f43; } .font-danger { color: #ea5455; }
.f-10 { font-size: 10px; }

.form-control:focus, .form-select:focus {
  border-color: #fd7e14;
  box-shadow: 0 0 0 0.25rem rgba(253, 126, 20, 0.25);
}
.form-check-input:checked { 
  background-color: #fd7e14 !important; 
  border-color: #fd7e14 !important; 
}
.form-check.border-orange { border: 1px solid #fd7e14 !important; background-color: #fff9f5 !important;}

.table-responsive::-webkit-scrollbar { height: 6px; }
.table-responsive::-webkit-scrollbar-thumb { background: #eee; border-radius: 4px; }
</style>