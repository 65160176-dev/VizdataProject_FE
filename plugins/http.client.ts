import { defineNuxtPlugin, useRuntimeConfig } from '#app';
import { initializeHttpClient } from '~/services/http';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const apiUrl = config.public.apiUrl as string;
  
  // Initialize the HTTP client with the API URL from runtime config
  initializeHttpClient(apiUrl);
  
  console.log(`[HTTP Plugin] API Base URL: ${apiUrl}`);
});
