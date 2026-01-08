<template>
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
              {{ seller?.display_name?.charAt(0) || seller?.name?.charAt(0) || 'S' }}
            </div>
          </div>
          <div class="col-md mt-3 mt-md-0">
            <h2 class="fw-bold mb-1">{{ seller?.display_name || seller?.name || 'ร้านค้า' }}</h2>
            <p class="text-muted mb-0">ยินดีต้อนรับสู่หน้าร้านค้าของเรา</p>
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
      <h4 class="fw-bold mb-4">สินค้าในร้านนี้ ({{ products.length }})</h4>
      
      <div v-if="products.length > 0" class="row g-3">
        <div v-for="p in products" :key="p._id" class="col-6 col-md-4 col-lg-3">
          <div class="card h-100 border-0 shadow-sm product-card">
            <nuxt-link :to="{ 
              path: '/product/three-column/thumbnail-left', 
              query: { id: p._id, hideSeller: 'true' } 
            }">
              <div class="product-img-wrapper">
                <img :src="p.image" class="card-img-top" alt="Product Image" />
              </div>
            </nuxt-link>
            <div class="card-body p-3 text-center">
              <h6 class="text-truncate mb-2" style="font-size: 14px;">{{ p.name }}</h6>
              <div class="text-danger fw-bold">฿{{ p.price?.toLocaleString() }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="!loading" class="text-center py-5">
        <p class="text-muted fs-5">ยังไม่มีรายการสินค้าในขณะนี้</p>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
export default {
  data() {
    return {
      seller: null,
      products: [],
      loading: true
    }
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        this.loading = true
        const sellerId = this.$route.params.brand; 

        // ดึงข้อมูลโปรไฟล์ร้านค้า
        const sellerRes = await $fetch(`http://localhost:3001/api/sellers/by-user/${sellerId}`)
        this.seller = sellerRes

        // ดึงเฉพาะสินค้าของร้านนี้
        const productsRes = await $fetch(`http://localhost:3001/api/product/seller/${sellerId}`)
        this.products = productsRes

      } catch (error) {
        console.error('Error fetching seller data:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.seller-logo {
  width: 80px; height: 80px; background: #ff4c3b; color: #fff;
  font-size: 32px; font-weight: bold; border-radius: 15px;
  display: flex; align-items: center; justify-content: center; margin: 0 auto;
}
.product-card { border-radius: 12px; overflow: hidden; transition: 0.3s; }
.product-card:hover { transform: translateY(-5px); box-shadow: 0 5px 15px rgba(0,0,0,0.1) !important; }
.product-img-wrapper { aspect-ratio: 1/1; background: #f8f9fa; overflow: hidden; }
.product-img-wrapper img { width: 100%; height: 100%; object-fit: contain; }
</style>