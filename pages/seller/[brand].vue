<template>
  <Header />
  <div>
    <button class="seller-back-btn btn btn-light" type="button" @click="goBack">
      <i class="fa fa-arrow-left"></i>
      กลับ
    </button>

    <div class="container py-4">
      <WidgetsBreadcrumbs :title="sellerName" />

      <section class="seller-page">
        <div class="row mb-3">
          <div class="col-md-8">
            <h2>ร้านค้า: {{ sellerName }}</h2>
          </div>
        </div>

        <div v-if="sellerProducts.length === 0" class="alert alert-secondary">ไม่มีสินค้าในร้านนี้</div>

        <div class="row">
          <div v-for="p in sellerProducts" :key="p.id" class="col-xl-3 col-lg-4 col-md-4 col-sm-6 mb-3">
            <div class="card h-100">
              <nuxt-link :to="{ path: '/product/three-column/thumbnail-left', query: { id: p.id } }">
                <img :src="getImgUrl(p.images[0].src)" class="card-img-top" alt="" />
              </nuxt-link>
              <div class="card-body p-2">
                <h6 class="mb-1" style="font-size:14px">{{ p.title }}</h6>
                <div class="text-muted small">{{ p.category || p.type }}</div>
                <div class="mt-1">{{ curr.symbol }}{{ (p.price * curr.curr).toFixed(2) }}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <Footer />
  </div>
</template>

<script>
import { useProductStore } from '~~/store/products'
export default {
  computed: {
    sellerName() {
      return this.$route && this.$route.params && decodeURIComponent(this.$route.params.brand || '')
    },
    sellerProducts() {
      return useProductStore().getProductsByBrand(this.sellerName)
    },
    curr() {
      return useProductStore().changeCurrency
    }
  },
  methods: {
    getImgUrl(path) {
      return '/images/' + path
    }
  }
}
</script>

<style scoped>
.seller-back-btn {
  position: fixed;
  top: 80px;
  left: 16px;
  z-index: 1100;
  padding: 6px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
}

@media (max-width: 576px) {
  .seller-back-btn { top: 64px; left: 10px; }
}
</style>
