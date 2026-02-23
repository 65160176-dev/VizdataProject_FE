<template>
  <div>
    <Header />

    <section class="marketplace py-4">
      <div class="container-fluid px-4">
        <div class="hero-swiper mb-4">
          <ClientOnly>
            <Swiper
              :modules="[SwiperAutoplay, SwiperNavigation, SwiperPagination]"
              :slides-per-view="1"
              :loop="true"
              :autoplay="{
                delay: 4000,
                disableOnInteraction: false,
              }"
              :navigation="true"
              :pagination="{ clickable: true }"
              class="banner-swiper"
            >
              <SwiperSlide v-for="(banner, index) in banners" :key="index">
                <div class="banner-slide">
                  <img :src="banner.image" :alt="banner.alt" />
                </div>
              </SwiperSlide>
            </Swiper>
          </ClientOnly>
        </div>

        <div class="row">
          <div class="col-lg-2 d-none d-lg-block">
            <div class="category-sidebar p-3 bg-white rounded shadow-sm border mb-4">
              <div class="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
                <h6 class="fw-bold mb-0" style="font-size: 15px;">หมวดหมู่สินค้า</h6>
                <button 
                  v-if="selectedCategories.length > 0" 
                  class="btn btn-link text-danger p-0 border-0 btn-clear" 
                  @click="selectedCategories = []"
                >
                  ล้าง
                </button>
              </div>

              <div class="category-list">
                <div v-for="(cat, index) in systemCategories" :key="cat._id || index" class="category-item mb-1">
                  <label :for="'cat-' + (cat._id || index)" class="category-row d-flex align-items-center justify-content-between py-2 px-2 rounded">
                    <div class="d-flex align-items-center overflow-hidden">
                      <input 
                        class="form-check-input me-2 mt-0 custom-checkbox" 
                        type="checkbox" 
                        :value="cat.name" 
                        :id="'cat-' + (cat._id || index)" 
                        v-model="selectedCategories"
                      >
                      <span class="cat-name text-truncate">{{ cat.name }}</span>
                    </div>
                    <span class="text-muted small ms-1" style="font-size: 11px;">({{ getCategoryCount(cat.name) }})</span>
                  </label>
                </div>
                <div v-if="systemCategories.length === 0" class="text-center py-3">
                  <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-10 col-12">
            <div class="search-box mb-4">
              <div class="input-group shadow-sm rounded">
                <span class="input-group-text bg-white border-end-0"><i class="fa fa-search text-muted"></i></span>
                <input v-model="q" class="form-control border-start-0 ps-0" placeholder="ค้นหาสินค้า หรือ ร้านค้า..." />
              </div>
            </div>

            <div v-if="bestLoading" class="text-center py-3">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else-if="bestSellersFiltered.length > 0" class="best-seller-section mb-5">
              <div class="d-flex align-items-center justify-content-between mb-3">
                <h5 class="fw-bold mb-0">🔥 สินค้าขายดี</h5>
              </div>
              <div class="product-grid">
                <div v-for="item in bestSellersFiltered" :key="item.productId" class="product-card">
                  <div class="card h-100 shadow-sm border-0">
                    <nuxt-link :to="{ path: '/product/three-column/thumbnail-left', query: { id: item.product?._id || item.product?.id || item.productId } }">
                      <img :src="getProductImage(item.product)" class="card-img-top" />
                    </nuxt-link>
                    <div class="card-body d-flex flex-column">
                      <h6 class="card-title mb-1 text-truncate">{{ item.product?.name || 'สินค้า' }}</h6>
                      <div class="mt-auto d-flex justify-content-between align-items-center">
                        <div class="fw-bold price-text">฿{{ item.product?.price || 0 }}</div>
                        <span class="text-muted" style="font-size: 11px;">ขายแล้ว {{ item.totalSold || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex align-items-center justify-content-between mb-3">
              <h5 class="fw-bold mb-0">สินค้าทั้งหมด</h5>
              <span class="text-muted small">พบ {{ filteredProducts.length }} รายการ</span>
            </div>

            <ClientOnly>
              <div v-if="productStore.loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              <div v-else-if="filteredProducts.length === 0" class="text-center py-5 bg-white rounded shadow-sm">
                <div class="mb-3"><i class="fa fa-search fa-3x text-muted opacity-25"></i></div>
                <p class="text-muted">ไม่พบสินค้าที่คุณต้องการ</p>
                <button class="btn btn-primary btn-sm px-4" @click="q = ''; selectedCategories = []">แสดงทั้งหมด</button>
              </div>
              <div v-else class="product-grid">
                <div v-for="product in displayedProducts" :key="product._id || product.id" class="product-card">
                  <div class="card h-100 shadow-sm border-0">
                    <div class="badge-sale" v-if="product?.sale">SALE</div>
                    <nuxt-link :to="{ path: '/product/three-column/thumbnail-left', query: { id: product._id || product.id } }">
                      <img :src="getProductImage(product)" class="card-img-top" />
                    </nuxt-link>
                    <div class="card-body d-flex flex-column">
                      <h6 class="card-title mb-1 text-truncate-2">{{ product?.name || 'ไม่มีชื่อสินค้า' }}</h6>
                      <div class="text-muted small mb-2">{{ product?.brand || '' }}</div>
                      <div class="mt-auto d-flex justify-content-between align-items-center">
                        <div>
                          <div v-if="product?.sale">
                            <div class="text-muted small text-decoration-line-through">฿{{ product.price }}</div>
                            <div class="fw-bold price-text">฿{{ discountedPrice(product) }}</div>
                          </div>
                          <div v-else class="fw-bold price-text">฿{{ product?.price || 0 }}</div>
                        </div>
                        <button class="btn-cart" @click="addToCart(product)">
                          <i class="fa fa-shopping-cart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-if="isLoadingMore && hasMoreProducts" class="text-center py-4">
                <div class="spinner-border spinner-border-sm text-primary"></div>
              </div>
              <div ref="scrollTrigger" class="scroll-trigger"></div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useCartStore } from '~/store/cart'
import { useProductStore } from '~/store/products'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Autoplay as SwiperAutoplay, Navigation as SwiperNavigation, Pagination as SwiperPagination } from 'swiper'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

