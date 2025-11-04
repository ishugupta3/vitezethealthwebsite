import { apiService } from '../services/apiService';

export const homeApi = {
  getHomeData: async (data = {}) => {
    try {
      const response = await apiService.getHomeData({
        token: localStorage.getItem('token') || '',
        device_id: data.device_id || 'web-device-' + Date.now(),
        plateform: data.plateform || 'Web',
        app_version: data.app_version || '1.0.0',
      });
      return response;
    } catch (error) {
      return { status: false, message: error.message || 'Error fetching home data' };
    }
  },

  getPackages: async () => {
    try {
      const response = await apiService.getPackages();
      return response;
    } catch (error) {
      return { status: false, message: error.message || 'Error fetching packages' };
    }
  },

  getLabTests: async () => {
    try {
      const response = await apiService.getLabTests();
      return response;
    } catch (error) {
      return { status: false, message: error.message || 'Error fetching lab tests' };
    }
  },
};

export const cartApi = {
  getCart: async () => {
    try {
      const response = await apiService.getCart();
      return response;
    } catch (error) {
      return { status: false, message: error.message || 'Error fetching cart' };
    }
  },

  addToCart: async (data) => {
    try {
      const response = await apiService.addToCart(data);
      return response;
    } catch (error) {
      return { status: false, message: error.message || 'Error adding to cart' };
    }
  },

  clearCart: async () => {
    try {
      const response = await apiService.clearCart();
      return response;
    } catch (error) {
      return { status: false, message: error.message || 'Error clearing cart' };
    }
  },
};

export const bookingApi = {
  getBookings: async () => {
    try {
      const response = await apiService.getBookingList();
      return response;
    } catch (error) {
      return { status: false, message: error.message || 'Error fetching bookings' };
    }
  },

  bookNow: async (data) => {
    try {
      const response = await apiService.bookNow(data);
      return response;
    } catch (error) {
      return { status: false, message: error.message || 'Error booking' };
    }
  },

  getBookingDetails: async (data) => {
    try {
      const response = await apiService.getBookingDetails(data.booking_id);
      return response;
    } catch (error) {
      return { status: false, message: error.message || 'Error fetching booking details' };
    }
  },
};
