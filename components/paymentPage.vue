<template>
  <section class="section-b-space">
    <div class="container">
      <div class="mb-3"></div>
      <div class="checkout-page">
        <div class="checkout-form">
          <form>
            <div class="row">
              <div class="col-lg-6 col-sm-12">
                <div class="checkout-title">
                  <h3>รายละเอียดการชำระเงิน</h3>
                </div>

                <div class="row check-out">
                  <div class="col-12 mb-3">
                    <label>ที่อยู่จัดส่ง:</label>

                    <div class="address-box" v-if="hasSelectedAddress">
                      <div class="d-flex justify-content-between">
                        <div class="name">
                          {{ user.firstName.value }} {{ user.lastName.value }}
                        </div>
                      </div>
                      <div class="phone">Tel: {{ user.phone.value }}</div>
                      <div class="address-detail pe-5">
                        {{ user.address.value }}<br />
                        {{ user.subDistrict.value }} {{ user.district.value
                        }}<br />
                        {{ user.province.value }} {{ user.zipCode.value }}
                      </div>
                      <div class="email text-muted small mt-1">
                        {{ user.email.value }}
                      </div>

                      <div class="edit-btn-icon" @click="editCurrentAddress">
                        <i class="ti-pencil-alt"></i>
                      </div>
                    </div>

                    <div v-else class="alert alert-warning border-0 mb-0">
                      <i class="ti-info-alt me-2"></i>
                      กรุณาเพิ่มที่อยู่จัดส่งสินค้า
                    </div>

                    <div
                      class="row mt-3"
                      v-if="!isFormVisible && hasSelectedAddress"
                    >
                      <div class="col-6">
                        <a
                          href="javascript:void(0)"
                          class="btn btn-outline w-100 btn-sm"
                          :class="{ active: isAddressListVisible }"
                          @click="toggleAddressList"
                        >
                          เปลี่ยนที่อยู่
                        </a>
                      </div>
                      <div class="col-6">
                        <a
                          href="javascript:void(0)"
                          class="btn btn-solid w-100 btn-sm"
                          @click="openAddressForm"
                        >
                          เพิ่มที่อยู่ใหม่
                        </a>
                      </div>
                    </div>

                    <div
                      class="mt-3"
                      v-if="isAddressListVisible && !isFormVisible"
                    >
                      <label class="text-muted mb-2"
                        >เลือกที่อยู่ที่บันทึกไว้:</label
                      >
                      <div class="saved-address-list">
                        <div
                          class="address-card p-3 mb-2 border rounded"
                          v-for="(addr, index) in savedAddressesList"
                          :key="index"
                          :class="{ active: isCurrentAddress(addr) }"
                          @click="selectFromList(addr)"
                        >
                          <div
                            class="d-flex justify-content-between align-items-center"
                          >
                            <span class="fw-bold">
                              {{ addr.firstName }} {{ addr.lastName }}
                              <span
                                v-if="addr.isDefault"
                                class="badge bg-success ms-2"
                                style="font-size: 10px"
                                >ค่าเริ่มต้น</span
                              >
                            </span>
                            <span
                              class="check-icon text-primary"
                              v-if="isCurrentAddress(addr)"
                            >
                              <i class="ti-check"></i>
                            </span>
                          </div>
                          <div class="small text-muted">{{ addr.phone }}</div>
                          <div class="small pe-4">
                            {{ addr.address }} {{ addr.subDistrict }}
                            {{ addr.district }} {{ addr.province }}
                            {{ addr.zipCode }}
                          </div>

                          <div
                            class="edit-btn-icon"
                            @click.stop="editSavedAddress(index)"
                          >
                            <i class="ti-pencil-alt"></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    class="col-12 mt-4 p-3 border rounded bg-light"
                    v-if="isFormVisible"
                  >
                    <h5 class="mb-3">
                      {{ formTemp._id ? "แก้ไขที่อยู่" : "เพิ่มที่อยู่ใหม่" }}
                    </h5>

                    <div class="row g-3">
                      <div class="col-12">
                        <label class="form-label text-muted mb-1"
                          >ชื่อ-นามสกุล (Name)
                          <span class="text-danger">*</span></label
                        >
                        <input
                          type="text"
                          v-model="formTemp.name"
                          class="form-control"
                          :class="{ 'is-invalid': errors.name }"
                          placeholder=""
                        />
                        <div class="invalid-feedback">{{ errors.name }}</div>
                      </div>

                      <div class="col-12">
                        <label class="form-label text-muted mb-1"
                          >เบอร์โทรศัพท์ (Phone)
                          <span class="text-danger">*</span></label
                        >
                        <input
                          type="tel"
                          v-model="formTemp.phone"
                          class="form-control"
                          :class="{ 'is-invalid': errors.phone }"
                          placeholder="08xxxxxxxx"
                        />
                        <div class="invalid-feedback">{{ errors.phone }}</div>
                      </div>

                      <div class="col-12">
                        <label class="form-label text-muted mb-1"
                          >ที่อยู่ (Address)
                          <span class="text-danger">*</span></label
                        >
                        <input
                          type="text"
                          v-model="formTemp.address"
                          class="form-control"
                          :class="{ 'is-invalid': errors.address }"
                          placeholder="บ้านเลขที่ หมู่ ซอย ถนน"
                        />
                        <div class="invalid-feedback">{{ errors.address }}</div>
                      </div>

                      <div class="col-6">
                        <label class="form-label text-muted mb-1"
                          >จังหวัด (Province)
                          <span class="text-danger">*</span></label
                        >
                        <SearchSelect
                          v-model="formTemp.province"
                          :options="provinceList"
                          placeholder="เลือกจังหวัด"
                          :error="!!errors.province"
                          @change="onProvinceChange(false)"
                        />
                        <div
                          v-if="errors.province"
                          class="text-danger small mt-1"
                        >
                          {{ errors.province }}
                        </div>
                      </div>

                      <div class="col-6">
                        <label class="form-label text-muted mb-1"
                          >อำเภอ/เขต (District)
                          <span class="text-danger">*</span></label
                        >
                        <SearchSelect
                          v-model="formTemp.district"
                          :options="districtList"
                          placeholder="เลือกอำเภอ/เขต"
                          :disabled="!formTemp.province"
                          :error="!!errors.district"
                          @change="onDistrictChange(false)"
                        />
                        <div
                          v-if="errors.district"
                          class="text-danger small mt-1"
                        >
                          {{ errors.district }}
                        </div>
                      </div>

                      <div class="col-6">
                        <label class="form-label text-muted mb-1"
                          >ตำบล/แขวง (Sub-district)
                          <span class="text-danger">*</span></label
                        >
                        <SearchSelect
                          v-model="formTemp.subDistrict"
                          :options="subDistrictList"
                          placeholder="เลือกตำบล/แขวง"
                          :disabled="!formTemp.district"
                          :error="!!errors.subDistrict"
                          @change="onSubDistrictChange"
                        />
                        <div
                          v-if="errors.subDistrict"
                          class="text-danger small mt-1"
                        >
                          {{ errors.subDistrict }}
                        </div>
                      </div>

                      <div class="col-6">
                        <label class="form-label text-muted mb-1"
                          >รหัสไปรษณีย์ (Zip Code)
                          <span class="text-danger">*</span></label
                        >
                        <select
                          class="form-select"
                          v-model="formTemp.zipCode"
                          :class="{ 'is-invalid': errors.zipCode }"
                          :disabled="!formTemp.subDistrict"
                        >
                          <option value="" disabled>เลือกรหัสไปรษณีย์</option>
                          <option v-for="z in zipCodeList" :key="z" :value="z">
                            {{ z }}
                          </option>
                        </select>
                        <div class="invalid-feedback">{{ errors.zipCode }}</div>
                      </div>

                      <div class="col-12 mt-4 d-flex justify-content-end gap-2">
                        <button
                          type="button"
                          class="btn btn-outline btn-sm me-2"
                          @click="cancelAddressForm"
                          v-if="hasSelectedAddress"
                        >
                          ยกเลิก
                        </button>
                        <button
                          type="button"
                          class="btn btn-solid btn-sm"
                          @click="saveNewAddress"
                        >
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
                        <span class="fw-bold" style="width: 120px">ร้านค้า</span>
                        <span class="fw-bold flex-grow-1">สินค้า</span>
                        <span class="fw-bold text-end" style="width: 100px"
                          >ราคารวม</span
                        >
                        <span class="fw-bold text-end ms-3" style="width: 80px"
                          >ค่าส่ง</span
                        >
                      </div>
                    </div>

                    <ul class="qty" v-if="cart.length">
                      <li v-for="(item, index) in cart" :key="index">
                        <div class="d-flex align-items-center w-100">
                          <span
                            class="text-uppercase small"
                            style="
                              width: 120px;
                              overflow: hidden;
                              white-space: nowrap;
                              text-overflow: ellipsis;
                              font-weight: 700;
                              color: #ff5722;
                            "
                          >
                            {{ getSellerName(item) }}
                          </span>

                          <span class="flex-grow-1 pe-2">
                            {{ item.name || item.title }} X {{ item.quantity }}
                          </span>

                          <span class="text-end" style="width: 100px">
                            ฿{{
                              (
                                calcPrice(item) *
                                item.quantity *
                                curr.curr
                              ).toFixed(2)
                            }}
                          </span>

                          <span class="ms-3 text-end" style="width: 80px">
                            <template
                              v-if="
                                item.shippingCost &&
                                String(item.shippingCost).toLowerCase() !==
                                  'free'
                              "
                            >
                              ฿{{
                                (
                                  Number(item.shippingCost) *
                                  item.quantity *
                                  curr.curr
                                ).toFixed(2)
                              }}
                            </template>
                            <template v-else> Free </template>
                          </span>
                        </div>
                      </li>
                    </ul>
                    <ul class="sub-total">
                      <li>
                        ราคารวมสินค้า
                        <span class="count">{{
                          (cartTotal * curr.curr).toFixed(2)
                        }}</span>
                      </li>
                      <li v-if="shippingBeforeDiscount > 0">
                        ค่าจัดส่ง
                        <span class="count">{{
                          (shippingBeforeDiscount * curr.curr).toFixed(2)
                        }}</span>
                      </li>
                      <li v-if="shippingDiscount > 0" class="text-success">
                        ส่วนลดค่าจัดส่ง 
                        <span class="count"
                          >-{{
                            (shippingDiscount * curr.curr).toFixed(2)
                          }}</span
                        >
                      </li>
                      <li
                        v-if="shippingDiscountInfo"
                        class="small text-muted"
                        style="border: none; padding: 5px 0"
                      >
                        <i class="ti-info-alt"></i> {{ shippingDiscountInfo }}
                      </li>
                      <li class="fw-bold">
                        ราคารวมสุทธิ
                        <span class="count">{{
                          (grandTotal * curr.curr).toFixed(2)
                        }}</span>
                      </li>
                    </ul>
                  </div>

                  <div class="payment-box">
                    <div class="checkout-title">
                      <h3>วิธีการชำระเงิน</h3>
                    </div>
                    <div class="upper-box">
                      <div class="payment-options">
                        <ul>
                          <li>
                            <label class="d-block" for="radio-cod">
                              <input
                                class="radio_animated"
                                id="radio-cod"
                                value="cod"
                                v-model="selectedPayment"
                                type="radio"
                                name="payment-method"
                              />
                              ชำระเงินปลายทาง (COD)
                            </label>
                          </li>
                          <li>
                            <label class="d-block" for="radio-promptpay">
                              <input
                                class="radio_animated"
                                id="radio-promptpay"
                                value="promptpay"
                                v-model="selectedPayment"
                                type="radio"
                                name="payment-method"
                              />
                              พร้อมเพย์ (คิวอาร์โค้ด)
                            </label>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <!-- <div class="checkout-title mt-4">
                      <h3>Note (Optional)</h3>
                    </div>
                    <div class="row">
                      <div class="col-12">
                        <textarea class="form-control" v-model="note" rows="3"
                          placeholder="หมายเหตุถึงร้านค้า เช่น ฝากไว้ที่ป้อมยาม, เบอร์ติดต่อสำรอง"></textarea>
                      </div>
                    </div> -->

                    <div class="text-center mt-4">
                      <div
                        v-if="isQRVisible && selectedPayment === 'promptpay'"
                        class="qr-payment-section mb-3 p-3 border rounded bg-white"
                      >
                        <h5 class="fw-bold mb-3">แสกนเพื่อชำระเงิน</h5>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png"
                          alt="PromptPay QR"
                          class="img-fluid border mb-2"
                          style="max-width: 200px"
                        />
                        <p class="text-muted small">
                          ยอดชำระ: {{ curr.symbol
                          }}{{ (grandTotal * curr.curr).toFixed(2) }}
                        </p>
                      </div>

                      <div class="order-place" v-if="cart.length">
                        <div
                          v-if="!isQRVisible || selectedPayment !== 'promptpay'"
                          class="row"
                        >
                          <div class="col-6">
                            <button
                              class="btn btn-outline-secondary w-100"
                              @click.prevent="cancelToHome"
                            >
                              ยกเลิก
                            </button>
                          </div>
                          <div class="col-6">
                            <button
                              class="btn btn-primary w-100"
                              :disabled="isLoading || !hasSelectedAddress"
                              @click.prevent="handlePlaceOrder"
                            >
                              <span v-if="isLoading">กำลังดำเนินการ...</span>
                              <span v-else>สั่งซื้อสินค้า</span>
                            </button>
                          </div>
                        </div>

                        <div v-else class="row mt-2">
                          <div class="col-6">
                            <button
                              class="btn btn-outline-secondary w-100"
                              :disabled="isLoading"
                              @click.prevent="cancelPromptPay"
                            >
                              ยกเลิก
                            </button>
                          </div>
                          <div class="col-6">
                            <button
                              class="btn btn-primary w-100"
                              :disabled="isLoading || !hasSelectedAddress"
                              @click.prevent="confirmOrder"
                            >
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

      <shipmentMethod
        v-if="showShippingModal"
        :options="shippingOptions"
        :currentId="selectedShipping ? selectedShipping.id : ''"
        :currency="curr.curr"
        @close="showShippingModal = false"
        @select-shipping="handleShippingSelection"
      />
    </div>
  </section>
