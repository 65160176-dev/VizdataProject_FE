<template>
  <div>
    <div id="cart_side" class="add_to_cart top" :class="{ openSide: openCart }">
      <a href="javascript:void(0)" class="overlay" v-on:click="closeCart(openCart)"></a>
      <div class="cart-inner">
        <div class="cart_top">
          <h3>my cart</h3>
          <div class="close-cart">
            <a href="javascript:void(0)" v-on:click="closeCart(openCart)">
              <i class="fa fa-times" aria-hidden="true"></i>
            </a>
          </div>
        </div>
        <div class="cart_media" v-if="cart.length">
          <ul class="cart_product">
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
                    <span>{{ curr.symbol }}{{ item.quantity }} x {{ item.price * curr.curr }}</span>
                  </h4>
                </div>
              </div>
              <div class="close-circle">
                <a href="javascript:void(0)" @click='removeCartItem(item)'>
                  <i class="ti-trash" aria-hidden="true"></i>
                </a>
              </div>
            </li>
          </ul>
          <ul class="cart_total">
            <li>
              <div class="total">
                <h5>
                  subtotal :
                  <span>{{ curr.symbol }}{{ cartTotal * curr.curr }}</span>
                </h5>
              </div>
            </li>
            <li>
              <div class="buttons">
                <nuxt-link :to="{ path: '/page/account/cart' }" :class="'btn btn-solid btn-xs view-cart'">
                  view cart
                </nuxt-link>
                <nuxt-link :to="{ path: '/page/account/checkout' }" :class="'btn btn-solid btn-xs checkout'">
                  checkout
                </nuxt-link>
              </div>
            </li>
          </ul>
        </div>
        <div class="col-sm-12 empty-cart-cls text-left" v-if="!cart.length">
          <h4 class="mt-3">
            <strong>Your Cart is Empty</strong>
          </h4>
          <nuxt-link :to="{ path: '/' }" class="btn btn-solid">continue shopping</nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'pinia'
import { useProductStore } from '~~/store/products'
import { useCartStore } from '~~/store/cart'
export default {
  props: ['openCart'],
  computed: {
    ...mapState(useProductStore, {
      currency: 'currency'
    }),
    cart() {
      return useCartStore().cartItems
    },
    cartTotal() {
      return useCartStore().cartTotalAmount
    },
    curr() {
      return useProductStore().changeCurrency
    }
  },
  methods: {
   
    getImgUrl(path) {
      return ('/images/' + path)
    },
    getProductImage(product) {
      if (!product) return 'https://placehold.co/400'
      if (product.image) {
        if (product.image.startsWith('http')) return product.image
        return `/images/${product.image}`
      }
      if (product.images && product.images[0]) {
        const img = product.images[0].src || product.images[0]
        return `/images/${img}`
      }
      return 'https://placehold.co/400'
    },
    closeCart(val) {
      val = false
      this.$emit('closeCart', val)
    },
    removeCartItem: function (product) {
      useCartStore().removeCartItem(product)
    },
    updateCurrency: function (currency, currSymbol) {
      this.currencyChange = { value: currency, symbol: currSymbol }
      useProductStore().changeCurrency2(this.currencyChange)
    }
  }
}
</script>
