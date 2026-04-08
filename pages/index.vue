<template>
  <div>
    <Header />

    <section class="marketplace py-3">
      <div class="container-fluid px-4">
        <!-- Top bar: Category dropdown + Search -->
        <div class="d-flex align-items-center gap-3 mb-3 top-bar-row">
          <!-- Category Dropdown -->
          <div class="category-dropdown-wrapper" ref="categoryDropdownRef">
            <button
              class="btn btn-category-dropdown d-flex align-items-center gap-2"
              @click="showCategoryDropdown = !showCategoryDropdown"
            >
              <i class="fa fa-bars"></i>
              <span class="fw-semibold">หมวดหมู่สินค้า</span>
              <i class="fa fa-chevron-down ms-1" style="font-size: 11px"></i>
            </button>
            <transition name="dropdown-fade">
              <div v-if="showCategoryDropdown" class="category-dropdown-menu shadow">
                <div class="dropdown-header d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
                  <span class="fw-bold">หมวดหมู่สินค้า</span>
                  <button
                    v-if="selectedCategories.length > 0"
                    class="btn btn-link text-danger p-0 border-0 small"
                    @click="selectedCategories = []"
                  >
                    ล้างทั้งหมด
                  </button>
                  <button class="btn btn-link text-muted p-0 border-0" @click="showCategoryDropdown = false">
                    <i class="fa fa-times"></i> ปิด
                  </button>
                </div>
                <div class="dropdown-body p-3">
                  <div class="category-grid">
                    <label
                      v-for="(cat, index) in systemCategories"
                      :key="cat.id || index"
                      :for="'cat-dd-' + (cat.id || index)"
                      class="category-dropdown-item d-flex align-items-center gap-2 py-2 px-3 rounded"
                    >
                      <input
                        class="form-check-input mt-0 custom-checkbox"
                        type="checkbox"
                        :value="cat.name"
                        :id="'cat-dd-' + (cat.id || index)"
                        v-model="selectedCategories"
                      />
                      <span class="cat-dd-name">{{ cat.name }}</span>
                      <span class="text-muted ms-auto" style="font-size: 11px">({{ getCategoryCount(cat.name) }})</span>
                    </label>
                  </div>
                  <div v-if="systemCategories.length === 0" class="text-center py-3">
                    <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                  </div>
                </div>
              </div>
            </transition>
          </div>

          <!-- Search bar -->
          <div class="search-box flex-grow-1">
            <div class="input-group shadow-sm rounded">
              <span class="input-group-text bg-white border-end-0"
                ><i class="fa fa-search text-muted"></i
              ></span>
              <input
                v-model="q"
                class="form-control border-start-0 ps-0"
                placeholder="ค้นหาสินค้า หรือ ร้านค้า..."
              />
            </div>
          </div>
        </div>

        <!-- Selected category tags -->
        <div v-if="selectedCategories.length > 0" class="selected-tags mb-3 d-flex flex-wrap gap-2">
          <span
            v-for="cat in selectedCategories"
            :key="cat"
            class="badge-tag d-flex align-items-center gap-1"
          >
            {{ cat }}
            <button class="btn-tag-remove" @click="selectedCategories = selectedCategories.filter(c => c !== cat)">
              <i class="fa fa-times"></i>
            </button>
          </span>
        </div>

        <div>
          <!-- Hero section: Banner left + Best Sellers right -->
          <div class="hero-row mb-4">
            <!-- Banner Left -->
            <div class="hero-banner">
              <ClientOnly>
                <Swiper
                  :modules="[SwiperAutoplay, SwiperNavigation, SwiperPagination]"
                  :slides-per-view="1"
                  :loop="true"
                  :autoplay="{
                    delay: 4000,
                    disableOnInteraction: false,
                  }"
                  :navigation="true"
                  :pagination="{ clickable: true }"
                  class="banner-swiper"
                >
                  <SwiperSlide v-for="(banner, index) in banners" :key="index">
                    <div class="banner-slide">
                      <img :src="banner.image" :alt="banner.alt" />
                    </div>
                  </SwiperSlide>
                </Swiper>
              </ClientOnly>
            </div>

            <!-- Best Sellers Right -->
            <div class="hero-bestseller">
              <div class="d-flex align-items-center justify-content-between mb-2">
                <h6 class="fw-bold mb-0">🔥 ขายดี</h6>
              </div>
              <div v-if="bestLoading" class="text-center py-5">
                <div class="spinner-border text-primary spinner-border-sm" role="status"></div>
              </div>
              <div v-else-if="bestSellersFiltered.length > 0" class="bestseller-grid">
                <div
                  v-for="item in bestSellersFiltered.slice(0, 8)"
                  :key="item.productId"
                  class="bestseller-card"
                >
                  <nuxt-link
                    :to="{
                      path: '/product/three-column/thumbnail-left',
                      query: {
                        id:
                          item.product?._id ||
                          item.product?.id ||
                          item.productId,
                      },
                    }"
                    class="text-decoration-none text-dark"
                  >
                    <div class="card h-100 shadow-sm border-0">
                      <img
                        :src="getProductImage(item.product)"
                        class="card-img-top"
                      />
                      <div class="card-body p-2">
                        <div class="small text-truncate fw-semibold">
                          {{ item.product?.name || "สินค้า" }}
                        </div>
                        <div class="d-flex justify-content-between align-items-center mt-1">
                          <span class="price-text" style="font-size: 14px">฿{{ (item.product?.price || 0).toLocaleString() }}</span>
                          <span class="text-muted" style="font-size: 10px">ขายแล้ว {{ item.totalSold || 0 }}</span>
                        </div>
                      </div>
                    </div>
                  </nuxt-link>
                </div>
              </div>
              <div v-else class="text-center text-muted py-5 small">ยังไม่มีสินค้าขายดีในหมวดหมู่นี้</div>
            </div>
          </div>

          <!-- Store search results -->
          <div v-if="filteredSellers.length > 0" class="mb-4">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h5 class="fw-bold mb-0">ร้านค้าที่เกี่ยวข้อง</h5>
              <span class="text-muted small">พบ {{ filteredSellers.length }} ร้านค้า</span>
            </div>
            <div class="seller-search-grid">
              <nuxt-link
                v-for="seller in filteredSellers"
                :key="seller._id || seller.id"
                :to="'/seller/' + (seller._id || seller.id)"
                class="seller-search-card text-decoration-none"
              >
                <div class="card shadow-sm border-0 h-100">
                  <div class="card-body d-flex align-items-center gap-4 py-4 px-4">
                    <div class="seller-avatar-circle">
                      <img v-if="seller.avatar" :src="seller.avatar" :alt="seller.display_name" />
                      <span v-else class="seller-avatar-initial">{{ (seller.display_name || seller.name || 'S').charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="overflow-hidden">
                      <div class="fw-semibold text-dark text-truncate">{{ seller.display_name || seller.name }}</div>
                      <div class="text-muted small text-truncate">{{ seller.description || 'ร้านค้าออนไลน์' }}</div>
                      <div v-if="seller.rating" class="text-warning small mt-1">
                        <i class="fa fa-star"></i> {{ seller.rating }}
                      </div>
                    </div>
                    <i class="fa fa-chevron-right text-muted ms-auto"></i>
                  </div>
                </div>
              </nuxt-link>
            </div>
          </div>

          <!-- Main content -->
          <div>
            <div class="d-flex align-items-center justify-content-between mb-3">
              <h5 class="fw-bold mb-0">สินค้าทั้งหมด</h5>
              <span class="text-muted small"
                >พบ {{ filteredProducts.length }} รายการ</span
              >
            </div>

            <ClientOnly>
              <div v-if="productStore.loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
              </div>
              <div
                v-else-if="filteredProducts.length === 0"
                class="text-center py-5 bg-white rounded shadow-sm"
              >
                <div class="mb-3">
                  <i class="fa fa-search fa-3x text-muted opacity-25"></i>
                </div>
                <p class="text-muted">ไม่พบสินค้าที่คุณต้องการ</p>
                <button
                  class="btn btn-primary btn-sm px-4"
                  @click="
                    q = '';
                    selectedCategories = [];
                  "
                >
                  แสดงทั้งหมด
                </button>
              </div>
              <div v-else class="product-grid">
                <div
                  v-for="product in displayedProducts"
                  :key="product._id || product.id"
                  class="product-card"
                >
                  <div class="card h-100 shadow-sm border-0">
                    <div class="badge-sale" v-if="product?.sale">SALE</div>
                    <nuxt-link
                      :to="{
                        path: '/product/three-column/thumbnail-left',
                        query: { id: product._id || product.id },
                      }"
                    >
                      <img
                        :src="getProductImage(product)"
                        class="card-img-top"
                      />
                    </nuxt-link>
                    <div class="card-body d-flex flex-column">
                      <h6 class="card-title mb-1 text-truncate-2">
                        {{ product?.name || "ไม่มีชื่อสินค้า" }}
                      </h6>
                      <div class="text-muted small mb-2">
                        {{ product?.brand || "" }}
                      </div>
                      <div
                        class="mt-auto d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <div v-if="product?.sale">
                            <div
                              class="text-muted small text-decoration-line-through"
                            >
                              ฿{{ product.price.toLocaleString() }}
                            </div>
                            <div class="fw-bold price-text">
                              ฿{{ discountedPrice(product).toLocaleString() }}
                            </div>
                          </div>
                          <div v-else class="fw-bold price-text">
                            ฿{{ (product?.price || 0).toLocaleString() }}
                          </div>
                        </div>
                        <button class="btn-cart" @click="addToCart(product)">
                          <i class="fa fa-shopping-cart"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                v-if="isLoadingMore && hasMoreProducts"
                class="text-center py-4"
              >
                <div
                  class="spinner-border spinner-border-sm text-primary"
                ></div>
              </div>
              <div ref="scrollTrigger" class="scroll-trigger"></div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { useCartStore } from "~/store/cart";
import { useProductStore } from "~/store/products";
import { Swiper, SwiperSlide } from "swiper/vue";
import {
  Autoplay as SwiperAutoplay,
  Navigation as SwiperNavigation,
  Pagination as SwiperPagination,
} from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BACKEND_URL = "https://vizdataprojectbe-production.up.railway.app";
const cart = useCartStore();
const productStore = useProductStore();

const q = ref("");
const selectedCategories = ref([]);
const systemCategories = ref([]);
const bestSellers = ref([]);
const bestLoading = ref(true);
const scrollTrigger = ref(null);
const showCategoryDropdown = ref(false);
const categoryDropdownRef = ref(null);
const allSellers = ref([]);

const itemsPerPage = 20;
const displayedCount = ref(20);
const isLoadingMore = ref(false);
let observer = null;

// อัปเดตข้อมูลแบนเนอร์เพิ่ม Banner 2 และ Banner 3
const banners = ref([
  {
    image: new URL("~/assets/images/Banner.jpg", import.meta.url).href,
    alt: "Banner 1",
  },
  {
    image: new URL("~/assets/images/Banner2.jpg", import.meta.url).href,
    alt: "Banner 2",
  },
  {
    image: new URL("~/assets/images/Banner3.jpg", import.meta.url).href,
    alt: "Banner 3",
  },
]);

function handleClickOutside(e) {
  if (categoryDropdownRef.value && !categoryDropdownRef.value.contains(e.target)) {
    showCategoryDropdown.value = false;
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside);
  await Promise.all([
    productStore.fetchProducts(),
    fetchSystemCategories(),
    fetchBestSellers(),
    fetchSellers(),
  ]);
  setupInfiniteScroll();
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
  if (observer) observer.disconnect();
});

