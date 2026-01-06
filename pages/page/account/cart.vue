<template>
  <div>
    <Header />
    <WidgetsBreadcrumbs title="Cart" />
    <section class="cart-section section-b-space">
      <div class="container">
        <div class="mb-3">
          <!-- <button @click="$router.back()" class="btn btn-sm btn-outline-secondary">
            <i class="ti-arrow-left"></i> Back
          </button> -->
        </div>
        <div class="row">
          <div class="col-sm-12">
            <div class="cart-table-wrapper" v-if="cart.length">
              <table class="table cart-table" :key="cartKey">

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
                  <tr class="align-middle">
                    <td>
                      <input type="checkbox" :value="item" v-model="selectedItems" />
                    </td>
                    <td>
                      <nuxt-link :to="{ path: '/product/sidebar/' + (item._id || item.id) }">
                        <img :src="getProductImage(item)" alt style="height: 60px; object-fit: contain;" />
                      </nuxt-link>
                    </td>
                    <td>
                      <nuxt-link :to="{ path: '/product/sidebar/' + (item._id || item.id) }" style="font-size: 14px;">
                        {{ item.name || item.title || 'No Name' }}
                      </nuxt-link>

                      <div class="mobile-cart-content row">
                        <div class="col-xs-3">
                          <div class="qty-box">
                            <div class="input-group">
                              <input type="text" name="quantity" class="form-control input-number"
                                :value="item.quantity" readonly />
                            </div>
                          </div>
                        </div>
                        <div class="col-xs-3">
                          <h2 class="td-color">{{ curr.symbol }}{{ (calcPrice(item) * curr.curr).toFixed(2) }}</h2>
                        </div>
                        <div class="col-xs-3">
                          <h2 class="td-color"><a href="#" class="icon"><i class="ti-close"></i></a></h2>
                        </div>
                      </div>
                    </td>
                    <td>
                      <h2 class="td-color" style="font-size: 16px;">
                        {{ curr.symbol }}{{ (calcPrice(item) * curr.curr).toFixed(2) }}
                      </h2>
                    </td>
                    <td>
                      <div class="qty-box d-flex justify-content-center">
                        <div class="input-group input-group-sm" style="width: 100px;">
                          <span class="input-group-prepend">
                            <button type="button" class="btn quantity-left-minus p-1" @click="decrement(item)">
                              <i class="ti-angle-left"></i>
                            </button>
                          </span>
                          <input type="text" name="quantity" class="form-control input-number text-center p-1"
                            :disabled="item.quantity > item.stock" :value="item.quantity" readonly style="height: 30px;" />
                          <span class="input-group-prepend">
                            <button type="button" class="btn quantity-right-plus p-1" @click="increment(item)">
                              <i class="ti-angle-right"></i>
                            </button>
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <a class="icon" href="#" @click.prevent="removeCartItem(item)">
                        <i class="ti-close" style="font-size: 16px;"></i>
                      </a>
                    </td>
                    <td>
                      <h2 class="td-color" style="font-size: 18px;">
                        {{ curr.symbol }} {{ ((calcPrice(item) * curr.curr) * item.quantity).toFixed(2) }}
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
      selectedItems: [],
      cartKey: 0
    }
  },
  computed: {
    cart() {
      return useCartStore().cartItems
    },
    // [แก้ไข] คำนวณราคารวมโดยใช้ราคาที่ลดแล้ว
    selectedTotal() {
      return this.selectedItems.reduce((total, item) => {
        return total + (this.calcPrice(item) * item.quantity);
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
      handler(newVal, oldVal) {
        console.log('===== CART CHANGED =====');
        console.log('Old cart length:', oldVal ? oldVal.length : 0);
        console.log('New cart length:', newVal.length);
        console.log('New cart:', newVal);
        
        this.selectedItems = this.selectedItems.filter(selected =>
          newVal.some(cartItem => cartItem.id === selected.id)
        );
        
        // Force re-render
        this.cartKey++;
        console.log('Cart key updated to:', this.cartKey);
        console.log('========================');
      },
      deep: true,
      immediate: false
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
    // [เพิ่มใหม่] ฟังก์ชันคำนวณราคา (ถ้าราคาเต็มให้คืนค่าเดิม ถ้าลดให้คำนวณ % ส่วนลด)
    calcPrice(item) {
      if (!item || !item.price) return 0
      const price = Number(item.price) || 0
      if (item.sale && item.discount) {
        // สูตร: ราคาเต็ม - (ราคาเต็ม * เปอร์เซ็นต์ส่วนลด / 100)
        return price - (price * (parseFloat(item.discount) / 100));
      }
      return price;
    },
    removeCartItem(product) {
      useCartStore().removeCartItem(product)
    },
    async increment(product, qty = 1) {
      await useCartStore().updateCartQuantity({ product: product, qty: qty })
      this.cartKey++;
    },
    async decrement(product, qty = -1) {
      await useCartStore().updateCartQuantity({ product: product, qty: qty })
      this.cartKey++;
    },
    goToCheckout() {
      if (this.selectedItems.length === 0) {
        useNuxtApp().$showToast({ msg: "Please select items to checkout.", type: "error" })
        return;
      }
      
      console.log('Selected items for checkout:', this.selectedItems);
      
      // Ensure all data is properly formatted before saving
      const checkoutData = this.selectedItems.map(item => ({
        ...item,
        id: item.id || item._id,
        _id: item._id || item.id,
        name: item.name || item.title || '',
        title: item.title || item.name || '',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        brand: item.brand || 'Shop',
        image: item.image || '',
        images: item.images || (item.image ? [{ src: item.image }] : []),
        shippingCost: item.shippingCost || 'Free',
        seller: item.seller || null
      }));
      
      console.log('Formatted checkout data:', checkoutData);
      localStorage.setItem('checkout_items', JSON.stringify(checkoutData));
      this.$router.push('/page/account/checkout');
    }
  },
  mounted() {
    this.selectedItems = [];
    // Fetch cart data from backend
    const cartStore = useCartStore();
    cartStore.fetchCart().then(() => {
      console.log('Cart loaded:', cartStore.cartItems);
    });
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