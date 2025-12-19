<template>
  <div>
    <Header />
    <section class="seller-hero py-4">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-auto">
            <div class="avatar rounded-circle bg-light text-center" style="width:88px;height:88px;line-height:88px;font-size:28px">{{ sellerInitial }}</div>
          </div>
          <div class="col">
            <h2>{{ seller.display_name }}</h2>
            <div class="text-muted">คะแนน {{ seller.rating }} · ผู้ติดตาม {{ seller.followers }}</div>
            <p class="mt-2">{{ seller.description }}</p>
          </div>
          <div class="col-auto">
            <button class="btn btn-primary">ติดตาม</button>
          </div>
        </div>
      </div>
    </section>

    <section class="seller-products py-4">
      <div class="container">
        <h5>สินค้าจาก {{ seller.display_name }}</h5>
        <div class="row mt-3">
          <div v-if="products.length === 0" class="col-12"><div class="alert alert-secondary">ยังไม่มีสินค้า</div></div>
          <div v-for="p in products" :key="p.id" class="col-xl-3 col-lg-4 col-md-4 col-sm-6 mb-4">
            <ProductBox1 :product="p" :index="p.id" />
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script>
import ProductBox1 from '~/components/product-box/product-box1.vue'
import { useSellerStore } from '~~/store/sellers'
import { useProductStore } from '~~/store/products'
export default {
  components: { Header: () => import('~~/components/header/index.vue'), Footer: () => import('~~/components/footer/index.vue'), ProductBox1 },
  computed: {
    sellerId() { return this.$route.params.id },
    seller() {
      return useSellerStore().getSellerById(this.sellerId) || { name: this.sellerId, display_name: this.sellerId, rating: '-', followers: 0, description: '' }
    },
    sellerInitial() { return this.seller && this.seller.display_name ? this.seller.display_name.charAt(0).toUpperCase() : 'S' },
    products() {
      // prefer explicit seller name mapping; fall back to brand matching
      const pstore = useProductStore()
      if (this.seller && this.seller.name) {
        return pstore.getProductsByBrand(this.seller.name)
      }
      return []
    }
  }
}
</script>

<style scoped>
.avatar{font-weight:700}
</style>
