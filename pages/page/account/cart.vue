<template>
  <!-- <div class="cart-page bg-light py-4"> -->
  <Header />
  <WidgetsBreadcrumbs title="Cart" />

  <section class="cart-section section-b-space">
    <div class="container">

      <div class="d-flex align-items-center mb-3">
        <nuxt-link to="/" class="text-muted text-decoration-none">
          <i class="ti-arrow-left"></i> Back
        </nuxt-link>
      </div>

      <div class="row" v-if="cart.length">

        <div class="col-lg-8">

          <div class="cart-box bg-white p-3 mb-3 rounded d-flex align-items-center shadow-sm">
            <div class="custom-control custom-checkbox d-flex align-items-center">
              <input type="checkbox" class="custom-checkbox-input" id="selectAll" v-model="isAllSelected"
                @change="toggleSelectAll">
              <label class="custom-control-label ms-2 mb-0 cursor-pointer fw-bold" for="selectAll">
                SELECT ALL({{ cart.length }} ITEM(S))
              </label>
            </div>
          </div>

          <div v-for="(products, sellerName) in groupedCart" :key="sellerName"
            class="cart-box bg-white mb-3 rounded shadow-sm">

            <div class="seller-header p-3 border-bottom d-flex align-items-center">
              <input type="checkbox" class="custom-checkbox-input me-3" :checked="isSellerSelected(products)"
                @change="toggleSellerSelection(products, $event)">
              <h5 class="mb-0 fw-bold"><i class="ti-home"></i> {{ sellerName }}</h5>
            </div>

            <div class="cart-item-list">
              <div v-for="(item, index) in products" :key="item.id" class="cart-item p-3 border-bottom">
                <div class="row align-items-center">

                  <div class="col-1 text-center">
                    <input type="checkbox" class="custom-checkbox-input" :value="item" v-model="selectedItems">
                  </div>

                  <div class="col-3 col-md-2">
                    <nuxt-link :to="{ path: '/product/three-column/thumbnail-left', query: { id: item.id } }">
                      <img :src="getImgUrl(item.images?.[0]?.src)" @error="handleImageError"
                        class="img-fluid rounded border" alt="product">
                    </nuxt-link>
                  </div>

                  <div class="col-8 col-md-5">
                    <nuxt-link :to="{ path: '/product/three-column/thumbnail-left', query: { id: item.id } }">
                      <h6 class="mb-1 text-truncate-2">{{ item.title }}</h6>
                    </nuxt-link>
                    <p class="text-muted small mb-2" v-if="item.size || item.color">
                      ตัวเลือก: {{ item.size }} {{ item.color }}
                    </p>
                    <h5 class="text-orange fw-bold mb-0">
                      {{ curr.symbol }}{{ formatPrice(item.price * curr.curr) }}
                    </h5>
                  </div>

                  <div
                    class="col-12 col-md-4 mt-3 mt-md-0 d-flex justify-content-between justify-content-md-end align-items-center">

                    <div class="d-flex flex-column align-items-center me-3" style="width: 110px;">

                      <div class="qty-box w-100">
                        <div class="input-group qty-group">
                          <button class="btn qty-btn qty-minus" type="button" @click="decrement(item)"
                            :disabled="item.quantity <= 1">
                            <i class="ti-minus"></i>
                          </button>
                          <input type="text" class="form-control qty-input text-center" v-model.number="item.quantity"
                            @keypress="isNumber($event)" @input="validateQuantity(item)" @blur="checkEmpty(item)">
                          <button class="btn qty-btn qty-plus" type="button" @click="increment(item)">
                            <i class="ti-plus"></i>
                          </button>
                        </div>
                      </div>

                      <small class="text-danger mt-1" style="font-size: 11px; white-space: nowrap;"
                        v-if="item.stock && item.stock <= 10">
                        เหลืออยู่ {{ item.stock }} ชิ้น
                      </small>
                    </div>

                    <div class="text-end me-3 d-none d-md-block" style="min-width: 80px;">
                      <span class="fw-bold">{{ curr.symbol }}{{ formatPrice((item.price * curr.curr) * item.quantity)
                      }}</span>
                    </div>

                    <a href="#" class="text-danger" @click.prevent="removeCartItem(item)">
                      <i class="ti-trash fs-5"></i>
                    </a>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="cart-summary bg-white p-4 rounded shadow-sm sticky-top" style="top: 20px; z-index: 1;">
            <h4 class="fw-bold mb-4">สรุปคำสั่งซื้อ</h4>

            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">สินค้าที่เลือก</span>
              <span>{{ selectedItems.length }} รายการ</span>
            </div>

            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">ราคาสินค้า</span>
              <span>{{ curr.symbol }}{{ formatPrice(selectedItemsTotal) }}</span>
            </div>

            <div class="d-flex justify-content-between mb-4">
              <span class="text-muted">ค่าจัดส่ง (Standard)</span>
              <span class="text-success" :class="{ 'fw-bold': selectedItems.length > 0 }">
                {{ selectedItems.length === 0 ? '0' : curr.symbol + formatPrice(selectedShippingCost) }}
              </span>
            </div>

            <div class="d-flex justify-content-between align-items-center border-top pt-3 mb-4">
              <h5 class="mb-0 fw-bold">ยอดรวมทั้งหมด</h5>
              <h3 class="mb-0 text-orange fw-bold">
                {{ curr.symbol }}{{ formatPrice(selectedItemsTotal + selectedShippingCost) }}
              </h3>
            </div>

            <nuxt-link :to="{ path: '/page/account/checkout' }"
              class="btn btn-solid w-100 py-3 d-block text-center rounded"
              :class="{ 'disabled': selectedItems.length === 0 }">
              ดำเนินการชำระเงิน ({{ selectedItems.length }})
            </nuxt-link>

          </div>
        </div>

      </div>

      <div class="row" v-else>
        <div class="col-sm-12 empty-cart-cls text-center bg-white p-5 rounded">
          <img src='/images/icon-empty-cart.png' class="img-fluid mb-4" alt="empty cart" />
          <h3 class="mt-3"><strong>ตะกร้าสินค้าของคุณว่างเปล่า</strong></h3>
          <h4 class="mb-3 text-muted">เลือกสินค้าที่คุณถูกใจใส่ตะกร้าเลย</h4>
          <div class="col-12">
            <nuxt-link :to="{ path: '/' }" class="btn btn-solid">เลือกซื้อสินค้า</nuxt-link>
          </div>
        </div>
      </div>

    </div>
  </section>
  <!-- </div> -->
  <Footer />
