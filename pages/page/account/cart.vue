<template>
  <div>
    <Header />
    <WidgetsBreadcrumbs title="Cart" />
    <section class="cart-section section-b-space">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <table class="table cart-table table-responsive-xs" v-if="cart.length">
              <thead>
                <tr class="table-head">
                  <th scope="col">
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
                  <td>
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
            </table>
            <table class="table cart-table table-responsive-md" v-if="cart.length">
              <tfoot>
                <tr>
                  <td>total price (Selected):</td>
                  <td>
                    <h2>{{ curr.symbol }}{{ (selectedTotal * curr.curr).toFixed(2) }}</h2>
                  </td>
                </tr>
              </tfoot>
            </table>
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
      selectedItems: [] // เก็บรายการที่เลือก
    }
  },
  computed: {
    cart() {
      return useCartStore().cartItems
    },
    // คำนวณราคารวมเฉพาะที่เลือก
    selectedTotal() {
      return this.selectedItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
      }, 0);
    },
    curr() {
      return useProductStore().changeCurrency
    },
    // Logic สำหรับ Checkbox เลือกทั้งหมด
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
    // ถ้ามีการลบของออกจากตะกร้า ให้ลบออกจาก selectedItems ด้วยเพื่อกัน error
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
    // ฟังก์ชันไปหน้า Checkout
    goToCheckout() {
      if (this.selectedItems.length === 0) {
        useNuxtApp().$showToast({ msg: "Please select items to checkout.", type: "error" })
        return;
      }

      // 1. บันทึกสินค้าที่ติ๊กเลือก ลงใน LocalStorage
      localStorage.setItem('checkout_items', JSON.stringify(this.selectedItems));

      // 2. ไปหน้า Checkout
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
</style>