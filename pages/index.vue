<template>
  <div>
    <Header />

    <section class="marketplace py-4">
      <div class="container">
        <div class="hero position-relative mb-3">
          <img src="/images/yoga/banner/Banner-1.jpg" alt="banner" />
          <div class="hero-text">
            <div class="title">ช็อปสินค้า Marketplace — ร้านค้าหลากหลาย</div>
            <div class="cta"><button class="btn btn-danger">ช้อปเลย</button></div>
          </div>
        </div>
        <div class="row mb-3">
          <div class="col-12">
            <input v-model="q" class="form-control" placeholder="ค้นหาสินค้า หรือ ร้านค้า" />
          </div>
        </div>

        <div class="product-grid">
          <div v-for="product in filteredProducts" :key="product.id" class="product-card">
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
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import productsJson from '~/data/products.json'
import { useCartStore } from '~/store/cart'

const q = ref('')
const allProducts = productsJson.data || []
const cart = useCartStore()

const filteredProducts = computed(() => {
  const term = (q.value || '').toLowerCase().trim()
  if (!term) return allProducts
  return allProducts.filter(p => (p.title || '').toLowerCase().includes(term) || (p.brand || '').toLowerCase().includes(term))
})

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
</style>