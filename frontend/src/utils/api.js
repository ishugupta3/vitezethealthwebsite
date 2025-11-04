import axios from 'axios';

// Base API URL
const API_BASE_URL = 'https://apihealth.zethealth.com';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user_detail');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// API endpoints
export const endpoints = {
  // Authentication
  auth: {
    checkMobile: '/v1/Authenticate/checkmobile',
    login: '/v1/Authenticate/login-user',
    register: '/v1/Authenticate/register-user',
    verifyOtp: '/v1/Authenticate/login-user',
    getProfile: '/v1/Authenticate/common/get-profile',
    logout: '/v1/Authenticate/common/logout-user',
  },

  // Home
  home: {
    getHome: '/v1/Authenticate/get-home',
  },

  // Packages and Tests
  packages: {
    getList: '/v1/Authenticate/get-package-list',
    getLabTests: '/v1/Authenticate/get-lab-test-list',
    getLabTestsV2: '/v1/Authenticate/get-lab-test-list-v2',
  },

  // Cart
  cart: {
    getCart: '/v1/Authenticate/get-cart',
    addToCart: '/v1/Authenticate/cart-create-or-update',
    clearCart: '/v1/Authenticate/clear-cart-list',
  },

  // Bookings
  booking: {
    getList: '/v1/Authenticate/get-booking-list',
    bookNow: '/v1/Authenticate/book-now',
    getDetails: '/v1/Authenticate/get-booking-details',
  },

  // Shared APIs (v2)
  shared: {
    getHome: '/v2/express/get-home',
    getPackages: '/v2/express/get-package-list',
    getLabTests: '/v2/express/get-lab-test-list',
  },
};
