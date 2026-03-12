<template>
  <div>
    <Header />
    <WidgetsBreadcrumbs title="ตะกร้าสินค้า" />
    <section class="cart-section section-b-space">
      <div
        class="container-fluid"
        style="padding-left: 3rem; padding-right: 3rem"
      >
        <div class="mb-3"></div>

        <div class="row mb-4">
          <div class="col-12 text-center">
            <h2 class="title-font font-weight-bold" style="color: #333; font-size: 28px;">ตะกร้าสินค้า</h2>
            <div class="title-border mb-0 mt-2" style="width: 50px; height: 3px; background-color: #ff4c3b; margin: 0 auto;"></div>
          </div>
        </div>

        <div class="row">
          <div class="col-sm-12">
            <div class="cart-table-wrapper" v-if="cart.length">
              <table class="table cart-table" :key="cartKey">
                <thead>
                  <tr class="table-head">
                    <th scope="col" class="col-center">
                      <input type="checkbox" v-model="isAllSelected" />
                    </th>
                    <th scope="col" class="col-center">รูปภาพสินค้า</th>
                    <th scope="col" class="col-center">ร้านค้า</th>
                    <th scope="col" class="col-left">สินค้า</th>
                    <th scope="col" class="col-center">ราคา</th>
                    <th scope="col" class="col-center">จำนวน</th>
                    <th scope="col" class="col-center">นำสินค้าออก</th>
                    <th scope="col" class="col-right">รวม</th>
                  </tr>
                </thead>

                <tbody v-for="(item, index) in cart" :key="index">
                  <tr class="align-middle">
                    <td class="col-center">
                      <input
                        type="checkbox"
                        :value="item.id || item._id"
                        v-model="selectedItems"
                      />
                    </td>

                    <td class="col-center">
                      <nuxt-link
                        :to="{
                          path: '/product/sidebar/' + (item._id || item.id),
                        }"
                      >
                        <img
                          :src="getProductImage(item.image || item.images?.[0]?.src)"
                          alt=""
                          class="product-img"
                        />
                      </nuxt-link>
                    </td>

                    <td class="col-center">
                      <div
                        v-if="getShopName(item)"
                        class="shop-badge-container"
                      >
                        <span class="shop-badge" @click="goToShop(item)">
                          <i class="ti-home"></i> {{ getShopName(item) }}
                        </span>
                      </div>
                      <div v-else class="text-muted small">-</div>
                    </td>

                    <td class="col-left">
                      <nuxt-link
                        :to="{
                          path: '/product/sidebar/' + (item._id || item.id),
                        }"
                        class="product-name-link"
                      >
                        {{ item.name || item.title || "No Name" }}
                      </nuxt-link>

                      <div class="mobile-cart-content row">
                        <div class="col-xs-3">
                          <div class="qty-box">
                            <div class="input-group">
                              <input
                                type="text"
                                name="quantity"
                                class="form-control input-number"
                                :value="item.quantity"
                                readonly
                              />
                            </div>
                          </div>
                        </div>
                        <div class="col-xs-3">
                          <h2 class="td-color">
                            {{ curr.symbol
                            }}{{ (calcPrice(item) * curr.curr).toFixed(2) }}
                          </h2>
                        </div>
                        <div class="col-xs-3">
                          <h2 class="td-color">
                            <a href="#" class="icon"
                              ><i class="ti-close"></i
                            ></a>
                          </h2>
                        </div>
                      </div>
                    </td>

                    <td class="col-center">
                      <h2 class="td-color price-text">
                        ฿ {{ (calcPrice(item) * curr.curr).toFixed(2) }}
                      </h2>
                    </td>

                    <td class="col-center">
                      <div class="qty-box d-flex justify-content-center">
                        <div class="input-group input-group-sm qty-input-group">
                          <span class="input-group-prepend">
                            <button
                              type="button"
                              class="btn quantity-btn"
                              @click="decrement(item)"
                            >
                              <i class="ti-angle-left"></i>
                            </button>
                          </span>
                          <input
                            type="number"
                            name="quantity"
                            class="form-control input-number qty-input"
                            :disabled="item.quantity > item.stock"
                            :value="item.quantity"
                            @input="handleQuantityInput($event, item)"
                            @blur="handleQuantityBlur($event, item)"
                            min="1"
                            :max="item.stock"
                          />
                          <span class="input-group-prepend">
                            <button
                              type="button"
                              class="btn quantity-btn"
                              @click="increment(item)"
                              :disabled="item.quantity >= item.stock"
                            >
                              <i class="ti-angle-right"></i>
                            </button>
                          </span>
                        </div>
                      </div>

                      <div
                        class="text-danger mt-1"
                        style="font-size: 0.8rem; font-weight: 500"
                      >
                        เหลือ {{ item.stock }} ชิ้น
                      </div>
                    </td>

                    <td class="col-center">
                      <a
                        class="icon remove-icon"
                        href="#"
                        @click.prevent="removeCartItem(item)"
                      >
                        <i class="ti-close"></i>
                      </a>
                    </td>

                    <td class="col-right">
                      <h2 class="td-color total-text">
                        ฿
                        {{
                          (calcPrice(item) * curr.curr * item.quantity).toFixed(
                            2,
                          )
                        }}
                      </h2>
                    </td>
                  </tr>
                </tbody>

                <tfoot>
                  <tr>
                    <td colspan="7" class="text-end total-label">
                      ราคารวม (สินค้าที่เลือก):
                    </td>
                    <td class="col-right">
                      <h2 class="td-color">
                        ฿ {{ (selectedTotal * curr.curr).toFixed(2) }}
                      </h2>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            <div
              class="col-sm-12 empty-cart-cls text-center"
              v-if="!cart.length"
            >
              <img
                src="/images/icon-empty-cart.png"
                class="img-fluid"
                alt="empty cart"
              />
              <h3 class="mt-3"><strong>Your Cart is Empty</strong></h3>
              <h4 class="mb-3">Add something to make me happy :)</h4>
              <div class="col-12">
                <nuxt-link :to="{ path: '/' }" class="btn btn-solid"
                  >continue shopping</nuxt-link
                >
              </div>
            </div>
          </div>
        </div>

        <div class="row cart-buttons" v-if="cart.length">
          <div class="col-6">
            <nuxt-link :to="{ path: '/' }" :class="'btn btn-solid'"
              >เลือกซื้อสินค้าต่อ</nuxt-link
            >
          </div>
          <div class="col-6">
            <a
              href="javascript:void(0)"
              class="btn btn-solid"
              :class="{ disabled: selectedItems.length === 0 }"
              @click="goToCheckout"
            >
              ชำระเงิน ({{ selectedItems.length }})
            </a>
          </div>
        </div>
      </div>
    </section>

    <section class="ratio_asos bg-light pt-3 pb-4" v-if="randomProducts.length > 0">
      <div class="container-fluid" style="padding-left: 3rem; padding-right: 3rem;">
        <div class="row">
          <div class="col-12 product-related">
            <h2 class="mb-3 text-center">สินค้าที่คุณอาจสนใจ</h2>
          </div>
        </div>
        <div class="product-grid">
          <div
            v-for="(prod, idx) in randomProducts"
            :key="'random-' + idx"
            class="product-card"
          >
            <div class="card h-100 shadow-sm" @click="navigateToProduct(prod._id || prod.id)" style="cursor: pointer;">
              <div class="card-img-wrap">
                <img
                  :src="getProductImage(prod.image || prod.images?.[0]?.src)"
                  class="card-img-top"
                  :alt="prod.name"
                />
              </div>
              <div class="card-body d-flex flex-column">
                <h6 class="card-title mb-2 text-truncate" style="white-space: normal;">
                  {{ prod.name }}
                </h6>
                <div class="mt-auto">
                  <div class="fw-bold td-color" style="font-size: 15px;">
                    ฿{{ prod.price?.toLocaleString() }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
  <Footer />
</template>

<script>
import { useCartStore } from "~~/store/cart";
import { useProductStore } from "~~/store/products";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      selectedItems: [],
      cartKey: 0,
      refreshInterval: null,
      randomProducts: [], // เก็บข้อมูลสินค้าแนะนำ
    };
  },
  computed: {
    cart() {
      return useCartStore().cartItems;
    },
    selectedTotal() {
      return this.cart
        .filter((item) => this.selectedItems.includes(item.id || item._id))
        .reduce((total, item) => {
          return total + this.calcPrice(item) * item.quantity;
        }, 0);
    },
    curr() {
      return useProductStore().changeCurrency;
    },
    isAllSelected: {
      get() {
        return (
          this.cart.length > 0 && this.selectedItems.length === this.cart.length
        );
      },
      set(value) {
        this.selectedItems = value
          ? this.cart.map((item) => item.id || item._id)
          : [];
      },
    },
  },
  watch: {
    cart: {
      handler(newVal) {
        const currentCartIds = newVal.map((item) => item.id || item._id);
        this.selectedItems = this.selectedItems.filter((id) =>
          currentCartIds.includes(id),
        );
        this.cartKey++;
      },
      deep: true,
    },
  },
  methods: {
    getImgUrl(path) {
      return "/images/" + path;
    },
    getProductImage(image) {
      const BACKEND_URL = "https://vizdataprojectbe-production.up.railway.app";
      if (!image) return "https://placehold.co/400?text=No+Image";
      if (typeof image === 'string' && image.startsWith("data:")) return "https://placehold.co/400?text=No+Image";
      if (typeof image === 'string' && image.startsWith("http")) return image;
      if (typeof image === 'string' && image.startsWith("/")) return `${BACKEND_URL}${image}`;
      return `${BACKEND_URL}/${image}`;
    },
    calcPrice(item) {
      if (!item || !item.price) return 0;
      const price = Number(item.price) || 0;
      return item.sale && item.discount
        ? price - price * (parseFloat(item.discount) / 100)
        : price;
    },
    getShopName(item) {
      if (item.brand) return item.brand;
      if (item.seller && (item.seller.display_name || item.seller.name))
        return item.seller.display_name || item.seller.name;
      return null;
    },
    goToShop(item) {
      if (item.seller && item.seller._id)
        this.$router.push("/seller/" + item.seller._id);
    },
    removeCartItem(product) {
      useCartStore()
        .removeCartItem(product)
        .then(() => {
          this.cartKey++;
        })
        .catch((err) => {
          console.error("Remove failed:", err);
          useNuxtApp().$showToast({
            msg: "ลบสินค้าไม่สำเร็จ กรุณาลองใหม่",
            type: "error",
          });
        });
    },
    async increment(product) {
      if (product.quantity >= product.stock) {
        useNuxtApp().$showToast({
          msg: "สินค้ามีจำนวนจำกัด ไม่สามารถเพิ่มได้อีก",
          type: "error",
        });
        return;
      }
      await useCartStore().updateCartQuantity({ product: product, qty: 1 });
      this.cartKey++;
    },
    async decrement(product) {
      if (product.quantity <= 1) return;
      await useCartStore().updateCartQuantity({ product: product, qty: -1 });
      this.cartKey++;
    },
    handleQuantityInput(event, item) {
      const value = parseInt(event.target.value) || 0;
      if (value < 1) {
        event.target.value = 1;
      } else if (value > item.stock) {
        event.target.value = item.stock;
        useNuxtApp().$showToast({
          msg: `สินค้ามีเพียง ${item.stock} ชิ้นในสต็อก`,
          type: "error",
        });
      }
    },
    async handleQuantityBlur(event, item) {
      const newQuantity = parseInt(event.target.value) || 1;
      const oldQuantity = item.quantity;
      if (newQuantity < 1) {
        event.target.value = oldQuantity;
        return;
      }
      if (newQuantity > item.stock) {
        event.target.value = item.stock;
        useNuxtApp().$showToast({
          msg: `สินค้ามีเพียง ${item.stock} ชิ้นในสต็อก`,
          type: "error",
        });
        return;
      }
      if (newQuantity !== oldQuantity) {
        const diff = newQuantity - oldQuantity;
        await useCartStore().updateCartQuantity({ product: item, qty: diff });
        this.cartKey++;
      }
    },
    goToCheckout() {
      const outOfStockItems = this.cart.filter(
        (item) => item.quantity > item.stock,
      );
      if (outOfStockItems.length > 0) {
        this.checkStockAvailability();
        return;
      }

      if (this.selectedItems.length === 0) {
        useNuxtApp().$showToast({
          msg: "Please select items to checkout.",
          type: "error",
        });
        return;
      }

      const checkoutData = this.cart
        .filter((item) => this.selectedItems.includes(item.id || item._id))
        .map((item) => ({
          ...item,
          id: item.id || item._id,
          _id: item._id || item.id,
          name: item.name || item.title || "",
          price: Number(item.price) || 0,
          quantity: Number(item.quantity),
          brand: item.brand || "Shop",
          image: item.image || item.images?.[0]?.src, // ส่งรูปไปด้วย
          seller: item.seller || null,
        }));

      localStorage.setItem("checkout_items", JSON.stringify(checkoutData));
      this.$router.push("/page/account/checkout");
    },
    async refreshCartData() {
      const store = useCartStore();
      const token = localStorage.getItem("token");
      
      if (token) {
        try {
          const previousCart = [...this.cart];
          await store.fetchCart();
          if (previousCart.length > 0) {
            const currentIds = new Set(
              this.cart.map((item) => item._id || item.id),
            );
            const removedItems = previousCart.filter(
              (item) => !currentIds.has(item._id || item.id),
            );
            if (removedItems.length > 0 && !Swal.isVisible()) {
              this.showRemovedItemsAlert(removedItems);
              return;
            }
          }
        } catch (error) {
          console.error("Fetch cart failed");
        }
      }
      
      if (!Swal.isVisible()) {
        this.checkStockAvailability();
      }
    },
    showRemovedItemsAlert(removedItems) {
      let removedHtml =
        '<div style="text-align: left; max-height: 300px; overflow-y: auto; padding-right: 5px;">';
      removedItems.forEach((item) => {
        const imageUrl = this.getProductImage(item.image || item.images?.[0]?.src);
        removedHtml += `<div class="d-flex align-items-center mb-3 pb-2 border-bottom" style="gap: 15px;">
                <div style="flex-shrink: 0; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid #eee; background-color: #f9f9f9; display: flex; align-items: center; justify-content: center;">
                    <img src="${imageUrl}" alt="${
          item.name
        }" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.onerror=null; this.src='/images/icon-empty-cart.png';">
                </div>
                <div style="flex-grow: 1; min-width: 0;">
                    <div style="color: #333; font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
                      item.name || "สินค้าไม่ทราบชื่อ"
                    }</div>
                    <div class="text-danger" style="font-size: 0.85rem;"><i class="ti-trash"></i> สินค้าถูกลบ หรือเลิกจำหน่าย</div>
                </div>
            </div>`;
      });
      removedHtml += "</div>";
      Swal.fire({
        icon: "error",
        title: "สินค้าถูกนำออกจากตะกร้า",
        html: `<p class="mb-4 text-muted small">ขออภัย สินค้าบางรายการถูกลบหรือเลิกจำหน่าย:</p>${removedHtml}`,
        confirmButtonText: "รับทราบ",
        confirmButtonColor: "#d33",
        allowOutsideClick: false,
        width: "450px",
        customClass: {
          popup: "rounded-4 shadow-lg",
          confirmButton: "px-4 py-2 rounded-pill fw-bold",
        },
      });
    },
    checkStockAvailability() {
      const outOfStockItems = this.cart.filter(
        (item) => item.quantity > item.stock,
      );
      if (outOfStockItems.length > 0) {
        this.showStockAlert(outOfStockItems);
      }
    },
    showStockAlert(outOfStockItems) {
      let itemListHtml =
        '<div style="text-align: left; max-height: 300px; overflow-y: auto; padding-right: 5px;">';
      outOfStockItems.forEach((item) => {
        const imageUrl = this.getProductImage(item.image || item.images?.[0]?.src);
        itemListHtml += `<div class="d-flex align-items-center mb-3 pb-2 border-bottom" style="gap: 15px;">
                <div style="flex-shrink: 0; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid #eee; background-color: #f9f9f9; display: flex; align-items: center; justify-content: center;">
                    <img src="${imageUrl}" alt="${
          item.name
        }" style="width: 100%; height: 100%; object-fit: cover; display: block;" onerror="this.onerror=null; this.src='/images/icon-empty-cart.png';">
                </div>
                <div style="flex-grow: 1; min-width: 0;">
                    <div style="color: #333; font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${
                      item.name || item.title
                    }</div>
                    <div class="text-danger" style="font-size: 0.85rem;"><i class="ti-alert"></i> ${
                      item.stock === 0
                        ? "สินค้าหมดแล้ว"
                        : `เหลือเพียง ${item.stock} ชิ้น`
                    } <span class="text-muted" style="font-size: 0.8rem;">(ในตะกร้า: ${
          item.quantity
        })</span></div>
                </div>
            </div>`;
      });
      itemListHtml += "</div>";
      Swal.fire({
        icon: "warning",
        title: "สินค้ามีการเปลี่ยนแปลง",
        html: `<p class="mb-4 text-muted small">ระบบตรวจพบว่าสต็อกสินค้าบางรายการไม่เพียงพอ ระบบจะปรับปรุงจำนวนให้อัตโนมัติ:</p>${itemListHtml}`,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#ff4c3b",
        allowOutsideClick: false,
        width: "450px",
        customClass: {
          popup: "rounded-4 shadow-lg",
          confirmButton: "px-4 py-2 rounded-pill fw-bold",
        },
      }).then(async (result) => {
        if (result.isConfirmed) {
          const store = useCartStore();
          for (const item of outOfStockItems) {
            const diff = item.stock - item.quantity;
            if (diff !== 0) {
              await store.updateCartQuantity({ product: item, qty: diff });
            }
          }
          this.cartKey++;
        }
      });
    },

    // ดึงสินค้าแนะนำ
    async fetchRandomProducts() {
      try {
        const allProducts = await $fetch(
          "https://vizdataprojectbe-production.up.railway.app/api/product"
        );
        
        // ดึงเฉพาะสินค้าที่มีสต็อก และไม่ได้อยู่ในตะกร้าแล้ว
        const cartIds = this.cart.map(item => item._id || item.id);
        const filtered = allProducts.filter(
          (p) => p.stock && p.stock > 0 && !cartIds.includes(p._id)
        );

        // สุ่มมา 6 ชิ้น
        this.randomProducts = this.shuffleArray(filtered).slice(0, 6);
      } catch (error) {
        console.error("Failed to fetch random products:", error);
        this.randomProducts = [];
      }
    },
    shuffleArray(array) {
      const shuffled = [...array];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    },
    navigateToProduct(productId) {
      this.$router.push(`/product/three-column/thumbnail-left?id=${productId}`);
    }
  },

  async mounted() {
    await this.refreshCartData();
    await this.fetchRandomProducts();

    this.refreshInterval = setInterval(async () => {
      await this.refreshCartData();
    }, 15000);
  },

  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  },
};
</script>

