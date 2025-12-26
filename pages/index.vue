<template>
  <div>
    <Header />

    <section class="marketplace py-4">
      <div class="container">
        <div class="hero position-relative mb-3">
          <img src="/assets/images/Banner.png" alt="banner" />
          <div class="hero-text">
            <div class="title">ช็อปสินค้า Marketplace — ร้านค้าหลากหลาย</div>
            <div class="cta"><button class="btn btn-danger">ช้อปเลย</button></div>
          </div>
        </div>
        <div ref="searchSection" class="row mb-3">
          <div class="col-12">
            <input v-model="q" class="form-control" placeholder="ค้นหาสินค้า หรือ ร้านค้า" />
          </div>
        </div>

        <div class="product-grid">
          <div v-for="product in paginatedProducts" :key="product.id" class="product-card">
            <div class="card h-100 shadow-sm">
              <nuxt-link :to="{ path: '/product/three-column/thumbnail-left', query: { id: product.id } }">
                <img :src="getImgUrl(product)" class="card-img-top" />
              </nuxt-link>
              <div class="card-body d-flex flex-column">
                <h6 class="card-title mb-1 text-truncate">{{ product.title }}</h6>
                <div class="text-muted small mb-2">{{ product.brand || '' }}</div>

                <div class="mt-auto d-flex justify-content-between align-items-center">
                  <div>
                    <div v-if="product.sale">
                      <div class="text-muted small"><del>฿{{ product.price }}</del></div>
                      <div class="fw-bold">฿{{ discountedPrice(product) }}</div>
                    </div>
                    <div v-else class="fw-bold">฿{{ product.price }}</div>
                  </div>
                  <div>
                    <button class="btn btn-sm btn-primary" @click="addToCart(product)">เพิ่มลงรถเข็น</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="pagination-wrapper mt-4">
          <nav>
            <ul class="pagination justify-content-end">
              <!-- หน้าแรกสุด -->
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" @click="goToPage(1)" href="javascript:void(0)">
                  <i class="fa fa-angle-double-left"></i>
                </a>
              </li>

              <!-- หน้าก่อนหน้า -->
              <li class="page-item" :class="{ disabled: currentPage === 1 }">
                <a class="page-link" @click="goToPage(currentPage - 1)" href="javascript:void(0)">
                  <i class="fa fa-angle-left"></i>
                </a>
              </li>

              <!-- เลขหน้า -->
              <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: currentPage === page }">
                <a class="page-link" @click="goToPage(page)" href="javascript:void(0)">{{ page }}</a>
              </li>

              <!-- หน้าถัดไป -->
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" @click="goToPage(currentPage + 1)" href="javascript:void(0)">
                  <i class="fa fa-angle-right"></i>
                </a>
              </li>

              <!-- หน้าท้ายสุด -->
              <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                <a class="page-link" @click="goToPage(totalPages)" href="javascript:void(0)">
                  <i class="fa fa-angle-double-right"></i>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import productsJson from '~/data/products.json'
import { useCartStore } from '~/store/cart'

const q = ref('')
const allProducts = productsJson.data || []
const cart = useCartStore()

// Pagination
const currentPage = ref(1)
const itemsPerPage = 40 // 8 แถว x 5 คอลัมน์

const filteredProducts = computed(() => {
  const term = (q.value || '').toLowerCase().trim()
  if (!term) return allProducts
  return allProducts.filter(p => (p.title || '').toLowerCase().includes(term) || (p.brand || '').toLowerCase().includes(term))
})

// เมื่อค้นหาใหม่ ให้กลับไปหน้า 1
watch(q, () => {
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

// แสดงเฉพาะเลขหน้าที่เกี่ยวข้อง (แสดงสูงสุด 5 หน้า)
const visiblePages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []
  
  if (total <= 5) {
    // ถ้ามีไม่เกิน 5 หน้า แสดงทั้งหมด
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // ถ้ามีมากกว่า 5 หน้า แสดงหน้าปัจจุบันและข้างเคียง
    if (current <= 3) {
      // อยู่ต้นๆ
      pages.push(1, 2, 3, 4, 5)
    } else if (current >= total - 2) {
      // อยู่ท้ายๆ
      pages.push(total - 4, total - 3, total - 2, total - 1, total)
    } else {
      // อยู่กลางๆ
      pages.push(current - 2, current - 1, current, current + 1, current + 2)
    }
  }
  
  return pages
})

