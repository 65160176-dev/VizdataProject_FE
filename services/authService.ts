import { $fetch } from 'ofetch';

const API_BASE_URL = 'https://vizdataprojectbe-production.up.railway.app/api';

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  userType?: number; // 0 = seller, 1 = user
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      id: string;
      username: string;
      email: string;
      userType: number;
      isActive: boolean;
    };
    token: string;
  };
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    console.log('authService.register called with:', data);
    try {
      const response = await $fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        body: data,
      });
      console.log('authService.register response:', response);
      return response;
    } catch (error) {
      console.error('authService.register error:', error);
      throw error;
    }
  },

  async login(data: LoginData): Promise<AuthResponse> {
    console.log('authService.login called with:', data);
    try {
      const response = await $fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: data,
      });
      console.log('authService.login response:', response);
      return response;
    } catch (error) {
      console.error('authService.login error:', error);
      throw error;
    }
  },

  async resetPassword(data: { email: string; password: string; confirmPassword: string; }) {
    console.log('authService.resetPassword called with:', data);
    try {
      const response = await $fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        body: data,
      });
      console.log('authService.resetPassword response:', response);
      return response;
    } catch (error) {
      console.error('authService.resetPassword error:', error);
      throw error;
    }
  },

  setToken(token: string) {
    if (import.meta.client) {
      localStorage.setItem('token', token);
    }
  },

  getToken(): string | null {
    if (import.meta.client) {
      return localStorage.getItem('token');
    }
    return null;
  },

  removeToken() {
    if (import.meta.client) {
      localStorage.removeItem('token');
    }
  },
};
