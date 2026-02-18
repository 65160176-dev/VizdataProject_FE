<template>
  <div>
    <Header />

    <section class="marketplace py-4">
      <div class="container-fluid px-4">
        <!-- Banner Swiper -->
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
              <h6 class="fw-bold mb-3 pb-2 border-bottom">หมวดหมู่สินค้า</h6>
              
              <div v-if="selectedCategories.length > 0" class="mb-3">
                <button class="btn btn-outline-danger btn-sm w-100" @click="selectedCategories = []">
                  <i class="fa fa-times"></i> ล้าง
                </button>
              </div>

              <div class="category-list">
                <div v-for="cat in systemCategories" :key="cat._id" class="form-check mb-2">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :value="cat.name" 
                    :id="'cat-' + cat._id" 
                    v-model="selectedCategories"
                  >
                  <label class="form-check-label w-100" :for="'cat-' + cat._id" style="cursor: pointer; font-size: 14px;">
                    {{ cat.name }}
                    <span class="text-muted small float-end" style="font-size: 11px;">({{ getCategoryCount(cat.name) }})</span>
                  </label>
                </div>
                <div v-if="systemCategories.length === 0" class="text-muted small text-center py-3">
                  <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-10 col-12">
            
            <div class="mb-3">
              <input v-model="q" class="form-control" placeholder="ค้นหาสินค้า หรือ ร้านค้า" />
            </div>

            <div v-if="bestLoading" class="text-center py-3">
              <div class="spinner-border text-primary" role="status"></div>
            </div>
            <div v-else-if="bestSellersFiltered.length > 0" class="best-seller-section mb-4">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <h5 class="fw-bold mb-0">สินค้าขายดี</h5>
                <span class="text-muted small">Top {{ bestSellersFiltered.length }}</span>
              </div>
              <div class="best-seller-grid">
                <div v-for="item in bestSellersFiltered" :key="item.productId" class="product-card">
                  <div class="card h-100 shadow-sm">
                    <nuxt-link :to="{ path: '/product/three-column/thumbnail-left', query: { id: item.product?._id || item.product?.id || item.productId } }">
                      <img :src="getBestImg(item.product)" class="card-img-top" />
                    </nuxt-link>
                    <div class="card-body d-flex flex-column">
                      <h6 class="card-title mb-1 text-truncate">{{ item.product?.name || item.product?.title || 'สินค้า' }}</h6>
                      <div class="mt-auto d-flex justify-content-between align-items-center">
                        <div class="fw-bold">฿{{ item.product?.price || 0 }}</div>
                        <span class="text-muted small">ขาย {{ item.totalSold || 0 }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex align-items-center justify-content-between mb-2">
              <h5 class="fw-bold mb-0">สินค้าในระบบ</h5>
              <span class="text-muted small">ทั้งหมด {{ allProducts.length }} ชิ้น</span>
            </div>

            <ClientOnly>
              <div v-if="productStore.loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">กำลังโหลดสินค้า...</p>
              </div>

              <div v-else-if="!productStore.loading && filteredProducts.length === 0" class="text-center py-5">
                <p class="text-muted">ไม่พบสินค้าในระบบ</p>
                <button v-if="selectedCategories.length > 0" class="btn btn-primary btn-sm" @click="selectedCategories = []">ดูสินค้าทั้งหมด</button>
              </div>

              <div v-else class="product-grid">
                <div v-for="product in displayedProducts" :key="product._id || product.id" class="product-card">
                  <div class="card h-100 shadow-sm">
                    <nuxt-link :to="{ path: '/product/three-column/thumbnail-left', query: { id: product._id || product.id } }">
                      <img :src="getImgUrl(product)" class="card-img-top" />
                    </nuxt-link>
                    <div class="card-body d-flex flex-column">
                      <h6 class="card-title mb-1 text-truncate">{{ product?.name || product?.title || 'ไม่มีชื่อ' }}</h6>
                      <div class="text-muted small mb-2">{{ product?.brand || '' }}</div>

                      <div class="mt-auto d-flex justify-content-between align-items-center">
                        <div>
                          <div v-if="product?.sale">
                            <div class="text-muted small"><del>฿{{ product.price }}</del></div>
                            <div class="fw-bold">฿{{ discountedPrice(product) }}</div>
                          </div>
                          <div v-else class="fw-bold">฿{{ product?.price || 0 }}</div>
                        </div>
                        <div>
                          <button class="btn-cart" @click="addToCart(product)" title="เพิ่มลงตะกร้า">
                            <Icon name="feather:shopping-cart" size="18" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="isLoadingMore && hasMoreProducts" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">กำลังโหลดเพิ่มเติม...</span>
                </div>
                <p class="mt-2 text-muted">กำลังโหลดสินค้าเพิ่มเติม...</p>
              </div>

              <div v-if="!hasMoreProducts && displayedProducts.length > 0" class="text-center py-4">
                <p class="text-muted">แสดงสินค้าครบทั้งหมดแล้ว ({{ displayedProducts.length }} ชิ้น)</p>
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

const q = ref('')
const selectedCategories = ref([])
// ✅ เพิ่มตัวแปรเก็บ System Categories
const systemCategories = ref([])
const bestSellers = ref([])
const bestLoading = ref(true)
const BACKEND_URL = 'http://localhost:3001'

// Banner slides
const banners = ref([
  { image: new URL('~/assets/images/Banner.png', import.meta.url).href, alt: 'Banner 1' },
  { image: new URL('~/assets/images/Banner.png', import.meta.url).href, alt: 'Banner 2' },
  { image: new URL('~/assets/images/Banner.png', import.meta.url).href, alt: 'Banner 3' },
]) 

const cart = useCartStore()
const productStore = useProductStore()
const scrollTrigger = ref(null)

// Infinite Scroll Variables
const itemsPerPage = 40
const displayedCount = ref(40)
const isLoadingMore = ref(false)
let observer = null

onMounted(async () => {
  await productStore.fetchProducts()
  fetchSystemCategories() // ✅ เรียกดึงหมวดหมู่ระบบ
  fetchBestSellers()
  setupInfiniteScroll()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

// ✅ ฟังก์ชันดึงหมวดหมู่ระบบ (Public)
const fetchSystemCategories = async () => {
  try {
    const res = await $fetch('http://localhost:3001/api/category/public/system')
    if (res) {
      systemCategories.value = res
    }
  } catch (e) {
    console.error('Error fetching system categories:', e)
  }
}

const fetchBestSellers = async () => {
  try {
    bestLoading.value = true
    const res = await $fetch(`${BACKEND_URL}/api/order/best-sellers`, {
      params: { limit: 20 },
    })
    bestSellers.value = Array.isArray(res) ? res : []
  } catch (e) {
    console.error('Error fetching best sellers:', e)
    bestSellers.value = []
  } finally {
    bestLoading.value = false
  }
}

const allProducts = computed(() => productStore.products || [])
const bestSellersInStock = computed(() =>
  bestSellers.value.filter(item => Number(item?.product?.stock) > 0)
)

const bestSellersFiltered = computed(() => {
  let result = bestSellersInStock.value
  if (selectedCategories.value.length > 0) {
    result = result.filter(item =>
      selectedCategories.value.includes(item?.product?.category)
    )
  }
  return result.slice(0, 5)
})

// ✅ นับจำนวนสินค้าในแต่ละหมวด (นับจากสินค้าที่โหลดมาแล้ว)
const getCategoryCount = (catName) => {
  return allProducts.value.filter(p => p.category === catName).length
}

// Logic Filter
const filteredProducts = computed(() => {
  let result = allProducts.value
  const term = (q.value || '').toLowerCase().trim()

  // ซ่อนสินค้าที่หมดสต็อก
  result = result.filter(p => p.stock && p.stock > 0)

  if (term) {
    result = result.filter(p => 
      (p.name || p.title || '').toLowerCase().includes(term) || 
      (p.brand || '').toLowerCase().includes(term)
    )
  }

  if (selectedCategories.value.length > 0) {
    result = result.filter(p => selectedCategories.value.includes(p.category))
  }

  return result
})

// เมื่อค้นหาหรือเลือกหมวดหมู่ใหม่ ให้รีเซ็ตการแสดงผล
watch([q, selectedCategories], () => {
  displayedCount.value = itemsPerPage
})

const displayedProducts = computed(() => {
  return filteredProducts.value.slice(0, displayedCount.value)
})

const hasMoreProducts = computed(() => {
  return displayedCount.value < filteredProducts.value.length
})

function loadMoreProducts() {
  if (isLoadingMore.value || !hasMoreProducts.value) return
  
  isLoadingMore.value = true
  
  setTimeout(() => {
    displayedCount.value += itemsPerPage
    isLoadingMore.value = false
  }, 500)
}

function setupInfiniteScroll() {
  if (!scrollTrigger.value) return
  
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && hasMoreProducts.value && !isLoadingMore.value) {
          loadMoreProducts()
        }
      })
    },
    {
      rootMargin: '200px', 
    }
  )
  
  observer.observe(scrollTrigger.value)
}

