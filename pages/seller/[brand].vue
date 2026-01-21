<template>
  <div>
    <Header />
    <div class="bg-light min-vh-100 pb-5">
      
      <div class="seller-header bg-white border-bottom mt-5 shadow-sm">
        <div class="container py-5">
          <div v-if="loading" class="text-center py-3">
            <div class="spinner-border text-primary"></div>
          </div>
          <div v-else class="row align-items-center">
            <div class="col-md-auto text-center text-md-start">
              <div class="seller-logo">
                <img v-if="seller?.image" :src="seller.image" class="w-100 h-100 rounded-3 object-fit-cover">
                <span v-else>{{ seller?.display_name?.charAt(0) || seller?.name?.charAt(0) || 'S' }}</span>
              </div>
            </div>
            <div class="col-md mt-3 mt-md-0 text-center text-md-start">
              <h2 class="fw-bold mb-1">{{ seller?.display_name || seller?.name || 'ร้านค้า' }}</h2>
              <p class="text-muted mb-0">
                <i class="fa fa-map-marker-alt text-danger me-1"></i> 
                {{ seller?.address || 'ร้านค้าออนไลน์' }}
              </p>
            </div>
            <div class="col-md-auto text-center mt-3 mt-md-0">
              <button class="btn btn-outline-dark rounded-pill px-4" @click="$router.back()">
                <i class="fa fa-arrow-left me-1"></i> กลับ
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="container mt-4">
        <div class="row">
          
          <div class="col-lg-3 mb-4">
            <div class="card border-0 shadow-sm sticky-top" style="top: 20px; z-index: 1;">
              <div class="card-header bg-white border-bottom py-3">
                <h6 class="fw-bold mb-0"><i class="fa fa-list me-2 text-primary"></i> หมวดหมู่ในร้าน</h6>
              </div>
              <div class="card-body p-3">
                <div v-if="selectedCategories.length > 0" class="mb-3">
                  <button class="btn btn-outline-danger btn-sm w-100" @click="selectedCategories = []">
                    <i class="fa fa-times"></i> ล้างตัวเลือก
                  </button>
                </div>

                <div class="category-list">
                  <div v-for="cat in uniqueShopCategories" :key="cat" class="form-check mb-2">
                    <input 
                      class="form-check-input cursor-pointer" 
                      type="checkbox" 
                      :value="cat" 
                      :id="'cat-' + cat" 
                      v-model="selectedCategories"
                    >
                    <label class="form-check-label w-100 cursor-pointer" :for="'cat-' + cat">
                      {{ cat }}
                      <span class="text-muted small float-end">({{ getCategoryCount(cat) }})</span>
                    </label>
                  </div>
                  
                  <div v-if="!loading && uniqueShopCategories.length === 0" class="text-muted small text-center py-3">
                    ร้านนี้ยังไม่มีหมวดหมู่
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-9">
            
            <div class="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm border">
              <h5 class="fw-bold mb-0">สินค้าทั้งหมด ({{ filteredProducts.length }})</h5>
              <div class="w-50">
                 <input v-model="q" class="form-control rounded-pill bg-light border-0 px-3" placeholder="ค้นหาสินค้าในร้านนี้..." />
              </div>
            </div>

            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary"></div>
            </div>

            <div v-else-if="filteredProducts.length > 0" class="row g-3">
              <div v-for="p in paginatedProducts" :key="p._id" class="col-6 col-md-4 col-lg-3">
                <div class="card h-100 border-0 shadow-sm product-card">
                  <nuxt-link :to="{ 
                    path: '/product/three-column/thumbnail-left', 
                    query: { id: p._id, hideSeller: 'true' } 
                  }">
                    <div class="product-img-wrapper">
                      <img :src="p.image || 'https://placehold.co/400'" class="card-img-top" alt="Product Image" />
                    </div>
                  </nuxt-link>
                  <div class="card-body p-3 text-center d-flex flex-column">
                    
                    <h6 class="text-truncate mb-2 fw-bold text-dark" style="font-size: 14px;">{{ p.name }}</h6>
                    <div class="mt-auto text-danger fw-bold fs-5">฿{{ p.price?.toLocaleString() }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-5 bg-white rounded shadow-sm">
              <i class="fa fa-box-open text-muted fa-3x mb-3 opacity-50"></i>
              <p class="text-muted fs-5">ไม่พบสินค้าที่คุณค้นหา</p>
              <button v-if="selectedCategories.length > 0" class="btn btn-link" @click="selectedCategories = []">ล้างตัวกรอง</button>
            </div>

            <div v-if="totalPages > 1" class="mt-4 d-flex justify-content-center">
                <nav>
                  <ul class="pagination">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <button class="page-link rounded-start-pill px-3" @click="goToPage(currentPage - 1)">
                        <i class="fa fa-chevron-left"></i>
                      </button>
                    </li>
                    <li class="page-item disabled">
                       <span class="page-link border-start-0 border-end-0 fw-bold text-dark px-4">
                         {{ currentPage }} / {{ totalPages }}
                       </span>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <button class="page-link rounded-end-pill px-3" @click="goToPage(currentPage + 1)">
                        <i class="fa fa-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
            </div>

          </div>
        </div>
      </div>
      
    </div>
    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// State
const seller = ref(null)
const allProducts = ref([]) // เก็บสินค้าทั้งหมดที่ fetch มา
const loading = ref(true)
const q = ref('')
const selectedCategories = ref([])
const currentPage = ref(1)
const itemsPerPage = 20

// Fetch Data
const fetchData = async () => {
  try {
    loading.value = true
    const sellerId = route.params.brand // รับค่าจาก URL param

    if(!sellerId) return

    // 1. ดึงข้อมูลร้านค้า
    // ใช้ $fetch ตามโค้ดเดิมของคุณ
    const sellerRes = await $fetch(`http://localhost:3001/api/sellers/by-user/${sellerId}`)
    seller.value = sellerRes

    // 2. ดึงสินค้าของร้านนี้
    const productsRes = await $fetch(`http://localhost:3001/api/product/seller/${sellerId}`)
    allProducts.value = productsRes || []

  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

// --- Logic หมวดหมู่ (เฉพาะร้านนี้) ---
const uniqueShopCategories = computed(() => {
  // ดึง Category จากสินค้าที่มีอยู่จริงของร้านนี้
  const cats = allProducts.value
    .map(p => p.category)
    .filter(c => c && c.trim() !== '')
  return [...new Set(cats)].sort()
})

const getCategoryCount = (catName) => {
  return allProducts.value.filter(p => p.category === catName).length
}

// --- Logic กรองสินค้า ---
const filteredProducts = computed(() => {
  let result = allProducts.value
  const term = q.value.toLowerCase().trim()

  // 1. กรองคำค้นหา
  if (term) {
    result = result.filter(p => p.name.toLowerCase().includes(term))
  }

  // 2. กรองตามหมวดหมู่ (Sidebar)
  if (selectedCategories.value.length > 0) {
    result = result.filter(p => selectedCategories.value.includes(p.category))
  }

  return result
})

// --- Logic Pagination ---
// เมื่อมีการค้นหาหรือเปลี่ยนหมวดหมู่ ให้กลับหน้า 1
watch([q, selectedCategories], () => {
  currentPage.value = 1
})

const totalPages = computed(() => Math.ceil(filteredProducts.value.length / itemsPerPage))

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredProducts.value.slice(start, start + itemsPerPage)
})

const goToPage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}
</script>

<style scoped>
.seller-logo {
  width: 100px; height: 100px; background: #ff4c3b; color: #fff;
  font-size: 40px; font-weight: bold; border-radius: 15px;
  display: flex; align-items: center; justify-content: center; margin: 0 auto;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

/* Sidebar Styles */
.category-list {
  max-height: 400px;
  overflow-y: auto;
}
.category-list::-webkit-scrollbar { width: 4px; }
.category-list::-webkit-scrollbar-thumb { background: #dee2e6; border-radius: 4px; }
.cursor-pointer { cursor: pointer; }

/* Product Card */
.product-card { border-radius: 12px; overflow: hidden; transition: all 0.3s ease; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
.product-img-wrapper { aspect-ratio: 1/1; background: #f8f9fa; overflow: hidden; position: relative; }
.product-img-wrapper img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
.product-card:hover .product-img-wrapper img { transform: scale(1.05); }

/* Pagination Button */
.page-link { color: #333; cursor: pointer; border: 1px solid #dee2e6; }
.page-link:hover { background-color: #f8f9fa; }
</style>