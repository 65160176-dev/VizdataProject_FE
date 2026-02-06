<template>
  <div>
    <Header />

    <WidgetsBreadcrumbs :title="seller?.display_name || seller?.name || 'รายละเอียดร้านค้า'" />

    <div class="theme-wrapper bg-light min-vh-100 pb-5">

      <div class="seller-header seller-header-gradient border-bottom shadow-sm">
        <div class="container py-5">
          <div v-if="loading" class="text-center py-3">
            <div class="spinner-border text-white"></div>
          </div>
          <div v-else class="row align-items-center">
            <div class="col-md-auto text-center text-md-start">
              <div class="seller-logo">
                <img v-if="seller?.avatar" :src="getSellerImage(seller.avatar)"
                  class="w-100 h-100 rounded-3 object-fit-cover" alt="Seller Logo">
                <span v-else>{{ seller?.display_name?.charAt(0) || seller?.name?.charAt(0) || 'S' }}</span>
              </div>
            </div>
            <div class="col-md mt-3 mt-md-0 text-center text-md-start">
              <h2 class="fw-bold mb-1 text-white">{{ seller?.display_name || seller?.name || 'ร้านค้า' }}</h2>
              <p class="text-white-50 mb-0">
                <i class="fa fa-map-marker-alt text-white me-1"></i>
                {{ seller?.address || 'ร้านค้าออนไลน์' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="container mt-4">
        <div class="row">

          <div class="col-lg-3 mb-4">
            <div class="card border-0 shadow-sm sticky-top" style="top: 20px; z-index: 1;">
              <div class="card-header bg-white border-bottom py-3">
                <h6 class="fw-bold mb-0 text-dark">
                  <i class="fa fa-list me-2 text-orange"></i> หมวดหมู่ในร้าน
                </h6>
              </div>
              <div class="card-body p-3">
                <div v-if="selectedCategories.length > 0" class="mb-3">
                  <button class="btn btn-outline-theme btn-sm w-100" @click="selectedCategories = []">
                    <i class="fa fa-times"></i> ล้างตัวเลือก
                  </button>
                </div>

                <div class="category-list custom-scrollbar">
                  <div v-for="cat in uniqueShopCategories" :key="cat" class="form-check mb-2">
                    <input class="form-check-input cursor-pointer" type="checkbox" :value="cat" :id="'cat-' + cat"
                      v-model="selectedCategories">
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

            <div
              class="d-flex justify-content-between align-items-center mb-4 bg-white p-3 rounded shadow-sm border border-light">
              <h5 class="fw-bold mb-0 text-dark">สินค้าทั้งหมด ({{ filteredProducts.length }})</h5>
              <div class="w-50">
                <input v-model="q" class="form-control rounded-pill bg-light border-0 px-3 search-input"
                  placeholder="ค้นหาสินค้าในร้านนี้..." />
              </div>
            </div>

            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-orange"></div>
            </div>

            <div v-else-if="filteredProducts.length > 0" class="row g-3">
              <div v-for="p in paginatedProducts" :key="p._id" class="col-6 col-md-4 col-lg-3">
                <div class="card h-100 border-0 shadow-sm product-card">
                  <nuxt-link :to="{
                    path: '/product/three-column/thumbnail-left',
                    query: { id: p._id, hideSeller: 'true' }
                  }">
                    <div class="product-img-wrapper">
                      <img :src="getSellerImage(p.image) || 'https://placehold.co/400'" class="card-img-top"
                        alt="Product Image" />
                    </div>
                  </nuxt-link>
                  <div class="card-body p-3 text-center d-flex flex-column">
                    <h6 class="text-truncate mb-2 fw-bold text-dark" style="font-size: 14px;">{{ p.name }}</h6>
                    <div class="mt-auto text-orange fw-bold fs-5">฿{{ p.price?.toLocaleString() }}</div>
                  </div>
                </div>
              </div>
            </div>

            <div v-else class="text-center py-5 bg-white rounded shadow-sm border border-light">
              <i class="fa fa-box-open text-muted fa-3x mb-3 opacity-50"></i>
              <p class="text-muted fs-5">ไม่พบสินค้าที่คุณค้นหา</p>
              <button v-if="selectedCategories.length > 0" class="btn btn-link text-orange"
                @click="selectedCategories = []">ล้างตัวกรอง</button>
            </div>

            <div v-if="totalPages > 1" class="mt-4 d-flex justify-content-center">
              <nav aria-label="Page navigation">
                <ul class="pagination custom-pagination">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="goToPage(currentPage - 1)">
                      <i class="fa fa-chevron-left"></i>
                    </button>
                  </li>
                  <li class="page-item disabled">
                    <span class="page-link border-start-0 border-end-0 fw-bold text-dark px-4">
                      {{ currentPage }} / {{ totalPages }}
                    </span>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="goToPage(currentPage + 1)">
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
import { WidgetsBreadcrumbs } from '#components'

const route = useRoute()
const BACKEND_URL = 'http://localhost:3001'

// State
const seller = ref(null)
const allProducts = ref([])
const loading = ref(true)
const q = ref('')
const selectedCategories = ref([])
const currentPage = ref(1)
const itemsPerPage = 20

// Fetch Data
const fetchData = async () => {
  try {
    loading.value = true
    const sellerId = route.params.brand

    if (!sellerId) return

    // 1. ดึงข้อมูลร้านค้า
    const sellerRes = await $fetch(`${BACKEND_URL}/api/sellers/by-user/${sellerId}`)
    seller.value = sellerRes

    // Logic: ถ้าร้านค้าไม่มี avatar แต่มี userId ให้ไปดึงรูปจาก User มาใช้แทน
    if (!seller.value.avatar && seller.value.userId) {
      try {
        const userRes = await $fetch(`${BACKEND_URL}/api/users/${seller.value.userId}`)
        if (userRes && userRes.avatar) {
          seller.value.avatar = userRes.avatar
        }
      } catch (err) {
        console.warn('ดึงรูป User สำรองไม่สำเร็จ', err)
      }
    }

    // 2. ดึงสินค้าของร้านนี้
    const productsRes = await $fetch(`${BACKEND_URL}/api/product/seller/${sellerId}`)
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

const getSellerImage = (path) => {
  if (!path) return null
  if (path.startsWith('http')) return path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${BACKEND_URL}/${cleanPath}`
}

// --- Logic หมวดหมู่ (เฉพาะร้านนี้) ---
const uniqueShopCategories = computed(() => {
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

  if (term) {
    result = result.filter(p => p.name.toLowerCase().includes(term))
  }

  if (selectedCategories.value.length > 0) {
    result = result.filter(p => selectedCategories.value.includes(p.category))
  }

  return result
})

// --- Logic Pagination ---
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
/* =========================================
   THEME VARIABLES (Deep Orange - Affiliate Match)
   ========================================= */
:root {
  --theme-color: #ff5722;
  /* Deep Orange */
  --theme-hover: #e64a19;
  /* Darker Orange */
  --theme-soft: #fff3e0;
  /* Light Orange BG */
  --text-main: #2d3748;
  --text-light: #718096;
  --bg-gray: #f8f9fa;
  --border-radius: 8px;
}

/* Helper Classes */
.text-orange {
  color: #ff5722 !important;
}

.bg-orange {
  background-color: #ff5722 !important;
}

/* =========================================
   COMPONENTS
   ========================================= */

/* Seller Logo */
.seller-logo {
  width: 100px;
  height: 100px;
  background: #ff5722;
  /* Theme Color */
  color: #fff;
  font-size: 40px;
  font-weight: bold;
  border-radius: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(255, 87, 34, 0.2);
  overflow: hidden;
  border: 4px solid white;
}

/* Theme Buttons */
.btn-theme {
  background: #ff5722;
  color: white;
  border: none;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-theme:hover {
  background: #e64a19;
  color: white;
}

.btn-outline-theme {
  background: white;
  border: 1px solid #ff5722;
  color: #ff5722;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-outline-theme:hover {
  background: #ff5722;
  color: white;
}

/* Search Input */
.search-input:focus {
  border: 1px solid #ff5722 !important;
  box-shadow: 0 0 0 0.2rem rgba(255, 87, 34, 0.15);
}

/* Checkbox Accent */
.form-check-input:checked {
  background-color: #ff5722;
  border-color: #ff5722;
}

.form-check-input:focus {
  box-shadow: 0 0 0 0.25rem rgba(255, 87, 34, 0.25);
  border-color: #ff5722;
}

/* Sidebar Scrollbar */
.custom-scrollbar {
  max-height: 400px;
  overflow-y: auto;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #ffccbc;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #ff5722;
}

.cursor-pointer {
  cursor: pointer;
}

/* Product Card */
.product-card {
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08) !important;
  border-color: #ffccbc !important;
}

.product-img-wrapper {
  aspect-ratio: 1/1;
  background: #f8f9fa;
  overflow: hidden;
  position: relative;
}

.product-img-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s;
}

.product-card:hover .product-img-wrapper img {
  transform: scale(1.05);
}

/* Pagination (Clean Orange Style) */
.custom-pagination .page-link {
  color: #4a5568;
  border-color: #e2e8f0;
  margin: 0 2px;
  border-radius: 4px;
  transition: all 0.2s;
}

.custom-pagination .page-link:hover {
  background: #fff3e0;
  color: #ff5722;
  border-color: #ffccbc;
}

.custom-pagination .page-item.active .page-link {
  background: #ff5722;
  border-color: #ff5722;
  color: white;
  box-shadow: 0 2px 4px rgba(255, 87, 34, 0.3);
}

.custom-pagination .page-item.disabled .page-link {
  color: #cbd5e0;
  background-color: #fff;
}

/* ✅ เพิ่มคลาสนี้: พื้นหลังสีส้มไล่เฉดแบบเดียวกับหน้า Dashboard */
.seller-header-gradient {
  background: linear-gradient(135deg, #e64a19 0%, #ff5722 50%, #ff7043 100%);
  color: white;
}

/* ปรับ Logo ให้มีขอบขาวตัดกับพื้นส้ม */
.seller-logo {
  /* ... (ค่าเดิม) ... */
  border: 4px solid rgba(255, 255, 255, 0.3);
  /* เพิ่มขอบโปร่งแสง */
  background: white;
  /* พื้นหลังโลโก้เป็นขาว (เผื่อรูปใส) */
  color: #ff5722;
  /* ตัวอักษรย่อเป็นสีส้ม */
}
</style>