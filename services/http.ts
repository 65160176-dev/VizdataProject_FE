import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '~/store/auth';

// ✅ 2. แก้ Port เป็น 3001 และเติม /api
let API_BASE_URL = 'http://localhost:3001/api';

// Function to set API URL from runtime config
export const initializeHttpClient = (apiUrl: string) => {
  API_BASE_URL = apiUrl;
  httpClient.defaults.baseURL = apiUrl;
};

// Create Axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // ✅ 3. ดึง Token จาก Store โดยตรง (แม่นยำกว่า)
    if (process.client) {
      const authStore = useAuthStore();
      // ลองดึงจากหลายๆ ตัวแปรเผื่อคุณตั้งชื่อไม่เหมือนกัน
      const token = authStore.token || localStorage.getItem('token') || localStorage.getItem('auth_token');

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        // console.log('[Auth] Token attached:', token.substring(0, 10) + '...'); // Debug ดูว่า Token มาไหม
      }
    }

    // console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error('[HTTP Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor
httpClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // console.error(
      //   `[HTTP Error] ${error.response.status} ${error.config?.url}`,
      //   error.response.data
      // );

      switch (error.response.status) {
        case 401:
          console.warn('Unauthorized - Token expired or invalid');
          // Optional: สั่ง Logout ถ้า Token ตาย
          // const authStore = useAuthStore();
          // authStore.logout();
          break;
        case 403:
          console.warn('Forbidden - insufficient permissions');
          break;
        case 404:
          console.warn('Resource not found');
          break;
        case 500:
          console.error('Internal server error');
          break;
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;

// Named export for convenience
export { httpClient };