<style scoped>
/* Style เดิมของตารางและปุ่ม */
.quantity-btn:disabled {
  opacity: 0.5 !important;
  background-color: #e9ecef !important;
  color: #6c757d !important;
  cursor: not-allowed !important;
  border-color: #ced4da !important;
}

.product-img {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 5px;
}

/* -----------------------------------------
   🔥 Style สำหรับสินค้าแนะนำ (Product Grid) 🔥
----------------------------------------- */
.product-related h2 {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 15px;
  padding-bottom: 20px;
}

.product-card {
  display: block;
}

.product-card .card {
  border: 1px solid #eaeaea;
  border-radius: 8px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  overflow: hidden;
  background-color: #fff;
}

.product-card .card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) !important;
}

.card-img-wrap {
  aspect-ratio: 1 / 1;
  overflow: hidden;
  background: #f9f9f9;
  display: flex;
  align-items: center;
  justify-content: center;
}

.product-card .card-img-top {
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 10px;
}

.product-card .card-body {
  padding: 12px;
}

.product-card .card-title {
  font-size: 13px;
  line-height: 1.4;
  height: 36px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  white-space: normal;
  color: #333;
}

.td-color {
  color: #ff4c3b;
}

/* Responsive Grid */
@media (max-width: 1400px) {
  .product-grid { grid-template-columns: repeat(5, 1fr); }
}
@media (max-width: 1100px) {
  .product-grid { grid-template-columns: repeat(4, 1fr); }
}
@media (max-width: 900px) {
  .product-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 600px) {
  .product-grid { 
    grid-template-columns: repeat(2, 1fr); 
    gap: 10px;
  }
  .product-related h2 { font-size: 18px; }
}

