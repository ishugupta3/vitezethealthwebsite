import axios from "axios";
import { BackendEndpoints } from "../utils/backendEndpoints";

// ------------------------ AXIOS INSTANCES ------------------------
const authApi = axios.create({
  baseURL: BackendEndpoints.AUTH_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const api = axios.create({
  baseURL: BackendEndpoints.API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ------------------------ TOKEN ATTACHER ------------------------
const attachToken = (config) => {
  try {
    let token = null;

    const loginResponse = sessionStorage.getItem("loginResponse");
    if (loginResponse) {
      const parsed = JSON.parse(loginResponse);
      token = parsed?.token;
    }

    if (!token) {
      token = sessionStorage.getItem("token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (err) {
    console.error("Token parse error:", err);
  }

  return config;
};

[authApi, api].forEach((instance) => {
  instance.interceptors.request.use(attachToken, (error) => Promise.reject(error));
});

// ------------------------ 401 HANDLER ------------------------
[authApi, api].forEach((instance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("user_mobile");
        if (window.location.pathname !== "/booking") {
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
});

// ------------------------ API SERVICE CLASS ------------------------
class ApiService {
  // AUTH
  sendOtp(data) { return authApi.post(BackendEndpoints.SEND_OTP, data).then(r => r.data); }
  verifyOtp(data) { return authApi.post(BackendEndpoints.VERIFY_OTP, data).then(r => r.data); }
  register(data) { return authApi.post(BackendEndpoints.REGISTER, data).then(r => r.data); }
  logout() { return authApi.post(BackendEndpoints.LOGOUT).then(r => r.data); }

  // HOME
  getHomeData(data) { return api.post(BackendEndpoints.GET_HOME, data).then(r => r.data); }
  getNotifications() { return api.get(BackendEndpoints.GET_NOTIFICATION).then(r => r.data); }

  // PACKAGES & LABS
  getPackages() { return api.get(BackendEndpoints.GET_PACKAGE_LIST).then(r => r.data); }
  getLabTests() { return api.get(BackendEndpoints.GET_LAB_TEST_LIST).then(r => r.data); }
  getTestProfile(testId) { return api.get(`${BackendEndpoints.GET_TEST_PROFILE}?test_id=${testId}`).then(r => r.data); }
  getLabList() { return api.post(BackendEndpoints.GET_LAB_LIST, {}).then(r => r.data); }
  getLabListV2(params) { return api.get(BackendEndpoints.GET_LAB_LIST_V2, { params }).then(r => r.data); }
  getLabWiseTests(labId) { return api.get(`${BackendEndpoints.LAB_WISE_TEST}?lab_id=${labId}`).then(r => r.data); }

  // PATIENT
  addPatient(data) { return api.post(BackendEndpoints.ADD_PATIENT, data).then(r => r.data); }
  getPatientList() { return api.get(BackendEndpoints.GET_PATIENT_LIST).then(r => r.data); }

  // CART
  addToCart(data) { return api.post(BackendEndpoints.ADD_TO_CART, data).then(r => r.data); }
  getCart() { return api.get(BackendEndpoints.GET_CART).then(r => r.data); }
  clearCart() { return api.get(BackendEndpoints.CLEAR_CART).then(r => r.data); }

  // BOOKING
  getSlots(data) { return api.post(BackendEndpoints.GET_SLOT, data).then(r => r.data); }
  bookNow(data) { return api.post(BackendEndpoints.BOOK_NOW, data).then(r => r.data); }
  getBookingList() { return api.get(BackendEndpoints.GET_BOOKING_LIST).then(r => r.data); }
  getBookingDetails(id) { return api.get(`${BackendEndpoints.GET_BOOKING_DETAILS}?booking_id=${id}`).then(r => r.data); }
  bookingAfterPayment(data) { return api.post(BackendEndpoints.BOOKING_AFTER_PAYMENT, data).then(r => r.data); }

  // PRESCRIPTION
  uploadPrescription(formData) {
    return api.post(BackendEndpoints.UPLOAD_PRESCRIPTION, formData, {
      headers: { "Content-Type": "multipart/form-data" }
    }).then(r => r.data);
  }
  getPrescriptions() { return api.get(BackendEndpoints.GET_PRESCRIPTION).then(r => r.data); }

  // REPORTS
  getReports() { return api.get(BackendEndpoints.GET_REPORT).then(r => r.data); }

  // ADDRESS
  getAddressList() { return api.get(BackendEndpoints.GET_ADDRESS_LIST).then(r => r.data); }
  addAddress(data) { return api.post(BackendEndpoints.ADD_ADDRESS, data).then(r => r.data); }
  deleteAddress(id) { return api.post(BackendEndpoints.ADDRESS_DELETE, { address_id: id }).then(r => r.data); }

  // CMS
  getCmsContent(slug) {
    return axios.post(`${BackendEndpoints.BASE_URL}${BackendEndpoints.CMS}`, { slug }, {
      headers: { "Content-Type": "application/json", Accept: "application/json" }
    }).then(r => r.data);
  }

  // CONTACT
  contactUs(data) { return api.post(BackendEndpoints.CONTACT_US, data).then(r => r.data); }

  // PAYMENT
  applyCoupon(data) { return api.post(BackendEndpoints.APPLY_COUPON, data).then(r => r.data); }
  getOrderKey() { return api.get(BackendEndpoints.GET_ORDER_KEY).then(r => r.data); }
  getWalletTransaction() { return api.get(BackendEndpoints.GET_WALLET_TRANSACTION).then(r => r.data); }
  rechargeWallet(amount) { return api.post(BackendEndpoints.RECHARGE_WALLET, { amount }).then(r => r.data); }
  checkBalanceWithPayment(data) { return api.post(BackendEndpoints.CHECK_BALANCE_WITH_PAYMENT, data).then(r => r.data); }

  // SEARCH
  searchByCity(city) { return api.get(`${BackendEndpoints.SEARCH_BY_CITY}?city=${city}`).then(r => r.data); }

  // SEARCH TESTS
  async searchTests(query, cityName) {
    try {
      const response = await api.get(`/search`, {
        params: { q: query, cityName }
      });
      return response.data;
    } catch (error) {
      console.error("Error in searchTests:", error);
      throw error;
    }
  }

  searchAllTests(query, cityName) {
    return api.get(`/search`, {
      params: { q: query, cityName }
    }).then(r => r.data);
  }

  // ALL TESTS
  getAllTests(city) {
    return axios.get(`${BackendEndpoints.API_BASE_URL}/tests/all-tests`, {
      params: { city },
      headers: { "Cache-Control": "no-cache" },
    }).then(r => r.data);
  }

  // RADIOLOGY TESTS ✔ (Fully Fixed)
  async getRadiologyTests(cityName) {
    try {
      const response = await api.get(`/tests/radiology`, {
        params: { city: cityName?.toLowerCase() }
      });

      const data = response.data;
      const lab_tests = Array.isArray(data)
        ? data
        : data?.lab_tests || [];

      return { status: 200, result: { lab_tests } };
    } catch (error) {
      console.error("Error fetching radiology tests:", error);
      return { status: 500, result: { lab_tests: [] } };
    }
  }

  // POPULAR PACKAGES
  getPopularPackages(city, pincode) {
    return api.get(`/tests/popular-package`, {
      params: { cityName: city, pincode }
    }).then(r => r.data);
  }

  // ERROR HANDLER
  handleError(error) {
    if (error.response) {
      const resp = error.response.data || {};
      const msg = resp.message || resp.error || resp.detail || `HTTP ${error.response.status}`;
      return new Error(msg);
    }
    if (error.request) {
      return new Error("Network error – check your internet");
    }
    return new Error(error.message || "Unexpected error");
  }
}

export const apiService = new ApiService();
export { BackendEndpoints };
