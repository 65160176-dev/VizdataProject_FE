<template>
  <div>
    <Header />
    <WidgetsBreadcrumbs title="Cart" />
    <section class="cart-section section-b-space">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <div class="cart-table-wrapper" v-if="cart.length">
              <table class="table cart-table">

                <thead>
                  <tr class="table-head">
                    <th scope="col" style="width: 1%; text-align: center; white-space: nowrap;">
                      <input type="checkbox" v-model="isAllSelected" />
                    </th>
                    <th scope="col">image</th>
                    <th scope="col">product name</th>
                    <th scope="col">price</th>
                    <th scope="col">quantity</th>
                    <th scope="col">action</th>
                    <th scope="col">total</th>
                  </tr>
                </thead>

                <tbody v-for="(item, index) in cart" :key="index">
                  <tr>
                    <td style="text-align: center;">
                      <input type="checkbox" :value="item" v-model="selectedItems" />
                    </td>
                    <td>
                      <nuxt-link :to="{ path: '/product/sidebar/' + item.id }">
                        <img :src="getImgUrl(item.images[0].src)" alt />
                      </nuxt-link>
                    </td>
                    <td>
                      <nuxt-link :to="{ path: '/product/sidebar/' + item.id }">{{ item.title }}</nuxt-link>
                      <div class="mobile-cart-content row">
                        <div class="col-xs-3">
                          <div class="qty-box">
                            <div class="input-group">
                              <input type="text" name="quantity" class="form-control input-number"
                                v-model="item.quantity" />
                            </div>
                          </div>
                        </div>
                        <div class="col-xs-3">
                          <h2 class="td-color">{{ curr.symbol }}{{ (item.price * curr.curr).toFixed(2) }}</h2>
                        </div>
                        <div class="col-xs-3">
                          <h2 class="td-color">
                            <a href="#" class="icon">
                              <i class="ti-close"></i>
                            </a>
                          </h2>
                        </div>
                      </div>
                    </td>
                    <td>
                      <h2>{{ curr.symbol }}{{ (item.price * curr.curr).toFixed(2) }}</h2>
                    </td>
                    <td>
                      <div class="qty-box">
                        <div class="input-group">
                          <span class="input-group-prepend">
                            <button type="button" class="btn quantity-left-minus" data-type="minus" data-field
                              @click="decrement(item)">
                              <i class="ti-angle-left"></i>
                            </button>
                          </span>
                          <input type="text" name="quantity" class="form-control input-number"
                            :disabled="item.quantity > item.stock" v-model="item.quantity" />
                          <span class="input-group-prepend">
                            <button type="button" class="btn quantity-right-plus" data-type="plus" data-field
                              @click="increment(item)">
                              <i class="ti-angle-right"></i>
                            </button>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a class="icon" href="#" @click.prevent="removeCartItem(item)">
                        <i class="ti-close"></i>
                      </a>
                    </td>
                    <td>
                      <h2 class="td-color">
                        {{ curr.symbol }} {{ ((item.price * curr.curr) * item.quantity).toFixed(2) }}
                      </h2>
                    </td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <td colspan="6" class="text-end" style="padding-right: 20px; font-weight: bold;">
                      total price (Selected):
                    </td>
                    <td>
                      <h2 class="td-color">{{ curr.symbol }}{{ (selectedTotal * curr.curr).toFixed(2) }}</h2>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="col-sm-12 empty-cart-cls text-center" v-if="!cart.length">
              <img src='/images/icon-empty-cart.png' class="img-fluid" alt="empty cart" />
              <h3 class="mt-3">
                <strong>Your Cart is Empty</strong>
              </h3>
              <h4 class="mb-3">Add something to make me happy :)</h4>
              <div class="col-12">
                <nuxt-link :to="{ path: '/' }" class="btn btn-solid">continue shopping</nuxt-link>
              </div>
            </div>
          </div>
        </div>
        <div class="row cart-buttons" v-if="cart.length">
          <div class="col-6">
            <nuxt-link :to="{ path: '/' }" :class="'btn btn-solid'">continue shopping</nuxt-link>
          </div>
          <div class="col-6">
            <a href="javascript:void(0)" class="btn btn-solid" :class="{ 'disabled': selectedItems.length === 0 }"
              @click="goToCheckout">
              check out ({{ selectedItems.length }})
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
  <Footer />
</template>

<script>
import { useCartStore } from '~~/store/cart'
import { useProductStore } from '~~/store/products'

export default {
  data() {
    return {
      selectedItems: []
    }
  },
  computed: {
    cart() {
      return useCartStore().cartItems
    },
    selectedTotal() {
      return this.selectedItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    },
    curr() {
      return useProductStore().changeCurrency
    },
    isAllSelected: {
      get() {
        return this.cart.length > 0 && this.selectedItems.length === this.cart.length;
      },
      set(value) {
        if (value) {
          this.selectedItems = [...this.cart];
        } else {
          this.selectedItems = [];
        }
      }
    }
  },
  watch: {
    cart: {
      handler(newVal) {
        this.selectedItems = this.selectedItems.filter(selected =>
          newVal.some(cartItem => cartItem.id === selected.id)
        );
      },
      deep: true
    }
  },
  methods: {
    getImgUrl(path) {
      return ('/images/' + path)
    },
    removeCartItem(product) {
      useCartStore().removeCartItem(product)
    },
    increment(product, qty = 1) {
      useCartStore().updateCartQuantity({ product: product, qty: qty })
    },
    decrement(product, qty = -1) {
      useCartStore().updateCartQuantity({ product: product, qty: qty })
    },
    goToCheckout() {
      if (this.selectedItems.length === 0) {
        useNuxtApp().$showToast({ msg: "Please select items to checkout.", type: "error" })
        return;
      }
      localStorage.setItem('checkout_items', JSON.stringify(this.selectedItems));
      this.$router.push('/page/account/checkout');
    }
  },
  mounted() {
    this.selectedItems = [];
  }
}
</script>

<style scoped>
input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #ff5722;
}

.disabled {
  pointer-events: none;
  opacity: 0.6;
}

.cart-table-wrapper {
  display: flex;
  justify-content: center;
}
</style>