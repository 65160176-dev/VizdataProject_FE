<template>
  <div>
    <Header />
    <WidgetsBreadcrumbs title="Cart" />
    <section class="cart-section section-b-space">
      <div class="container-fluid" style="padding-left: 3rem; padding-right: 3rem;">
        <div class="mb-3"></div>
        <div class="row">
          <div class="col-sm-12">

            <div class="cart-table-wrapper" v-if="cart.length">
              <table class="table cart-table" :key="cartKey">

                <thead>
                  <tr class="table-head">
                    <th scope="col" class="col-center">
                      <input type="checkbox" v-model="isAllSelected" />
                    </th>
                    <th scope="col" class="col-center">Image</th>
                    <th scope="col" class="col-center">Shop</th>
                    <th scope="col" class="col-left">Product</th>
                    <th scope="col" class="col-center">Price</th>
                    <th scope="col" class="col-center">Quantity</th>
                    <th scope="col" class="col-center">Action</th>
                    <th scope="col" class="col-right">Total</th>
                  </tr>
                </thead>

                <tbody v-for="(item, index) in cart" :key="index">
                  <tr class="align-middle">

                    <td class="col-center">
                      <input type="checkbox" :value="item" v-model="selectedItems" />
                    </td>

                    <td class="col-center">
                      <nuxt-link :to="{ path: '/product/sidebar/' + (item._id || item.id) }">
                        <img :src="getProductImage(item)" alt="" class="product-img" />
                      </nuxt-link>
                    </td>

                    <td class="col-center">
                      <div v-if="getShopName(item)" class="shop-badge-container">
                        <span class="shop-badge" @click="goToShop(item)">
                          <i class="ti-home"></i> {{ getShopName(item) }}
                        </span>
                      </div>
                      <div v-else class="text-muted small">-</div>
                    </td>

                    <td class="col-left">
                      <nuxt-link :to="{ path: '/product/sidebar/' + (item._id || item.id) }" class="product-name-link">
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

                    <td class="col-center">
                      <h2 class="td-color price-text">
                        {{ curr.symbol }}{{ (calcPrice(item) * curr.curr).toFixed(2) }}
                      </h2>
                    </td>

                    <td class="col-center">
                      <div class="qty-box d-flex justify-content-center">
                        <div class="input-group input-group-sm qty-input-group">
                          <span class="input-group-prepend">
                            <button type="button" class="btn quantity-btn" @click="decrement(item)">
                              <i class="ti-angle-left"></i>
                            </button>
                          </span>
                          <input type="number" name="quantity" class="form-control input-number qty-input"
                            :disabled="item.quantity > item.stock" :value="item.quantity"
                            @input="handleQuantityInput($event, item)" @blur="handleQuantityBlur($event, item)" min="1"
                            :max="item.stock" />
                          <span class="input-group-prepend">
                            <button type="button" class="btn quantity-btn" @click="increment(item)"
                              :disabled="item.quantity >= item.stock">
                              <i class="ti-angle-right"></i>
                            </button>
                          </span>
                        </div>
                      </div>
                    </td>

                    <td class="col-center">
                      <a class="icon remove-icon" href="#" @click.prevent="removeCartItem(item)">
                        <i class="ti-close"></i>
                      </a>
                    </td>

                    <td class="col-right">
                      <h2 class="td-color total-text">
                        {{ curr.symbol }} {{ ((calcPrice(item) * curr.curr) * item.quantity).toFixed(2) }}
                      </h2>
                    </td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <td colspan="7" class="text-end total-label">
                      Total Price (Selected):
                    </td>
                    <td class="col-right">
                      <h2 class="td-color">{{ curr.symbol }}{{ (selectedTotal * curr.curr).toFixed(2) }}</h2>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div class="col-sm-12 empty-cart-cls text-center" v-if="!cart.length">
              <img src='/images/icon-empty-cart.png' class="img-fluid" alt="empty cart" />
              <h3 class="mt-3"><strong>Your Cart is Empty</strong></h3>
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
    cart() { return useCartStore().cartItems },
    selectedTotal() {
      return this.selectedItems.reduce((total, item) => {
        return total + (this.calcPrice(item) * item.quantity);
      }, 0);
    },
    curr() { return useProductStore().changeCurrency },
    isAllSelected: {
      get() { return this.cart.length > 0 && this.selectedItems.length === this.cart.length; },
      set(value) {
        this.selectedItems = value ? [...this.cart] : [];
      }
    }
  },
  watch: {
    cart: {
      handler(newVal) {
        this.selectedItems = this.selectedItems.filter(selected =>
          newVal.some(cartItem => cartItem.id === selected.id)
        );
        this.cartKey++;
      },
      deep: true
    }
  },
  methods: {
    getImgUrl(path) { return ('/images/' + path) },
    getProductImage(product) {
      if (!product) return 'https://placehold.co/400'
      if (product.image) return product.image.startsWith('http') ? product.image : `/images/${product.image}`
      return 'https://placehold.co/400'
    },
    calcPrice(item) {
      if (!item || !item.price) return 0
      const price = Number(item.price) || 0
      return (item.sale && item.discount) ? price - (price * (parseFloat(item.discount) / 100)) : price;
    },
    // ✅ แก้ไข: ให้แสดงชื่อร้านเสมอ แม้จะเป็น Shop ก็ตาม (เพื่อ Debug)
    getShopName(item) {
      if (item.brand) return item.brand;
      if (item.seller && (item.seller.display_name || item.seller.name)) return item.seller.display_name || item.seller.name;
      return null;
    },
    goToShop(item) {
      if (item.seller && item.seller._id) this.$router.push('/seller/' + item.seller._id);
    },
    removeCartItem(product) { useCartStore().removeCartItem(product) },
    async increment(product) {
      // ✅ เพิ่มการตรวจสอบ Stock ตรงนี้
      if (product.quantity >= product.stock) {
        useNuxtApp().$showToast({ msg: "สินค้ามีจำนวนจำกัด ไม่สามารถเพิ่มได้อีก", type: "error" });
        return;
      }

      await useCartStore().updateCartQuantity({ product: product, qty: 1 });
      this.cartKey++;
    },
    async decrement(product) { await useCartStore().updateCartQuantity({ product: product, qty: -1 }); this.cartKey++; },
    handleQuantityInput(event, item) {
      // Allow typing but don't update yet
      const value = parseInt(event.target.value) || 0;
      if (value < 1) {
        event.target.value = 1;
      } else if (value > item.stock) {
        event.target.value = item.stock;
        useNuxtApp().$showToast({ msg: `สินค้ามีเพียง ${item.stock} ชิ้นในสต็อก`, type: "error" });
      }
    },
    async handleQuantityBlur(event, item) {
      const newQuantity = parseInt(event.target.value) || 1;
      const oldQuantity = item.quantity;

      // Validate quantity
      if (newQuantity < 1) {
        event.target.value = oldQuantity;
        return;
      }
      if (newQuantity > item.stock) {
        event.target.value = item.stock;
        useNuxtApp().$showToast({ msg: `สินค้ามีเพียง ${item.stock} ชิ้นในสต็อก`, type: "error" });
        return;
      }

      // Only update if quantity changed
      if (newQuantity !== oldQuantity) {
        const diff = newQuantity - oldQuantity;
        await useCartStore().updateCartQuantity({ product: item, qty: diff });
        this.cartKey++;
      }
    },
    goToCheckout() {
      if (this.selectedItems.length === 0) {
        useNuxtApp().$showToast({ msg: "Please select items to checkout.", type: "error" })
        return;
      }
      const checkoutData = this.selectedItems.map(item => ({
        ...item,
        id: item.id || item._id,
        _id: item._id || item.id,
        name: item.name || item.title || '',
        price: Number(item.price) || 0,
        quantity: Number(item.quantity) || 1,
        brand: item.brand || 'Shop',
        image: item.image || '',
        seller: item.seller || null
      }));
      localStorage.setItem('checkout_items', JSON.stringify(checkoutData));
      this.$router.push('/page/account/checkout');
    }
  },
  mounted() {
    useCartStore().fetchCart();
  }
}
</script>

<style scoped>
/* ... (CSS เดิมของคุณ) ... */

/* ✅ เพิ่มส่วนนี้: ปรับแต่งปุ่มเมื่อถูก Disable (สินค้าหมด Stock) */
.quantity-btn:disabled {
  opacity: 0.5 !important;
  /* ทำให้ปุ่มจางลง 50% */
  background-color: #e9ecef !important;
  /* เปลี่ยนพื้นหลังเป็นสีเทา */
  color: #6c757d !important;
  /* เปลี่ยนสีไอคอนเป็นสีเทาเข้ม */
  cursor: not-allowed !important;
  /* เปลี่ยนเมาส์เป็นเครื่องหมายห้าม */
  border-color: #ced4da !important;
}

.product-img {
  width: 60px;
  /* กำหนดความกว้างตามต้องการ */
  height: 60px;
  /* กำหนดความสูงให้เท่ากัน (แนะนำสี่เหลี่ยมจัตุรัส) */
  object-fit: cover;
  /* สำคัญ! ช่วยให้รูปไม่บีบ ไม่ยืด แต่จะตัดส่วนเกินออกแทน */
  border-radius: 5px;
  /* (ทางเลือก) ลบเหลี่ยมมุมภาพเล็กน้อย */
}
</style>