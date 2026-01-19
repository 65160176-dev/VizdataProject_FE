<template>
<Header/> 
  <div>
    <ClientOnly>
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="mt-2">กำลังโหลดข้อมูลสินค้า...</p>
    </div>
    <div v-else-if="!product" class="text-center py-5">
      <p class="text-muted">ไม่พบข้อมูลสินค้า</p>
    </div>
    <div v-else>
    <WidgetsBreadcrumbs :title="product.name" />
    <section>
      <div class="collection-wrapper">
        <div class="container-fluid px-4">
          <div class="row">
            <div class="col-lg-1 col-sm-2 col-xs-12">
              <div class="row">
                <div class="col-12 slider-nav-images">
                  <div class="swiper-wrapper slider-right-nav">
                    <div class="swiper-slide">
                      <img :src="getProductImage(product.image)" class="img-fluid bg-img" alt="" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-3 col-sm-10 col-xs-12 order-up">
              <div class="swiper-wrapper">
                <div class="swiper-slide">
                  <img :src="getProductImage(product.image)" class="img-fluid bg-img" alt="" style="max-height: 400px; object-fit: contain;" />
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="product-right product-description-box">
                <h2>{{ product.name }}</h2>
                
                <div class="seller-block mt-3 p-3 border rounded bg-light" v-if="seller && $route.query.hideSeller !== 'true'">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <label class="text-muted small mb-1">ร้านค้า</label>
                      <h5 class="mb-0">{{ seller.display_name || seller.name }}</h5>
                      <p class="text-muted small mb-0" v-if="seller.description">{{ seller.description }}</p>
                    </div>
                    <nuxt-link :to="{ path: '/seller/' + product.userId }" class="btn btn-sm btn-outline-primary">
                      <i class="ti-eye"></i> ดูร้าน
                    </nuxt-link>
                  </div>
                </div>

                <div class="pro_inventory" v-if="product.stock < 8 && product.stock > 0">
                  <p class="active"> เหลือเพียง {{ product.stock }} ชิ้น! </p>
                  <div class="inventory-scroll">
                    <span :style="{ width: (product.stock / 8 * 100) + '%' }"></span>
                  </div>
                </div>
                <div class="single-product-tables border-product detail-section">
                  <table>
                    <tbody>
                      <tr>
                        <td>หมวดหมู่:</td>
                        <td>{{ product.category || '-' }}</td>
                      </tr>
                      <tr>
                        <td>น้ำหนัก:</td>
                        <td>{{ product.weight || '-' }} กิโลกรัม</td>
                      </tr>
                      <tr>
                        <td>ค่าจัดส่ง:</td>
                        <td>฿{{ product.shippingCost || 0 }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="border-product">
                  <h6 class="product-title">share it</h6>
                  <div class="product-icon">
                    <ul class="product-social">
                      <li><a href="javascript:void(0)"><i class="fa fa-facebook"></i></a></li>
                      <li><a href="javascript:void(0)"><i class="fa fa-google-plus"></i></a></li>
                    </ul>
                    <form class="d-inline-block" @submit.prevent>
                      <button type="button" class="wishlist-btn" @click="addToWishlist(product)">
                        <i class="fa fa-heart"></i><span class="title-font">Add To WishList</span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-lg-4">
              <div class="product-right product-form-box">
                <h3>฿{{ product.price?.toFixed(2) }}</h3>
                <div class="text-muted small mb-3">คอมมิชชั่น: {{ product.commission }}%</div>
                
                <div class="border-product">
                  <h5 class="avalibility" v-if="product.stock > 0 && counter <= product.stock">
                    <span>มีสินค้า (เหลือ {{ product.stock }} ชิ้น)</span>
                  </h5>
                  <h5 class="avalibility text-danger" v-else>
                    <span>สินค้าหมด</span>
                  </h5>
                  
                  <h6 class="product-title">จำนวน</h6>
                  <div class="qty-box d-flex justify-content-center">
                    <div class="input-group" style="width: 140px;">
                      <span class="input-group-prepend">
                        <button type="button" class="btn quantity-left-minus" style="padding: 10px 15px; height: 45px;" @click="decrement()" :disabled="counter <= 1">
                          <i class="ti-angle-left"></i>
                        </button>
                      </span>
                      <input type="text" name="quantity" class="form-control input-number text-center" style="height: 45px; font-size: 16px; font-weight: 600;" :disabled="counter > product.stock" v-model="counter" readonly />
                      <span class="input-group-prepend">
                        <button type="button" class="btn quantity-right-plus" style="padding: 10px 15px; height: 45px;" @click="increment()" :disabled="counter >= product.stock">
                          <i class="ti-angle-right"></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <div class="product-buttons">
                  <button class="btn btn-solid" style="padding: 12px 24px; height: auto; min-height: 45px;" @click="addToCart(product, counter)" :disabled="counter > product.stock || product.stock === 0">เพิ่มลงรถเข็น</button>
                  <button class="btn btn-solid" style="padding: 12px 24px; height: auto; min-height: 45px;" @click="buyNow(product, counter)" :disabled="counter > product.stock || product.stock === 0">ซื้อเลย</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section class="tab-product m-0">
        <div class="container-fluid px-4">
          <div class="row">
            <div class="col-sm-12 col-lg-12">
              <ul class="nav nav-tabs nav-material" id="top-tab" role="tablist">
                <li class="nav-item">
                  <a class="nav-link active" id="top-home-tab" data-bs-toggle="tab" href="#top-home" role="tab" aria-selected="true"><i class="icofont icofont-ui-home"></i>Details</a>
                  <div class="material-border"></div>
                </li>
              </ul>
              <div class="tab-content nav-material" id="top-tabContent">
                <div class="tab-pane fade show active" id="top-home" role="tabpanel">
                  <div class="product-tab-discription">
                    <div class="part">
                      <h5 class="inner-title">รายละเอียดสินค้า:</h5>
                      <p>{{ product.description || 'ไม่มีรายละเอียด' }}</p>
                    </div>
                    <div class="part">
                      <h5 class="inner-title">เอาอะไรก็ได้มาใส่ค้าบ:</h5>
                      <p>ABCDEFG</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
    </div>
    </ClientOnly>
  </div>
  <Footer />
</template>

<script>
import { useProductStore } from '~~/store/products'
import { useCartStore } from '~~/store/cart'

export default {
  data() {
    return {
      product: null,
      seller: null,
      loading: true,
      counter: 1,
    }
  },
  async mounted() {
    await this.fetchProductDetail()
  },
  methods: {
    async fetchProductDetail() {
      try {
        this.loading = true
        const productId = this.$route.query.id
        const response = await $fetch(`http://localhost:3001/api/product/${productId}`)
        this.product = response
        
        if (this.product.userId && this.$route.query.hideSeller !== 'true') {
          try {
            const sellerResponse = await $fetch(`http://localhost:3001/api/sellers/by-user/${this.product.userId}`)
            this.seller = sellerResponse
          } catch (error) { console.error('Failed to fetch seller:', error) }
        }
      } catch (error) { console.error('Failed to fetch product:', error)
      } finally { this.loading = false }
    },
    getProductImage(image) {
      if (!image) return '/images/placeholder.jpg'
      return image.startsWith('http') ? image : `/images/${image}`
    },
    // เพิ่มฟังก์ชัน Wishlist กลับมา
    addToWishlist(product) {
      if (useNuxtApp().$showToast) {
        useNuxtApp().$showToast({ 
          msg: `เพิ่ม ${product.name || product.title} ในรายการที่ชอบ`, 
          type: 'info' 
        })
      }
      useProductStore().addToWishlist(product)
    },
    addToCart(product, qty) {
      const cartProduct = { ...product, quantity: qty || 1, title: product.name, price: Number(product.price) || 0, seller: this.seller }
      useCartStore().addToCart(cartProduct)
      if (useNuxtApp().$showToast) { useNuxtApp().$showToast({ msg: `เพิ่ม ${product.name} ลงตะกร้าเรียบร้อย`, type: "success" }) }
    },
    buyNow(product, qty) {
      this.addToCart(product, qty)
      this.$router.push('/page/account/checkout')
    },
    increment() { if (this.counter < this.product.stock) this.counter++ },
    decrement() { if (this.counter > 1) this.counter-- }
  }
}
</script>

<style scoped>
.seller-name{font-size:16px;font-weight:600;color:#333}
.seller-block small{font-size:12px}
.card img{height:150px;object-fit:cover}
</style>