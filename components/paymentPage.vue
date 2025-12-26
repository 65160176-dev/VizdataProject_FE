<template>
  <section class="section-b-space">
    <div class="container">
      <div class="checkout-page">
        <div class="checkout-form">
          <form>
            <div class="row">
              <div class="col-lg-6 col-sm-12">
                <div class="checkout-title">
                  <h3>Billing Details</h3>
                </div>

                <div class="row check-out">
                  <div class="col-12 mb-3">
                    <label>Shipping Address:</label>

                    <div class="address-box">
                      <div class="d-flex justify-content-between">
                        <div class="name">{{ user.firstName.value }} {{ user.lastName.value }}</div>
                      </div>
                      <div class="phone">Tel: {{ user.phone.value }}</div>
                      <div class="address-detail pe-5">
                        {{ user.address.value }}<br>
                        {{ user.city.value }}, {{ user.state.value }} {{ user.pincode.value }}
                      </div>
                      <div class="email text-muted small mt-1">{{ user.email.value }}</div>

                      <div class="edit-btn-icon" @click="editCurrentAddress">
                        <i class="ti-pencil-alt"></i>
                      </div>
                    </div>

                    <div class="row mt-3" v-if="!isFormVisible">
                      <div class="col-6">
                        <a href="javascript:void(0)" class="btn btn-outline w-100 btn-sm"
                          :class="{ 'active': isAddressListVisible }" @click="toggleAddressList">
                          เปลี่ยนที่อยู่
                        </a>
                      </div>
                      <div class="col-6">
                        <a href="javascript:void(0)" class="btn btn-solid w-100 btn-sm" @click="openAddressForm">
                          เพิ่มที่อยู่ใหม่
                        </a>
                      </div>
                    </div>

                    <div class="mt-3" v-if="isAddressListVisible && !isFormVisible">
                      <label class="text-muted mb-2">Select from saved addresses:</label>
                      <div class="saved-address-list">
                        <div class="address-card p-3 mb-2 border rounded" v-for="(addr, index) in savedAddressesList"
                          :key="index" :class="{ 'active': isCurrentAddress(addr) }" @click="selectFromList(addr)">

                          <div class="d-flex justify-content-between align-items-center">
                            <span class="fw-bold">
                              {{ addr.firstName }} {{ addr.lastName }}
                              <span v-if="addr.isDefault" class="badge bg-success ms-2"
                                style="font-size: 10px;">Default</span>
                            </span>
                            <span class="check-icon text-primary" v-if="isCurrentAddress(addr)">
                              <i class="ti-check"></i>
                            </span>
                          </div>
                          <div class="small text-muted">{{ addr.phone }}</div>
                          <div class="small pe-4">{{ addr.address }} {{ addr.city }} {{ addr.pincode }}</div>

                          <div class="edit-btn-icon" @click.stop="editSavedAddress(index)">
                            <i class="ti-pencil-alt"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="col-12 mt-4 p-3 border rounded bg-light" v-if="isFormVisible">
                    <h5 class="mb-3">Address Details</h5>
                    <div class="row">
                      <div class="form-group col-md-6 col-sm-6">
                        <label>First Name</label>
                        <input type="text" v-model="formTemp.firstName" class="form-control" />
                      </div>
                      <div class="form-group col-md-6 col-sm-6">
                        <label>Last Name</label>
                        <input type="text" v-model="formTemp.lastName" class="form-control" />
                      </div>
                      <div class="form-group col-md-6 col-sm-6">
                        <label>Phone</label>
                        <input type="tel" v-model="formTemp.phone" class="form-control" />
                      </div>
                      <div class="form-group col-md-6 col-sm-6">
                        <label>Email</label>
                        <input type="email" v-model="formTemp.email" class="form-control" />
                      </div>
                      <div class="form-group col-md-12">
                        <label>Address</label>
                        <input type="text" v-model="formTemp.address" class="form-control" />
                      </div>
                      <div class="form-group col-md-12">
                        <label>City</label>
                        <input type="text" v-model="formTemp.city" class="form-control" />
                      </div>
                      <div class="form-group col-md-6">
                        <label>State</label>
                        <input type="text" v-model="formTemp.state" class="form-control" />
                      </div>
                      <div class="form-group col-md-6">
                        <label>Pincode</label>
                        <input type="text" v-model="formTemp.pincode" class="form-control" />
                      </div>

                      <div class="col-12 mt-3 d-flex justify-content-end gap-2">
                        <button type="button" class="btn btn-outline btn-sm me-2" @click="cancelAddressForm">
                          ยกเลิก
                        </button>
                        <button type="button" class="btn btn-solid btn-sm" @click="saveNewAddress">
                          บันทึก
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div class="col-lg-6 col-sm-12">
                <div class="checkout-details">
                  <div class="order-box">

                    <div class="title-box">
                      <div class="d-flex align-items-center mb-3">
                        <span class="fw-bold" style="width: 100px;">Shop</span>
                        <span class="fw-bold flex-grow-1">Product</span>
                        <span class="fw-bold text-end" style="width: 100px;">Total</span>
                        <span class="fw-bold text-end ms-3" style="width: 80px;">Shipping</span>
                      </div>
                    </div>

                    <ul class="qty" v-if="cart.length">
                      <li v-for="(item, index) in cart" :key="index">
                        <div class="d-flex align-items-center w-100">
                          <span class="text-muted text-uppercase small"
                            style="width: 100px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;">
                            {{ item.brand || '-' }}
                          </span>
                          <span class="flex-grow-1 pe-2">
                            {{ item.title }} X {{ item.quantity }}
                          </span>
                          <span class="text-end" style="width: 100px;">
                            {{ (item.price * curr.curr * item.quantity).toFixed(2) }}
                          </span>
                          <span class="ms-3" style="width: 80px;"></span>
                        </div>
                      </li>
                    </ul>

                    <ul class="sub-total">
                      <li>Subtotal <span class="count">{{ (cartTotal * curr.curr).toFixed(2) }}</span></li>
                      <li>Total <span class="count">{{ (grandTotal * curr.curr).toFixed(2) }}</span></li>
                    </ul>

                  </div>

                  <div class="payment-box">
                    <div class="checkout-title">
                      <h3>Payment Method</h3>
                    </div>
                    <div class="upper-box">
                      <div class="payment-options">
                        <ul>
                          <li>
                            <label class="d-block" for="radio-cod">
                              <input class="radio_animated" id="radio-cod" value="cod" v-model="selectedPayment"
                                type="radio" name="payment-method">
                              Cash On Delivery (COD)
                            </label>
                          </li>
                          <li>
                            <label class="d-block" for="radio-promptpay">
                              <input class="radio_animated" id="radio-promptpay" value="promptpay"
                                v-model="selectedPayment" type="radio" name="payment-method">
                              PromptPay (QR Code)
                            </label>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div class="text-center mt-4">
                      <div v-if="isQRVisible && selectedPayment === 'promptpay'"
                        class="qr-payment-section mb-3 p-3 border rounded bg-white">
                        <h5 class="fw-bold mb-3">Scan to Pay</h5>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png"
                          alt="PromptPay QR" class="img-fluid border mb-2" style="max-width: 200px;">
                        <p class="text-muted small">
                          ยอดชำระ: {{ curr.symbol }}{{ (grandTotal * curr.curr).toFixed(2) }}
                        </p>
                      </div>

                      <div class="order-place" v-if="cart.length">
                        <div v-if="!isQRVisible || selectedPayment !== 'promptpay'" class="row">
                          <div class="col-6">
                            <button class="btn btn-outline-secondary w-100" @click.prevent="cancelToHome">
                              ยกเลิก
                            </button>
                          </div>
                          <div class="col-6">
                            <button class="btn btn-primary w-100" :disabled="isLoading"
                              @click.prevent="handlePlaceOrder">
                              <span v-if="isLoading">Processing...</span>
                              <span v-else>Place Order</span>
                            </button>
                          </div>
                        </div>

                        <div v-else class="row mt-2">
                          <div class="col-6">
                            <button class="btn btn-outline-secondary w-100" :disabled="isLoading"
                              @click.prevent="cancelPromptPay">
                              ยกเลิก
                            </button>
                          </div>
                          <div class="col-6">
                            <button class="btn btn-primary w-100" :disabled="isLoading" @click.prevent="confirmOrder">
                              <span v-if="isLoading">Processing...</span>
                              <span v-else>ชำระเงิน</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      <shipmentMethod v-if="showShippingModal" :options="shippingOptions"
        :currentId="selectedShipping ? selectedShipping.id : ''" :currency="curr.curr"
        @close="showShippingModal = false" @select-shipping="handleShippingSelection" />

    </div>
  </section>
