<template>
  <section class="section-b-space">
    <div class="container">
      <div class="mb-3">
        <button @click="$router.back()" class="btn btn-sm btn-outline-secondary">
          <i class="ti-arrow-left"></i> Back
        </button>
      </div>
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
                            {{ getSellerName(item) }}
                          </span>
                          <span class="flex-grow-1 pe-2">
                            {{ item.name || item.title }} X {{ item.quantity }}
                          </span>
                          <span class="text-end" style="width: 100px;">
                            {{ curr.symbol }}{{ (calcPrice(item) * curr.curr * item.quantity).toFixed(2) }}
                          </span>
                          <span class="ms-3 text-end" style="width: 80px;">
                            <template v-if="item.shippingCost && String(item.shippingCost).toLowerCase() !== 'free'">
                              {{ curr.symbol }}{{ (Number(item.shippingCost) * curr.curr).toFixed(2) }}
                            </template>
                            <template v-else>
                              Free
                            </template>
                          </span>
                        </div>
                      </li>
                    </ul>
                    <ul class="sub-total">
                      <li>Subtotal <span class="count">{{ (cartTotal * curr.curr).toFixed(2) }}</span></li>
                      <li>Shipping <span class="count">{{ (shippingTotal * curr.curr).toFixed(2) }}</span></li>
                      <li class="fw-bold">Total <span class="count">{{ (grandTotal * curr.curr).toFixed(2) }}</span></li>
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
      console.log('Cart computed called, checkoutItems:', this.checkoutItems);
      // เรียงลำดับตาม brand (Shop)
      const sorted = [...this.checkoutItems].sort((a, b) => {
        const brandA = (a.brand || '').toLowerCase();
        const brandB = (b.brand || '').toLowerCase();
        if (brandA < brandB) return -1;
        if (brandA > brandB) return 1;
        return 0;
      });
      console.log('Sorted cart:', sorted);
      return sorted;
    },
    // [แก้ไข] คำนวณราคารวมโดยใช้ราคาที่ลดแล้ว (calcPrice)
    cartTotal() {
      return this.checkoutItems.reduce((total, item) => {
        const itemPrice = this.calcPrice(item) * item.quantity
        return total + itemPrice
      }, 0);
    },
    shippingTotal() {
      return this.checkoutItems.reduce((total, item) => {
        let shipping = 0
        if (item.shippingCost) {
          // ถ้าเป็น string และไม่ใช่ 'Free' ให้แปลงเป็นตัวเลข
          const cost = String(item.shippingCost).toLowerCase()
          if (cost === 'free' || cost === '0') {
            shipping = 0
          } else {
            shipping = Number(item.shippingCost) || 0
          }
        }
        return total + shipping
      }, 0);
    },
    grandTotal() { 
      return this.cartTotal + this.shippingTotal
    }
  },
  methods: {
    // ฟังก์ชันคำนวณราคา
    calcPrice(item) {
      if (!item || !item.price) return 0
      return Number(item.price) || 0
    },
    getSellerName(item) {
      console.log('getSellerName called for item:', item);
      // ถ้ามีข้อมูล seller ใช้ display_name หรือ name
      if (item.seller) {
        const sellerName = item.seller.display_name || item.seller.name || '-';
        console.log('  -> Using seller name:', sellerName);
        return sellerName;
      }
      // fallback ใช้ brand จาก mock data
      const brandName = item.brand || '-';
      console.log('  -> Using brand name:', brandName);
      return brandName;
    },

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

    // --- ฟังก์ชันหลักในการบันทึกออเดอร์ ---
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

        // ดึงข้อมูลเก่าจาก LocalStorage
        const storedOrders = JSON.parse(localStorage.getItem('my_app_orders') || "[]");
        const currentNotifs = JSON.parse(localStorage.getItem('my_app_notifications') || "[]"); // [แจ้งเตือน]

        const newNotifications = []; // [แจ้งเตือน] เตรียม array สำหรับแจ้งเตือนใหม่
        const now = new Date();
        const dateString = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

        // 2. สร้าง Order แยกตามร้านค้า
        Object.keys(itemsByBrand).forEach((brand, index) => {
          const brandItems = itemsByBrand[brand];

          // [ราคา] คำนวณ Subtotal โดยใช้ราคาที่ลดแล้ว (this.calcPrice)
          const subtotal = brandItems.reduce((sum, item) => sum + (this.calcPrice(item) * item.quantity), 0);

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

            status: 'Pending', // [สถานะ] ตั้งเป็น Pending ตามที่ต้องการ

            items: brandItems.map(item => ({
              id: item.id, // [ID] เก็บ ID สินค้า
              name: item.title,
              brand: brand,
              price: this.calcPrice(item), // [ราคา] เก็บราคาที่ลดแล้ว
              qty: item.quantity,
              image: item.images ? item.images[0].src : ''
            }))
          };
          storedOrders.unshift(newOrder);

          // [แจ้งเตือน] สร้าง Notification object สำหรับออเดอร์นี้
          const notif = {
            id: Date.now() + index + 999, // สร้าง ID ไม่ให้ซ้ำ
            title: 'สั่งซื้อสำเร็จ',
            message: `คำสั่งซื้อ #${newOrder.orderId} จากร้าน ${brand} ได้ถูกส่งไปที่ทางร้านแล้ว`,
            date: dateString,
            isRead: false,
            image: newOrder.items[0]?.image || ''
          };
          newNotifications.push(notif);
        });

        // 3. บันทึก Order ลง LocalStorage
        localStorage.setItem('my_app_orders', JSON.stringify(storedOrders));

        // [แจ้งเตือน] บันทึก Notification ลง LocalStorage
        const updatedNotifs = [...newNotifications, ...currentNotifs];
        localStorage.setItem('my_app_notifications', JSON.stringify(updatedNotifs));
        window.dispatchEvent(new Event('notification-updated'));

        // 4. เคลียร์ค่าตะกร้าสินค้า
        this.isQRVisible = false;
        localStorage.removeItem('checkout_items');

        const cartStore = useCartStore();
        if (cartStore.cartItems) cartStore.cartItems = [];

        // 5. แสดง Toast และกลับหน้าหลัก
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
    console.log('===== PaymentPage mounted() started =====');
    let items = localStorage.getItem('checkout_items');
    console.log('Raw checkout_items from localStorage:', items);
    
    if (!items || items === '[]') {
      console.log('No checkout items found, checking cartStore...');
      const cartStore = useCartStore();
      console.log('Cart store items:', cartStore.cartItems);
      if (cartStore.cartItems && cartStore.cartItems.length > 0) {
        items = JSON.stringify(cartStore.cartItems);
        localStorage.setItem('checkout_items', items);
        console.log('Saved cart items to checkout_items');
      }
    }

    if (items && items !== '[]') {
      try {
        const parsedItems = JSON.parse(items);
        console.log('Parsed checkout items:', parsedItems);
        
        // Ensure all items have required fields
        this.checkoutItems = parsedItems.map(item => {
          console.log('===== Processing item =====');
          console.log('Original item:', item);
          console.log('  - name:', item.name);
          console.log('  - title:', item.title);
          console.log('  - price:', item.price);
          console.log('  - brand:', item.brand);
          console.log('  - seller:', item.seller);
          console.log('  - quantity:', item.quantity);
          
          const normalizedItem = {
            ...item,
            id: item.id || item._id,
            _id: item._id || item.id,
            title: item.title || item.name || 'Product',
            name: item.name || item.title || 'Product',
            price: Number(item.price) || 0,
            quantity: Number(item.quantity) || 1,
            brand: item.brand || (item.seller && item.seller.name) || 'Shop',
            images: item.images || (item.image ? [{ src: item.image }] : []),
            image: item.image || (item.images && item.images[0] ? item.images[0].src : ''),
            shippingCost: item.shippingCost || 'Free',
            seller: item.seller || null
          };
          console.log('Normalized item:', normalizedItem);
          console.log('  - Final name:', normalizedItem.name);
          console.log('  - Final price:', normalizedItem.price);
          console.log('  - Final brand:', normalizedItem.brand);
          console.log('===========================');
          return normalizedItem;
        });
        console.log('Final checkoutItems array:', this.checkoutItems);
        console.log('Total items loaded:', this.checkoutItems.length);
      } catch (e) {
        console.error('Error parsing checkout items:', e);
        this.checkoutItems = [];
      }
    } else {
      console.log('No items to process, checkoutItems remains empty');
    }
    
    if (this.checkoutItems.length === 0) {
      console.warn('WARNING: No checkout items loaded! Redirecting to cart...');
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
    
    console.log('===== PaymentPage mounted() completed =====');
    console.log('Final state:');
    console.log('  - checkoutItems length:', this.checkoutItems.length);
    console.log('  - isLogin:', this.isLogin);
    console.log('=========================================');
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