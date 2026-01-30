// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  build: {
    transpile: ['ufo']
  },

  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Multikart Ecommerce | Vuejs shopping theme',
      meta: [
        { name: 'description', content: 'My amazing site.' }
      ],
      script: [
        { src: 'https://www.paypal.com/sdk/js?client-id=test&currency=USD' },
        { src: 'https://checkout.stripe.com/checkout.js' },

      ],

    },

  },

  // Frontend dev server configuration
  devServer: {
    port: 3000,
  },

  css: ["@/assets/scss/app.scss"],
  ssr:false,

  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3001', // Backend API port
    }
  },

  modules: [
    'nuxt-icon',
    '@nuxt/image-edge',
    '@vueuse/nuxt',
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],


  ],

 
  plugins: [

    { src: './plugins/useBootstrap.client.ts', mode: 'client' },
    { src: './plugins/showToast.client.js', mode: 'client' },
    { src: './plugins/affiliate.client.ts', mode: 'client' },
    { src: './plugins/affiliate-tracker.client.js', mode: 'client' },
  ],

  compatibilityDate: '2025-03-26',
})