</template>

<script>
import { useProductStore } from '~~/store/products'
import { useCartStore } from '~~/store/cart' // Import Store
import shipmentMethod from './widgets/Payment/shipmentMethod.vue';
import addressDataJSON from '~/data/address.json'

export default {
  components: {
    shipmentMethod
  },
  data() {
    return {
      checkoutItems: [],
      selectedPayment: 'promptpay',
      isLoading: false,
      isQRVisible: false,

      savedAddressesList: [],

      isAddressListVisible: false,
      isFormVisible: false,

      formTemp: { firstName: '', lastName: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', isDefault: false },

      user: {
        firstName: { value: '', errormsg: '' },
        lastName: { value: '', errormsg: '' },
        phone: { value: '', errormsg: '' },
        email: { value: '', errormsg: '' },
        address: { value: '', errormsg: '' },
        city: { value: '', errormsg: '' },
        state: { value: '', errormsg: '' },
        pincode: { value: '', errormsg: '' }
      },
      isLogin: false,
      showShippingModal: false,
      selectedShipping: null,
      shippingOptions: [
        { id: 'economy', name: 'Economy Delivery', time: '5-7 Days', price: 0 },
        { id: 'standard', name: 'Standard Delivery', time: '3-5 Days', price: 50 },
        { id: 'express', name: 'Express Delivery', time: '1-2 Days', price: 100 }
      ],
    }
  },
  watch: {
    selectedPayment(val) {
      this.isQRVisible = false;
    }
  },
  computed: {
    curr() { return useProductStore().changeCurrency },
    cart() {
      // เรียงลำดับตาม brand (Shop)
      return [...this.checkoutItems].sort((a, b) => {
        const brandA = (a.brand || '').toLowerCase();
        const brandB = (b.brand || '').toLowerCase();
        if (brandA < brandB) return -1;
        if (brandA > brandB) return 1;
        return 0;
      });
    },
    cartTotal() { return this.checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0); },
    grandTotal() { return this.cartTotal; }
  },
  methods: {
    loadAddressToUser(addr) {
      if (!addr) return;
      this.user.firstName.value = addr.firstName || '';
      this.user.lastName.value = addr.lastName || '';
      this.user.phone.value = addr.phone || '';
      this.user.email.value = addr.email || '';
      this.user.address.value = addr.address || '';
      this.user.city.value = addr.city || '';
      this.user.state.value = addr.state || '';
      this.user.pincode.value = addr.pincode || '';
    },
    toggleAddressList() { this.isAddressListVisible = !this.isAddressListVisible; this.isFormVisible = false; },
    selectFromList(addr) { this.loadAddressToUser(addr); this.isAddressListVisible = false; },
    isCurrentAddress(addr) { return this.user.phone.value === addr.phone; },
    openAddressForm() {
      this.isFormVisible = true;
      this.isAddressListVisible = false;
      this.formTemp = { firstName: '', lastName: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', isDefault: false };
    },
    editCurrentAddress() {
      this.formTemp = {
        firstName: this.user.firstName.value, lastName: this.user.lastName.value, phone: this.user.phone.value, email: this.user.email.value,
        address: this.user.address.value, city: this.user.city.value, state: this.user.state.value, pincode: this.user.pincode.value
      };
      this.isFormVisible = true; this.isAddressListVisible = false;
    },
    editSavedAddress(index) {
      this.formTemp = { ...this.savedAddressesList[index] };
      this.isFormVisible = true;
      this.isAddressListVisible = false;
    },
    cancelAddressForm() { this.isFormVisible = false; },
    saveNewAddress() {
      if (!this.formTemp.firstName || !this.formTemp.phone) {
        useNuxtApp().$showToast({ msg: "Please fill required fields", type: "error" });
        return;
      }
      const newAddr = { ...this.formTemp };
      const index = this.savedAddressesList.findIndex(addr => addr.phone === newAddr.phone);
      if (index !== -1) {
        this.savedAddressesList[index] = newAddr;
      } else {
        this.savedAddressesList.push(newAddr);
      }
      localStorage.setItem('my_app_addresses', JSON.stringify(this.savedAddressesList));
      this.loadAddressToUser(newAddr);
      this.isFormVisible = false;
    },
    handleShippingSelection(option) { this.selectedShipping = option; this.showShippingModal = false; },
    cancelToHome() { this.$router.push('/'); },
    handlePlaceOrder() {
      this.onSubmit();
      if (this.user.firstName.errormsg || this.user.phone.errormsg) {
        try { useNuxtApp().$showToast({ msg: "Please check your details.", type: "error" }); } catch (e) { }
        return;
      }
      if (this.selectedPayment === 'promptpay') {
        this.isQRVisible = true;
      } else if (this.selectedPayment === 'cod') {
        this.confirmOrder();
      }
    },
    cancelPromptPay() { this.isQRVisible = false; },

    // --- ฟังก์ชันหลักในการบันทึกออเดอร์ (แก้ไขแล้ว) ---
    async confirmOrder() {
      this.isLogin = useCookie('userlogin').value;
      if (!this.isLogin) {
        this.$router.replace('/page/auth/LoginPage?redirect=/page/account/checkout');
        return;
      }

      this.isLoading = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 1. แยกออเดอร์ตาม Brand
        const itemsByBrand = {};
        this.checkoutItems.forEach(item => {
          const brandName = item.brand || 'Official Store';
          if (!itemsByBrand[brandName]) itemsByBrand[brandName] = [];
          itemsByBrand[brandName].push(item);
        });

        const storedOrders = JSON.parse(localStorage.getItem('my_app_orders') || "[]");
        const now = new Date();
        const dateString = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        // 2. สร้าง Order ตามจำนวน Brand
        Object.keys(itemsByBrand).forEach((brand, index) => {
          const brandItems = itemsByBrand[brand];
          const subtotal = brandItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
          const shippingFee = this.selectedShipping ? this.selectedShipping.price : 0;
          const total = subtotal + shippingFee;
          const orderId = 'ORD-' + Math.floor(10000 + Math.random() * 90000) + '-' + (index + 1);

          const newOrder = {
            id: Date.now() + index,
            orderId: orderId,
            date: dateString,
            shopName: brand,
            customer: `${this.user.firstName.value} ${this.user.lastName.value}`,
            email: this.user.email.value,
            address: `${this.user.address.value}, ${this.user.city.value}, ${this.user.state.value} ${this.user.pincode.value}`,
            subtotal: subtotal,
            shippingFee: shippingFee,
            total: total,
            paymentMethod: this.selectedPayment === 'cod' ? 'COD' : 'PromptPay',
            status: 'Pending',
            items: brandItems.map(item => ({
              id: item.id, // [แก้ไข] เพิ่มบรรทัดนี้ เพื่อดึง ID สินค้ามาเก็บไว้
              name: item.title,
              brand: brand,
              price: item.price,
              qty: item.quantity,
              image: item.images ? item.images[0].src : ''
            }))
          };
          storedOrders.unshift(newOrder);
        });

        // 3. บันทึก
        localStorage.setItem('my_app_orders', JSON.stringify(storedOrders));

        // 4. เคลียร์ค่า
        this.isQRVisible = false;
        localStorage.removeItem('checkout_items');

        const cartStore = useCartStore();
        if (cartStore.cartItems) cartStore.cartItems = [];

        // 5. แสดงผลและกลับหน้า Homepage (รวมกันทั้ง COD และ PromptPay)
        try { useNuxtApp().$showToast({ msg: "สั่งซื้อสินค้าสำเร็จ", type: "success" }); } catch (e) { }

        setTimeout(() => {
          this.$router.push('/');
        }, 500);

      } catch (error) {
        console.error("Order Failed:", error);
      } finally {
        this.isLoading = false;
      }
    },

    onSubmit() {
      if (!this.user.firstName.value || this.user.firstName.value.length <= 1) this.user.firstName.errormsg = 'empty not allowed'; else this.user.firstName.errormsg = '';
      if (!this.user.phone.value) this.user.phone.errormsg = 'empty not allowed'; else this.user.phone.errormsg = '';
    }
  },
  mounted() {
    let items = localStorage.getItem('checkout_items');
    if (!items || items === '[]') {
      const cartStore = useCartStore();
      if (cartStore.cartItems && cartStore.cartItems.length > 0) {
        items = JSON.stringify(cartStore.cartItems);
        localStorage.setItem('checkout_items', items);
      }
    }

    if (items && items !== '[]') {
      this.checkoutItems = JSON.parse(items);
    } else {
      try { useNuxtApp().$showToast({ msg: "No items selected.", type: "error" }); } catch (e) { }
      this.$router.replace('/page/account/cart');
      return;
    }

    const storedAddr = localStorage.getItem('my_app_addresses');
    if (storedAddr) {
      this.savedAddressesList = JSON.parse(storedAddr);
    } else {
      this.savedAddressesList = addressDataJSON || [];
    }

    if (this.savedAddressesList.length > 0) {
      const defaultAddr = this.savedAddressesList.find(addr => addr.isDefault) || this.savedAddressesList[0];
      this.loadAddressToUser(defaultAddr);
    }

    this.selectedShipping = this.shippingOptions[1];
    this.isLogin = useCookie('userlogin').value;
    if (!this.isLogin) { this.$router.replace('/page/auth/LoginPage?redirect=/page/account/checkout'); }
  }
}
</script>

<style scoped>
/* (Style เดิม) */
.address-box {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 8px;
  background-color: #fff;
  position: relative;
}

.address-card {
  position: relative;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #fff;
  border: 1px solid #ddd;
}

.address-card.active {
  border: 2px solid #ff5722 !important;
  background-color: #fff8f5;
}

.edit-btn-icon {
  position: absolute;
  bottom: 15px;
  right: 15px;
  color: #999;
  font-size: 1.1rem;
  transition: color 0.2s;
  cursor: pointer;
}

.edit-btn-icon:hover {
  color: #ff5722;
}

.btn-outline {
  background-color: transparent;
  border: 1px solid #ddd;
  color: #333;
}

.btn-outline:hover,
.btn-outline.active {
  border-color: #ff5722;
  color: #ff5722;
}

.btn-solid {
  background-color: #ff5722;
  color: #fff;
  border: none;
  font-weight: 700;
  transition: 0.3s;
}

.btn-solid:hover {
  background-color: #e64a19;
  box-shadow: 0 4px 10px rgba(255, 87, 34, 0.3);
}

.qr-payment-section {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>