</template>

<script>
// ... (Script ส่วนเดิม ไม่มีการเปลี่ยนแปลง) ...
import { useStorage } from '@vueuse/core'
import { mapState } from 'pinia'
import { useProductStore } from '~~/store/products'
import { useCartStore } from '~~/store/cart'

export default {
  data() {
    return {
      selectedItems: []
    }
  },
  computed: {
    cart() { return useCartStore().cartItems },
    curr() { return useProductStore().changeCurrency },
    groupedCart() {
      const groups = {};
      this.cart.forEach(item => {
        const sellerName = item.seller || 'No Seller';
        if (!groups[sellerName]) {
          groups[sellerName] = [];
        }
        groups[sellerName].push(item);
      });
      return groups;
    },
    selectedItemsTotal() {
      return this.selectedItems.reduce((total, item) => {
        return total + (item.price * this.curr.curr * item.quantity);
      }, 0);
    }, selectedShippingCost() {
      if (this.selectedItems.length === 0) return 0;

      // 1. ดึงชื่อร้านค้าจากสินค้าที่เลือกทั้งหมด
      const selectedSellers = this.selectedItems.map(item => item.seller || 'ร้านค้าทั่วไป');

      // 2. ใช้ Set เพื่อกรองให้เหลือแต่ชื่อร้านที่ไม่ซ้ำกัน
      const uniqueSellers = new Set(selectedSellers);

      // 3. เอาจำนวนร้าน x 50 x ค่าเงิน
      return uniqueSellers.size * 50 * this.curr.curr;
    },
    isAllSelected: {
      get() {
        return this.cart.length > 0 && this.selectedItems.length === this.cart.length;
      },
      set(value) {
        this.selectedItems = value ? [...this.cart] : [];
      }
    }
  },
  methods: {
    getImgUrl(path) { return path ? '/images/' + path : '/images/ajax-loader.gif'; },
    handleImageError(e) { e.target.src = '/images/ajax-loader.gif'; },
    formatPrice(value) {
      return value.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    removeCartItem(product) {
      useCartStore().removeCartItem(product);
      this.selectedItems = this.selectedItems.filter(item => item.id !== product.id);
    },
    increment(product) {
      useCartStore().updateCartQuantity({ product: product, qty: 1 })
    },
    decrement(product) {
      useCartStore().updateCartQuantity({ product: product, qty: -1 })
    },
    isSellerSelected(products) {
      return products.length > 0 && products.every(item => this.selectedItems.includes(item));
    },
    toggleSellerSelection(products, event) {
      const isChecked = event.target.checked;
      if (isChecked) {
        products.forEach(item => {
          if (!this.selectedItems.includes(item)) {
            this.selectedItems.push(item);
          }
        });
      } else {
        this.selectedItems = this.selectedItems.filter(item => !products.includes(item));
      }
    },
    toggleSelectAll() { },
    isNumber(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      // อนุญาตเฉพาะตัวเลข 0-9 (ASCII 48-57)
      if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        evt.preventDefault();
      }
      return true;
    },

    // 2. ตรวจสอบค่าขณะพิมพ์ (ห้ามต่ำกว่า 1 และห้ามเกิน Stock)
    validateQuantity(item) {
      if (item.quantity === '') return; // ปล่อยผ่านชั่วคราวถ้าว่าง

      let value = parseInt(item.quantity);

      if (isNaN(value) || value < 1) {
        item.quantity = 1;
      } else if (item.stock && value > item.stock) {
        item.quantity = item.stock; // ถ้าเกินสต็อก ให้ปรับเท่าสต็อก
      } else {
        item.quantity = value;
      }

      // อัปเดต Store (ถ้าจำเป็นต้องอัปเดตทุกครั้งที่พิมพ์)
      // useCartStore().updateCartQuantity({ product: item, qty: 0 }); 
    },

    // 3. ตรวจสอบตอนเมาส์ออกจากช่อง (Blur) กันลูกค้าลบจนว่าง
    checkEmpty(item) {
      if (!item.quantity || item.quantity === '' || item.quantity === 0) {
        item.quantity = 1;
        // useCartStore().updateCartQuantity({ product: item, qty: 0 }); // Sync กลับ Store
      }
    }
  },
  watch: {
    cart: {
      handler(newCart) {
        this.selectedItems = this.selectedItems.filter(selectedItem =>
          newCart.some(cartItem => cartItem.id === selectedItem.id)
        );
      },
      deep: true
    }
  }
}
</script>
<style scoped>
/* --- โทนสีและพื้นหลัง --- */
.bg-light {
  background-color: #f5f5f5 !important;
}

