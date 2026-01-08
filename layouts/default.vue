<template>
  <div>
    <div id="body-content" />

     <slot />
    <WidgetsLayoutSetting />
    <ClientOnly>
      <div class="tap-top top-cls" :class="top?'d-block':'d-none'" @click="totop">
        <div>
          <i class="fa fa-angle-double-up"></i>
        </div>
      </div>
    </ClientOnly>

  </div>


</template>
<script>
import { useAuthStore } from '~/store/auth'

export default {
  head() {
    return {
      title: 'BDN Ecommerce | Online Shop'
    }
  },
  data(){
    return{
      top:false
    }
  },
  methods:{
    totop(){
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    handelscroll(){
      if (window.scrollY > 600) {
        this.top = true
  }
  else {
    this.top = false
  }
    }
  },
    async mounted(){
       window.addEventListener('scroll', this.handelscroll)
       // Ensure auth state (including avatar) is initialized on client mount
       try {
         const auth = useAuthStore()
         if (auth && typeof auth.initAuth === 'function') {
           await auth.initAuth()
         }
       } catch (e) {
         // silent
       }
    },

}
</script>