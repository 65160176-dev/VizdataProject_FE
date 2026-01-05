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
        <div class="container">
          <div class="mb-3">
            <button @click="$router.back()" class="btn btn-sm btn-outline-secondary">
              <i class="ti-arrow-left"></i> Back
            </button>
          </div>
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
                <div class="seller-block mt-3 p-3 border rounded bg-light" v-if="seller">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <label class="text-muted small mb-1">ร้านค้า</label>
                      <h5 class="mb-0">{{ seller.display_name || seller.name }}</h5>
                      <p class="text-muted small mb-0" v-if="seller.description">{{ seller.description }}</p>
                    </div>
                    <nuxt-link :to="{ path: '/seller/' + seller._id }" class="btn btn-sm btn-outline-primary">
                      <i class="ti-eye"></i> ดูร้าน
                    </nuxt-link>
                  </div>
                </div>
                <div class="border-product">
                  <h6 class="product-title">รายละเอียดสินค้า</h6>
                  <p>{{ product.description || 'ไม่มีรายละเอียด' }}</p>
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
                      <tr v-if="seller">
                        <td>ร้านค้า:</td>
                        <td>{{ seller.display_name || seller.name }}</td>
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
                      <li><a href="javascript:void(0)"><i class="fa fa-twitter"></i></a></li>
                      <li><a href="javascript:void(0)"><i class="fa fa-instagram"></i></a></li>
                      <li><a href="javascript:void(0)"><i class="fa fa-rss"></i></a></li>
                    </ul>
                    <form class="d-inline-block">
                      <button class="wishlist-btn" @click="addToWishlist(product)">
                        <i class="fa fa-heart"></i><span class="title-font">Add To WishList</span></button>
                    </form>
                  </div>
                </div>
                
              </div>
            </div>
            <div class="col-lg-4">
              <div class="product-right product-form-box">
                <h3 class="text-danger">฿{{ product.price?.toFixed(2) }}</h3>
                <div class="text-muted small mb-3">คอมมิชชั่น: {{ product.commission }}%</div>
                <!-- <ul class="color-variant">
                  <li v-bind:class="{ active: activeColor == variant }"
                    v-for="(variant, variantIndex) in Color(getDetail.variants)" :key="variantIndex">
                    <a :class="[variant]" v-bind:style="{ 'background-color': variant }"
                      v-on:click="sizeVariant(getDetail.variants[variantIndex].image_id, variantIndex, variant)"></a>
                  </li>
                </ul> -->
                <div class="product-description border-product">
                  <h5 class="avalibility" v-if="product.stock > 0 && counter <= product.stock">
                    <span>มีสินค้า (เหลือ {{ product.stock }} ชิ้น)</span>
                  </h5>
                  <h5 class="avalibility text-danger" v-else>
                    <span>สินค้าหมด</span>
                  </h5>
                  <h6 class="product-title">quantity</h6>
                  <div class="qty-box">
                    <div class="input-group">
                      <span class="input-group-prepend">
                        <button type="button" class="btn quantity-left-minus" data-type="minus" data-field
                          @click="decrement()">
                          <i class="ti-angle-left"></i>
                        </button>
                      </span>
                      <input type="text" name="quantity" class="form-control input-number"
                        :disabled="counter > product.stock" v-model="counter" />
                      <span class="input-group-prepend">
                        <button type="button" class="btn quantity-right-plus" data-type="plus" data-field
                          @click="increment()" :disabled="counter >= product.stock">
                          <i class="ti-angle-right"></i>
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="product-buttons">
                  <button class="btn btn-solid" title="Add to cart" @click="addToCart(product, counter)"
                    :disabled="counter > product.stock || product.stock === 0">เพิ่มลงรถเข็น</button>
                  <button class="btn btn-solid" title="buy now" @click="buyNow(product, counter)"
                    :disabled="counter > product.stock || product.stock === 0">ซื้อเลย</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <section class="tab-product m-0">
        <div class="container">
          <div class="row">
            <div class="col-sm-12 col-lg-12">
              <ul class="nav nav-tabs nav-material" id="top-tab" role="tablist">
                <li class="nav-item">
                  <a class="nav-link active" id="top-home-tab" data-bs-toggle="tab" href="#top-home" role="tab"
                    aria-selected="true"><i class="icofont icofont-ui-home"></i>Details</a>
                  <div class="material-border"></div>
                </li>
            
                
              </ul>
              <div class="tab-content nav-material" id="top-tabContent">
                <div class="tab-pane fade show active" id="top-home" role="tabpanel" aria-labelledby="top-home-tab">
                  <div class="product-tab-discription">
                    <div class="part">
                      <p>The Model is wearing a white blouse from our stylist's collection, see the image
                        for a mock-up of what the actual blouse would look like.it has text written on
                        it in a black cursive language which looks great on a white color.</p>
                    </div>
                    <div class="part">
                      <h5 class="inner-title">fabric:</h5>
                      <p>Art silk is manufactured by synthetic fibres like rayon. It's light in weight and
                        is soft on the skin for comfort in summers.Art silk is manufactured by synthetic
                        fibres like rayon. It's light in weight and is soft on the skin for comfort in
                        summers.</p>
                    </div>
                    <div class="part">
                      <h5 class="inner-title">size & fit:</h5>
                      <p>The model (height 5'8") is wearing a size S</p>
                    </div>
                    <div class="part">
                      <h5 class="inner-title">Material & Care:</h5>
                      <p>Top fabric: pure cotton</p>
                      <p>Bottom fabric: pure cotton</p>
                      <p>Hand-wash</p>
                    </div>
                  </div>
                </div>
                <div class="tab-pane fade" id="top-profile" role="tabpanel" aria-labelledby="profile-top-tab">
                  <p>The Model is wearing a white blouse from our stylist's collection, see the image for a
                    mock-up of what the actual blouse would look like.it has text written on it in a black
                    cursive language which looks great on a white color.</p>
                  <div class="single-product-tables">
                    <table>
                      <tbody>
                        <tr>
                          <td>Sleeve Length</td>
                          <td>Sleevless</td>
                        </tr>
                        <tr>
                          <td>Neck</td>
                          <td>Round Neck</td>
                        </tr>
                        <tr>
                          <td>Occasion</td>
                          <td>Sports</td>
                        </tr>
                      </tbody>
                    </table>
                    <table>
                      <tbody>
                        <tr>
                          <td>Fabric</td>
                          <td>Polyester</td>
                        </tr>
                        <tr>
                          <td>Fit</td>
                          <td>Regular Fit</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div class="tab-pane fade" id="top-contact" role="tabpanel" aria-labelledby="contact-top-tab">
                  <div class="">
                    <iframe width="560" height="315" src="https://www.youtube.com/embed/BUWzX78Ye_8"
                      allow="autoplay; encrypted-media" allowfullscreen></iframe>
                  </div>
                </div>
                <div class="tab-pane fade" id="top-review" role="tabpanel" aria-labelledby="review-top-tab">
                  <form class="theme-form">
                    <div class="form-row row">
                      <div class="col-md-12">
                        <div class="media">
                          <label>Rating</label>
                          <div class="media-body ms-3">
                            <div class="rating three-star"><i class="fa fa-star"></i> <i class="fa fa-star"></i> <i
                                class="fa fa-star"></i> <i class="fa fa-star"></i> <i class="fa fa-star"></i></div>
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <label for="name">Name</label>
                        <input type="text" class="form-control" id="name" placeholder="Enter Your name" required>
                      </div>
                      <div class="col-md-6">
                        <label for="email">Email</label>
                        <input type="text" class="form-control" id="email" placeholder="Email" required>
                      </div>
                      <div class="col-md-12">
                        <label for="review">Review Title</label>
                        <input type="text" class="form-control" id="review" placeholder="Enter your Review Subjects"
                          required>
                      </div>
                      <div class="col-md-12">
                        <label for="review">Review Title</label>
                        <textarea class="form-control" placeholder="Wrire Your Testimonial Here"
                          id="exampleFormControlTextarea1" rows="6"></textarea>
                      </div>
                      <div class="col-md-12">
                        <button class="btn btn-solid" type="submit">Submit YOur
                          Review</button>
                      </div>
                    </div>
                  </form>
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
import { mapState } from 'pinia'
import {
  Swiper,
  SwiperSlide
} from "swiper/vue";
import 'swiper/css';
import { useProductStore } from '~~/store/products'
import { useCartStore } from '~~/store/cart'
export default {
  components: {
 Swiper, SwiperSlide
  },
  data() {
    return {
      product: null,
      seller: null,
      loading: true,
      slideId: 0,
      counter: 1,
    }
  },
  async mounted() {
    await this.fetchProductDetail()
  },
  computed: {
    curr() {
      return useProductStore().changeCurrency
    },
  },
  
  methods: {
    async fetchProductDetail() {
      try {
        this.loading = true
        const productId = this.$route.params.id || this.$route.query.id
        
        // Fetch product detail
        const response = await $fetch(`http://localhost:3001/api/product/${productId}`)
        this.product = response
        
        // Fetch seller info
        if (this.product.userId) {
          try {
            const sellerResponse = await $fetch(`http://localhost:3001/api/sellers/by-user/${this.product.userId}`)
            this.seller = sellerResponse
          } catch (error) {
            console.error('Failed to fetch seller:', error)
          }
        }
      } catch (error) {
        console.error('Failed to fetch product:', error)
      } finally {
        this.loading = false
      }
    },
    getProductImage(image) {
      if (!image) return '/images/placeholder.jpg'
      if (image.startsWith('http')) return image
      return `/images/${image}`
    },
    addToCart: async function (product, qty) {
      console.log('Adding to cart - Product:', product)
      console.log('Seller info:', this.seller)
      
      const cartProduct = {
        ...product,
        quantity: qty || 1,
        // Map fields for cart compatibility
        title: product.name,
        name: product.name,
        id: product._id,
        _id: product._id,
        price: Number(product.price) || 0,
        shippingCost: product.shippingCost || 'Free',
        image: product.image,
        stock: product.stock || 0,
        commission: product.commission || 0,
        weight: product.weight || 0,
        description: product.description || '',
        category: product.category || '',
        // เพิ่มข้อมูล seller
        seller: this.seller
      }
      
      console.log('Cart product to add:', cartProduct)
      
      await useCartStore().addToCart(cartProduct)
      
      // แสดง notification
      if (useNuxtApp().$showToast) {
        useNuxtApp().$showToast({ 
          msg: `เพิ่ม ${product.name} ลงตะกร้าเรียบร้อย`, 
          type: "success" 
        })
      } else {
        alert(`เพิ่ม ${product.name} ลงตะกร้าเรียบร้อย`)
      }
    },
    buyNow: function (product, qty) {
      this.addToCart(product, qty)
      this.$router.push('/page/account/checkout')
    },
    increment() {
      if (this.counter < this.product.stock) {
        this.counter++
      }
    },
    decrement() {
      if (this.counter > 1) this.counter--
    },
  },
}
</script>
<style scoped>
.seller-name{font-size:16px;font-weight:600;color:#333}
.seller-block small{font-size:12px}
.card img{height:150px;object-fit:cover}
</style>
 