</template>

<script>
import { useProductStore } from "~~/store/products";
import { useCartStore } from "~~/store/cart";
import { useAddressStore } from "~/store/address";
import { useOrderStore } from "~/store/orders";
import { useAuthStore } from "~/store/auth";
import shipmentMethod from "./widgets/Payment/shipmentMethod.vue";
import SearchSelect from "./searchSelect.vue";

// Helper function
const getSafeStringId = (val) => {
  if (!val) return null;
  if (typeof val === "string") {
    if (val === "[object Object]") return null;
    return val;
  }
  if (val._id) return getSafeStringId(val._id);
  if (val.id) return getSafeStringId(val.id);
  try {
    const str = String(val);
    if (str !== "[object Object]") return str;
  } catch (e) {}
  return null;
};

export default {
  components: {
    shipmentMethod,
    SearchSelect,
  },
  setup() {
    const addressStore = useAddressStore();
    const orderStore = useOrderStore();
    const authStore = useAuthStore();
    const cartStore = useCartStore();
    return { addressStore, orderStore, authStore, cartStore };
  },
  data() {
    return {
      thaiAddressData: [],
      provinceList: [],
      districtList: [],
      subDistrictList: [],
      zipCodeList: [],

      checkoutItems: [],
      selectedPayment: "promptpay",
      note: "",
      isLoading: false,
      isQRVisible: false,
      isAddressListVisible: false,
      isFormVisible: false,
      formTemp: {
        _id: null,
        name: "",
        phone: "",
        address: "",
        subDistrict: "",
        district: "",
        province: "",
        zipCode: "",
        isDefault: false,
      },
      errors: {
        name: "",
        phone: "",
        address: "",
        subDistrict: "",
        district: "",
        province: "",
        zipCode: "",
      },
      user: {
        firstName: { value: "", errormsg: "" },
        lastName: { value: "", errormsg: "" },
        phone: { value: "", errormsg: "" },
        email: { value: "", errormsg: "" },
        address: { value: "", errormsg: "" },
        subDistrict: { value: "", errormsg: "" },
        district: { value: "", errormsg: "" },
        province: { value: "", errormsg: "" },
        zipCode: { value: "", errormsg: "" },
      },
      isLogin: false,
      showShippingModal: false,
      selectedShipping: null,
      shippingOptions: [
        { id: "economy", name: "Economy Delivery", time: "5-7 Days", price: 0 },
        {
          id: "standard",
          name: "Standard Delivery",
          time: "3-5 Days",
          price: 50,
        },
        {
          id: "express",
          name: "Express Delivery",
          time: "1-2 Days",
          price: 100,
        },
      ],
    };
  },
  watch: {
    selectedPayment(val) {
      this.isQRVisible = false;
    },
    "addressStore.addresses": {
      handler(newVal) {
        if (newVal && newVal.length > 0) {
          const defaultAddr = newVal.find((a) => a.isDefault) || newVal[0];
          this.loadAddressToUser(defaultAddr);
          this.isFormVisible = false;
        } else {
          this.isFormVisible = true;
          this.clearUserDisplay();
        }
      },
      deep: true,
      immediate: true,
    },
  },
  computed: {
    hasSelectedAddress() {
      return (
        !!this.user.firstName.value &&
        !!this.user.phone.value &&
        !!this.user.address.value
      );
    },
    savedAddressesList() {
      return this.addressStore.addresses.map((addr) => ({
        ...addr,
        firstName: addr.name,
        lastName: "",
        subDistrict: addr.subDistrict,
        city: addr.district,
        state: addr.province,
        pincode: addr.zipCode,
      }));
    },
    curr() {
      return useProductStore().changeCurrency;
    },
    cart() {
      const sorted = [...this.checkoutItems].sort((a, b) => {
        const brandA = (a.brand || "").toLowerCase();
        const brandB = (b.brand || "").toLowerCase();
        if (brandA < brandB) return -1;
        if (brandA > brandB) return 1;
        return 0;
      });
      return sorted;
    },
    cartTotal() {
      // รวมราคาสินค้าเพียวๆ
      return this.checkoutItems.reduce((total, item) => {
        const q = Number(item.quantity) || Number(item.qty) || 1;
        return total + this.calcPrice(item) * q;
      }, 0);
    },
    shippingBeforeDiscount() {
      // รวมค่าส่งราคาเต็ม (เอาค่าส่ง x จำนวนชิ้นของทุกชิ้นในตะกร้า)
      return this.checkoutItems.reduce((total, item) => {
        let cost = 0;
        if (
          item.shippingCost &&
          String(item.shippingCost).toLowerCase() !== "free"
        ) {
          cost = Number(item.shippingCost) || 0;
        }
        const q = Number(item.quantity) || Number(item.qty) || 1;
        return total + cost * q;
      }, 0);
    },
    shippingDiscount() {
      let discount = 0;
      const isFreeShipping = this.cartTotal >= 2000;
      const isHalfShipping = this.cartTotal >= 1000 && this.cartTotal < 2000;

      // ✅ คำนวณส่วนลดแบบระบุทีละรายการ
      this.checkoutItems.forEach((item) => {
        let unitShippingCost = 0;
        if (
          item.shippingCost &&
          String(item.shippingCost).toLowerCase() !== "free"
        ) {
          unitShippingCost = Number(item.shippingCost) || 0;
        }

        const q = Number(item.quantity) || Number(item.qty) || 1;
        const itemTotalShipping = unitShippingCost * q;

        if (isFreeShipping) {
          discount += itemTotalShipping;
        } else if (isHalfShipping) {
          discount += itemTotalShipping * 0.5;
        } else if (q >= 5) {
          // ถ้ายอดรวมไม่ถึง 1,000 แต่สินค้านี้สั่ง 5 ชิ้นขึ้นไป ให้ลดค่าส่ง 1 ชิ้น
          discount += unitShippingCost;
        }
      });

      return discount;
    },
    shippingTotal() {
      return Math.max(0, this.shippingBeforeDiscount - this.shippingDiscount);
    },
    shippingDiscountInfo() {
      if (this.cartTotal >= 2000) {
        return "ฟรีค่าส่ง (ยอดซื้อครบ 2,000 บาท)";
      } else if (this.cartTotal >= 1000) {
        return "ลดค่าส่ง 50% (ยอดซื้อครบ 1,000 บาท)";
      } else {
        // เช็คว่ามีสินค้าไหนเข้าเงื่อนไข >= 5 ชิ้นไหม
        const has5Items = this.checkoutItems.some((item) => {
          const q = Number(item.quantity) || Number(item.qty) || 1;
          return q >= 5;
        });
        if (has5Items) {
          return "ฟรีค่าจัดส่ง 1 ชิ้น (สำหรับสินค้าที่ซื้อ 5 ชิ้นขึ้นไป)";
        }
      }
      return "";
    },
    grandTotal() {
      return this.cartTotal + this.shippingTotal;
    },
  },
  methods: {
    calcPrice(item) {
      return Number(item?.price) || 0;
    },
    getSellerName(item) {
      if (item.seller && (item.seller.display_name || item.seller.name)) {
        return item.seller.display_name || item.seller.name;
      }
      if (
        item.brand &&
        item.brand.toLowerCase() !== "shop" &&
        item.brand.toLowerCase() !== "shop store"
      ) {
        return item.brand;
      }
      return "Official Store";
    },
    loadAddressToUser(addr) {
      if (!addr) return;
      this.user.firstName.value = addr.name || addr.firstName || "";
      this.user.lastName.value = "";
      this.user.phone.value = addr.phone || "";
      const details = [addr.address].filter(Boolean).join(" ");
      this.user.address.value = details || "";
      this.user.subDistrict.value = addr.subDistrict || "";
      this.user.district.value = addr.district || addr.city || "";
      this.user.province.value = addr.province || addr.state || "";
      this.user.zipCode.value = addr.zipCode || addr.pincode || "";
    },
    clearUserDisplay() {
      this.user.firstName.value = "";
      this.user.phone.value = "";
      this.user.address.value = "";
      this.user.subDistrict.value = "";
      this.user.district.value = "";
      this.user.province.value = "";
      this.user.zipCode.value = "";
    },
    toggleAddressList() {
      this.isAddressListVisible = !this.isAddressListVisible;
      this.isFormVisible = false;
    },
    selectFromList(addr) {
      this.loadAddressToUser(addr);
      this.isAddressListVisible = false;
    },
    isCurrentAddress(addr) {
      return (
        this.user.phone.value === addr.phone &&
        this.user.firstName.value === (addr.name || addr.firstName)
      );
    },

    clearErrors() {
      this.errors = {
        name: "",
        phone: "",
        address: "",
        subDistrict: "",
        district: "",
        province: "",
        zipCode: "",
      };
    },

    openAddressForm() {
      this.isFormVisible = true;
      this.isAddressListVisible = false;
      this.clearErrors();
      this.formTemp = {
        _id: null,
        name: "",
        phone: "",
        address: "",
        subDistrict: "",
        district: "",
        province: "",
        zipCode: "",
        isDefault: false,
      };
      this.districtList = [];
      this.subDistrictList = [];
      this.zipCodeList = [];
    },
    editCurrentAddress() {
      this.clearErrors();
      const currentPhone = this.user.phone.value;
      const realAddressObj = this.addressStore.addresses.find(
        (a) => a.phone === currentPhone,
      );

      if (realAddressObj) {
        this.fillFormWithAddress(realAddressObj);
      } else {
        this.formTemp = {
          _id: null,
          name: this.user.firstName.value,
          phone: this.user.phone.value,
          address: this.user.address.value,
          subDistrict: this.user.subDistrict.value,
          district: this.user.district.value,
          province: this.user.province.value,
          zipCode: this.user.zipCode.value,
          isDefault: false,
        };
        this.onProvinceChange(true);
        this.onDistrictChange(true);
        this.onSubDistrictChange();
      }
      this.isFormVisible = true;
      this.isAddressListVisible = false;
    },
    editSavedAddress(index) {
      this.clearErrors();
      const addr = this.savedAddressesList[index];
      this.fillFormWithAddress(addr);
      this.isFormVisible = true;
      this.isAddressListVisible = false;
    },

    fillFormWithAddress(addr) {
      this.formTemp = {
        _id: addr._id || addr.id,
        name: addr.name || addr.firstName,
        phone: addr.phone,
        address: addr.address,
        subDistrict: addr.subDistrict || "",
        district: addr.district || addr.city,
        province: addr.province || addr.state,
        zipCode: addr.zipCode || addr.pincode,
        isDefault: addr.isDefault,
      };
      this.onProvinceChange(true);
      this.onDistrictChange(true);
      this.onSubDistrictChange();
    },

    cancelAddressForm() {
      this.isFormVisible = false;
      this.clearErrors();
    },

    validateForm() {
      let isValid = true;
      this.clearErrors();

      if (!this.formTemp.name && !this.formTemp.firstName) {
        this.errors.name = "กรุณากรอกชื่อ-นามสกุล";
        isValid = false;
      }
      if (!this.formTemp.phone) {
        this.errors.phone = "กรุณากรอกเบอร์โทรศัพท์";
        isValid = false;
      } else {
        const phoneClean = this.formTemp.phone.replace(/[^0-9]/g, "");
        if (!/^0\d{9}$/.test(phoneClean)) {
          this.errors.phone =
            "เบอร์โทรศัพท์ต้องเป็นตัวเลข 10 หลักและขึ้นต้นด้วย 0";
          isValid = false;
        }
      }
      if (!this.formTemp.address) {
        this.errors.address = "กรุณากรอกที่อยู่";
        isValid = false;
      }
      if (!this.formTemp.province) {
        this.errors.province = "กรุณาเลือกจังหวัด";
        isValid = false;
      }
      if (!this.formTemp.district) {
        this.errors.district = "กรุณาเลือกอำเภอ/เขต";
        isValid = false;
      }
      if (!this.formTemp.subDistrict) {
        this.errors.subDistrict = "กรุณาเลือกตำบล/แขวง";
        isValid = false;
      }
      if (!this.formTemp.zipCode) {
        this.errors.zipCode = "รหัสไปรษณีย์ต้องมีค่า";
        isValid = false;
      }

      return isValid;
    },

    async saveNewAddress() {
      if (!this.validateForm()) {
        useNuxtApp().$showToast({
          msg: "กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง",
          type: "error",
        });
        return;
      }

      try {
        const payload = {
          name: this.formTemp.name || this.formTemp.firstName,
          phone: this.formTemp.phone.replace(/[^0-9]/g, ""),
          address: this.formTemp.address,
          subDistrict: this.formTemp.subDistrict || "-",
          district: this.formTemp.district || this.formTemp.city,
          province: this.formTemp.province || this.formTemp.state,
          zipCode: this.formTemp.zipCode || this.formTemp.pincode,
          isDefault: this.formTemp.isDefault,
        };
        if (this.formTemp._id) {
          await this.addressStore.updateAddress(this.formTemp._id, payload);
          useNuxtApp().$showToast({
            msg: "อัปเดตที่อยู่สำเร็จ",
            type: "success",
          });
        } else {
          await this.addressStore.addAddress(payload);
          useNuxtApp().$showToast({
            msg: "เพิ่มที่อยู่สำเร็จ",
            type: "success",
          });
        }
      } catch (err) {
        useNuxtApp().$showToast({
          msg: err.message || "บันทึกไม่สำเร็จ",
          type: "error",
        });
      }
    },
    handleShippingSelection(option) {
      this.selectedShipping = option;
      this.showShippingModal = false;
    },
    cancelToHome() {
      this.$router.push("/");
    },

    handlePlaceOrder() {
      this.onSubmit();
      if (!this.hasSelectedAddress) {
        try {
          useNuxtApp().$showToast({
            msg: "กรุณาเพิ่มที่อยู่จัดส่ง",
            type: "error",
          });
        } catch (e) {}
        return;
      }
      if (this.user.firstName.errormsg || this.user.phone.errormsg) {
        try {
          useNuxtApp().$showToast({
            msg: "Please check your details.",
            type: "error",
          });
        } catch (e) {}
        return;
      }
      if (this.selectedPayment === "promptpay") {
        this.isQRVisible = true;
      } else if (this.selectedPayment === "cod") {
        this.confirmOrder();
      }
    },
    cancelPromptPay() {
      this.isQRVisible = false;
    },

    async confirmOrder() {
      this.isLogin = useCookie("userlogin").value;
      if (!this.isLogin) {
        this.$router.replace(
          "/page/auth/LoginPage?redirect=/page/account/checkout",
        );
        return;
      }

      this.isLoading = true;
      try {
        // ตรวจสอบสต็อกล่าสุดก่อน checkout
        const stockValidation = await this.cartStore.validateCheckoutStock();
        if (!stockValidation) {
          this.isLoading = false;
          useNuxtApp().$showToast({
            msg: "มีการเปลี่ยนแปลงสินค้าในตะกร้า กรุณาตรวจสอบอีกครั้ง",
            type: "warning",
          });
          // รีเฟรชหน้าเพื่อแสดงข้อมูลล่าสุด
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          return;
        }

        const now = new Date();
        const dateString =
          now.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }) +
          ", " +
          now.toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });

        const realUserId = this.authStore.user?._id || this.authStore.user?.id;
        const realUserEmail =
          this.authStore.user?.email ||
          this.user.email.value ||
          "no-email@example.com";

        if (!realUserId) {
          throw new Error("ไม่พบข้อมูลผู้ใช้งาน (User ID) กรุณา Login ใหม่");
        }

        const ordersBySeller = {};
        this.checkoutItems.forEach((item) => {
          let sellerId = "official_store";
          if (item.seller) {
            const safeId = getSafeStringId(item.seller);
            if (safeId) sellerId = safeId;
          }
          if (!ordersBySeller[sellerId]) {
            ordersBySeller[sellerId] = { items: [] };
          }
          ordersBySeller[sellerId].items.push(item);
        });

        // 🚨 1. คำนวณราคาสินค้ารวม "ทั้งตะกร้า" (เพื่อเช็คเงื่อนไขโปรโมชั่นระดับ Global)
        const globalCartTotal = this.checkoutItems.reduce((sum, item) => {
          const q = Number(item.quantity) || Number(item.qty) || 1;
          return sum + this.calcPrice(item) * q;
        }, 0);

        const isFreeShipping = globalCartTotal >= 2000;
        const isHalfShipping =
          globalCartTotal >= 1000 && globalCartTotal < 2000;

        const orderPromises = Object.keys(ordersBySeller).map(
          async (sellerId, index) => {
            const group = ordersBySeller[sellerId];

            let subTotal = 0;
            let sellerRawShippingCost = 0;
            let sellerShippingDiscount = 0;

            // ✅ 2. วนลูปคำนวณเงิน "ทีละสินค้า" ภายในร้านค้านี้
            group.items.forEach((item) => {
              const q = Number(item.quantity) || Number(item.qty) || 1;
              const price = this.calcPrice(item);

              // รวมค่าสินค้า
              subTotal += price * q;

              // ดึงค่าส่งต่อ 1 ชิ้น
              let unitShippingCost = 0;
              if (
                item.shippingCost &&
                String(item.shippingCost).toLowerCase() !== "free"
              ) {
                unitShippingCost = Number(item.shippingCost) || 0;
              }

              // รวมค่าส่งตั้งต้นของสินค้านี้ (คูณจำนวนชิ้น)
              const totalItemShipping = unitShippingCost * q;
              sellerRawShippingCost += totalItemShipping;

              // 🚨 3. คำนวณส่วนลดของสินค้านี้ (อิงตาม Global Cart Total)
              let itemDiscount = 0;
              if (isFreeShipping) {
                itemDiscount = totalItemShipping; // ลด 100%
              } else if (isHalfShipping) {
                itemDiscount = totalItemShipping * 0.5; // ลด 50%
              } else if (q >= 5) {
                // ถ้ายอดรวมไม่ถึง 1,000 แต่สั่งชิ้นนี้ 5 ชิ้นขึ้นไป ให้หักค่าส่งออก 1 ชิ้น
                itemDiscount = unitShippingCost;
              }

              sellerShippingDiscount += itemDiscount;
            });

            // ✅ 4. คำนวณค่าส่งสุทธิของร้านนี้
            const finalShippingCost =
              sellerRawShippingCost - sellerShippingDiscount;

            // ยอดรวม = (ค่าสินค้า) + (ค่าส่งสุทธิที่หักส่วนลดแล้ว)
            const total = subTotal + finalShippingCost;

            const orderId =
              "ORD-" +
              Math.floor(100000 + Math.random() * 900000) +
              "-" +
              (index + 1);
            const finalSellerId =
              sellerId === "official_store" ? null : sellerId;

            const payload = {
              orderId: orderId,
              user: realUserId,
              email: realUserEmail,
              seller: finalSellerId,
              address: `${this.user.firstName.value} ${this.user.lastName.value} (${this.user.phone.value}) ${this.user.address.value} ${this.user.subDistrict.value} ${this.user.district.value} ${this.user.province.value} ${this.user.zipCode.value}`,
              customer: `${this.user.firstName.value} ${this.user.lastName.value}`,
              date: dateString,
              status: "Pending",
              total: total, // 👈 ยอดรวมที่หักส่วนลดแล้ว
              shippingCost: finalShippingCost, // 👈 ค่าส่งสุทธิที่หักส่วนลดแล้ว
              paymentMethod:
                this.selectedPayment === "cod" ? "COD" : "PromptPay",
              note: this.note,
              item: group.items.map((p) => {
                const productId =
                  getSafeStringId(p.id) || getSafeStringId(p._id);
                const affiliateCode =
                  this.getAffiliateCodeForProduct(productId);

                return {
                  productId,
                  name: p.name || p.title,
                  price: this.calcPrice(p),
                  qty: Number(p.quantity) || Number(p.qty) || 1,
                  image: (() => {
                    const img = p.image || (p.images && p.images[0]?.src) || "";
                    // ข้าม base64 ไม่ส่งไปเก็บใน MongoDB — ใช้เฉพาะ Cloudinary URL
                    if (typeof img === "string" && img.startsWith("data:"))
                      return "";
                    return img;
                  })(),
                  refAffiliateId: affiliateCode || undefined,
                };
              }),
            };

            console.log(`📦 Order payload for ${sellerId}:`, payload);
            return await this.orderStore.placeOrder(payload);
          },
        );

        await Promise.all(orderPromises);

        try {
          this.clearAffiliateSession();
        } catch (e) {
          console.error("Error clearing affiliate session:", e);
        }

        localStorage.removeItem("checkout_items");

        const cartStore = useCartStore();
        if (cartStore.cartItems) cartStore.cartItems = [];
        await cartStore.fetchCart();

        try {
          useNuxtApp().$showToast({
            msg: "สั่งซื้อสำเร็จเรียบร้อย!",
            type: "success",
          });
        } catch (e) {}
        setTimeout(() => {
          this.$router.push({
            path: "/page/account/userdashboard",
            query: { tab: "orders" },
          });
        }, 500);
      } catch (error) {
        console.error("Order Failed:", error);
        const errorMsg = error.response?.data?.message || error.message;
        try {
          useNuxtApp().$showToast({
            msg: "เกิดข้อผิดพลาด: " + errorMsg,
            type: "error",
          });
        } catch (e) {}
      } finally {
        this.isLoading = false;
      }
    },

    onSubmit() {
      if (!this.user.firstName.value || this.user.firstName.value.length <= 1)
        this.user.firstName.errormsg = "required";
      else this.user.firstName.errormsg = "";
      if (!this.user.phone.value) this.user.phone.errormsg = "required";
      else this.user.phone.errormsg = "";
    },

    async fetchThaiAddressData() {
      try {
        const response = await fetch(
          "https://raw.githubusercontent.com/earthchie/jquery.Thailand.js/master/jquery.Thailand.js/database/raw_database/raw_database.json",
        );
        const data = await response.json();
        this.thaiAddressData = data;
        const provinces = data.map((i) => i.province);
        this.provinceList = [...new Set(provinces)].sort();
      } catch (error) {
        console.error("Failed to load address data:", error);
      }
    },

    onProvinceChange(preserveChildren = false) {
      if (!preserveChildren) {
        this.formTemp.district = "";
        this.formTemp.subDistrict = "";
        this.formTemp.zipCode = "";
        this.zipCodeList = [];
      }
      if (!this.formTemp.province) return;
      const districts = this.thaiAddressData
        .filter((i) => i.province === this.formTemp.province)
        .map((i) => i.amphoe);
      this.districtList = [...new Set(districts)].sort();
    },

    onDistrictChange(preserveChildren = false) {
      if (!preserveChildren) {
        this.formTemp.subDistrict = "";
        this.formTemp.zipCode = "";
        this.zipCodeList = [];
      }
      if (!this.formTemp.district) return;
      const subDistricts = this.thaiAddressData
        .filter(
          (i) =>
            i.province === this.formTemp.province &&
            i.amphoe === this.formTemp.district,
        )
        .map((i) => i.district);
      this.subDistrictList = [...new Set(subDistricts)].sort();
    },

    onSubDistrictChange() {
      if (!this.formTemp.subDistrict) {
        this.zipCodeList = [];
        this.formTemp.zipCode = "";
        return;
      }
      const matches = this.thaiAddressData.filter(
        (i) =>
          i.province === this.formTemp.province &&
          i.amphoe === this.formTemp.district &&
          i.district === this.formTemp.subDistrict,
      );
      const codes = [...new Set(matches.map((i) => String(i.zipcode)))];
      this.zipCodeList = codes;
      if (codes.length === 1) {
        this.formTemp.zipCode = codes[0];
      } else {
        this.formTemp.zipCode = "";
      }
    },

    getAffiliateMap() {
      try {
        const raw = localStorage.getItem("affiliateProductMap") || "{}";
        const map = JSON.parse(raw);
        return map && typeof map === "object" ? map : {};
      } catch (e) {
        return {};
      }
    },

    getAffiliateCodeForProduct(productId) {
      const map = this.getAffiliateMap();
      if (!productId) {
        console.warn("⚠️ getAffiliateCodeForProduct called without productId");
        return null;
      }
      if (map[productId]) {
        return map[productId];
      }
      try {
        const fallback = localStorage.getItem("affiliateFallback");
        if (fallback) {
          return fallback;
        }
      } catch (e) {
        console.error("Error getting fallback affiliate:", e);
      }
      return null;
    },

    isValidAffiliateSession() {
      try {
        const mapRaw = localStorage.getItem("affiliateProductMap");
        const startTime = localStorage.getItem("affiliateStartTime");
        if (!mapRaw || !startTime) {
          return false;
        }
        const sessionDuration = Date.now() - parseInt(startTime);
        const maxSessionTime = 30 * 60 * 1000;
        if (sessionDuration > maxSessionTime) {
          this.clearAffiliateSession();
          return false;
        }
        return true;
      } catch (e) {
        return false;
      }
    },

    clearAffiliateSession() {
      try {
        localStorage.removeItem("affiliateProductMap");
        localStorage.removeItem("affiliateFallback");
        localStorage.removeItem("affiliateStartTime");
      } catch (e) {}
    },
  },

  async mounted() {
    this.isLogin = useCookie("userlogin").value;
    if (!this.isLogin) {
      this.$router.replace(
        "/page/auth/LoginPage?redirect=/page/account/checkout",
      );
      return;
    }

    if (this.authStore.initAuth) this.authStore.initAuth();

    await this.addressStore.fetchAddresses();
    if (
      !this.addressStore.addresses ||
      this.addressStore.addresses.length === 0
    ) {
      useNuxtApp().$showToast({
        msg: "กรุณาเพิ่มที่อยู่จัดส่งสินค้า",
        type: "error",
      });

      this.openAddressForm();
      this.validateForm();
    }

    this.fetchThaiAddressData();

    let items = localStorage.getItem("checkout_items");
    if (!items || items === "[]") {
      const cartStore = useCartStore();
      if (cartStore.cartItems && cartStore.cartItems.length > 0) {
        items = JSON.stringify(cartStore.cartItems);
        localStorage.setItem("checkout_items", items);
      }
    }

    if (items && items !== "[]") {
      try {
        const parsedItems = JSON.parse(items);
        this.checkoutItems = parsedItems.map((item) => ({
          ...item,
          id: getSafeStringId(item.id) || getSafeStringId(item._id),
          price: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          shippingCost: item.shippingCost || "Free",
        }));
      } catch (e) {
        this.checkoutItems = [];
      }
    }

    if (this.checkoutItems.length === 0) {
      this.$router.replace("/page/account/cart");
    }

    this.selectedShipping = this.shippingOptions[1];
  },
};
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

.is-invalid {
  border-color: #dc3545 !important;
  padding-right: calc(1.5em + 0.75rem);
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12' width='12' height='12' fill='none' stroke='%23dc3545'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: 0.875em;
  color: #dc3545;
}
</style>
