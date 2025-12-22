import products from '../data/products.json'
import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'

export const useCartStore = defineStore({
  id: 'cart-store',
  state: () => {
    return {
      products: products.data,
      cart: [],
      abc: {},
      // [เพิ่มใหม่ 1] State สำหรับเก็บสินค้าที่ถูกเลือกจากหน้า Cart เพื่อไปหน้า Checkout
      selectedCheckoutItems: []
    }
  },
  actions: {
    addToCart(payload) {
      const product = this.products.find(item => item.id === payload.id)
      const cartItems = this.cart.find(item => item.id === payload.id)
      const qty = payload.quantity ? payload.quantity : 1
      if (cartItems) {
        cartItems.quantity = qty
      } else {
        this.cart.push({
          ...product,
          quantity: qty
        })
      }
      product.stock--
    },
    updateCartQuantity(payload) {
      function calculateStockCounts(product, quantity) {
        const qty = product.quantity + quantity
        const stock = product.stock
        if (stock < qty) {
          return false
        }
        return true
      }
      this.cart.find((items, index) => {
        if (items.id === payload.product.id) {
          const qty = this.cart[index].quantity + payload.qty
          const stock = calculateStockCounts(this.cart[index], payload.qty)
          if (qty !== 0 && stock) {
            this.cart[index].quantity = qty
          } else {

          }
          return true
        }
      })
    },
    removeCartItem(payload) {
      this.cart = this.cart.filter((item) => item.id != payload.id)
    },
    setInitialCart(payload) {
      this.cart = payload
    },
    // [เพิ่มใหม่ 2] Action สำหรับบันทึกรายการสินค้าที่ถูกเลือก (เรียกใช้ตอนกดปุ่ม Checkout)
    setSelectedItems(payload) {
      this.selectedCheckoutItems = payload
    }
  },
  getters: {
    cartItems: (state) => {
      return state.cart
    },
    cartTotalAmount: (state) => {
      return state.cart.reduce((total, product) => {
        return total + (product.price * product.quantity)
      }, 0)
    },
    // [เพิ่มใหม่ 3] Getter คำนวณราคารวม เฉพาะสินค้าที่ถูกเลือก (ใช้ในหน้า Checkout)
    selectedCheckoutTotal: (state) => {
      return state.selectedCheckoutItems.reduce((total, product) => {
        return total + (product.price * product.quantity)
      }, 0)
    }
  }
})