<template>
    <Header/>
  <div>
    <WidgetsBreadcrumbs title="wishlist" />
    <section class="wishlist-section section-b-space">
      <div class="container">
        <div class="mb-3">
          <button @click="$router.back()" class="btn btn-sm btn-outline-secondary">
            <i class="ti-arrow-left"></i> Back
          </button>
        </div>
        <div class="row">
          <div class="col-12">
            <div class="table-responsive">
              <table class="table cart-table table-responsive" v-if="wishlist.length">
                <thead>
                  <tr class="table-head">
                    <th scope="col">image</th>
                    <th scope="col">product name</th>
                    <th scope="col">price</th>
                    <th scope="col">availability</th>
                    <th scope="col">action</th>
                  </tr>
                </thead>
                <tbody v-for="(item, index) in wishlist" :key="index">
                  <tr>
                    <td>
                      <nuxt-link :to="{ path: '/product/sidebar/' + (item._id || item.id) }">
                        <img :src='getProductImage(item)' alt="" style="height: 60px; object-fit: contain;">
                      </nuxt-link>
                    </td>
                    <td>
                      <nuxt-link :to="{ path: '/product/sidebar/' + (item._id || item.id) }">{{ item.name || item.title }}</nuxt-link>
                      <div class="mobile-cart-content">
                        <ul>
                          <li>
                            <p>{{ item.stock > 0 ? 'in stock' : 'out of stock' }}</p>
                          </li>
                          <li>
                            <h2 class="td-color">{{ curr.symbol }}{{ (item.price * curr.curr).toFixed(2)  }}
                            </h2>
                          </li>
                          <li>
                            <h2 class="td-color">
                              <a href="#" class="icon mr-1">
                                <i class="ti-close" @click="removeWishlistItem(item)"></i>
                              </a>
                              <a href="#" class="cart">
                                <i class="ti-shopping-cart" @click="addToCart(item)"></i>
                              </a>
                            </h2>
                          </li>
                        </ul>
                      </div>
                    </td>
                    <td>
                      <h2>{{ curr.symbol }}{{ item.price * curr.curr  }}</h2>
                    </td>
                    <td>
                      <p>in stock</p>
                    </td>
                    <td>
                      <a href="javascript:void(0)" class="icon me-3" @click="removeWishlistItem(item)">
                        <i class="ti-close"></i>
                      </a>
                      <a href="javascript:void(0)" class="cart" @click="addToCart(item)">
                        <i class="ti-shopping-cart"></i>
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div class="row wishlist-buttons" v-if="wishlist.length">
          <div class="col-12">
            <nuxt-link :to="{ path: '/' }" :class="'btn btn-solid'">continue shopping</nuxt-link>
          </div>
        </div>
        <div class="col-sm-12 empty-cart-cls text-center" v-if="!wishlist.length">
          <img src='/images/empty-wishlist.png' class="img-fluid" alt="empty cart" />
          <h3 class="mt-3 empty-text">
            <strong>Your Wishlist is Empty</strong>
          </h3>
          <div class="col-12">
            <nuxt-link :to="{ path: '/' }" class="btn btn-solid">continue shopping</nuxt-link>
          </div>
        </div>
      </div>
    </section>
  
  </div>
  <Footer />
</template>
<script>
import { useProductStore } from '~~/store/products'
import { useCartStore } from '~~/store/cart'
export default {
  data(){
    return{
      whishItem:[]
    }
  },
  computed: {

    wishlist() {
      if(!useProductStore().wishlistItems.length)
      {
        this.whishItem.forEach(item=>{
    useProductStore().addToWishlist(item)  
  })
 
  return useProductStore().wishlistItems
      }
      else{
        return useProductStore().wishlistItems
      }
    },
    curr() {
      return useProductStore().changeCurrency
    }
  },
  methods: {
    getImgUrl(path) {
      return ('/images/' + path)
    },
    getProductImage(product) {
      if (!product) return 'https://placehold.co/400'
      if (product.image) {
        if (product.image.startsWith('http')) return product.image
        return `/images/${product.image}`
      }
      if (product.images && product.images[0]) {
        const img = product.images[0].src || product.images[0]
        return `/images/${img}`
      }
      return 'https://placehold.co/400'
    },
    removeWishlistItem: function (product) {
      useProductStore().removeWishlistItem(product)
    },
  
  },
  setup(){
    const addToCart = (product) => {
      useCartStore().addToCart(product)
    }
    return {
      addToCart
    }
  },
  mounted(){
    this.whishItem = JSON.parse(localStorage.getItem('whish'))
   
  }
}
</script>