const fetchSystemCategories = async () => {
  try {
    const res = await $fetch(`${BACKEND_URL}/api/category/public/system`);
    if (res) systemCategories.value = res;
  } catch (e) {
    console.error(e);
  }
};

const fetchSellers = async () => {
  try {
    const res = await $fetch(`${BACKEND_URL}/api/sellers`);
    allSellers.value = Array.isArray(res?.data) ? res.data : [];
  } catch (e) {
    allSellers.value = [];
  }
};

const fetchBestSellers = async () => {
  try {
    bestLoading.value = true;
    const res = await $fetch(`${BACKEND_URL}/api/order/best-sellers`, {
      params: { limit: 10 },
    });
    bestSellers.value = Array.isArray(res) ? res : [];
  } catch (e) {
    bestSellers.value = [];
  } finally {
    bestLoading.value = false;
  }
};

const categoryCounts = computed(() => {
  const counts = {};
  productStore.products?.forEach((p) => {
    if (p.category && p.stock > 0)
      counts[p.category] = (counts[p.category] || 0) + 1;
  });
  return counts;
});

const getCategoryCount = (name) => categoryCounts.value[name] || 0;

const filteredProducts = computed(() => {
  let result = productStore.products || [];
  const term = q.value.toLowerCase().trim();
  result = result.filter((p) => Number(p.stock) > 0);
  if (term) {
    result = result.filter(
      (p) =>
        (p.name || "").toLowerCase().includes(term) ||
        (p.brand || "").toLowerCase().includes(term),
    );
  }
  if (selectedCategories.value.length > 0) {
    result = result.filter((p) =>
      selectedCategories.value.includes(p.category),
    );
  }
  return result;
});