const BACKEND_URL = 'https://vizdataprojectbe-production.up.railway.app'
const cart = useCartStore()
const productStore = useProductStore()

const q = ref('')
const selectedCategories = ref([])
const systemCategories = ref([])
const bestSellers = ref([])
const bestLoading = ref(true)
const scrollTrigger = ref(null)

const itemsPerPage = 20
const displayedCount = ref(20)
const isLoadingMore = ref(false)
let observer = null

const banners = ref([
  { image: new URL('~/assets/images/Banner.png', import.meta.url).href, alt: 'Banner 1' },
  { image: new URL('~/assets/images/Banner.png', import.meta.url).href, alt: 'Banner 2' },
])

onMounted(async () => {
  await productStore.fetchProducts()
  fetchSystemCategories()
  fetchBestSellers()
  setupInfiniteScroll()
})

onUnmounted(() => { if (observer) observer.disconnect() })

const fetchSystemCategories = async () => {
  try {
    const res = await $fetch(`${BACKEND_URL}/api/category/public/system`)
    if (res) systemCategories.value = res
  } catch (e) { console.error(e) }
}

const fetchBestSellers = async () => {
  try {
    bestLoading.value = true
    const res = await $fetch(`${BACKEND_URL}/api/order/best-sellers`, { params: { limit: 10 } })
    bestSellers.value = Array.isArray(res) ? res : []
  } catch (e) { bestSellers.value = [] } finally { bestLoading.value = false }
}

const categoryCounts = computed(() => {
  const counts = {}
  productStore.products?.forEach(p => {
    if (p.category && p.stock > 0) counts[p.category] = (counts[p.category] || 0) + 1
  })
  return counts
})

const getCategoryCount = (name) => categoryCounts.value[name] || 0

const filteredProducts = computed(() => {
  let result = productStore.products || []
  const term = q.value.toLowerCase().trim()
  result = result.filter(p => Number(p.stock) > 0)
  if (term) {
    result = result.filter(p => (p.name || '').toLowerCase().includes(term) || (p.brand || '').toLowerCase().includes(term))
  }
  if (selectedCategories.value.length > 0) {
    result = result.filter(p => selectedCategories.value.includes(p.category))
  }
  return result
})