function getImgUrl(product) {
  if (product.image) {
    if (product.image.startsWith('http')) return product.image
    return `/images/${product.image}`
  }
  const img = (product.images && product.images[0] && product.images[0].src) ? product.images[0].src : null
  return img ? `/images/${img}` : 'https://placehold.co/400'
}

function getBestImg(product) {
  if (product?.image) {
    if (product.image.startsWith('http')) return product.image
    return `${BACKEND_URL}/${product.image.replace(/^\//, '')}`
  }
  return 'https://placehold.co/400'
}

function discountedPrice(p) {
  const d = Number(p.discount || 0)
  if (!d) return p.price
  return Math.round(p.price * (1 - d / 100))
}

function addToCart(product) {
  cart.addToCart({
    ...product,
    _id: product._id || product.id,
    id: product._id || product.id,
    quantity: 1
  })
}
</script>

<style scoped>
/* CSS เดิม */
.marketplace { background:#fafafa; }

/* Banner Swiper Styles */
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

/* Swiper Navigation Buttons */
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

/* Swiper Pagination */
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
  background: #ff5722;
  width: 30px;
  border-radius: 6px;
}

.marketplace input.form-control { height:48px; border-radius:6px; padding:0 16px; border:1px solid #e6e6e6; }

.marketplace .card { border:1px solid #eee; border-radius:8px; transition:transform .18s ease, box-shadow .18s ease; overflow:hidden }
.marketplace .card:hover { transform:translateY(-6px); box-shadow:0 12px 30px rgba(17,24,39,0.08); }
.marketplace .card .card-img-top { background:#f5f5f5; height:200px; object-fit:cover }
.marketplace .card .card-body { padding:10px; }
.marketplace .card .card-title { font-size:14px; line-height:1.2; }
.marketplace .card .fw-bold { color:#111827; font-size:16px }
.marketplace .card .text-muted { color:#6b7280 }
.marketplace .btn-sm { padding:6px 10px; border-radius:6px }

/* Cart Button Styles */
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

/* --- FORCE 5 COLUMNS --- */
.product-grid { 
  display:grid; 
  grid-template-columns: repeat(5, 1fr); 
  gap:12px; 
}
.best-seller-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}
.product-card { display:block; overflow: hidden; }
.product-card .card { overflow: hidden; }
.product-card .card img.card-img-top { 
  width: 100%; 
  height: 200px; 
  object-fit: cover; 
  display: block;
  background: #f5f5f5;
}

/* Responsive Grid Adjustments */
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
  .banner-swiper { height: 260px; }
  .banner-swiper :deep(.swiper-button-next),
  .banner-swiper :deep(.swiper-button-prev) {
    width: 35px;
    height: 35px;
  }
  .banner-swiper :deep(.swiper-button-next)::after,
  .banner-swiper :deep(.swiper-button-prev)::after {
    font-size: 16px;
  }
}
@media (max-width: 480px) {
  .product-grid { grid-template-columns: repeat(1, 1fr); }
  .best-seller-grid { grid-template-columns: repeat(1, 1fr); }
}

/* Sidebar Styles */
.category-sidebar {
  /* position: sticky; top: 20px; */ 
}
.category-list {
  max-height: 500px;
  overflow-y: auto;
}
.category-list::-webkit-scrollbar { width: 4px; }
.category-list::-webkit-scrollbar-thumb { background: #ddd; border-radius: 4px; }

/* Infinite Scroll */
.scroll-trigger {
  height: 1px;
  width: 100%;
  margin-top: 20px;
}
</style>