const filteredSellers = computed(() => {
  const term = q.value.toLowerCase().trim();
  if (!term) return [];
  return allSellers.value.filter(
    (s) =>
      (s.display_name || "").toLowerCase().includes(term) ||
      (s.name || "").toLowerCase().includes(term),
  );
});

const bestSellersFiltered = computed(() => {
  let result = bestSellers.value.filter(
    (item) => Number(item?.product?.stock) > 0,
  );
  if (selectedCategories.value.length > 0) {
    result = result.filter((item) =>
      selectedCategories.value.includes(item?.product?.category),
    );
  }
  return result.slice(0, 5);
});

const displayedProducts = computed(() =>
  filteredProducts.value.slice(0, displayedCount.value),
);
const hasMoreProducts = computed(
  () => displayedCount.value < filteredProducts.value.length,
);

watch([q, selectedCategories], () => {
  displayedCount.value = itemsPerPage;
});

function loadMoreProducts() {
  if (isLoadingMore.value || !hasMoreProducts.value) return;
  isLoadingMore.value = true;
  setTimeout(() => {
    displayedCount.value += itemsPerPage;
    isLoadingMore.value = false;
  }, 400);
}

function setupInfiniteScroll() {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMoreProducts.value)
        loadMoreProducts();
    },
    { rootMargin: "300px" },
  );
  if (scrollTrigger.value) observer.observe(scrollTrigger.value);
}

