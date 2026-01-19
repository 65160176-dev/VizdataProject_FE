<template>
  <div>
    <Header />

    <section class="marketplace py-4">
      <div class="container-fluid px-4"> <div class="hero position-relative mb-4">
          <img src="/assets/images/Banner.png" alt="banner" />
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
                <div v-for="cat in uniqueCategories" :key="cat" class="form-check mb-2">
                  <input 
                    class="form-check-input" 
                    type="checkbox" 
                    :value="cat" 
                    :id="'cat-' + cat" 
                    v-model="selectedCategories"
                  >
                  <label class="form-check-label w-100" :for="'cat-' + cat" style="cursor: pointer; font-size: 14px;">
                    {{ cat }}
                    <span class="text-muted small float-end" style="font-size: 11px;">({{ getCategoryCount(cat) }})</span>
                  </label>
                </div>
                <div v-if="uniqueCategories.length === 0" class="text-muted small">ไม่มีหมวดหมู่</div>
              </div>
            </div>
          </div>

          <div class="col-lg-10 col-12">
            
            <div class="mb-3">
              <input v-model="q" class="form-control" placeholder="ค้นหาสินค้า หรือ ร้านค้า" />
            </div>

            <ClientOnly>
              <div v-if="productStore.loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2">กำลังโหลดสินค้า...</p>
              </div>

              <div v-else-if="!productStore.loading && filteredProducts.length === 0" class="text-center py-5">
                <p class="text-muted">ไม่พบสินค้าในหมวดหมู่นี้</p>
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
                          <button class="btn btn-sm btn-primary" @click="addToCart(product)">เพิ่มสินค้าลงตะกร้า</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Infinite Scroll Loading Indicator -->
              <div v-if="isLoadingMore && hasMoreProducts" class="text-center py-4">
                <div class="spinner-border text-primary" role="status">
                  <span class="visually-hidden">กำลังโหลดเพิ่มเติม...</span>
                </div>
                <p class="mt-2 text-muted">กำลังโหลดสินค้าเพิ่มเติม...</p>
              </div>

              <!-- End of Products Message -->
              <div v-if="!hasMoreProducts && displayedProducts.length > 0" class="text-center py-4">
                <p class="text-muted">แสดงสินค้าครบทั้งหมดแล้ว ({{ displayedProducts.length }} ชิ้น)</p>
              </div>

              <!-- Scroll Trigger Element -->
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

const q = ref('')
const selectedCategories = ref([])
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
  setupInfiniteScroll()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
  }
})

const allProducts = computed(() => productStore.products || [])

// Logic Category
const uniqueCategories = computed(() => {
  const cats = allProducts.value.map(p => p.category).filter(c => c && c.trim() !== '')
  return [...new Set(cats)].sort()
})

const getCategoryCount = (catName) => {
  return allProducts.value.filter(p => p.category === catName).length
}

// Logic Filter
const filteredProducts = computed(() => {
  let result = allProducts.value
  const term = (q.value || '').toLowerCase().trim()

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
  
  // จำลองการโหลด (เพื่อให้ดู smooth)
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
      rootMargin: '200px', // เริ่มโหลดก่อนถึง 200px
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
.marketplace .hero { display:flex; align-items:center; justify-content:center; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.06); margin-bottom:22px; position:relative }
.marketplace .hero img { width:100%; height:480px; object-fit:cover; display:block; }

.marketplace input.form-control { height:48px; border-radius:6px; padding:0 16px; border:1px solid #e6e6e6; }

.marketplace .card { border:1px solid #eee; border-radius:8px; transition:transform .18s ease, box-shadow .18s ease; overflow:hidden }
.marketplace .card:hover { transform:translateY(-6px); box-shadow:0 12px 30px rgba(17,24,39,0.08); }
/* ปรับความสูงรูปเล็กน้อย เพื่อให้สมดุลกับความกว้างที่ลดลง */
.marketplace .card .card-img-top { background:#f5f5f5; height:200px; object-fit:cover }
.marketplace .card .card-body { padding:10px; }
.marketplace .card .card-title { font-size:14px; line-height:1.2; }
.marketplace .card .fw-bold { color:#111827; font-size:16px }
.marketplace .card .text-muted { color:#6b7280 }
.marketplace .btn-sm { padding:6px 10px; border-radius:6px }

/* --- FORCE 5 COLUMNS --- */
/* บังคับ 5 คอลัมน์สำหรับหน้าจอใหญ่ */
.product-grid { 
  display:grid; 
  grid-template-columns: repeat(5, 1fr); 
  gap:12px; 
}
.product-card { display:block }

/* Responsive Grid Adjustments */
@media (max-width: 1400px) {
  /* ถ้าจอเริ่มเล็ก อาจจะต้องยอมลดเหลือ 4 เพื่อไม่ให้การ์ดเบี้ยว (แต่ถ้าอยากบังคับ 5 ตลอด ลบบรรทัดนี้ได้เลย) */
  .product-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 1100px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 767px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .marketplace .hero img { height:260px }
}
@media (max-width: 480px) {
  .product-grid { grid-template-columns: repeat(1, 1fr); }
}

/* Sidebar Styles */
.category-sidebar {
  /* เอา Sticky ออกตามที่ขอ */
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