.text-orange {
  color: #ff5722 !important;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* --- Checkbox Styling (แก้ไขตรงนี้) --- */
.custom-checkbox-input {
  width: 20px;
  height: 20px;
  /* cursor: pointer;  <-- ลบอันนี้ออก หรือเปลี่ยนเป็น default */
  cursor: default;
  /* ใช้ default เพื่อให้เป็นรูปเมาส์ปกติ */
  accent-color: #ff5722;
}

/* Class นี้สำหรับ Label (ข้อความ) ถ้าอยากให้ข้อความไม่ขึ้นรูปมือด้วย ให้แก้เป็น default เช่นกัน */
.cursor-pointer {
  cursor: pointer;
}

/* --- ปุ่ม Checkout --- */
.btn-solid {
  background-color: #ff5722;
  color: #fff;
  border: none;
  transition: 0.3s;
}

.btn-solid:hover:not(.disabled) {
  background-color: #e64a19;
  box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3);
}

.btn-solid.disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

/* --- Layout --- */
.cart-box,
.cart-summary {
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.cart-item:last-child {
  border-bottom: none !important;
}


/* =========================================
   ส่วน Quantity Box
   ========================================= */

.qty-box {
  width: 110px;
}

.qty-group {
  display: flex !important;
  align-items: center;
  justify-content: center;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  padding: 0;
  background: #fff;
  height: 32px;
  overflow: hidden;
}

.qty-btn {
  width: 30px;
  height: 100%;
  border: none;
  border-radius: 0;
  background: #f9fafb;
  color: #555;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  /* ปุ่มบวกลบยังคงเป็นรูปมือ (ปกติควรเป็น) */
  transition: all .2s ease;
  padding: 0;
  line-height: 1;
}

.qty-btn:hover:not(:disabled) {
  background: #f3f4f6;
  color: #ff5722;
}

.qty-btn:disabled {
  background: #f3f4f6;
  color: #ccc;
  cursor: not-allowed;
}

.qty-btn i {
  font-size: 10px;
  font-weight: bold;
}

.qty-input {
  width: 50px !important;
  height: 100%;
  border: none !important;
  border-left: 1px solid #e5e7eb !important;
  border-right: 1px solid #e5e7eb !important;
  background: #fff !important;
  font-weight: 500;
  font-size: 14px;
  text-align: center;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.qty-input:focus,
.qty-btn:focus {
  box-shadow: none;
  outline: none;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>