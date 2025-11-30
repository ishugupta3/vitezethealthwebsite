import axios from 'axios';
import { BackendEndpoints } from '../utils/backendEndpoints';


// Auth API instance (login/register/OTP)
const authApi = axios.create({
  baseURL: BackendEndpoints.AUTH_BASE_URL, // proxied via /api/auth
  timeout: 30000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

// General API instance (packages, labs, cart, booking)
const api = axios.create({
  baseURL: BackendEndpoints.API_BASE_URL, // proxied via /api
  timeout: 30000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

const attachToken = (config) => {
  let token = null;
  const loginResponse = sessionStorage.getItem('loginResponse');
  if (loginResponse) {
    try {
      const parsed = JSON.parse(loginResponse);
      token = parsed.token;
    } catch (err) {
      console.error('Error parsing login response:', err);
    }
  }
  if (!token) {
    token = sessionStorage.getItem('token');
  }
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
};

[authApi, api].forEach((instance) => {
  instance.interceptors.request.use(attachToken, (error) => Promise.reject(error));
});

[authApi, api].forEach((instance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        // Token expired/invalid
        if (window.location.pathname !== '/booking') {
          sessionStorage.removeItem('token');
          sessionStorage.removeItem('user_mobile');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );
});


class ApiService {
  async sendOtp(data) { return authApi.post(BackendEndpoints.SEND_OTP, data).then(r => r.data); }
  async verifyOtp(data) { return authApi.post(BackendEndpoints.VERIFY_OTP, data).then(r => r.data); }
  async register(data) { return authApi.post(BackendEndpoints.REGISTER, data).then(r => r.data); }
  async logout() { return authApi.post(BackendEndpoints.LOGOUT).then(r => r.data); }

  // ---------------- HOME APIs ----------------
  async getHomeData(data) { return api.post(BackendEndpoints.GET_HOME, data).then(r => r.data); }
  async getNotifications() { return api.get(BackendEndpoints.GET_NOTIFICATION).then(r => r.data); }

  // ---------------- PACKAGES & LABS ----------------
  async getPackages() { return api.get(BackendEndpoints.GET_PACKAGE_LIST).then(r => r.data); }
  async getLabTests() { return api.get(BackendEndpoints.GET_LAB_TEST_LIST).then(r => r.data); }
  async getTestProfile(testId) { return api.get(`${BackendEndpoints.GET_TEST_PROFILE}?test_id=${testId}`).then(r => r.data); }
  async getLabList() { return api.post(BackendEndpoints.GET_LAB_LIST, {}).then(r => r.data); }
  async getLabListV2(params) { return api.get(BackendEndpoints.GET_LAB_LIST_V2, { params }).then(r => r.data); }
  async getLabWiseTests(labId) { return api.get(`${BackendEndpoints.LAB_WISE_TEST}?lab_id=${labId}`).then(r => r.data); }

  // ---------------- PATIENT APIs ----------------
  async addPatient(patientData) { return api.post(BackendEndpoints.ADD_PATIENT, patientData).then(r => r.data); }
  async getPatientList() { return api.get(BackendEndpoints.GET_PATIENT_LIST).then(r => r.data); }

  // ---------------- CART APIs ----------------
  async addToCart(cartData) { return api.post(BackendEndpoints.ADD_TO_CART, cartData).then(r => r.data); }
  async getCart() { return api.get(BackendEndpoints.GET_CART).then(r => r.data); }
  async clearCart() { return api.get(BackendEndpoints.CLEAR_CART).then(r => r.data); }

  // ---------------- BOOKING APIs ----------------
  async getSlots(bookingData) { return api.post(BackendEndpoints.GET_SLOT, bookingData).then(r => r.data); }
  async bookNow(bookingData) { return api.post(BackendEndpoints.BOOK_NOW, bookingData).then(r => r.data); }
  async getBookingList() { return api.get(BackendEndpoints.GET_BOOKING_LIST).then(r => r.data); }
  async getBookingDetails(bookingId) { return api.get(`${BackendEndpoints.GET_BOOKING_DETAILS}?booking_id=${bookingId}`).then(r => r.data); }
  async bookingAfterPayment(paymentData) { return api.post(BackendEndpoints.BOOKING_AFTER_PAYMENT, paymentData).then(r => r.data); }

  // ---------------- PRESCRIPTION APIs ----------------
  async uploadPrescription(formData) {
    return api.post(BackendEndpoints.UPLOAD_PRESCRIPTION, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(r => r.data);
  }
  async getPrescriptions() { return api.get(BackendEndpoints.GET_PRESCRIPTION).then(r => r.data); }

  // ---------------- REPORT APIs ----------------
  async getReports() { return api.get(BackendEndpoints.GET_REPORT).then(r => r.data); }

  // ---------------- ADDRESS APIs ----------------
  async getAddressList() { return api.get(BackendEndpoints.GET_ADDRESS_LIST).then(r => r.data); }
  async addAddress(addressData) { return api.post(BackendEndpoints.ADD_ADDRESS, addressData).then(r => r.data); }
  async deleteAddress(addressId) { return api.post(BackendEndpoints.ADDRESS_DELETE, { address_id: addressId }).then(r => r.data); }

  // ---------------- CMS ----------------
  async getCmsContent(slug) {
    return axios.post(`${BackendEndpoints.BASE_URL}${BackendEndpoints.CMS}`, { slug }, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      timeout: 30000,
    }).then(r => r.data);
  }

  // ---------------- CONTACT ----------------
  async contactUs(contactData) { return api.post(BackendEndpoints.CONTACT_US, contactData).then(r => r.data); }

  // ---------------- COUPONS & PAYMENTS ----------------
  async applyCoupon(couponData) { return api.post(BackendEndpoints.APPLY_COUPON, couponData).then(r => r.data); }
  async getOrderKey() { return api.get(BackendEndpoints.GET_ORDER_KEY).then(r => r.data); }
  async getWalletTransaction() { return api.get(BackendEndpoints.GET_WALLET_TRANSACTION).then(r => r.data); }
  async rechargeWallet(amount) { return api.post(BackendEndpoints.RECHARGE_WALLET, { amount }).then(r => r.data); }
  async checkBalanceWithPayment(paymentData) { return api.post(BackendEndpoints.CHECK_BALANCE_WITH_PAYMENT, paymentData).then(r => r.data); }

  // ---------------- DELETE & UPDATE ----------------
  async deleteAccount() { return api.post(BackendEndpoints.DELETE_ACCOUNT).then(r => r.data); }
  async updateProfile(profileData) { return api.post(BackendEndpoints.UPDATE_PROFILE, profileData).then(r => r.data); }

  // ---------------- SEARCH ----------------
  async searchByCity(cityName) { return api.get(`${BackendEndpoints.SEARCH_BY_CITY}?city=${cityName}`).then(r => r.data); }

  // --------------- Search by tests --------------
  async searchTests(query, cityName) {
  try {
    const response = await api.get(
      `/search?q=${encodeURIComponent(query)}&cityName=${encodeURIComponent(cityName)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in searchTests:", error);
    throw error;
  }
}

async searchAllTests(query, cityName) {
  return api.get(`/search?q=${query}&cityName=${cityName}`)
           .then(r => r.data);
}

  // --------------- Popular Tests ----------------
  async getAllTests(cityName) {
  return axios.get(`${BackendEndpoints.API_BASE_URL}/tests/all-tests`, {
    params: { city: cityName },
    headers: { 'Cache-Control': 'no-cache' },
  }).then(r => r.data);
}

  // ---------------- RADIOLOGY TESTS ----------------
  async getRadiologyTests(cityName) {
  try {
    // Make sure we hit the proxy /api/tests/radiology
    const response = await api.get(`/tests/radiology`, { params: { city: cityName.toUpperCase() } });
    const data = response.data;

    // Normalize so frontend expects { status, result: { lab_tests: [] } }
    const lab_tests = Array.isArray(data) ? data : data?.lab_tests || [];
    return { status: 200, result: { lab_tests } };
  } catch (error) {
    console.error('Error fetching radiology tests:', error);
    return { status: 500, result: { lab_tests: [] } };
  }
}



  // ---------------- POPULAR PACKAGES ----------------
  async getPopularPackages(cityName, pincode) {
    return api.get(`/tests/popular-package?pincode=${pincode}&cityName=${cityName}`).then(r => r.data);
  }

  // ---------------- ERROR HANDLER ----------------
  handleError(error) {
    if (error.response) {
      const resp = error.response.data || {};
      const msg = resp.message || resp.error || resp.detail || `HTTP ${error.response.status}`;
      console.error('API ERROR', { status: error.response.status, url: error.config.url, method: error.config.method, data: resp });
      return new Error(msg);
    } else if (error.request) {
      console.error('Network error', error.request);
      return new Error('Network error - check your internet connection');
    } else {
      console.error('Unknown error', error.message);
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export const apiService = new ApiService();
export { BackendEndpoints };