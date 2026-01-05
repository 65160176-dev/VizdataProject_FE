<template>
  <div>
    <div class="icon-nav">
      <ul>
        <li class="onhover-div mobile-search">
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
        </li>
        <li class="onhover-div mobile-setting">
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
        </li>
        <li class="onhover-div mobile-cart">
          <div>
            <img alt src="/images/icon/layout4/cart.png" class="img-fluid">
            <i class="ti-shopping-cart"></i>
            <span class="cart_qty_cls">{{ cartTotalQuantity }}</span>
          </div>
          <ul class="show-div shopping-cart" v-if="!cart.length">
            <li>Your cart is currently empty.</li>
          </ul>
          <ul class="show-div shopping-cart" v-if="cart.length">
            <li v-for="(item, index) in cart" :key="index">
              <div class="media">
                <nuxt-link :to="{ path: '/product/sidebar/' + (item._id || item.id) }">
                  <img alt class="mr-3" :src='getProductImage(item)'>
                </nuxt-link>
                <div class="media-body">
                  <nuxt-link :to="{ path: '/product/sidebar/' + (item._id || item.id) }">
                    <h4>{{ item.name || item.title }}</h4>
                  </nuxt-link>
                  <h4>
                    <span>{{ item.quantity }} x {{ curr.symbol }}{{ (item.price * curr.curr).toFixed(2) }}</span>
                  </h4>
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

export default {
  data() {
    return {
      currencyChange: {},
      search: false,
      searchString: '',
      lang: [
        {
          code: 'en',
          name: 'English'
        },
        {
          code: 'fr',
          name: 'French'
        }
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
      console.log('===== COMPUTING TOTAL ITEMS =====');
      console.log('Cart:', this.cart);
      console.log('Cart length:', this.cart.length);
      
      if (!this.cart || this.cart.length === 0) {
        console.log('Cart is empty, returning 0');
        return 0;
      }
      
      const total = this.cart.reduce((sum, item) => {
        console.log(`Item: ${item.name}, quantity: ${item.quantity}`);
        return sum + (item.quantity || 0);
      }, 0);
      
      console.log('Total items calculated:', total);
      console.log('=================================');
      return total;
    }
  },
  watch: {
    searchString() {
      useProductStore().searchProduct(this.searchString)
    },
    cart() {
      useCartStore().cartItems
    },
  },
  methods: {
    getImgUrl(path) {
      return ('/images/' + path)
    },
    getProductImage(product) {
      // รองรับทั้ง image field จาก API (string) และ images array จาก mock data
      if (product.image) {
        if (product.image.startsWith('http')) {
          return product.image
        }
        return `/images/${product.image}`
      }
      const img = (product.images && product.images[0] && product.images[0].src) ? product.images[0].src : null
      return img ? `/images/${img}` : 'https://placehold.co/400'
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
      console.log('Removing from header cart:', product)
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

    // --- แก้ไขฟังก์ชันนี้ ---
    goToCheckout() {
      // 1. ตรวจสอบว่ามีสินค้าในตะกร้าไหม
      if (this.cart.length === 0) {
        useNuxtApp().$showToast({ msg: "Cart is empty", type: "error" });
        return;
      }

      // 2. บันทึกสินค้า "ทั้งหมด" ลงใน LocalStorage
      // ชื่อตัวแปร 'checkout_items' ต้องตรงกับที่หน้า PaymentPage เรียกใช้
      localStorage.setItem('checkout_items', JSON.stringify(this.cart));

      // 3. ตรวจสอบ Login และเปลี่ยนหน้า
      const user = localStorage.getItem('user')
      if (user) {
        this.$router.push('/page/account/checkout')
      } else {
        this.$router.push('/page/auth/LoginPage?redirect=/page/account/checkout')
      }
    }
  },
}
</script>