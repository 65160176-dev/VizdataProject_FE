<template>
  <div>
    <div class="icon-nav">
      <ul>
        <!-- <li class="onhover-div mobile-search">
          <div>
            <img alt src="/images/icon/layout4/search.png" @click="openSearch()" class="img-fluid">
            <i class="ti-search" @click="openSearch()"></i>
          </div>
          <div id="search-overlay" class="search-overlay" :class="{ opensearch: search }">
            <div>
              <span class="closebtn" @click="closeSearch()" title="Close Overlay">x</span>
              <div class="overlay-content">
                <div class="container">
                  <div class="row">
                    <div class="col-xl-12">
                      <form>
                        <div class="form-group mb-0">
                          <input type="text" class="form-control" v-model="searchString" placeholder="Search a Product">
                        </div>
                        <button type="submit" class="btn btn-primary">
                          <i class="fa fa-search"></i>
                        </button>
                      </form>
                      <ul class="search-results" v-if="searchItems.length">
                        <li v-for="(product, index) in searchItems" :key="index" class="product-box">
                          <div class="img-wrapper">
                            <img :src='getProductImage(product)' class="img-fluid bg-img" :key="index" />
                          </div>
                          <div class="product-detail">
                            <nuxt-link :to="{ path: '/product/sidebar/' + (product._id || product.id) }">
                              <h6>{{ product.name || product.title }}</h6>
                            </nuxt-link>
                            <h4>{{ curr.symbol }}{{ (product.price * curr.curr).toFixed(2) }}</h4>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </li> -->
        <!-- <li class="onhover-div mobile-setting">
          <div>
            <img alt src="/images/icon/layout4/setting.png" class="img-fluid">
            <i class="ti-settings"></i>
          </div>
          <div class="show-div setting">
            <h6>Language</h6>
            <ul class="list-inline">
              <li>
                <Nuxt-link v-for="locale in language" :key="locale.code" @click="setlang(locale.code)"
                  to="javascript:void(0)">
                  {{ locale.name }}
                </Nuxt-link>
              </li>

            </ul>
            <h6>currency</h6>
            <ul class="list-inline">
              <li>
                <a href="javascript:void(0)" @click="updateCurrency('eur', '€')">eur</a>
              </li>
              <li>
                <a href="javascript:void(0)" @click="updateCurrency('inr', '₹')">inr</a>
              </li>
              <li>
                <a href="javascript:void(0)" @click="updateCurrency('gbp', '£')">gbp</a>
              </li>
              <li>
                <a href="javascript:void(0)" @click="updateCurrency('usd', '$')">usd</a>
              </li>
            </ul>
          </div>
        </li> -->
        <li class="onhover-div mobile-cart">
          <nuxt-link to="/page/account/cart">
            <img alt src="/images/icon/layout4/cart.png" class="img-fluid">
            <i class="ti-shopping-cart"></i>
            <span class="cart_qty_cls">{{ cartTotalQuantity }}</span>
          </nuxt-link>
          <ul class="show-div shopping-cart" v-if="!cart.length">
            <li>Your cart is currently empty.</li>
          </ul>
          <ul class="show-div shopping-cart" v-if="cart.length">
            <li v-for="(item, index) in cart" :key="index">
              <div class="media">
                <nuxt-link :to="{ path: '/product/sidebar/' + (item._id || item.id) }">
                  <img alt class="mr-3 cart-img" :src='getProductImage(item)'>
                </nuxt-link>
                <div class="media-body">
                  <nuxt-link :to="{ path: '/product/sidebar/' + (item._id || item.id) }">
                    <h4>{{ item.name || item.title }}</h4>
                  </nuxt-link>
                  <h4>
                    <span>{{ item.quantity }} x ฿{{ (item.price * curr.curr).toFixed(2) }}</span>
                  </h4>

                  <div v-if="item.quantity > item.stock" class="text-danger mt-1"
                    style="font-size: 11px; font-weight: 600;">
                    <i class="fa fa-exclamation-circle"></i> สต็อกไม่พอ (เหลือ {{ item.stock }})
                  </div>
                </div>
              </div>
              <div class="close-circle">
                <a href="#" @click.prevent='removeCartItem(item)'>
                  <i class="fa fa-times" aria-hidden="true"></i>
                </a>
              </div>
            </li>
            <li>
              <div class="total">
                <h5>
                  total items :
                  <span>{{ totalItems }}</span>
                </h5>
              </div>
            </li>
            <li>
              <div class="buttons">
                <nuxt-link :to="{ path: '/page/account/cart' }" :class="'view-cart'">
                  view cart
                </nuxt-link>

                <a href="javascript:void(0)" @click="goToCheckout" :class="'checkout'">
                  checkout
                </a>

              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { useProductStore } from '~/store/products'
