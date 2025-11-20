import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sendOtp, setError } from '../store/slices/authSlice';
import { clearToast } from '../store/slices/appSlice';
import InputField from '../components/InputField';
import Button from '../components/Button';
import appLogo from '../assets/logo/app_logo.png';

const LoginScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    mobile: '',
  });


  const [errors, setErrors] = useState({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/location', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear toast on component mount
  useEffect(() => {
    dispatch(clearToast());
  }, [dispatch]);

  const handleInputChange = (value) => {
    setFormData(prev => ({
      ...prev,
      mobile: value,
    }));

    // Clear error when user starts typing
    if (errors.mobile) {
      setErrors(prev => ({
        ...prev,
        mobile: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Mobile validation
    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Dispatch sendOtp to send OTP
      await dispatch(sendOtp({
        mobile_number: formData.mobile,
        user_type: 'User',
      })).unwrap();

      // Navigate to OTP page after successful OTP send
      localStorage.setItem("mobile", formData.mobile);
      navigate('/otp', { state: { mobile: formData.mobile, isLogin: true } });
    } catch (error) {
      // Check if user needs to register first
      const errorMessage = error?.toLowerCase() || '';
      if (errorMessage.includes('not registered') ||
          errorMessage.includes('user not found') ||
          errorMessage.includes('signup') ||
          errorMessage.includes('register') ||
          errorMessage.includes('does not exist')) {
        // Clear error and redirect to register page with mobile number
        dispatch(setError(null));
        navigate('/register', { state: { mobile: formData.mobile } });
      } else {
        // Error is handled by the reducer for other cases
        console.error('Send OTP failed:', error);
      }
    }
  };



  const handleSkip = () => {
    navigate("/location");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-white to-green-200 flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-md w-full p-6 sm:p-8 shadow-xl rounded-3xl bg-white border-2 border-green-200">
        <div className="flex justify-end mb-6">
          <button
            onClick={handleSkip}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-lg px-6 py-2 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            Skip
          </button>
        </div>
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={appLogo} alt="Zet Health Logo" className="w-35 h-15 mr-4" />
            {/* <h1 className="text-4xl font-bold text-green-600">ZET HEALTH</h1> */}
          </div>
          <h2 className="text-2xl font-semibold text-black-600">Log In</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              {error}
            </div>
          )}
          <InputField label="Mobile Number" value={formData.mobile} onChange={handleInputChange} showCountryCode />
          <div className="flex space-x-4">
            <Button title="Submit →" onClick={handleSubmit} loading={loading} className="flex-1" />
          </div>
        </form>
        <div className="text-center mt-6 text-sm text-gray-600">
          By logging in, you agree to our{" "}
          <a
            href="https://zethealth.com/terms-and-conditions/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 underline hover:text-green-800"
          >
            Terms and Conditions
          </a>{" "}
          &{" "}
          <a
            href="https://zethealth.com/privacy-policy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 underline hover:text-green-800"
          >
            Privacy Policy
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;