/* ==========================================
   🔥 CSS แปลง Table เป็น Card (Mobile Only) 🔥
============================================= */
@media (max-width: 767px) {
  .container-fluid {
    padding-left: 15px !important;
    padding-right: 15px !important;
  }

  :deep(.cart-table thead) {
    display: block !important;
    margin-bottom: 15px;
    background: transparent !important;
  }
  :deep(.cart-table thead tr) {
    display: flex !important;
    align-items: center;
    border: none !important;
    padding: 0 5px;
  }
  :deep(.cart-table thead th) {
    display: none !important;
  }
  :deep(.cart-table thead th:nth-child(1)) {
    display: flex !important;
    align-items: center;
    border: none !important;
    padding: 0 !important;
  }
  :deep(.cart-table thead th:nth-child(1))::after {
    content: "เลือกทั้งหมด";
    margin-left: 10px;
    font-size: 15px;
    font-weight: 600;
    color: #333;
  }
  :deep(.cart-table thead th:nth-child(1) input[type="checkbox"]) {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #ff4c3b;
  }
  :deep(.cart-table),
  :deep(.cart-table tbody),
  :deep(.cart-table tr),
  :deep(.cart-table td) {
    display: block !important;
    width: 100% !important;
  }
  :deep(.cart-table tr.align-middle) {
    position: relative;
    border: 1px solid #eaeaea !important;
    border-radius: 12px;
    margin-bottom: 15px;
    padding: 15px 15px 10px 10px !important;
    background-color: #fff;
    display: grid !important;
    grid-template-columns: 28px 65px 1fr auto;
    grid-template-areas:
      "shop  shop  shop  shop"
      "check image title title"
      "check image price price"
      "check image qty   qty"
      "total total total total";
    grid-column-gap: 12px;
    align-items: start;
  }
  :deep(.cart-table td) {
    border: none !important;
    padding: 0 !important;
    text-align: left !important;
    background-color: transparent !important;
  }
  :deep(.cart-table td:nth-child(1)) {
    grid-area: check;
    align-self: stretch;
    display: flex;
    align-items: flex-start !important;
    justify-content: flex-start;
    padding-top: 22px !important;
    padding-left: 17px !important;
  }
  :deep(.cart-table td:nth-child(1) input[type="checkbox"]) {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #ff4c3b;
  }
  :deep(.cart-table td:nth-child(2)) {
    grid-area: image;
  }
  :deep(.cart-table td:nth-child(2) .product-img) {
    width: 70% !important;
    height: 70px !important;
    border: 1px solid #f1f1f1;
    border-radius: 6px;
  }
  :deep(.cart-table td:nth-child(3)) {
    grid-area: shop;
    padding-bottom: 8px !important;
    border-bottom: 1px solid #f1f1f1 !important;
    margin-bottom: 10px !important;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    margin-left: -120px !important;
  }
  :deep(.cart-table td:nth-child(4)) {
    grid-area: title;
    padding-right: 25px !important;
    margin-bottom: 5px !important;
    margin-left: 50px !important;
    margin-top: 0 !important;
  }
  :deep(.product-name-link) {
    font-size: 14px !important;
    font-weight: 600;
    color: #333;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  :deep(.mobile-cart-content) {
    display: none !important;
  }
  :deep(.cart-table td:nth-child(5)) {
    grid-area: price;
    align-self: center;
    margin-left: 100px !important;
    margin-top: 0 !important;
  }
  :deep(.price-text) {
    font-size: 15px !important;
    color: rgb(255, 76, 59);
    margin: 0 !important;
    font-weight: bold;
  }
  :deep(.cart-table td:nth-child(6)) {
    grid-area: qty;
    align-self: start;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 10px !important;
    margin-top: 5px !important;
    margin-left: 80px !important;
  }
  :deep(.qty-box) {
    width: 100px !important;
    justify-content: flex-start !important;
  }
  :deep(.cart-table td:nth-child(6) .text-danger) {
    font-size: 11px !important;
    margin-top: 4px !important;
    text-align: left;
    font-weight: 600;
    margin-left: 30px !important;
  }
  :deep(.cart-table td:nth-child(7)) {
    position: absolute;
    top: 15px;
    right: 15px;
    width: auto !important;
    z-index: 2;
  }
  :deep(.cart-table td:nth-child(7) a i) {
    font-size: 16px;
    color: rgb(255, 76, 59);
    margin-left: 100px !important;
  }
  :deep(.cart-table td:nth-child(8)) {
    grid-area: total;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
    border-top: 1px dashed #eee !important;
    margin-top: 12px !important;
    padding-top: 12px !important;
    padding-left: 5px !important;
    padding-right: 0px !important;
    background-color: transparent !important;
  }
  :deep(.cart-table td:nth-child(8))::before {
    content: "ราคารวม:";
    font-size: 14px !important;
    font-weight: 600 !important;
    color: #666 !important;
    display: block !important;
    flex-shrink: 0 !important;
    margin-right: 10px !important;
  }
  :deep(.total-text) {
    font-size: 17px !important;
    color: #ff4c3b !important;
    margin: 0 !important;
    font-weight: 700 !important;
    display: block !important;
    text-align: right !important;
    white-space: nowrap !important;
    flex-grow: 1 !important;
    margin-right: 25px !important;
  }
  :deep(.cart-table tfoot) {
    display: block !important;
  }
  :deep(.cart-table tfoot tr) {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;
    padding: 15px 20px !important;
    background-color: #f8f9fa !important;
    border: 1px solid #eee !important;
    border-radius: 8px !important;
    margin-top: 10px !important;
  }
  :deep(.cart-table tfoot td.total-label) {
    text-align: left !important;
    font-size: 15px !important;
    font-weight: 600 !important;
    color: #333 !important;
    flex-grow: 1 !important;
    white-space: nowrap !important;
  }
  :deep(.cart-table tfoot td.col-right) {
    flex-shrink: 0 !important;
    text-align: right !important;
  }
  :deep(.cart-table tfoot .col-right h2) {
    font-size: 20px !important;
    margin: 0 !important;
    color: #ff4c3b !important;
    font-weight: 700 !important;
  }
  .cart-buttons {
    display: flex;
    flex-direction: column-reverse;
    gap: 10px;
    margin-top: 20px;
    margin-bottom: 30px;
  }
  .cart-buttons .col-6 {
    width: 100%;
    padding: 0;
  }
  .cart-buttons .btn {
    width: 100%;
    display: block;
    padding: 12px 0;
    border-radius: 8px;
    font-size: 16px;
  }
  .cart-buttons .col-6:first-child .btn-solid {
    background-color: transparent !important;
    color: #ff4c3b !important;
    border: 1px solid #ff4c3b !important;
  }
}
</style>