<template>
  <section class="section-b-space">
    <div class="container">
      <div class="checkout-page">
        <div class="checkout-form">
          <form>
            <div class="row">

              <div class="col-12">
                <div class="checkout-title">
                  <h3>Billing Details</h3>
                </div>
                <div class="row check-out">
                  <div class="form-group col-md-6 col-sm-6">
                    <div class="field-label">First Name</div>
                    <input type="text" v-model="user.firstName.value" name="First name" />
                    <span class="validate-error" v-if="user.firstName.value.length === 0">{{
                      user.firstName.errormsg
                    }}</span>
                  </div>
                  <div class="form-group col-md-6 col-sm-6">
                    <div class="field-label">Last Name</div>
                    <input type="text" v-model="user.lastName.value" name="Last name" />
                    <span class="validate-error" v-if="user.lastName.value.length === 0">{{
                      user.lastName.errormsg
                    }}</span>
                  </div>
                  <div class="form-group col-md-6 col-sm-6">
                    <div class="field-label">Phone</div>
                    <input type="tel" v-model="user.phone.value" name="Phone" />
                    <span class="validate-error" v-if="user.phone.value.length === 0">{{ user.phone.errormsg }}</span>
                  </div>
                  <div class="form-group col-md-6 col-sm-6">
                    <div class="field-label">Email Address</div>
                    <input type="email" v-model="user.email.value" name="Email Address" />
                    <span class="validate-error" v-if="!user.email.value || !validEmail(user.email.value)">{{
                      user.email.errormsg
                    }}</span>
                  </div>
                  <div class="form-group col-md-12 col-sm-12">
                    <div class="field-label">Address</div>
                    <input type="text" v-model="user.address.value" name="Address" />
                    <span class="validate-error" v-if="user.address.value.length === 0">{{
                      user.address.errormsg
                    }}</span>
                  </div>
                  <div class="form-group col-md-12 col-sm-12">
                    <div class="field-label">Town/City</div>
                    <input type="text" v-model="user.city.value" name="City" />
                    <span class="validate-error" v-if="user.city.value.length === 0">{{ user.city.errormsg }}</span>
                  </div>
                  <div class="form-group col-md-12 col-sm-6">
                    <div class="field-label">State / County</div>
                    <input type="text" v-model="user.state.value" name="State" />
                    <span class="validate-error" v-if="user.state.value.length === 0">{{ user.state.errormsg }}</span>
                  </div>
                  <div class="form-group col-md-12 col-sm-6">
                    <div class="field-label">Postal Code</div>
                    <input type="text" v-model="user.pincode.value" name="Postal Code" />
                    <span class="validate-error" v-if="user.pincode.value.length === 0">{{
                      user.pincode.errormsg
                    }}</span>
                  </div>
                </div>
              </div>

              <div class="col-12 mt-4">
                <div class="checkout-details">
                  <div class="order-box">
                    <div class="title-box">
                      <div>
                        Product
                        <span>Total</span>
                      </div>
                    </div>
                    <ul class="qty" v-if="cart.length">
                      <li v-for="(item, index) in cart" :key="index">
                        {{ item.title || uppercase }} X {{ item.quantity }}
                        <span>{{ (item.price * curr.curr) * item.quantity }}</span>
                      </li>
                    </ul>
                    <ul class="sub-total">
                      <li>
                        Subtotal
                        <span class="count">{{ cartTotal * curr.curr }}</span>
                      </li>
                      <li>Shipping
                        <div class="shipping">
                          <div class="shopping-option d-flex justify-content-between align-items-center">
                            <div>
                              <label class="mb-0" v-if="selectedShipping">
                                {{ selectedShipping.name }}
                                <br>
                                <small class="text-muted">({{ selectedShipping.time }})</small>
                              </label>
                            </div>
                            <div class="text-end">
                              <span class="count fw-bold">
                                {{ selectedShipping && selectedShipping.price === 0 ? 'Free' : (selectedShipping ?
                                  (selectedShipping.price * curr.curr).toFixed(2) : 0) }}
                              </span>
                              <a href="javascript:void(0)" class="d-block text-primary"
                                style="font-size: 0.8rem; cursor: pointer;" @click="showShippingModal = true">
                                (เปลี่ยน)
                              </a>
                            </div>
                          </div>
                        </div>
                      </li>
                    </ul>
                    <ul class="sub-total">
                      <li>
                        Total
                        <span class="count">{{ (grandTotal * curr.curr).toFixed(2) }}</span>
                      </li>
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
                            <label class="d-block" for="edo-ani2">
                              <input class="radio_animated" id="edo-ani2" value="paypal" v-model="selectedPayment"
                                type="radio" name="rdo-ani">
                              PayPal
                            </label>
                          </li>
                          <li>
                            <label class="d-block" for="edo-ani1">
                              <input class="radio_animated" id="edo-ani1" value="promptpay" v-model="selectedPayment"
                                type="radio" name="rdo-ani">
                              PromptPay (QR Code)
                            </label>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div class="text-end">
                      <div id="paypal-button-container" :class="[{ 'd-none': selectedPayment != 'paypal' }]"></div>
                      <div class="order-place" v-if="selectedPayment === 'promptpay' && cart.length">
                        <button class="btn btn-primary" @click.prevent="payWithPromptPay">Place Order
                          (PromptPay)</button>
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
import { useCartStore } from '~~/store/cart'
import { useProductStore } from '~~/store/products'

