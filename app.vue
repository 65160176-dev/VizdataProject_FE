<template>
  <NuxtLayout>
    <Head>
      </Head>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
import { onMounted } from 'vue'
import { useCartStore } from '~~/store/cart'
import { useProductStore } from './store/products'

// เรียกใช้ Store
const cartStore = useCartStore()
const productStore = useProductStore()

onMounted(() => {
  // ----------------------------------------
  // 1. ส่วนจัดการ Dark Mode (เพิ่มใหม่)
  // ----------------------------------------
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode')
  } else {
    document.body.classList.remove('dark-mode')
  }

  // ----------------------------------------
  // 2. ส่วนจัดการ Cart / Product (โค้ดเดิมของคุณ)
  // ----------------------------------------
  
  // Load Compare
  const localstorageCompare = JSON.parse(localStorage.getItem('compare'))
  if (localstorageCompare?.length) {
    productStore.setInitialCompare(localstorageCompare)
  }

  // Load Wishlist
  const localstorageWhishlist = JSON.parse(localStorage.getItem('whish'))
  if (localstorageWhishlist?.length) {
    productStore.setInitialWhishlist(localstorageWhishlist)
  }

  // Load Cart
  const localStorageProducts = JSON.parse(localStorage.getItem('product'))
  if (localStorageProducts?.length) {
    cartStore.setInitialCart(localStorageProducts)
  }

  // Save on Close/Refresh
  window.addEventListener('beforeunload', () => {
    localStorage.setItem('product', JSON.stringify(cartStore.cart))
    localStorage.setItem('whish', JSON.stringify(productStore.wishlist))
    localStorage.setItem('compare', JSON.stringify(productStore.compare))
  })
})
</script>

<style>
/* ---------------------------------------------------- */
/* Global Styles & Dark Mode (ใส่ที่นี่เพื่อให้เห็นผลทันที) */
/* ---------------------------------------------------- */

body {
  margin: 0;
  font-family: 'Sarabun', sans-serif; /* หรือฟอนต์ที่คุณใช้ */
  background-color: #f8f9fa; /* สีพื้นหลัง Light Mode */
  color: #333;
  transition: background-color 0.3s ease, color 0.3s ease;
}

/* === DARK MODE STYLES === */
body.dark-mode {
  background-color: #121212 !important; /* พื้นหลังมืด */
  color: #e0e0e0 !important;           /* ตัวหนังสือสว่าง */
}

/* ปรับสี Card ทั้งหมดใน Dark Mode */
body.dark-mode .card,
body.dark-mode .bg-white,
body.dark-mode .sidebar-menu { 
  background-color: #1e1e2f !important;
  color: #fff !important;
  border-color: #333 !important;
}

/* ปรับหัวข้อต่างๆ */
body.dark-mode h1, 
body.dark-mode h2, 
body.dark-mode h3, 
body.dark-mode h4, 
body.dark-mode h5, 
body.dark-mode h6 {
  color: #ffffff !important;
}

/* ปรับสีเส้นคั่น */
body.dark-mode hr {
  border-color: #444 !important;
}

/* ปรับสี Input (ถ้ามี) */
body.dark-mode input,
body.dark-mode select,
body.dark-mode textarea {
  background-color: #2b2b40 !important;
  color: #fff !important;
  border: 1px solid #444 !important;
}
</style>