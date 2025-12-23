import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// API Configuration - will be set during initialization
let API_BASE_URL = 'http://localhost:3000';

// Function to set API URL from runtime config
export const initializeHttpClient = (apiUrl: string) => {
  API_BASE_URL = apiUrl;
  httpClient.defaults.baseURL = apiUrl;
};

// Create Axios instance
const httpClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Enable credentials for CORS
});

// Request interceptor
httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add authentication token if available
    if (process.client) {
      const token = localStorage.getItem('auth_token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    console.log(`[HTTP Request] ${config.method?.toUpperCase()} ${config.url}`);
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
    console.log(`[HTTP Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error(
        `[HTTP Error] ${error.response.status} ${error.config?.url}`,
        error.response.data
      );
      
      // Handle specific error codes
      switch (error.response.status) {
        case 401:
          console.warn('Unauthorized - redirecting to login');
          // Handle unauthorized access (e.g., redirect to login)
          if (process.client) {
            // You can add navigation logic here
            // navigateTo('/login');
          }
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
    } else if (error.request) {
      // Request was made but no response received
      console.error('[HTTP Error] No response received', error.request);
    } else {
      // Something else happened
      console.error('[HTTP Error] Request setup failed', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default httpClient;
