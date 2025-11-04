

import api, { endpoints } from './api';

export const authApi = {
  checkMobile: async (mobile_number) => {
    try {
      const response = await api.post(endpoints.auth.checkMobile, { mobile_number });
      return response.data;
    } catch (error) {
      return { status: false, message: error.response?.data?.message || 'Error checking mobile' };
    }
  },

  loginUser: async (mobile_number, user_type = 'User') => {
    try {
      const response = await api.post(endpoints.auth.login, { mobile_number, user_type, device_id: 'web-app' });
      return response.data;
    } catch (error) {
      return { status: false, message: error.response?.data?.message || 'Error sending OTP' };
    }
  },

  registerUser: async (data) => {
    try {
      console.log("authApi.registerUser called with data:", data);
      const payload = {
        user_name: data.name,
        user_email: data.email,
        mobile_number: data.mobile,
        user_gender: data.gender,
        device_id: 'user register'
      };
      console.log("Sending payload to API:", payload);
      const response = await api.post(endpoints.auth.register, payload);
      console.log("authApi.registerUser response:", response.data);
      return response.data;
    } catch (error) {
      console.error("authApi.registerUser error:", error);
      console.error("Error response:", error.response);
      console.error("Error data:", error.response?.data);
      return { status: false, message: error.response?.data?.message || 'Registration failed' };
    }
  },

  verifyOtp: async (mobile_number, otp) => {
    try {
      const response = await api.post(endpoints.auth.verifyOtp, { mobile_number, otp, user_type: 'User' });
      return response.data;
    } catch (error) {
      return { status: false, message: error.response?.data?.message || 'OTP verification failed' };
    }
  },

  sendOtpForRegistration: async (data) => {
    try {
      const response = await api.post(endpoints.auth.register, data);
      return response.data;
    } catch (error) {
      return { status: false, message: error.response?.data?.message || 'Error sending OTP for registration' };
    }
  },

  getProfile: async () => {
    try {
      const response = await api.get(endpoints.auth.getProfile);
      return response.data;
    } catch (error) {
      return { status: false, message: error.response?.data?.message || 'Error fetching profile' };
    }
  },

  logout: async () => {
    try {
      const response = await api.get(endpoints.auth.logout);
      return response.data;
    } catch (error) {
      return { status: false, message: error.response?.data?.message || 'Error logging out' };
    }
  },
};
