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
                        <td>ค่าจัดส่ง: (ต่อชิ้น)</td>
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
                      <input type="text" name="quantity" class="form-control input-number text-center qty-input-custom" style="height: 45px; font-size: 16px; font-weight: 600;" :disabled="counter > product.stock" v-model="counter" readonly />
                      <span class="input-group-prepend">
                        <button type="button" class="btn quantity-right-plus" style="padding: 10px 15px; height: 45px;" @click="increment()" :disabled="counter >= product.stock">
                          <i class="ti-angle-right"></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>

                <div class="product-buttons">
                  <button class="btn btn-solid" style="padding: 12px 24px; height: auto; min-height: 45px;" @click="addToCart(product, counter)">เพิ่มลงรถเข็น</button>
                  <button class="btn btn-solid" style="padding: 12px 24px; height: auto; min-height: 45px;" @click="buyNow(product, counter)">ซื้อเลย</button>
                </div>
 
 
                <div class="border-product mt-3" v-if="isAffiliate">
                  <h6 class="product-title">🔗 แชร์ลิงก์รับค่าคอม (Affiliate)</h6>
                  <div class="d-flex gap-2 align-items-center">
                    <input 
                      type="text" 
                      :value="affiliateLink" 
                      readonly 
                      class="form-control form-control-sm"
                    />
                    <button 
                      @click="copyAffiliateLink" 
                      class="btn btn-outline-primary btn-sm"
                      style="min-width: 100px;"
                    >
                      <i class="fa fa-copy me-1"></i>Copy
                    </button>
                  </div>
                  <small class="text-muted mt-1 d-block">คัดลอกลิงก์ไปแชร์เพื่อรับค่าคอมมิชชั่น</small>
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

    <!-- Related Products Section -->
    <section class="section-b-space ratio_asos" v-if="relatedProducts.length > 0">
      <div class="container-fluid px-4">
        <div class="row">
          <div class="col-12 product-related">
            <h2>สินค้าในหมวดเดียวกัน</h2>
          </div>
        </div>
        <div class="product-grid">
          <div v-for="(prod, idx) in relatedProducts" :key="'related-' + idx" class="product-card">
            <div class="card h-100 shadow-sm">
              <div class="card-img-wrap" @click="navigateToProduct(prod._id || prod.id)">
                <img :src="getProductImage(prod.image)" class="card-img-top" :alt="prod.name" />
              </div>
              <div class="card-body d-flex flex-column">
                <h6 class="card-title mb-1 text-truncate" @click="navigateToProduct(prod._id || prod.id)" style="cursor: pointer;">{{ prod.name }}</h6>
                <div class="mt-auto d-flex justify-content-between align-items-center">
                  <div class="fw-bold">฿{{ prod.price?.toLocaleString() }}</div>
                  <button class="btn-cart" @click="addToCart(prod, 1)" title="เพิ่มลงตะกร้า">
                    <Icon name="feather:shopping-cart" size="18" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Random Products Section -->
    <section class="section-b-space ratio_asos" v-if="randomProducts.length > 0">
      <div class="container-fluid px-4">
        <div class="row">
          <div class="col-12 product-related">
            <h2>สินค้าแนะนำ</h2>
          </div>
        </div>
        <div class="product-grid">
          <div v-for="(prod, idx) in randomProducts" :key="'random-' + idx" class="product-card">
            <div class="card h-100 shadow-sm">
              <div class="card-img-wrap" @click="navigateToProduct(prod._id || prod.id)">
                <img :src="getProductImage(prod.image)" class="card-img-top" :alt="prod.name" />
              </div>
              <div class="card-body d-flex flex-column">
                <h6 class="card-title mb-1 text-truncate" @click="navigateToProduct(prod._id || prod.id)" style="cursor: pointer;">{{ prod.name }}</h6>
                <div class="mt-auto d-flex justify-content-between align-items-center">
                  <div class="fw-bold">฿{{ prod.price?.toLocaleString() }}</div>
                  <button class="btn-cart" @click="addToCart(prod, 1)" title="เพิ่มลงตะกร้า">
                    <Icon name="feather:shopping-cart" size="18" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    </div>
    </ClientOnly>
  </div>
  <Footer />
</template>

<script>
import { useProductStore } from '~~/store/products'
import { useCartStore } from '~~/store/cart'
import { useAuthStore } from '~/store/auth'
import { affiliateService } from '~/services/affiliate.service'

