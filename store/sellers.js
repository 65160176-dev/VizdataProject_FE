import sellers from '../data/sellers.json'
import { defineStore } from 'pinia'

export const useSellerStore = defineStore({
  id: 'seller-store',
  state: () => ({
    sellers: sellers.data || []
  }),
  actions: {
    addSeller(payload) {
      this.sellers.push(payload)
    }
  },
  getters: {
    getSellerById: (state) => {
      return id => state.sellers.find(s => s.id === +id)
    },
    getSellerByName: (state) => {
      return name => state.sellers.find(s => s.name && s.name.toLowerCase() === (name || '').toLowerCase())
    }
  }
})