function getProductImage(product) {
  if (!product) return "https://placehold.co/400";
  const img = product.image || product.images?.[0]?.src;
  if (!img) return "https://placehold.co/400";
  if (img.startsWith("data:")) return "https://placehold.co/400"; // legacy base64 — skip
  if (img.startsWith("http")) return img;
  return `${BACKEND_URL}/${img.replace(/^\//, "")}`;
}

function discountedPrice(p) {
  const d = Number(p.discount || 0);
  return d ? Math.round(p.price * (1 - d / 100)) : p.price;
}

function addToCart(product) {
  cart.addToCart({ ...product, id: product._id || product.id, quantity: 1 });
}
</script>

<style scoped>
.marketplace {
  background: #f8f9fa;
  min-height: 100vh;
}

/* --- Seller Search Results --- */
.seller-search-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 16px;
}

.seller-search-card .card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.seller-search-card .card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1) !important;
}

.seller-avatar-circle {
  width: 68px;
  height: 68px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
}

.seller-avatar-circle img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.seller-avatar-initial {
  color: #fff;
  font-size: 28px;
  font-weight: 700;
}

/* --- Hero Row: Banner + Best Sellers side by side --- */
.hero-row {
  display: flex;
  gap: 16px;
  min-height: 360px;
}

.hero-banner {
  flex: 0 0 52%;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

.hero-bestseller {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
  overflow: hidden;
}

.bestseller-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.bestseller-card .card {
  border-radius: 10px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.bestseller-card .card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08) !important;
}
.bestseller-card .card-img-top {
  height: 120px;
  object-fit: contain;
  background: #fff;
  padding: 6px;
}

