<template>
  <div>
    <Header />

    <WidgetsBreadcrumbs :title="seller?.display_name || seller?.name || 'รายละเอียดร้านค้า'" />

    <div class="seller-header-gradient">
      <div class="container-fluid px-4">
        <div v-if="loading" class="text-center py-3">
          <div class="spinner-border text-white"></div>
        </div>
        <div v-else class="d-flex align-items-center gap-3">
          <div class="seller-logo">
            <img v-if="seller?.avatar" :src="getSellerImage(seller.avatar)" alt="Seller Logo">
            <span v-else>{{ seller?.display_name?.charAt(0) || seller?.name?.charAt(0) || 'S' }}</span>
          </div>
          <div>
            <h2 class="fw-bold mb-1 text-white">{{ seller?.display_name || seller?.name || 'ร้านค้า' }}</h2>
            <p class="mb-0" style="color: rgba(255,255,255,0.8);">
              <i class="fa fa-map-marker-alt me-1"></i>
              {{ seller?.address || 'ร้านค้าออนไลน์' }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <section class="marketplace py-4">
      <div class="container-fluid px-4">
        <div class="row">

          <div class="col-lg-2 d-none d-lg-block">
            <div class="category-sidebar p-3 bg-white rounded shadow-sm border mb-4">
              <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <h6 class="fw-bold mb-0" style="font-size: 15px;">หมวดหมู่สินค้า</h6>
                <button 
                  v-if="selectedCategories.length > 0" 
                  class="btn btn-link text-danger p-0 border-0 btn-clear shadow-none" 
                  @click="selectedCategories = []"
                >
                  ล้าง
                </button>
              </div>

              <div class="category-list">
                <div v-for="cat in uniqueShopCategories" :key="cat" class="category-item mb-1">
                  <label :for="'cat-' + cat" class="category-row d-flex align-items-center justify-content-between py-2 px-2 rounded">
                    <div class="d-flex align-items-center overflow-hidden">
                      <input 
                        class="form-check-input me-2 mt-0 custom-checkbox" 
                        type="checkbox" 
                        :value="cat" 
                        :id="'cat-' + cat" 
                        v-model="selectedCategories"
                      >
                      <span class="cat-name text-truncate">{{ cat }}</span>
                    </div>
                    <span class="text-muted small ms-1" style="font-size: 11px;">({{ getCategoryCount(cat) }})</span>
                  </label>
                </div>
                
                <div v-if="loading" class="text-center py-3">
                  <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                </div>
                <div v-else-if="uniqueShopCategories.length === 0" class="text-muted small text-center py-3">
                  ร้านนี้ยังไม่มีหมวดหมู่
                </div>
              </div>
            </div>
            </div>

          <div class="col-lg-10 col-12">

            <div class="mb-3">
              <input v-model="q" class="form-control shadow-sm" style="border: 1px solid #e6e6e6;" placeholder="ค้นหาสินค้า หรือ ร้านค้า" />
            </div>

            <div v-if="bestLoading" class="text-center py-3">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else-if="bestSellerItems.length > 0" class="best-seller-section mb-4">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <h5 class="fw-bold mb-0">🔥 สินค้าขายดี</h5>
                <span class="text-muted small">Top {{ bestSellerItems.length }}</span>
              </div>
              <div class="best-seller-grid">
                <div v-for="item in bestSellerItems" :key="item.productId" class="product-card">
                  <div class="card h-100 shadow-sm">
                    <nuxt-link :to="{ path: '/product/three-column/thumbnail-left', query: { id: item.product?._id || item.product?.id || item.productId, hideSeller: 'true' } }">
                      <img :src="getSellerImage(item.product?.image) || 'https://placehold.co/400'" class="card-img-top" alt="Best Seller" />
                    </nuxt-link>
                    <div class="card-body d-flex flex-column">
                      <h6 class="card-title mb-1 text-truncate">{{ item.product?.name || 'สินค้า' }}</h6>
                      <div class="mt-auto d-flex justify-content-between align-items-center">
                        <div class="fw-bold price-text">฿{{ item.product?.price?.toLocaleString() || 0 }}</div>
                        <span class="text-muted small" style="font-size: 11px;">ขาย {{ item.totalSold || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-muted small mb-4">ยังไม่มีสินค้าขายดีในหมวดหมู่นี้</div>

            <div class="d-flex align-items-center justify-content-between mb-2">
              <h5 class="fw-bold mb-0">สินค้าในระบบ</h5>
              <span class="text-muted small">ทั้งหมด {{ allProducts.length }} ชิ้น</span>
            </div>

            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">กำลังโหลด...</span>
              </div>
              <p class="mt-2">กำลังโหลดสินค้า...</p>
            </div>

            <div v-else-if="filteredProducts.length === 0" class="text-center py-5 bg-white rounded shadow-sm">
              <div class="mb-3"><i class="fa fa-search fa-3x text-muted opacity-25"></i></div>
              <p class="text-muted">ไม่พบสินค้าในร้านนี้</p>
              <button v-if="selectedCategories.length > 0" class="btn btn-primary btn-sm px-4"
                @click="selectedCategories = []">ดูสินค้าทั้งหมด</button>
            </div>

            <div v-else class="product-grid">
              <div v-for="p in paginatedProducts" :key="p._id" class="product-card">
                <div class="card h-100 shadow-sm border-0">
                  <nuxt-link :to="{ path: '/product/three-column/thumbnail-left', query: { id: p._id, hideSeller: 'true' } }">
                    <img :src="getSellerImage(p.image) || 'https://placehold.co/400'" class="card-img-top" alt="Product Image" />
                  </nuxt-link>
                  <div class="card-body d-flex flex-column">
                    <h6 class="card-title mb-1 text-truncate-2">{{ p.name }}</h6>
                    <div class="mt-auto d-flex justify-content-between align-items-center pt-2">
                      <div class="fw-bold price-text">฿{{ p.price?.toLocaleString() }}</div>
                      <button class="btn-cart" @click="addToCart(p)" title="เพิ่มลงตะกร้า">
                        <i class="fa fa-shopping-cart"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="totalPages > 1" class="d-flex justify-content-center align-items-center gap-3 py-4">
              <button class="btn btn-sm btn-outline-secondary" :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)">
                <i class="fa fa-chevron-left"></i>
              </button>
              <span class="fw-bold">{{ currentPage }} / {{ totalPages }}</span>
              <button class="btn btn-sm btn-outline-secondary" :disabled="currentPage === totalPages"
                @click="goToPage(currentPage + 1)">
                <i class="fa fa-chevron-right"></i>
              </button>
            </div>

            <div v-if="!loading && filteredProducts.length > 0" class="text-center py-3">
              <p class="text-muted">แสดงสินค้า {{ paginatedProducts.length }} จาก {{ filteredProducts.length }} ชิ้น</p>
            </div>

          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useCartStore } from '~/store/cart'
import { useProductStore } from '~/store/products'
import { WidgetsBreadcrumbs } from '#components'

const route = useRoute()
const cart = useCartStore()
const productStore = useProductStore()
const router = useRouter()
const BACKEND_URL = 'https://vizdataprojectbe-production.up.railway.app'

// State
const seller = ref(null)
const allProducts = ref([])
const loading = ref(true)
const bestLoading = ref(true)
const bestSellers = ref([])
const q = ref('')
const selectedCategories = ref([])
const currentPage = ref(1)
const itemsPerPage = 20

const bestSellerItems = computed(() => {
  let filtered = bestSellers.value
    .filter(item => Number(item?.product?.stock) > 0)
  
  // กรองตามหมวดหมู่ที่เลือก
  if (selectedCategories.value.length > 0) {
    filtered = filtered.filter(item => 
      selectedCategories.value.includes(item.product?.category)
    )
  }
  
  return filtered.slice(0, 5)
})

// Fetch Data
const fetchData = async () => {
  try {
    loading.value = true
    bestLoading.value = true
    const sellerParam = String(route.params.brand || '')

    if (!sellerParam) {
      loading.value = false
      bestLoading.value = false
      return
    }

    let sellerRes = null

    try {
      sellerRes = await $fetch(`${BACKEND_URL}/api/sellers/by-user/${sellerParam}`)
      if (sellerRes && sellerRes.success === false) {
        sellerRes = null
      }
    } catch (err) {
      sellerRes = null
    }

    if (!sellerRes || !sellerRes._id) {
      try {
        const byIdRes = await $fetch(`${BACKEND_URL}/api/sellers/${sellerParam}`)
        sellerRes = byIdRes?.data || null
      } catch (err) {
        sellerRes = null
      }
    }

    seller.value = sellerRes

    if (seller.value && !seller.value.avatar && seller.value.userId) {
      try {
        const userRes = await $fetch(`${BACKEND_URL}/api/users/${seller.value.userId}`)
        if (userRes && userRes.avatar) {
          seller.value.avatar = userRes.avatar
        }
      } catch (err) {
        console.warn('ดึงรูป User สำรองไม่สำเร็จ', err)
      }
    }

    const sellerUserId = seller.value?.userId || sellerParam
    const sellerUserIdString = sellerUserId?._id || sellerUserId

    const productsRes = await $fetch(`${BACKEND_URL}/api/product/seller/${sellerUserIdString}`)
    allProducts.value = productsRes || []

    const bestRes = await $fetch(`${BACKEND_URL}/api/order/best-sellers`, {
      params: { sellerId: sellerUserIdString, limit: 20 },
    })
    bestSellers.value = Array.isArray(bestRes) ? bestRes : []

  } catch (error) {
    console.error('Error fetching data:', error)
  } finally {
    loading.value = false
    bestLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const getSellerImage = (path) => {
  if (!path) return null
  if (path.startsWith('data:')) return path
  if (path.startsWith('http')) return path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${BACKEND_URL}/${cleanPath}`
}

// --- Logic หมวดหมู่ (ใช้ของเดิม เพราะดึงจากสินค้าในร้าน) ---
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

  result = result.filter(p => Number(p?.stock) > 0)

  if (term) {
    result = result.filter(p =>
      (p.name || '').toLowerCase().includes(term) ||
      (p.brand || '').toLowerCase().includes(term)
    )
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

function addToCart(product) {
  cart.addToCart({
    ...product,
    _id: product._id || product.id,
    id: product._id || product.id,
    quantity: 1
  })
  if (useNuxtApp().$showToast) {
    useNuxtApp().$showToast({ msg: `เพิ่ม ${product.name} ลงตะกร้าเรียบร้อย`, type: 'success' })
  }
}
</script>

<style scoped>
/* Seller Header */
.seller-header-gradient {
  background: linear-gradient(135deg, #e64a19 0%, #ff5722 50%, #ff7043 100%);
  padding: 30px 0;
}

.seller-logo {
  width: 80px;
  height: 80px;
  background: white;
  color: #ff5722;
  font-size: 32px;
  font-weight: 800;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.seller-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Marketplace */
.marketplace {
  background: #f8f9fa;
  min-height: 100vh;
}

.marketplace input.form-control {
  height: 48px;
  border-radius: 6px;
  padding: 0 16px;
}

/* --- หมวดหมู่ Sidebar แบบใหม่ --- */
.category-sidebar { 
  border-radius: 12px !important;
  background: white;
}

.btn-clear { font-size: 13px; text-decoration: none; font-weight: 500; color: #dc3545; }

.category-list {
  max-height: 350px; 
  overflow-y: auto;
  padding-right: 5px;
  scrollbar-width: thin;
  scrollbar-color: #eee transparent;
}

.category-list::-webkit-scrollbar { width: 4px; }
.category-list::-webkit-scrollbar-track { background: transparent; }
.category-list::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }

.category-row { cursor: pointer; transition: all 0.2s; user-select: none; }
.category-row:hover { background-color: #fff1f0; color: #ff4c3b; }
.custom-checkbox:checked { background-color: #ff4c3b; border-color: #ff4c3b; }

.cat-name { 
  font-size: 14px; 
  white-space: nowrap; 
  overflow: hidden; 
  text-overflow: ellipsis;
  max-width: 130px;
}
/* -------------------------------- */

/* Product Grid & Cards */
.product-grid, .best-seller-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
}

.product-card {
  display: block;
  overflow: hidden;
}

.product-card .card { 
  transition: transform 0.3s, box-shadow 0.3s; 
  border-radius: 12px;
  overflow: hidden;
}

.product-card .card:hover { 
  transform: translateY(-5px); 
  box-shadow: 0 12px 24px rgba(0,0,0,0.08) !important; 
}

.card-img-top { height: 200px; object-fit: cover; background: #fdfdfd; }
.price-text { color: #ff4c3b; font-size: 17px; font-weight: 700; }

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 13.5px;
  height: 40px;
  line-height: 1.4;
}

/* Cart Button */
.btn-cart {
  background: #ff4c3b; color: white; border: none;
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s ease;
}
.btn-cart:hover { transform: scale(1.1); background: #e6392a; }

/* Responsive */
@media (max-width: 1400px) {
  .product-grid { grid-template-columns: repeat(4, 1fr); }
  .best-seller-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 1100px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
  .best-seller-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 767px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .best-seller-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 480px) {
  .product-grid { grid-template-columns: repeat(1, 1fr); }
  .best-seller-grid { grid-template-columns: repeat(1, 1fr); }
}
</style>