import { useCartStore } from '~/store/cart'
import { mapState } from 'pinia'
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      currencyChange: {},
      search: false,
      searchString: '',
      refreshInterval: null, // ✅ 1. เพิ่มตัวแปรเก็บ Interval
      lang: [
        { code: 'en', name: 'English' },
        { code: 'fr', name: 'French' }
      ]
    }
  },
  computed: {
    ...mapState(useProductStore, {
      searchItems: 'searchProducts',
    }),
    language() {
      return this.lang.filter((lang) => lang.code != this.$i18n.locale)
    },
    ...mapState(useCartStore, {
      cartTotal: (store) => store.cartTotalAmount,
      cart: (store) => store.cart,
      cartTotalQuantity: (store) => store.cartTotalQuantity,
    }),
    curr() {
      return useProductStore().changeCurrency
    },
    totalItems() {
      if (!this.cart || this.cart.length === 0) return 0;
      return this.cart.reduce((sum, item) => sum + (item.quantity || 0), 0);
    }
  },
  watch: {
    searchString() {
      useProductStore().searchProduct(this.searchString)
    },
    // ไม่จำเป็นต้อง watch cart เพื่อ update cartItems แล้ว เพราะใช้ mapState อัตโนมัติ
  },
  methods: {
    getImgUrl(path) {
      return ('/images/' + path)
    },
    getProductImage(product) {
      if (!product) return 'https://placehold.co/400'

      const resolveUrl = (url) => {
        if (!url || (typeof url === 'string' && url.trim() === '')) return null
        if (url.startsWith('http')) return url
        if (url.startsWith('/')) return `https://vizdataprojectbe-production.up.railway.app${url}`
        return `https://vizdataprojectbe-production.up.railway.app/${url}`
      }

      const fromImage = resolveUrl(product.image)
      if (fromImage) return fromImage

      if (product.images && product.images.length > 0) {
        const img = product.images[0].src || product.images[0]
        const fromImages = resolveUrl(img)
        if (fromImages) return fromImages
      }

      return 'https://placehold.co/400'
    },
    openSearch() {
      this.search = true
    },
    closeSearch() {
      this.search = false
    },
    searchProduct() {
    },
    removeCartItem: async function (product) {
      await useCartStore().removeCartItem(product)
      if (this.cart.length == 0 && this.$route.name === 'page-account-checkout') {
        this.$router.replace('/page/account/cart')
      }
    },
    setlang(name) {
      this.$i18n.locale = name
    },
    updateCurrency: function (currency, currSymbol) {
      this.currencyChange = { value: currency, symbol: currSymbol }
      useProductStore().changeCurrency2(this.currencyChange)
    },

    // ✅ 2. เพิ่มฟังก์ชันดึงข้อมูลใหม่ (ทำงานเบื้องหลัง)
    async refreshCartData() {
      const store = useCartStore();
      // ดึงข้อมูลใหม่ ซึ่งจะไปอัปเดต state.cart โดยอัตโนมัติ
      // ผลลัพธ์คือ item.stock ใน template จะเปลี่ยนไป และข้อความสีแดงจะโชว์/ซ่อนเอง
      await store.fetchCart();
    },

    async goToCheckout() {
      const cartStore = useCartStore(); // เรียก store ไว้ก่อน

      // 1. ตรวจสอบว่ามีสินค้าในตะกร้าไหม
      if (this.cart.length === 0) {
        useNuxtApp().$showToast({ msg: "Cart is empty", type: "error" });
        return;
      }

      // ดึงข้อมูลล่าสุดก่อนเช็ค 1 ครั้ง เพื่อความชัวร์ที่สุด
      await cartStore.fetchCart();

      // 2. ตรวจสอบสต็อกสินค้า
      const outOfStockItems = this.cart.filter(item => item.quantity > item.stock);

      if (outOfStockItems.length > 0) {
        let itemListHtml = '<div style="text-align: left; max-height: 250px; overflow-y: auto; padding-right: 5px;">';
        outOfStockItems.forEach(item => {
          const imageUrl = this.getProductImage(item);
          itemListHtml += `
             <div class="d-flex align-items-center mb-2 pb-2 border-bottom" style="gap: 10px;">
               <img src="${imageUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; border: 1px solid #eee;">
               <div style="min-width: 0; flex-grow: 1;">
                 <div style="font-size: 0.85rem; font-weight: bold; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${item.name}</div>
                 <div class="text-danger" style="font-size: 0.8rem;">
                    เหลือเพียง ${item.stock} ชิ้น <span class="text-muted">(ในตะกร้า: ${item.quantity})</span>
                 </div>
               </div>
             </div>`;
        });
        itemListHtml += '</div>';

        Swal.fire({
          icon: 'warning',
          title: 'สต็อกสินค้ามีการเปลี่ยนแปลง',
          html: `<p class="mb-3 small text-muted">สินค้าบางรายการมีไม่เพียงพอ ระบบจะปรับจำนวนให้เท่ากับสต็อกที่เหลืออัตโนมัติ</p>${itemListHtml}`,
          confirmButtonText: 'ตกลง, ปรับปรุงข้อมูล',
          confirmButtonColor: '#ff4c3b',
          allowOutsideClick: false
        }).then(async (result) => {
          if (result.isConfirmed) {
            // ✅ ทำการหักลบจำนวนใน Store ให้เท่ากับ Stock จริง
            for (const item of outOfStockItems) {
              const diff = item.stock - item.quantity;
              if (diff !== 0) {
                await cartStore.updateCartQuantity({ product: item, qty: diff });
              }
            }
            useNuxtApp().$showToast({ msg: 'ปรับปรุงข้อมูลแล้ว กรุณากด Checkout อีกครั้ง', type: 'success' });
          }
        });
        return; // หยุดการไปหน้าถัดไป
      }

      // 3. ถ้าตรวจสอบผ่านหมดแล้ว บันทึกสินค้าลง LocalStorage
      localStorage.setItem('checkout_items', JSON.stringify(this.cart));

      // 4. ตรวจสอบ Login และเปลี่ยนหน้า
      const token = localStorage.getItem('token')
      if (token) {
        this.$router.push('/page/account/checkout')
      } else {
        this.$router.push('/page/auth/LoginPage?redirect=/page/account/checkout')
      }
    }
  },

  // ✅ 3. เริ่มการทำงาน Real-time
  mounted() {
    // ดึงข้อมูลครั้งแรก
    this.refreshCartData();

    // ตั้งเวลาดึงข้อมูลทุก 15 วินาที
    this.refreshInterval = setInterval(() => {
      // ดึงเงียบๆ เพื่ออัปเดตตัวเลข Stock และแจ้งเตือนสีแดงใน Dropdown
      this.refreshCartData();
    }, 15000);
  },

  // ✅ 4. ล้างเวลาเมื่อ Component ถูกทำลาย
  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}
</script>

<style scoped>
.onhover-div .show-div {
  left: auto !important;
  right: 0 !important;
}

.onhover-div .show-div.shopping-cart {
  left: auto !important;
  right: 0 !important;
}

.shopping-cart .media img.cart-img {
  width: 90px;
  /* ปรับขนาดความกว้างตามต้องการ (เช่น 70px - 90px) */
  height: 90px;
  /* ปรับขนาดความสูงให้เท่ากับความกว้าง (สี่เหลี่ยมจัตุรัส) */
  object-fit: cover;
  /* สำคัญ! ช่วยให้รูปไม่เบี้ยว แม้ขนาดจริงจะไม่ใช่สี่เหลี่ยม */
  border-radius: 5px;
  /* (ทางเลือก) เพิ่มความมนให้ขอบรูป */
}
</style>