const bestSellersFiltered = computed(() => {
  let result = bestSellers.value.filter(item => Number(item?.product?.stock) > 0)
  if (selectedCategories.value.length > 0) {
    result = result.filter(item => selectedCategories.value.includes(item?.product?.category))
  }
  return result.slice(0, 5)
})

const displayedProducts = computed(() => filteredProducts.value.slice(0, displayedCount.value))
const hasMoreProducts = computed(() => displayedCount.value < filteredProducts.value.length)

watch([q, selectedCategories], () => { displayedCount.value = itemsPerPage })

function loadMoreProducts() {
  if (isLoadingMore.value || !hasMoreProducts.value) return
  isLoadingMore.value = true
  setTimeout(() => {
    displayedCount.value += itemsPerPage
    isLoadingMore.value = false
  }, 400)
}

function setupInfiniteScroll() {
  observer = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && hasMoreProducts.value) loadMoreProducts()
  }, { rootMargin: '300px' })
  if (scrollTrigger.value) observer.observe(scrollTrigger.value)
}

function getProductImage(product) {
  if (!product) return 'https://placehold.co/400'
  const img = product.image || (product.images?.[0]?.src)
  if (!img) return 'https://placehold.co/400'
  if (img.startsWith('http')) return img
  return `${BACKEND_URL}/${img.replace(/^\//, '')}`
}

function discountedPrice(p) {
  const d = Number(p.discount || 0)
  return d ? Math.round(p.price * (1 - d / 100)) : p.price
}

function addToCart(product) {
  cart.addToCart({ ...product, id: product._id || product.id, quantity: 1 })
}
</script>

<style scoped>
.marketplace { background: #f8f9fa; min-height: 100vh; }

/* --- CSS คืนค่าแบนเนอร์ให้เท่าของเก่า --- */
.hero-swiper {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}

.banner-swiper {
  width: 100%;
  height: 480px;
  border-radius: 8px;
}

.banner-slide {
  width: 100%;
  height: 100%;
  position: relative;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ปุ่มเลื่อนซ้าย-ขวา */
.banner-swiper :deep(.swiper-button-next),
.banner-swiper :deep(.swiper-button-prev) {
  color: white;
  background: rgba(0, 0, 0, 0.5);
  width: 45px;
  height: 45px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.banner-swiper :deep(.swiper-button-next):hover,
.banner-swiper :deep(.swiper-button-prev):hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.banner-swiper :deep(.swiper-button-next)::after,
.banner-swiper :deep(.swiper-button-prev)::after {
  font-size: 20px;
  font-weight: bold;
}

/* จุดไข่ปลาด้านล่าง (Pagination) */
.banner-swiper :deep(.swiper-pagination) {
  bottom: 20px;
}

.banner-swiper :deep(.swiper-pagination-bullet) {
  width: 12px;
  height: 12px;
  background: white;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.banner-swiper :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: #ff4c3b; /* ปรับสีให้เข้ากับธีมใหม่ */
  width: 30px;
  border-radius: 6px;
}
/* ------------------------------------- */

.category-sidebar { 
  border-radius: 12px !important;
  background: white;
}

.btn-clear { font-size: 13px; text-decoration: none; font-weight: 500; }

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

/* Product Grid & Cards */
.product-grid { 
  display: grid; 
  grid-template-columns: repeat(5, 1fr); 
  gap: 16px; 
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

.badge-sale {
  position: absolute; top: 10px; left: 10px;
  background: #ff4c3b; color: white; padding: 2px 8px;
  font-size: 10px; font-weight: bold; border-radius: 4px; z-index: 1;
}

.btn-cart {
  background: #ff4c3b; color: white; border: none;
  width: 34px; height: 34px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
}
.btn-cart:hover { transform: scale(1.1); background: #e6392a; }

@media (max-width: 1400px) { .product-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 1100px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { 
  .product-grid { grid-template-columns: repeat(2, 1fr); } 
  .banner-swiper { height: 260px; } /* ปรับกลับเป็น 260px ให้เท่าของเก่า */
}
</style>