<template>
  <div class="col-sm-12">
    <div class="card">

      <!-- Header -->
      <div class="card-header d-flex justify-content-between align-items-center">
        <h5>Products Category</h5>

        <button 
          type="button" 
          class="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
        >
          Add Category
        </button>
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
                  <th>Sub Category</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="(item, index) in data" :key="index">
                  <td>
                    <img class="img-40 me-2" :src="'/multikart-admin/' + item.image" alt="">
                  </td>

                  <td>{{ item.name }}</td>
                  <td>{{ item.stock }}</td>
                  <td>{{ item.price }}</td>
                  <td>{{ item.commission }}</td>

                  <td>
                    <i class="fa fa-circle f-12" :class="'font-' + item.status"></i>
                  </td>

                  <td>{{ item.category }}</td>

                  <!-- Actions -->
                  <td>

                    <!-- Edit -->
                    <Icon
                      name="feather:edit"
                      style="height:20px; cursor:pointer; margin-right:8px;"
                      @click="goEdit(item.id)"
                    />

                    <!-- Delete -->
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

        <!-- Modal Add Category -->
        <ClientOnly>
          <div class="modal fade" id="exampleModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">

                <div class="modal-header">
                  <h5 class="modal-title f-w-600">Add Physical Product</h5>
                  <button class="btn-close" type="button" data-bs-dismiss="modal"></button>
                </div>

                <div class="modal-body">
                  <form class="needs-validation">

                    <div class="form-group mb-3">
                      <label class="mb-1">Product Name :</label>
                      <input class="form-control" type="text">
                    </div>

                    <div class="form-group mb-3">
                      <label class="mb-1">Stock :</label>
                      <input class="form-control" type="number" min="0">
                    </div>

                    <div class="form-group mb-3">
                      <label class="mb-1">Category :</label>
                      <input class="form-control" type="text">
                    </div>

                    <div class="form-group mb-3">
                      <label class="mb-1">Price :</label>
                      <input class="form-control" type="number" min="0">
                    </div>

                    <div class="form-group mb-3">
                      <label class="mb-1">Commission (%) :</label>
                      <input class="form-control" type="number" min="0">
                    </div>

                    <div class="form-group mb-3">
                      <label class="mb-1">Description :</label>
                      <textarea class="form-control" rows="3"></textarea>
                    </div>

                    <div class="form-group mb-0">
                      <label class="mb-1">Product Image :</label>
                      <input class="form-control" type="file">
                    </div>

                  </form>
                </div>

                <div class="modal-footer">
                  <button class="btn btn-primary" type="button" data-bs-dismiss="modal">Save</button>
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
import { ref } from "vue"
import productcategory from "~/data/productcategory.json"


definePageMeta({
  layout: "default"
})

const data = ref(productcategory.data)

// ลบตาม index
const deleteItem = (index) => {
  if (confirm("คุณต้องการลบรายการนี้หรือไม่ ?")) {
    data.value.splice(index, 1)
  }
}

function goEdit(id) {
  navigateTo(`/edit-product/${id}`)
}
</script>
