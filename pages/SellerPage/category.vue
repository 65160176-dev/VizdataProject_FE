<template>
  <div class="col-sm-12">
    <div class="card">

      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>Category Management</h5>
        <button 
          type="button" 
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#addCategoryModal"
        >
          Add Category
        </button>
      </div>

      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped text-center align-middle">
            <thead class="table-light">
              <tr>
                <th class="text-start ps-4">Category Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in categories" :key="index">
                <td class="fw-bold text-start ps-4">{{ item.name }}</td>
                
                <td>
                  <Icon name="feather:edit" class="action-icon me-2 text-primary" style="cursor: pointer;" @click="editCategory(item)" />
                  <Icon name="feather:trash" class="action-icon text-danger" style="cursor: pointer;" @click="deleteCategory(index)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <ClientOnly>
        <div class="modal fade" id="addCategoryModal" tabindex="-1" aria-hidden="true">
          <div class="modal-dialog"> 
            <div class="modal-content">
              
              <div class="modal-header">
                <h5 class="modal-title f-w-600">Add New Category</h5>
                <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
              </div>

              <div class="modal-body">
                <form>
                  <div class="form-group mb-3">
                    <label class="mb-1">Category Name :</label>
                    <input class="form-control" v-model="newCategory.name" type="text" placeholder="e.g. Fashion">
                  </div>

                  <div class="form-group mb-0">
                    <label class="mb-1">Description :</label>
                    <textarea class="form-control" v-model="newCategory.description" rows="3"></textarea>
                  </div>
                </form>
              </div>

              <div class="modal-footer">
                <button class="btn btn-primary" type="button" @click="saveCategory">Save</button>
                <button class="btn btn-secondary" type="button" data-bs-dismiss="modal">Close</button>
              </div>

            </div>
          </div>
        </div>
      </ClientOnly>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import bootstrap from 'bootstrap/dist/js/bootstrap.bundle.min.js'

definePageMeta({ layout: 'seller' })

// Mock Data: เหลือแค่ ID, Name, Description
const categories = ref([
  { id: 1, name: 'Fashion', description: 'Clothes' },
  { id: 2, name: 'Electronics', description: 'Gadgets' },
])

// ตัวแปรรับค่า: เหลือแค่ Name, Description
const newCategory = ref({
  name: '',
  description: ''
})

const saveCategory = () => {
  if (!newCategory.value.name) return alert('Please enter category name')

  categories.value.push({
    id: Date.now(),
    name: newCategory.value.name,
    description: newCategory.value.description
  })

  // Reset ค่า
  newCategory.value = { name: '', description: '' }
  
  // ปิด Modal
  const modalEle = document.getElementById('addCategoryModal')
  const modal = bootstrap.Modal.getInstance(modalEle) || new bootstrap.Modal(modalEle)
  modal.hide()
}

const deleteCategory = (index) => {
  if(confirm('Delete this category?')) categories.value.splice(index, 1)
}

const editCategory = (item) => {
  alert('Edit: ' + item.name)
}
</script>

<style scoped>
.action-icon {
  width: 20px;
  height: 20px;
}
</style>