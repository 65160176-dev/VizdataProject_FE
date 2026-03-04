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
                        ฿ {{ (calcPrice(item) * curr.curr).toFixed(2) }}
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

                      <div class="text-danger mt-1" style="font-size: 0.8rem; font-weight: 500;">
                        เหลือ {{ item.stock }} ชิ้น
                      </div>
                    </td>

                    <td class="col-center">
                      <a class="icon remove-icon" href="#" @click.prevent="removeCartItem(item)">
                        <i class="ti-close"></i>
                      </a>
                    </td>

                    <td class="col-right">
                      <h2 class="td-color total-text">
                        ฿ {{ ((calcPrice(item) * curr.curr) * item.quantity).toFixed(2) }}
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
import Swal from 'sweetalert2'

export default {
  data() {
    return {
      selectedItems: [],
      cartKey: 0,
      refreshInterval: null
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
      // 1. ถ้าไม่มีข้อมูลสินค้าเลย ให้ส่งรูป Default กลับไป
      if (!product) return 'https://placehold.co/400?text=No+Product'

      const resolveUrl = (url) => {
        if (!url || (typeof url === 'string' && url.trim() === '')) return null
        if (url.startsWith('data:')) return null  // legacy base64 — skip
        if (url.startsWith('http')) return url
        if (url.startsWith('/')) return `https://vizdataprojectbe-production.up.railway.app${url}`
        return `https://vizdataprojectbe-production.up.railway.app/${url}`
      }

      // 2. พยายามดึงรูปจาก product.image หลัก
      const fromImage = resolveUrl(product.image)
      if (fromImage) return fromImage

      // 3. ถ้าไม่มี ให้ลองดึงจาก product.images[0]
      if (product.images && product.images.length > 0) {
        const img = product.images[0].src || product.images[0]
        const fromImages = resolveUrl(img)
        if (fromImages) return fromImages
      }

      // 4. ถ้าไม่มีรูปเลย ให้ส่ง URL รูป Placeholder กลับไป
      // (คุณสามารถเปลี่ยนตรงนี้เป็น '/images/default-product.png' ได้ถ้ามีไฟล์ในเครื่อง)
      return 'https://placehold.co/400?text=No+Image'
    },
    calcPrice(item) {
      if (!item || !item.price) return 0
      const price = Number(item.price) || 0
      return (item.sale && item.discount) ? price - (price * (parseFloat(item.discount) / 100)) : price;
    },
    getShopName(item) {
      if (item.brand) return item.brand;
      if (item.seller && (item.seller.display_name || item.seller.name)) return item.seller.display_name || item.seller.name;
      return null;
    },
    goToShop(item) {
      if (item.seller && item.seller._id) this.$router.push('/seller/' + item.seller._id);
    },
    removeCartItem(product) {
      useCartStore().removeCartItem(product).then(() => {
        this.cartKey++
      }).catch((err) => {
        console.error('Remove failed:', err)
        useNuxtApp().$showToast({ msg: 'ลบสินค้าไม่สำเร็จ กรุณาลองใหม่', type: 'error' })
      })
    },
    async increment(product) {
      if (product.quantity >= product.stock) {
        useNuxtApp().$showToast({ msg: "สินค้ามีจำนวนจำกัด ไม่สามารถเพิ่มได้อีก", type: "error" });
        return;
      }
      await useCartStore().updateCartQuantity({ product: product, qty: 1 });
      this.cartKey++;
    },
    async decrement(product) { await useCartStore().updateCartQuantity({ product: product, qty: -1 }); this.cartKey++; },
    handleQuantityInput(event, item) {
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

      if (newQuantity < 1) {
        event.target.value = oldQuantity;
        return;
      }
      if (newQuantity > item.stock) {
        event.target.value = item.stock;
        useNuxtApp().$showToast({ msg: `สินค้ามีเพียง ${item.stock} ชิ้นในสต็อก`, type: "error" });
        return;
      }

      if (newQuantity !== oldQuantity) {
        const diff = newQuantity - oldQuantity;
        await useCartStore().updateCartQuantity({ product: item, qty: diff });
        this.cartKey++;
      }
    },
    goToCheckout() {
      const outOfStockItems = this.cart.filter(item => item.quantity > item.stock);
      if (outOfStockItems.length > 0) {
        this.checkStockAvailability();
        return;
      }

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
    },

    // ✅ ฟังก์ชันดึงข้อมูล (Logic แจ้งเตือนของหาย + แก้ไขรูปภาพ)
    async refreshCartData() {
      const store = useCartStore();
      const previousCart = [...this.cart];

      await store.fetchCart();

      if (previousCart.length > 0) {
        const currentIds = new Set(this.cart.map(item => item._id || item.id));
        const removedItems = previousCart.filter(item => !currentIds.has(item._id || item.id));

        if (removedItems.length > 0 && !Swal.isVisible()) {
          let removedHtml = '<div style="text-align: left; max-height: 300px; overflow-y: auto; padding-right: 5px;">';

          removedItems.forEach(item => {
            const imageUrl = this.getProductImage(item);
            // ✅ ใช้ div wrapper ขนาด 60x60 เพื่อบังคับขนาดรูป
            // ✅ ใช้ onerror เปลี่ยนเป็นรูป icon-empty-cart.png ในโปรเจกต์แทน (มั่นใจว่ามีรูปแน่นอน)
            removedHtml += `
               <div class="d-flex align-items-center mb-3 pb-2 border-bottom" style="gap: 15px;">
                 <div style="flex-shrink: 0; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid #eee; background-color: #f9f9f9; display: flex; align-items: center; justify-content: center;">
                   <img src="${imageUrl}" alt="${item.name}" 
                        style="width: 100%; height: 100%; object-fit: cover; display: block;"
                        onerror="this.onerror=null; this.src='/images/icon-empty-cart.png';">
                 </div>
                 <div style="flex-grow: 1; min-width: 0;">
                   <div style="color: #333; font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                     ${item.name || 'สินค้าไม่ทราบชื่อ'}
                   </div>
                   <div class="text-danger" style="font-size: 0.85rem;">
                     <i class="ti-trash"></i> สินค้าถูกลบ หรือเลิกจำหน่าย
                   </div>
                 </div>
               </div>`;
          });
          removedHtml += '</div>';

          Swal.fire({
            icon: 'error',
            title: 'สินค้าถูกนำออกจากตะกร้า',
            html: `<p class="mb-4 text-muted small">ขออภัย สินค้าบางรายการถูกลบหรือเลิกจำหน่าย:</p>${removedHtml}`,
            confirmButtonText: 'รับทราบ',
            confirmButtonColor: '#d33',
            allowOutsideClick: false,
            width: '450px',
            customClass: {
              popup: 'rounded-4 shadow-lg',
              confirmButton: 'px-4 py-2 rounded-pill fw-bold'
            }
          });

          return;
        }
      }

      if (!Swal.isVisible()) {
        this.checkStockAvailability();
      }
    },

    // ✅ ฟังก์ชันแจ้งเตือนสต็อก (แก้ไขรูปภาพให้เหมือนกัน)
    checkStockAvailability() {
      const outOfStockItems = this.cart.filter(item => item.quantity > item.stock);

      if (outOfStockItems.length > 0) {
        let itemListHtml = '<div style="text-align: left; max-height: 300px; overflow-y: auto; padding-right: 5px;">';

        outOfStockItems.forEach(item => {
          const imageUrl = this.getProductImage(item);
          const name = item.name || item.title || 'Unknown Product';
          const stock = item.stock;
          const currentQty = item.quantity;

          itemListHtml += `
             <div class="d-flex align-items-center mb-3 pb-2 border-bottom" style="gap: 15px;">
               <div style="flex-shrink: 0; width: 60px; height: 60px; border-radius: 6px; overflow: hidden; border: 1px solid #eee; background-color: #f9f9f9; display: flex; align-items: center; justify-content: center;">
                 <img src="${imageUrl}" alt="${name}" 
                      style="width: 100%; height: 100%; object-fit: cover; display: block;"
                      onerror="this.onerror=null; this.src='/images/icon-empty-cart.png';">
               </div>
               <div style="flex-grow: 1; min-width: 0;">
                 <div style="color: #333; font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                   ${name}
                 </div>
                 <div class="text-danger" style="font-size: 0.85rem;">
                   <i class="ti-alert"></i> ${stock === 0 ? 'สินค้าหมดแล้ว' : `เหลือเพียง ${stock} ชิ้น`} 
                   <span class="text-muted" style="font-size: 0.8rem;">(ในตะกร้า: ${currentQty})</span>
                 </div>
               </div>
             </div>`;
        });
        itemListHtml += '</div>';

        Swal.fire({
          icon: 'warning',
          title: 'สินค้ามีการเปลี่ยนแปลง',
          html: `<p class="mb-4 text-muted small">ระบบตรวจพบว่าสต็อกสินค้าบางรายการไม่เพียงพอ ระบบจะปรับปรุงจำนวนให้อัตโนมัติ:</p>${itemListHtml}`,
          confirmButtonText: 'ตกลง',
          confirmButtonColor: '#ff4c3b',
          allowOutsideClick: false,
          width: '450px',
          customClass: {
            popup: 'rounded-4 shadow-lg',
            confirmButton: 'px-4 py-2 rounded-pill fw-bold'
          }
        }).then(async (result) => {
          if (result.isConfirmed) {
            const store = useCartStore();
            for (const item of outOfStockItems) {
              const diff = item.stock - item.quantity;
              if (diff !== 0) {
                await store.updateCartQuantity({ product: item, qty: diff });
              }
            }
            useNuxtApp().$showToast({ msg: 'ปรับปรุงจำนวนสินค้าเรียบร้อยแล้ว', type: 'success' });
          }
        });
      }
    }
  },

  async mounted() {
    await this.refreshCartData();

    this.refreshInterval = setInterval(async () => {
      console.log('Real-time checking cart stock & removed items...');
      await this.refreshCartData();
    }, 15000);
  },

  beforeUnmount() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }
}
</script>