.banner-swiper {
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.banner-slide {
  width: 100%;
  height: 100%;
  position: relative;
}

.banner-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ปรับแต่งปุ่มเลื่อนซ้าย-ขวาแบบบังคับแสดงผล (Force Display) */
.banner-swiper :deep(.swiper-button-next),
.banner-swiper :deep(.swiper-button-prev) {
  background: rgba(0, 0, 0, 0.5);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex !important;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: white !important;
}

/* บังคับซ่อนลูกศรเดิมของ Swiper เผื่อมันบั๊ก */
.banner-swiper :deep(.swiper-button-next)::after,
.banner-swiper :deep(.swiper-button-prev)::after {
  display: none !important;
}

/* สร้างลูกศรใหม่โดยใช้ Unicode ที่ชัวร์ 100% */
.banner-swiper :deep(.swiper-button-next)::before {
  content: "\276F" !important;
  font-size: 14px !important;
  font-weight: bold !important;
  display: block !important;
  color: white !important;
  font-family: Arial, sans-serif !important;
}

.banner-swiper :deep(.swiper-button-prev)::before {
  content: "\276E" !important;
  font-size: 14px !important;
  font-weight: bold !important;
  display: block !important;
  color: white !important;
  font-family: Arial, sans-serif !important;
}

.banner-swiper :deep(.swiper-button-next):hover,
.banner-swiper :deep(.swiper-button-prev):hover {
  background: rgba(0, 0, 0, 0.8);
  transform: scale(1.1);
}

.banner-swiper :deep(.swiper-pagination) {
  bottom: 10px;
}

.banner-swiper :deep(.swiper-pagination-bullet) {
  width: 8px;
  height: 8px;
  background: white;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.banner-swiper :deep(.swiper-pagination-bullet-active) {
  opacity: 1;
  background: #ff4c3b;
  width: 20px;
  border-radius: 4px;
}

/* --- Category Dropdown --- */
.category-dropdown-wrapper {
  position: relative;
  flex-shrink: 0;
}

.btn-category-dropdown {
  background: #ff4c3b;
  color: white;
  border: none;
  padding: 9px 18px;
  border-radius: 8px;
  font-size: 14px;
  white-space: nowrap;
  transition: all 0.2s ease;
}
.btn-category-dropdown:hover {
  background: #e6392a;
  color: white;
}

.category-dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 380px;
  max-width: 500px;
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  z-index: 1050;
  overflow: hidden;
}

.dropdown-body {
  max-height: 400px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #ddd transparent;
}
.dropdown-body::-webkit-scrollbar {
  width: 4px;
}
.dropdown-body::-webkit-scrollbar-thumb {
  background: #ddd;
  border-radius: 10px;
}

.category-grid {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.category-dropdown-item {
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
  font-size: 14px;
}
.category-dropdown-item:hover {
  background: #fff1f0;
  color: #ff4c3b;
}

.cat-dd-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.custom-checkbox:checked {
  background-color: #ff4c3b;
  border-color: #ff4c3b;
}

/* Dropdown animation */
.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Selected category tags */
.badge-tag {
  background: #fff1f0;
  color: #ff4c3b;
  border: 1px solid #ffd6d2;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
}
.btn-tag-remove {
  background: none;
  border: none;
  color: #ff4c3b;
  padding: 0;
  margin-left: 2px;
  cursor: pointer;
  font-size: 11px;
}
.btn-tag-remove:hover {
  color: #c0392b;
}

/* Product Grid & Cards */
.product-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
}

.product-card .card {
  transition: transform 0.3s, box-shadow 0.3s;
  border-radius: 12px;
  overflow: hidden;
}

.product-card .card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.08) !important;
}

.card-img-top {
  height: 220px;
  object-fit: contain;
  background: #fff;
  padding: 10px;
}
.price-text {
  color: #ff4c3b;
  font-size: 17px;
  font-weight: 700;
}

.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 13.5px;
  height: 40px;
  line-height: 1.4;
}

.badge-sale {
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff4c3b;
  color: white;
  padding: 2px 8px;
  font-size: 10px;
  font-weight: bold;
  border-radius: 4px;
  z-index: 1;
}

.btn-cart {
  background: #ff4c3b;
  color: white;
  border: none;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-cart:hover {
  transform: scale(1.1);
  background: #e6392a;
}

@media (max-width: 1400px) {
  .product-grid {
    grid-template-columns: repeat(5, 1fr);
  }
  .bestseller-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
@media (max-width: 1100px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
  .hero-row {
    flex-direction: column;
  }
  .hero-banner {
    flex: none;
    height: 220px;
  }
  .bestseller-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
@media (max-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .bestseller-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero-banner {
    height: 180px;
  }
}
</style>
