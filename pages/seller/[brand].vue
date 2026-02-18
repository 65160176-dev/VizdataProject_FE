<template>
  <div>
    <Header />

    <WidgetsBreadcrumbs :title="seller?.display_name || seller?.name || 'รายละเอียดร้านค้า'" />

    <!-- Seller Header -->
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

          <!-- Sidebar -->
          <div class="col-lg-2 d-none d-lg-block">
            <div class="category-sidebar p-3 bg-white rounded shadow-sm border mb-4">
              <h6 class="fw-bold mb-3 pb-2 border-bottom">หมวดหมู่สินค้า</h6>

              <div v-if="selectedCategories.length > 0" class="mb-3">
                <button class="btn btn-outline-danger btn-sm w-100" @click="selectedCategories = []">
                  <i class="fa fa-times"></i> ล้าง
                </button>
              </div>

              <div class="category-list">
                <div v-for="cat in uniqueShopCategories" :key="cat" class="form-check mb-2">
                  <input class="form-check-input" type="checkbox" :value="cat" :id="'cat-' + cat"
                    v-model="selectedCategories">
                  <label class="form-check-label w-100" :for="'cat-' + cat"
                    style="cursor: pointer; font-size: 14px;">
                    {{ cat }}
                    <span class="text-muted small float-end" style="font-size: 11px;">({{ getCategoryCount(cat) }})</span>
                  </label>
                </div>
                <div v-if="!loading && uniqueShopCategories.length === 0" class="text-muted small text-center py-3">
                  ร้านนี้ยังไม่มีหมวดหมู่
                </div>
              </div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="col-lg-10 col-12">

            <div class="mb-3">
              <input v-model="q" class="form-control" placeholder="ค้นหาสินค้า หรือ ร้านค้า" />
            </div>

            <div v-if="bestLoading" class="text-center py-3">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else-if="bestSellerItems.length > 0" class="best-seller-section mb-4">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <h5 class="fw-bold mb-0">สินค้าขายดี</h5>
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
                        <div class="fw-bold">฿{{ item.product?.price?.toLocaleString() || 0 }}</div>
                        <span class="text-muted small">ขาย {{ item.totalSold || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="text-muted small mb-4">ยังไม่มีสินค้าขายดีในร้านนี้</div>

            <div class="d-flex align-items-center justify-content-between mb-2">
              <h5 class="fw-bold mb-0">สินค้าในระบบ</h5>
              <span class="text-muted small">ทั้งหมด {{ allProducts.length }} ชิ้น</span>
            </div>

            <div v-if="loading" class="text-center py-5">
              <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
              </div>
              <p class="mt-2">กำลังโหลดสินค้า...</p>
            </div>

            <div v-else-if="filteredProducts.length === 0" class="text-center py-5">
              <p class="text-muted">ไม่พบสินค้าในร้านนี้</p>
              <button v-if="selectedCategories.length > 0" class="btn btn-primary btn-sm"
                @click="selectedCategories = []">ดูสินค้าทั้งหมด</button>
            </div>

            <div v-else class="product-grid">
              <div v-for="p in paginatedProducts" :key="p._id" class="product-card">
                <div class="card h-100 shadow-sm">
                  <nuxt-link :to="{ path: '/product/three-column/thumbnail-left', query: { id: p._id, hideSeller: 'true' } }">
                    <img :src="getSellerImage(p.image) || 'https://placehold.co/400'" class="card-img-top" alt="Product Image" />
                  </nuxt-link>
                  <div class="card-body d-flex flex-column">
                    <h6 class="card-title mb-1 text-truncate">{{ p.name }}</h6>
                    <div class="mt-auto d-flex justify-content-between align-items-center">
                      <div class="fw-bold">฿{{ p.price?.toLocaleString() }}</div>
                      <button class="btn-cart" @click="addToCart(p)" title="เพิ่มลงตะกร้า">
                        <Icon name="feather:shopping-cart" size="18" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
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
const BACKEND_URL = 'http://localhost:3001'

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

const bestSellerItems = computed(() =>
  bestSellers.value
    .filter(item => Number(item?.product?.stock) > 0)
    .slice(0, 5)
)

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
  if (path.startsWith('http')) return path
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  return `${BACKEND_URL}/${cleanPath}`
}

// --- Logic หมวดหมู่ ---
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

function addToWishlist(product) {
  productStore.addToWishlist(product)
  if (useNuxtApp().$showToast) {
    useNuxtApp().$showToast({ msg: `เพิ่ม ${product.name} ในรายการที่ชอบ`, type: 'info' })
  }
}

function goToProduct(productId) {
  window.location.href = `/product/three-column/thumbnail-left?id=${productId}&hideSeller=true`
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
  background: #fafafa;
}

.marketplace input.form-control {
  height: 48px;
  border-radius: 6px;
  padding: 0 16px;
  border: 1px solid #e6e6e6;
}

/* Sidebar */
.category-sidebar {}

.category-list {
  max-height: 500px;
  overflow-y: auto;
}

.category-list::-webkit-scrollbar {
  width: 4px;
}

.category-list::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 4px;
}

/* Card */
.marketplace .card { border:1px solid #eee; border-radius:8px; transition:transform .18s ease, box-shadow .18s ease; overflow:hidden; }
.marketplace .card:hover { transform:translateY(-6px); box-shadow:0 12px 30px rgba(17,24,39,0.08); }
.marketplace .card .card-img-top { background:#f5f5f5; height:200px; object-fit:cover; }
.marketplace .card .card-body { padding:10px; }
.marketplace .card .card-title { font-size:14px; line-height:1.2; }
.marketplace .card .fw-bold { color:#111827; font-size:16px; }
.marketplace .card .text-muted { color:#6b7280; }
.marketplace .btn-sm { padding:6px 10px; border-radius:6px; }

/* Cart Button */
.btn-cart {
  background: #ff4c3b;
  padding: 8px 14px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ff4c3b;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  box-shadow: 0 2px 6px rgba(255, 76, 59, 0.3);
}

.btn-cart:hover {
  background: white;
  color: #ff4c3b;
  border-color: #ff4c3b;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 76, 59, 0.3);
}

/* 5 Columns Grid */
.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

.product-card {
  display: block;
  overflow: hidden;
}
.product-card .card { overflow: hidden; }
.product-card .card img.card-img-top {
  width: 100%;
  height: 200px;
  object-fit: cover;
  display: block;
  background: #f5f5f5;
}

.best-seller-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}

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