const searchSection = ref(null)

function goToPage(page) {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
  // เลื่อนไปที่ช่องค้นหา
  if (searchSection.value) {
    searchSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function getImgUrl(product) {
  const img = (product.images && product.images[0] && product.images[0].src) ? product.images[0].src : null
  return img ? `/images/${img}` : '/images/placeholder.png'
}

function discountedPrice(p) {
  const d = Number(p.discount || 0)
  if (!d) return p.price
  return Math.round(p.price * (1 - d / 100))
}

function addToCart(product) {
  cart.addToCart({ id: product.id, quantity: 1 })
}
</script>

<style scoped>
/* Banner */
.marketplace { background:#fafafa; }
.marketplace .hero { display:flex; align-items:center; justify-content:center; background:#fff; border-radius:8px; overflow:hidden; box-shadow:0 6px 18px rgba(0,0,0,0.06); margin-bottom:22px; position:relative }
.marketplace .hero img { width:100%; height:480px; object-fit:cover; display:block; }
.marketplace .hero .hero-text { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; color:#fff; padding:0 18px }
.marketplace .hero .title { font-size:44px; font-weight:700; text-shadow:0 2px 12px rgba(0,0,0,0.45); }
.marketplace .hero .cta { margin-top:12px; }

/* Search */
.marketplace input.form-control { height:48px; border-radius:6px; padding:0 16px; border:1px solid #e6e6e6; }

/* Product card */
.marketplace .card { border:1px solid #eee; border-radius:8px; transition:transform .18s ease, box-shadow .18s ease; overflow:hidden }
.marketplace .card:hover { transform:translateY(-6px); box-shadow:0 12px 30px rgba(17,24,39,0.08); }
.marketplace .card .card-img-top { background:#f5f5f5; height:260px; object-fit:cover }
.marketplace .card .card-body { padding:12px; }
.marketplace .card .card-title { font-size:14px; line-height:1.2; }
.marketplace .card .fw-bold { color:#111827; font-size:16px }
.marketplace .card .text-muted { color:#6b7280 }
.marketplace .btn-sm { padding:6px 10px; border-radius:6px }

/* 5-column grid */
.product-grid { display:grid; grid-template-columns: repeat(5, 1fr); gap:18px; }
.product-card { display:block }

@media (max-width: 1400px) {
  .product-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 1100px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
  .marketplace .card .card-img-top { height:220px }
}
@media (max-width: 767px) {
  .product-grid { grid-template-columns: repeat(2, 1fr); }
  .marketplace .hero img { height:260px }
  .marketplace .card .card-img-top { height:160px }
}
@media (max-width: 480px) {
  .product-grid { grid-template-columns: repeat(1, 1fr); }
  .marketplace .hero img { height:180px }
}

/* Responsive tweaks */
@media (max-width: 767px) {
  .marketplace .hero img { height:180px }
  .marketplace .card .card-img-top { height:160px }
}

/* Pagination styles */
.pagination-wrapper { margin-top:30px; margin-bottom:30px; }
.pagination { margin:0; }
.pagination .page-item { margin:0 3px; }
.pagination .page-link { 
  border:1px solid #dee2e6; 
  border-radius:6px; 
  padding:8px 14px; 
  color:#495057; 
  cursor:pointer; 
  transition:all .2s ease;
}
.pagination .page-link:hover { 
  background:#f8f9fa; 
  border-color:#dee2e6; 
  color:#111; 
}
.pagination .page-item.active .page-link { 
  background:#0d6efd; 
  border-color:#0d6efd; 
  color:#fff; 
  font-weight:600;
}
.pagination .page-item.disabled .page-link { 
  opacity:0.5; 
  cursor:not-allowed; 
  pointer-events:none; 
}
.pagination .page-link i { font-size:14px; }

@media (max-width: 767px) {
  .pagination .page-link { padding:6px 10px; font-size:14px; }
  .pagination .page-item { margin:0 2px; }
}
</style>