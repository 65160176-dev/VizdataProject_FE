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
                <div v-for="product in paginatedProducts" :key="product._id || product.id" class="product-card">
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
                          <button class="btn btn-sm btn-primary" @click="addToCart(product)">เพิ่ม</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="totalPages > 1" class="pagination-wrapper mt-4">
                <nav>
                  <ul class="pagination justify-content-end">
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <a class="page-link" @click="goToPage(1)" href="javascript:void(0)"><i class="fa fa-angle-double-left"></i></a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === 1 }">
                      <a class="page-link" @click="goToPage(currentPage - 1)" href="javascript:void(0)"><i class="fa fa-angle-left"></i></a>
                    </li>
                    <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                      <a class="page-link" @click="goToPage(page)" href="javascript:void(0)">{{ page }}</a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <a class="page-link" @click="goToPage(currentPage + 1)" href="javascript:void(0)"><i class="fa fa-angle-right"></i></a>
                    </li>
                    <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                      <a class="page-link" @click="goToPage(totalPages)" href="javascript:void(0)"><i class="fa fa-angle-double-right"></i></a>
                    </li>
                  </ul>
                </nav>
              </div>
            </ClientOnly>
          </div>
        </div>

      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useCartStore } from '~/store/cart'
import { useProductStore } from '~/store/products'

const q = ref('')
const selectedCategories = ref([])
const cart = useCartStore()
const productStore = useProductStore()

onMounted(async () => {
  await productStore.fetchProducts()
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

// Pagination
const currentPage = ref(1)
const itemsPerPage = 40 // 5 columns * 8 rows = 40

watch([q, selectedCategories], () => {
  currentPage.value = 1
})

const totalPages = computed(() => {
  return Math.ceil(filteredProducts.value.length / itemsPerPage)
})

const paginatedProducts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProducts.value.slice(start, end)
})

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  if (total <= 5) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 3) pages.push(1, 2, 3, 4, 5)
    else if (current >= total - 2) pages.push(total - 4, total - 3, total - 2, total - 1, total)
    else pages.push(current - 2, current - 1, current, current + 1, current + 2)
  }
  return pages
})

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

/* Pagination */
.pagination-wrapper { margin-top:30px; margin-bottom:30px; }
.pagination .page-link { border:1px solid #dee2e6; border-radius:6px; padding:8px 14px; color:#495057; cursor:pointer; }
.pagination .page-item.active .page-link { background:#0d6efd; border-color:#0d6efd; color:#fff; }
.pagination .page-item.disabled .page-link { opacity:0.5; pointer-events:none; }
</style>