export default {
  data() {
    return {
      product: null,
      seller: null,
      loading: true,
      counter: 1,
      relatedProducts: [],
      randomProducts: [],
      isAffiliate: false,
      affiliateCode: null
    }
  },
  async mounted() {
    await this.fetchProductDetail()
    await this.fetchRelatedProducts()
    await this.fetchRandomProducts()
    await this.checkAffiliateStatus()
  },
   computed: {
    affiliateLink() {
      if (!this.product || !this.affiliateCode) return ''
      const productId = this.product._id || this.product.id
      // ใช้พารามิเตอร์ 'ref' ให้สอดคล้องกับตัวติดตาม affiliate ฝั่ง client
      return `${window.location.origin}/product/three-column/thumbnail-left?id=${productId}&ref=${this.affiliateCode}`
    }
  },
  methods: {
    async checkAffiliateStatus() {
      try {
        const authStore = useAuthStore()
        const userId = authStore.user?._id || authStore.user?.id
        if (!userId) return

        const data = await affiliateService.getMyAffiliate(userId)
        if (data && data.code) {
          this.isAffiliate = true
          this.affiliateCode = data.code
        }
      } catch (error) {
        // ไม่ใช่ affiliate
        this.isAffiliate = false
      }
    },
    copyAffiliateLink() {
      if (!this.affiliateLink) return
      navigator.clipboard.writeText(this.affiliateLink).then(() => {
        if (useNuxtApp().$showToast) {
          useNuxtApp().$showToast({ msg: 'คัดลอกลิงก์แล้ว!', type: 'success' })
        }
      }).catch(err => {
        console.error('Failed to copy:', err)
      })
    },
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
      // สร้าง item สำหรับ checkout
      const checkoutItem = {
        ...product,
        id: product._id || product.id,
        _id: product._id || product.id,
        quantity: qty || 1,
        title: product.name,
        name: product.name,
        price: Number(product.price) || 0,
        seller: this.seller,
        shippingCost: product.shippingCost || 'Free',
        image: product.image
      }
      
      // เซ็ตเฉพาะสินค้านี้ใน localStorage สำหรับหน้า checkout
      localStorage.setItem('checkout_items', JSON.stringify([checkoutItem]))
      
      // ไปหน้า checkout
      this.$router.push('/page/account/checkout')
    },
    increment() { if (this.counter < this.product.stock) this.counter++ },
    decrement() { if (this.counter > 1) this.counter-- },
    
    async fetchRelatedProducts() {
      try {
        if (!this.product || !this.product.category) return
        
        // ดึงสินค้าในหมวดเดียวกัน
        const allProducts = await $fetch('http://localhost:3001/api/product')
        const related = allProducts.filter(p => 
          p.category === this.product.category && 
          (p._id !== this.product._id && p.id !== this.product.id) &&
          p.stock && p.stock > 0  // ซ่อนสินค้าที่หมด
        )
        
        // สุ่มเอา 6 ตัว
        this.relatedProducts = this.shuffleArray(related).slice(0, 5)
      } catch (error) {
        console.error('Failed to fetch related products:', error)
        this.relatedProducts = []
      }
    },
    
    async fetchRandomProducts() {
      try {
        // ดึงสินค้าทั้งหมด
        const allProducts = await $fetch('http://localhost:3001/api/product')
        const filtered = allProducts.filter(p => 
          p._id !== this.product._id && p.id !== this.product.id &&
          p.stock && p.stock > 0  // ซ่อนสินค้าที่หมด
        )
        
        // สุ่มเอา 6 ตัว
        this.randomProducts = this.shuffleArray(filtered).slice(0, 5)
      } catch (error) {
        console.error('Failed to fetch random products:', error)
        this.randomProducts = []
      }
    },
    
    shuffleArray(array) {
      const shuffled = [...array]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }
      return shuffled
    },
    
    navigateToProduct(productId) {
      // Reload page with new product ID
      window.location.href = `/product/three-column/thumbnail-left?id=${productId}`
    }
  }
}
</script>

<style scoped>
.seller-name{font-size:16px;font-weight:600;color:#333}
.seller-block small{font-size:12px}
.card img{height:150px;object-fit:cover}

.product-related h2 {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}

/* Product Grid (index style) */
.product-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
}
.product-card { display: block; }

.card { border: 1px solid #eee; border-radius: 8px; transition: transform .18s ease, box-shadow .18s ease; overflow: hidden; }
.card:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(17,24,39,0.08); }
.card-img-wrap { height: 200px; overflow: hidden; background: #f5f5f5; cursor: pointer; }
.card .card-img-top { width: 100%; height: 100%; object-fit: cover; display: block; }
.card .card-body { padding: 10px; }
.card .card-title { font-size: 14px; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.card .fw-bold { color: #111827; font-size: 16px; }

/* Cart Button */
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

/* Responsive */
@media (max-width: 1400px) { .product-grid { grid-template-columns: repeat(4, 1fr); } }
@media (max-width: 1100px) { .product-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 767px) { .product-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .product-grid { grid-template-columns: repeat(1, 1fr); } }

.qty-input-custom {
  border-color: #ced4da !important;
  box-shadow: none !important;
  outline: none !important;
}

.qty-input-custom:focus {
  border-color: #ced4da !important;
  box-shadow: none !important;
  outline: none !important;
}

.qty-input-custom:active {
  border-color: #ced4da !important;
  box-shadow: none !important;
  outline: none !important;
}

.qty-input-custom:disabled {
  border-color: #ced4da !important;
  background-color: #e9ecef !important;
}

/* ลบกรอบสีส้มออกจากปุ่มเพิ่ม/ลด */
.qty-box .btn {
  border-color: #ced4da !important;
  box-shadow: none !important;
  outline: none !important;
}

.qty-box .btn:focus,
.qty-box .btn:active,
.qty-box .btn:hover {
  border-color: #ced4da !important;
  box-shadow: none !important;
  outline: none !important;
}

.quantity-left-minus,
.quantity-right-plus {
  border-color: #ced4da !important;
  box-shadow: none !important;
  outline: none !important;
}

.quantity-left-minus:focus,
.quantity-left-minus:active,
.quantity-right-plus:focus,
.quantity-right-plus:active {
  border-color: #ced4da !important;
  box-shadow: none !important;
  outline: none !important;
}
</style>