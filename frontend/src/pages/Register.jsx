import { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from "react-router-dom";
import InputField from "../components/InputField";
import Button from "../components/Button";
import { validateRegister } from "../utils/validation";
import { showToast } from "../components/Toast";
import { registerUser, sendOtp, setError } from '../store/slices/authSlice';
import { clearToast } from '../store/slices/appSlice';
import logoimage from "../assets/logo/app_logo.png";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ name: "", email: "", mobile: "", gender: "" });

  // Pre-fill mobile number if passed from login page
  useEffect(() => {
    if (location.state?.mobile) {
      setForm(prev => ({ ...prev, mobile: location.state.mobile }));
    }
  }, [location.state]);

  // Clear toast on component mount
  useEffect(() => {
    dispatch(clearToast());
  }, [dispatch]);

  const handleChange = (field, value) => setForm({ ...form, [field]: value });

  const handleRegistrationError = (errorMessage) => {
    const lowerMessage = errorMessage?.toLowerCase() || '';
    if (lowerMessage.includes('already registered') ||
        lowerMessage.includes('user already exists') ||
        lowerMessage.includes('mobile number already') ||
        lowerMessage.includes('already exists')) {
      showToast("Mobile number already registered, please login");
      navigate("/login");
    } else {
      showToast(errorMessage || "Registration failed");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const validationError = validateRegister(form);
    if (validationError) {
      return showToast(validationError);
    }

    try {
      // Dispatch registerUser
      await dispatch(registerUser({
        user_name: form.name,
        user_email: form.email,
        user_gender: form.gender,
        mobile_number: form.mobile,
        device_id: 'user_register'
      })).unwrap();

      // On successful registration, send OTP
      await dispatch(sendOtp({
        mobile_number: form.mobile,
        user_type: 'User',
      })).unwrap();

      // Navigate to OTP page after successful OTP send
      localStorage.setItem("mobile", form.mobile);
      navigate('/otp', { state: { mobile: form.mobile, isRegister: true } });
    } catch (err) {
      // Handle errors
      const errorMessage = err?.toLowerCase() || '';
      if (errorMessage.includes('already registered') ||
          errorMessage.includes('user already exists') ||
          errorMessage.includes('mobile number already') ||
          errorMessage.includes('already exists')) {
        showToast("Mobile number already registered, please login");
        navigate("/login");
      } else {
        // Error is handled by the reducer for other cases
        console.error('Registration or OTP send failed:', err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-white to-green-200 flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-md w-full p-6 sm:p-8 shadow-xl rounded-3xl bg-white border-2 border-green-200">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={logoimage} alt="Zet Health Logo" className="w-35 h-15 mr-4" />
            {/* <h1 className="text-4xl font-bold text-black mb-2">ZET <span className="text-green-600">HEALTH</span></h1> */}
          </div>
          <p className="text-green-600 text-lg font-medium">Enter Your Number and Book your Test now</p>
        </div>
        <div className="space-y-6">
          <InputField label="Full Name" value={form.name} onChange={(v) => handleChange("name", v)} />
          <InputField label="Email Address" value={form.email} onChange={(v) => handleChange("email", v)} type="email" />
          <InputField label="Mobile Number" value={form.mobile} onChange={(v) => handleChange("mobile", v)} showCountryCode />

          <div className="mb-6">
            <label className="block text-gray-700 text-base font-medium mb-3">Gender</label>
            <div className="flex space-x-6">
              {["Male", "Female", "Other"].map((gender) => (
                <label key={gender} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="gender"
                    value={gender}
                    checked={form.gender === gender}
                    onChange={(e) => handleChange("gender", e.target.value)}
                    className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                  />
                  <span className="text-gray-700 font-medium text-sm">{gender}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <Button title="Register →" onClick={handleRegister} loading={loading} className="w-auto px-8" />
          </div>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => navigate("/login")}
                className="text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