// 1. นำเข้าชื่อ shipmentMethod
import shipmentMethod from './widgets/Payment/shipmentMethod.vue';

export default {
  components: {
    shipmentMethod // 2. ลงทะเบียนชื่อ shipmentMethod
  },
  computed: {
    cart() {
      return useCartStore().selectedCheckoutItems
    },
    cartTotal() {
      return useCartStore().selectedCheckoutTotal
    },
    curr() {
      return useProductStore().changeCurrency
    },
    grandTotal() {
      let shippingCost = this.selectedShipping ? this.selectedShipping.price : 0;
      return this.cartTotal + shippingCost;
    }
  },
  data() {
    return {
      items: [{
        stripePriceId: '1',
        quantity: 5
      }],
      selectedPayment: 'paypal',
      errors: [],
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
      paypal: {
        sandbox: 'Your_Sendbox_Key'
      },
      payment: false,
      environment: 'sandbox',
      button_style: {
        label: 'checkout',
        size: 'medium', // small | medium | large | responsive
        shape: 'pill', // pill | rect
        color: 'blue' // gold | blue | silver | black
      },
      amtchar: '',

      // ส่วนของ Shipping
      showShippingModal: false,
      selectedShipping: null,
      shippingOptions: [
        { id: 'economy', name: 'Economy Delivery', time: '5-7 Days', price: 0 },
        { id: 'standard', name: 'Standard Delivery', time: '3-5 Days', price: 50 },
        { id: 'express', name: 'Express Delivery', time: '1-2 Days', price: 100 }
      ],
    }
  },
  created() {
    this.selectedShipping = this.shippingOptions[1];
  },

  watch: {
    cart: {
      handler(value) {
        if (value.length == 0) {
          useNuxtApp().$showToast({ msg: "Cart is Empty.", type: "error" })
          this.$router.replace('/page/account/cart')
        }

      }, deep: true
    }
  },

  methods: {
    payWithPromptPay() {
      this.onSubmit()
      this.isLogin = useCookie('userlogin').value
      if (!this.isLogin) {
        this.$router.replace('/page/auth/LoginPage?redirect=/page/account/checkout')
      }
      else if (this.user.firstName.errormsg == '' && this.user.lastName.errormsg == '' &&
        this.user.city.errormsg == '' && this.user.pincode.errormsg == '' &&
        this.user.state.errormsg == '' && this.user.phone.errormsg == '' &&
        this.user.address.errormsg == '' && this.user.email.errormsg == '') {

        this.$store.dispatch('products/createOrder', {
          product: this.cart,
          userDetail: this.user,
          token: 'promptpay-manual',
          paymentMethod: 'promptpay',
          amt: this.cartTotal
        })

        this.$router.push('/page/order-success')
      }
    },

    handleShippingSelection(option) {
      this.selectedShipping = option;
      this.showShippingModal = false;
    },

    onSubmit() {
      if (this.user.firstName.value.length <= 1 || this.user.firstName.value.length > 10) {
        this.user.firstName.errormsg = 'empty not allowed'
      } else {
        this.user.firstName.errormsg = ''
      }
      if (this.user.lastName.value.length <= 1 || this.user.lastName.value.length > 10) {
        this.user.lastName.errormsg = 'empty not allowed'
      } else {
        this.user.lastName.errormsg = ''
      }
      if (this.user.city.value.length < 3 || this.user.city.value.length > 10) {
        this.user.city.errormsg = 'empty not allowed'
      } else {
        this.user.city.errormsg = ''
      }
      if (this.user.pincode.value.length < 4) {
        this.user.pincode.errormsg = 'empty not  allowed'
      } else {
        this.user.pincode.errormsg = ''
      }
      if (!this.user.state.value) {
        this.user.state.errormsg = 'empty not allowed'
      } else {
        this.user.state.errormsg = ''
      }
      if (!this.user.phone.value) {
        this.user.phone.errormsg = 'empty not allowed'
      } else {
        this.user.phone.errormsg = ''
      }
      if (!this.user.address.value) {
        this.user.address.errormsg = 'empty not allowed'
      } else {
        this.user.address.errormsg = ''
      }
      if (!this.user.email.value) {
        this.user.email.errormsg = 'empty not allowed'
      } else if (!this.validEmail(this.user.email.value)) {
        this.user.email.errormsg = 'Valid email required.'
      } else {
        this.user.email.errormsg = ''
      }

    },
    validEmail: function (email) {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(email)
    }
  },

  mounted() {
    window.paypal.Buttons({

    }).render('#paypal-button-container')

    this.isLogin = useCookie('userlogin').value

    if (!this.isLogin) {
      this.$router.replace('/page/auth/LoginPage?redirect=/page/account/checkout')
    }
    else if (this.isLogin && this.cart.length == 0) {
      useNuxtApp().$showToast({ msg: "Cart is Empty.", type: "error" })
      this.$router.replace('/page/account/cart')
    }

    if (this.cart.length === 0) {
      useNuxtApp().$showToast({ msg: "Please select items to checkout.", type: "error" });
      this.$router.replace('/page/account/cart');
      return; // จบการทำงาน
    }

  },
}
</script>