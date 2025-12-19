<template>
  <div>
    <Header />
    <section class="shop-header py-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="shop-avatar rounded-circle bg-light text-center" style="width:88px;height:88px;line-height:88px;font-size:32px;">{{ brandInitial }}</div>
          </div>
          <div class="col">
            <h2 class="mb-1">{{ brand }}</h2>
            <div class="shop-meta text-muted">ร้านค้าแบบ mockup — ติดตามได้ · คะแนน 4.9 · ตอบแชทเร็ว</div>
          </div>
          <div class="col-auto">
            <button class="btn btn-outline-primary">ติดตาม</button>
          </div>
        </div>
      </div>
    </section>

    <section class="shop-products py-4">
      <div class="container">
        <div class="row mb-3">
          <div class="col">
            <h4>สินค้าจาก {{ brand }}</h4>
          </div>
          <div class="col-auto">
            <input v-model="q" class="form-control" placeholder="ค้นหาในร้านนี้" />
          </div>
        </div>

        <div class="row">
          <div v-if="filtered.length === 0" class="col-12">
            <div class="alert alert-secondary">ไม่พบสินค้าที่ตรงกับคำค้นหา</div>
          </div>
          <div v-for="product in pagedProducts" :key="product.id" class="col-xl-3 col-lg-4 col-md-4 col-sm-6 mb-4">
            <ProductBox1 :product="product" :index="product.id" />
          </div>
        </div>

      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import ProductBox1 from '~/components/product-box/product-box1.vue'
import { useProductStore } from '~~/store/products'
export default {
  components: { Header: () => import('~~/components/header/index.vue'), Footer: () => import('~~/components/footer/index.vue'), ProductBox1 },
  data() {
    return {
      q: ''
    }
  },
  computed: {
    brand() {
      return this.$route.params.brand || ''
    },
    brandInitial() {
      return this.brand ? this.brand.charAt(0).toUpperCase() : 'S'
    },
    products() {
      return useProductStore().products
    },
    filtered() {
      const b = (this.brand || '').toLowerCase()
      return this.products.filter(p => p.brand && p.brand.toLowerCase() === b && (this.q === '' || p.title.toLowerCase().includes(this.q.toLowerCase())))
    },
    pagedProducts() {
      return this.filtered
    }
  }
}
</script>

<style scoped>
.shop-header{background:#fff}
.shop-avatar{font-weight:700}
.seller-name{color:#333;text-decoration:none}
</style>
