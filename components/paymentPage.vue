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
                      <div>Product <span>Total</span></div>
                    </div>
                    <ul class="qty" v-if="cart.length">
                      <li v-for="(item, index) in cart" :key="index">
                        {{ item.title }} X {{ item.quantity }}
                        <span>{{ (item.price * curr.curr * item.quantity).toFixed(2) }}</span>
                      </li>
                    </ul>
                    <ul class="sub-total">
                      <li>Subtotal <span class="count">{{ (cartTotal * curr.curr).toFixed(2) }}</span></li>
                      <li>Shipping
                        <div class="shipping">
                          <div class="shopping-option d-flex justify-content-between align-items-center">
                            <div>
                              <label class="mb-0" v-if="selectedShipping">
                                {{ selectedShipping.name }}<br>
                                <small class="text-muted">({{ selectedShipping.time }})</small>
                              </label>
                            </div>
                            <div class="text-end">
                              <span class="count fw-bold">
                                {{ selectedShipping && selectedShipping.price === 0 ? 'Free' : (selectedShipping ?
                                  (selectedShipping.price * curr.curr).toFixed(2) : 0) }}
                              </span>
                              <a href="javascript:void(0)" class="d-block text-primary"
                                style="font-size: 0.8rem; cursor: pointer;"
                                @click="showShippingModal = true">(เปลี่ยน)</a>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <ul class="sub-total">
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
import shipmentMethod from './widgets/Payment/shipmentMethod.vue';
import addressDataJSON from '~/data/address.json' // Import JSON

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

      savedAddressesList: [], // เริ่มต้นเป็นว่าง เดี๋ยวโหลดใส่

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
    cart() { return this.checkoutItems; },
    cartTotal() { return this.checkoutItems.reduce((total, item) => total + (item.price * item.quantity), 0); },
    grandTotal() {
      let shippingCost = this.selectedShipping ? this.selectedShipping.price : 0;
      return this.cartTotal + shippingCost;
    }
  },
  methods: {
    // โหลด Address เข้าฟอร์ม User
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

    // บันทึกที่อยู่ใหม่ และ Save ลง Local Storage
    saveNewAddress() {
      if (!this.formTemp.firstName || !this.formTemp.phone) {
        useNuxtApp().$showToast({ msg: "Please fill required fields", type: "error" });
        return;
      }

      const newAddr = { ...this.formTemp };

      // เช็คว่ามีอยู่แล้วไหม (ใช้เบอร์โทรเช็ค)
      const index = this.savedAddressesList.findIndex(addr => addr.phone === newAddr.phone);

      if (index !== -1) {
        // อัปเดตของเดิม
        this.savedAddressesList[index] = newAddr;
      } else {
        // เพิ่มใหม่
        this.savedAddressesList.push(newAddr);
      }

      // บันทึกลง Local Storage
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
    async confirmOrder() {
      this.isLogin = useCookie('userlogin').value;
      if (!this.isLogin) {
        this.$router.replace('/page/auth/LoginPage?redirect=/page/account/checkout');
        return;
      }
      this.isLoading = true;
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        this.isQRVisible = false;
        localStorage.removeItem('checkout_items');
        if (this.selectedPayment === 'cod') {
          try { useNuxtApp().$showToast({ msg: "สั่งซื้อสินค้าสำเร็จ", type: "success" }); } catch (e) { }
          setTimeout(() => { window.location.href = '/'; }, 500);
        } else {
          this.$router.push('/page/order-success');
        }
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
    // 1. โหลด Cart Items
    const items = localStorage.getItem('checkout_items');
    if (items) { this.checkoutItems = JSON.parse(items); } else {
      try { useNuxtApp().$showToast({ msg: "No items selected.", type: "error" }); } catch (e) { }
      this.$router.replace('/page/account/cart');
      return;
    }

    // 2. โหลด Address (JSON + LocalStorage)
    const storedAddr = localStorage.getItem('my_app_addresses');
    if (storedAddr) {
      // ถ้ามีใน Local Storage ให้ใช้จาก Local Storage
      this.savedAddressesList = JSON.parse(storedAddr);
    } else {
      // ถ้าไม่มี ให้ใช้จาก JSON และบันทึกไว้
      this.savedAddressesList = addressDataJSON || [];
      // (Optional) ถ้าอยากให้ sync กลับไป local storage เลย ก็เปิดบรรทัดล่าง
      // localStorage.setItem('my_app_addresses', JSON.stringify(this.savedAddressesList));
    }

    // 3. เลือก Address ที่เป็น Default หรืออันแรกสุด
    if (this.savedAddressesList.length > 0) {
      const defaultAddr = this.savedAddressesList.find(addr => addr.isDefault) || this.savedAddressesList[0];
      this.loadAddressToUser(defaultAddr);
    }

    // 4. Init อื่นๆ
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