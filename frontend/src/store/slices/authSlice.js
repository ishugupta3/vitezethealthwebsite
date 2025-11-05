import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '../../services/apiService';

// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
  loginResponse: null, // Store login response for OTP verification
};

// Async thunks
export const sendOtp = createAsyncThunk(
  'auth/sendOtp',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.sendOtp(data);
      if (response.status) {
        return response; // Return full response including last_otp
      } else {
        return rejectWithValue(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const sendOtpForRegistration = createAsyncThunk(
  'auth/sendOtpForRegistration',
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiService.sendOtpForRegistration(data);
      if (response.status) {
        return response;
      } else {
        return rejectWithValue(response.message || 'Failed to send OTP');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (data, { rejectWithValue, getState }) => {
    const state = getState();
    const loginResponse = state.auth.loginResponse;

    if (!loginResponse) {
      return rejectWithValue('No login response found. Please login first.');
    }

    const storedOtp = loginResponse.last_otp || loginResponse.user_detail?.last_otp;
    const enteredOtp = data.otp;

    console.log('Stored OTP:', storedOtp);
    console.log('Entered OTP:', enteredOtp);

    if (storedOtp && enteredOtp === storedOtp.toString()) {
      // OTP matches, return the stored login response data
      return {
        status: true,
        message: 'OTP verified successfully',
        user_detail: loginResponse.user_detail,
        token: loginResponse.token,
        last_otp: loginResponse.last_otp
      };
    } else {
      return rejectWithValue('Invalid OTP. Please try again.');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await apiService.register(userData);
      if (response.status) {
        return response;
      } else {
        return rejectWithValue(response.message || 'Registration failed');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.logout();
      return response;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      sessionStorage.setItem('token', action.payload);
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
      state.loginResponse = null; // Clear stored login response
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user_mobile');
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    initializeAuth: (state) => {
      const token = sessionStorage.getItem('token');
      const userMobile = sessionStorage.getItem('user_mobile');

      if (token && userMobile) {
        state.token = token;
        state.isAuthenticated = true;
        // Note: User details would need to be fetched separately
      }
    },
  },
  extraReducers: (builder) => {
    // Login User
    builder
      .addCase(sendOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.loading = false;
        // Store the login response for OTP verification
        state.loginResponse = action.payload;
        console.log('Login response stored:', action.payload);
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.loading = false;
        console.log('OTP verification response:', action.payload);

        // Use the user_detail and token from the payload (which comes from stored login response)
        const payload = action.payload;
        const userDetail = payload.user_detail;
        const token = payload.token;

        console.log('Extracted userDetail:', userDetail);
        console.log('Extracted token:', token);

        if (userDetail && token) {
          state.isAuthenticated = true;
          state.user = userDetail;
          state.token = token;
          sessionStorage.setItem('token', token);
          if (userDetail.user_mobile || userDetail.mobile_number) {
            sessionStorage.setItem('user_mobile', userDetail.user_mobile || userDetail.mobile_number);
          }
          // Clear the stored login response after successful verification
          state.loginResponse = null;
          console.log('User authenticated successfully');
        } else {
          // If response doesn't contain expected data, treat as error
          state.error = 'OTP verification failed - invalid response';
          state.isAuthenticated = false;
          console.log('Authentication failed - missing user data or token');
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Ensure user is not authenticated on verification failure
        state.isAuthenticated = false;
      })

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        // Registration successful, but user needs to login
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user_mobile');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Even if logout fails on server, clear local state
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user_mobile');
      });
  },
});

export const { setUser, setToken, clearAuth, setLoading, setError, initializeAuth } = authSlice.actions;
export default authSlice.reducer;