<style scoped>
/* ปรับแต่งปุ่มเมื่อถูก Disable (สินค้าหมด Stock) */
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

/* ==========================================
   🔥 CSS แปลง Table เป็น Card (Mobile Only) 🔥
============================================= */
@media (max-width: 767px) {

  /* ลดขอบจอด้านข้าง */
  .container-fluid {
    padding-left: 15px !important;
    padding-right: 15px !important;
  }

  /* 📌 1. นำ Checkbox "เลือกทั้งหมด" (Select All) กลับมาโชว์ */
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
    /* ซ่อนคำว่า Image, Shop, Product ฯลฯ */
  }

  :deep(.cart-table thead th:nth-child(1)) {
    display: flex !important;
    /* โชว์แค่ช่อง Checkbox ซ้ายสุด */
    align-items: center;
    border: none !important;
    padding: 0 !important;
  }

  /* เติมคำอธิบายหลัง Checkbox */
  :deep(.cart-table thead th:nth-child(1))::after {
    content: "เลือกทั้งหมด";
    margin-left: 10px;
    font-size: 15px;
    font-weight: 600;
    color: #333;
  }

  /* ขยายขนาด Checkbox เลือกทั้งหมด */
  :deep(.cart-table thead th:nth-child(1) input[type="checkbox"]) {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #ff4c3b;
    /* เปลี่ยนสีตอนติ๊กให้เข้ากับธีมแดง */
  }

  /* พับ Table ให้เป็น Block */
  :deep(.cart-table),
  :deep(.cart-table tbody),
  :deep(.cart-table tr),
  :deep(.cart-table td) {
    display: block !important;
    width: 100% !important;
  }

  /* 📌 จัดโครงร่าง Grid ใหม่ ให้ทุกอย่างอยู่ถูกที่ */
  :deep(.cart-table tr.align-middle) {
    position: relative;
    border: 1px solid #eaeaea !important;
    border-radius: 12px;
    margin-bottom: 15px;
    padding: 15px 15px 10px 10px !important;
    /* ปรับลดขอบซ้ายนิดนึง */
    background-color: #fff;
    display: grid !important;
    grid-template-columns: 28px 65px 1fr auto;
    /* เว้นที่ให้ Checkbox 28px */
    grid-template-areas:
      "shop  shop  shop  shop"
      "check image title title"
      "check image price price"
      "check image qty   qty"
      "total total total total";
    grid-column-gap: 12px;
    align-items: start;
  }

  /* ล้าง Padding, Border ของ td เดิมทิ้ง และลบพื้นหลังขาว */
  :deep(.cart-table td) {
    border: none !important;
    padding: 0 !important;
    text-align: left !important;
    background-color: transparent !important;
  }

  /* --- 2. Checkbox ของสินค้าแต่ละชิ้น --- */
  :deep(.cart-table td:nth-child(1)) {
    grid-area: check;
    align-self: stretch;
    display: flex;

    /* 1. เปลี่ยนจาก center เป็น flex-start เพื่อให้เราคุมระยะจากด้านบนเองได้ */
    align-items: flex-start !important;
    justify-content: flex-start;

    /* 2. 👇 ใช้ Padding ในการขยับตำแหน่งทีละนิด */
    padding-top: 22px !important;
    /* เพิ่มเลขนี้เพื่อขยับ "ลง" */
    padding-left: 17px !important;
    /* เพิ่มเลขนี้เพื่อขยับไปทาง "ขวา" */
  }

  /* ส่วนของ Input ขนาดเดิมที่คุณตั้งไว้ */
  :deep(.cart-table td:nth-child(1) input[type="checkbox"]) {
    width: 20px;
    height: 20px;
    cursor: pointer;
    accent-color: #ff4c3b;
  }

  /* --- 3. รูปภาพสินค้า --- */
  :deep(.cart-table td:nth-child(2)) {
    grid-area: image;
  }

  :deep(.cart-table td:nth-child(2) .product-img) {
    width: 70% !important;
    height: 70px !important;
    border: 1px solid #f1f1f1;
    border-radius: 6px;
  }

  /* --- 4. ชื่อร้าน (Shop) --- */
  :deep(.cart-table td:nth-child(3)) {
    grid-area: shop;
    padding-bottom: 8px !important;
    border-bottom: 1px solid #f1f1f1 !important;
    margin-bottom: 10px !important;
    font-size: 14px;
    font-weight: 600;
    color: #333;
    /* แก้ margin-left ที่ติดลบเยอะเกินไป ให้กลับมาพอดีขอบ */
    margin-left: -120px !important;
  }

  /* --- 5. ชื่อสินค้า (Title) --- */
  :deep(.cart-table td:nth-child(4)) {
    grid-area: title;
    padding-right: 25px !important;
    /* เว้นที่ให้ปุ่ม X */
    margin-bottom: 5px !important;
    /* เคลียร์ margin ที่ทำให้ข้อความกระเด็น */
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

  /* --- 6. ราคาสินค้าต่อชิ้น (Price) --- */
  :deep(.cart-table td:nth-child(5)) {
    grid-area: price;
    align-self: center;
    /* เคลียร์ margin ที่ทำให้ทับกัน */
    margin-left: 100px !important;
    margin-top: 0 !important;
  }

  :deep(.price-text) {
    font-size: 15px !important;
    color: rgb(255, 76, 59);
    margin: 0 !important;
    font-weight: bold;
  }

  /* --- 7. จำนวน และ จำนวนชิ้นที่เหลือ (Qty & Stock) --- */
  :deep(.cart-table td:nth-child(6)) {
    grid-area: qty;
    align-self: start;
    display: flex;
    flex-direction: column;
    /* ดึงปุ่มให้มาชิดซ้าย ตรงกับราคาและชื่อสินค้า */
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
    /* เปลี่ยนข้อความเหลือชิ้นให้ชิดซ้าย */
    font-weight: 600;
    margin-left: 30px !important;
  }

  /* --- 8. ปุ่มกากบาท ลบสินค้า (X) --- */
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

  /* --- 9. ราคารวมของสินค้านั้น (Total Price) --- */
  :deep(.cart-table td:nth-child(8)) {
    grid-area: total;
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    width: 100% !important;

    border-top: 1px dashed #eee !important;
    margin-top: 12px !important;
    padding-top: 12px !important;

    /* 🚨 ลด Padding ขวาลงนิดนึงเพื่อเพิ่มพื้นที่ให้ตัวเลข */
    padding-left: 5px !important;
    padding-right: 0px !important;
    background-color: transparent !important;
  }

  /* 🏷️ ส่วนของข้อความ "ราคารวม:" (ฝั่งซ้าย) */
  :deep(.cart-table td:nth-child(8))::before {
    content: "ราคารวม:";
    font-size: 14px !important;
    font-weight: 600 !important;
    color: #666 !important;
    display: block !important;
    /* ห้ามคำว่าราคารวมหดขนาด */
    flex-shrink: 0 !important;
    margin-right: 10px !important;
  }

  /* 💰 ส่วนของตัวเลขราคา (ฝั่งขวา) */
  :deep(.total-text) {
    font-size: 17px !important;
    color: #ff4c3b !important;
    margin: 0 !important;
    font-weight: 700 !important;
    display: block !important;
    text-align: right !important;

    /* ✅ บรรทัดสำคัญ: ห้ามตัดคำ ห้ามขึ้นบรรทัดใหม่เด็ดขาด ✅ */
    white-space: nowrap !important;
    /* ให้ตัวเลขใช้พื้นที่ที่เหลือทั้งหมด */
    flex-grow: 1 !important;
    margin-right: 25px !important;
  }

  /* ==========================================
     จัดหน้าสรุปยอดตะกร้าล่างสุด (Total Footer)
  ============================================= */
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

  /* ==========================================
     ปุ่ม Checkout และ Continue Shopping 
  ============================================= */
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