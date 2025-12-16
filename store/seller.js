import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSellerStore = defineStore('seller', () => {
  // เมนูสำหรับ Seller เท่านั้น
  const data = ref([
    {
      title: 'Seller Center', // หัวข้อหลัก
      icon: 'box',
      type: 'link',
      path: '/seller/dashboard',
      active: true
    },
    {
      title: 'My Orders',
      icon: 'shopping-cart',
      type: 'sub',
      active: false,
      children: [
        { title: 'New Orders', type: 'link', path: '/seller/orders/new' },
        { title: 'History', type: 'link', path: '/seller/orders/history' }
      ]
    }
  ]);

  // ใช้ฟังก์ชัน toggle เดียวกับตัวหลักได้ หรือเขียนใหม่ก็ได้
  function toggleMenu(item) {
    item.active = !item.active;
  }

  return { data, toggleMenu };
});