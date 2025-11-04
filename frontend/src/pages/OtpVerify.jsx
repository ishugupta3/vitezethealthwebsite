import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyOtp, sendOtp } from "../store/slices/authSlice";
import { clearToast } from "../store/slices/appSlice";
import { showToast } from "../components/Toast";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import logoimage from "../assets/logo/app_logo.png";

export default function OtpVerify() {
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const mobile = localStorage.getItem("mobile") || "";

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtpDigits = [...otpDigits];
    newOtpDigits[index] = value;
    setOtpDigits(newOtpDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const dispatch = useDispatch();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearToast());
  }, [dispatch]);

  const handleVerify = async () => {
    const otp = otpDigits.join("");
    if (otp.length !== 6) {
      showToast("Please enter complete OTP");
      return;
    }
    try {
      await dispatch(verifyOtp({
        mobile_number: mobile,
        otp: otp,
        user_type: 'User',
      })).unwrap();
      showToast("OTP Verified!");
    } catch (error) {
      showToast(error || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    try {
      await dispatch(sendOtp({
        mobile_number: mobile,
        user_type: 'User',
      })).unwrap();
      setTimeLeft(30);
      setCanResend(false);
      showToast("OTP resent!");
    } catch (error) {
      showToast(error || "Failed to resend OTP");
    }
  };

  const handleEdit = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-white to-green-200 flex items-center justify-center p-2 sm:p-4">
      <div className="max-w-md w-full p-6 sm:p-8 shadow-xl rounded-3xl bg-white border-2 border-green-200">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src={logoimage} alt="Zet Health Logo" className="w-35 h-15 mr-4" />
            {/* <h1 className="text-4xl font-bold text-black mb-2">ZET <span className="text-green-600">HEALTH</span></h1> */}
          </div>
          <p className="text-2xl font- text-black mb-1">We Have sent you</p>
          <p className="text-3xl font-bold text-green-600 mb-4">OTP</p>
          <p className="text-gray-700">
            Please enter the verification code sent to {mobile}{" "}
            <button onClick={handleEdit} className="text-green-600 underline hover:bg-green-100 active:scale-95 transition duration-150">
              edit
            </button>
          </p>
        </div>
        <div className="space-y-6">
          <div className="flex justify-center space-x-2">
            {otpDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                maxLength="1"
              />
            ))}
          </div>
          <div className="flex justify-end">
            <Button title="Verify OTP →" onClick={handleVerify} loading={loading} className="w-auto px-8" />
          </div>
        </div>
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Didn't receive the OTP?{" "}
            {canResend ? (
              <button onClick={handleResend} disabled={resendLoading} className="text-green-600 underline hover:bg-green-100 active:scale-95 transition duration-150 disabled:opacity-50">
                {resendLoading ? "Resending..." : "Resend OTP"}
              </button>
            ) : (
              <span className="text-gray-500 font-bold">
                {String(Math.floor(timeLeft / 60)).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
