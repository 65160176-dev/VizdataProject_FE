import {defineNuxtPlugin} from '#app'
import Toast, {POSITION, useToast} from "vue-toastification";
import "vue-toastification/dist/index.css";
import VueEasyLightbox from 'vue-easy-lightbox'

import VueScrollTo from 'vue-scrollto'

const toast = useToast();


export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.use(Toast);

    nuxtApp.provide('showToast', (params) => toast[params.type||'sucsess'](params.msg||'default', {timeout: params.time||2000, position:params.position||'top-right'}))

    nuxtApp.vueApp.use(VueScrollTo)
      
  nuxtApp.vueApp.use(VueEasyLightbox)

})
