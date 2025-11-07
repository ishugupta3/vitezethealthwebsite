import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../store/slices/authSlice';
import logo from '../assets/logo/logo.svg';
import {
  FaLinkedin,
  FaTwitter,
  FaInstagram,
  FaFacebook,
  FaApple,
  FaGooglePlay,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaUser,
  FaSignOutAlt,
  FaHandshake,
  FaShareAlt
} from 'react-icons/fa';

const Footer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleShareApp = async () => {
    const shareText = `Download Now
Android
https://play.google.com/store/apps/details?id=com.healthexpress
IOS
https://apps.apple.com/in/app/zet-health/id6749360221
Website
http://localhost:5174`;

    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Share text copied to clipboard!');
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Unable to share. Please copy the text manually.');
      }
    }
  };

  return (
    <footer className="bg-gradient-to-b from-green-600 to-gray-900 text-white font-montserrat pt-10 pb-4">
      <div className="max-w-6xl mx-auto px-4">
        {/* SOCIALS & AUTHENTICATION */}
        {/* <h3 className="text-2xl font-bold mb-3 text-green-200 text-center">Get connected with us on social networks</h3> */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mb-8">
          {/* Social Media */}
          <div className="flex justify-center gap-4">
            <a href="https://www.linkedin.com/company/zethealth" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="bg-white text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white rounded-full p-2 text-[30px] transition-all shadow-lg">
              <FaLinkedin />
            </a>
            <a href="https://twitter.com/zethealth" target="_blank" rel="noopener noreferrer" aria-label="Twitter"
              className="bg-white text-[#1DA1F2] hover:bg-[#1DA1F2] hover:text-white rounded-full p-2 text-[30px] transition-all shadow-lg">
              <FaTwitter />
            </a>
            <a href="https://www.instagram.com/zethealth" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="bg-white text-pink-500 hover:bg-gradient-to-br hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:text-white rounded-full p-2 text-[30px] transition-all shadow-lg">
              <FaInstagram />
            </a>
            <a href="https://www.facebook.com/zethealth" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
              className="bg-white text-[#1877F3] hover:bg-[#1877F3] hover:text-white rounded-full p-2 text-[30px] transition-all shadow-lg">
              <FaFacebook />
            </a>
          </div>
          {/* Authentication (Right on Desktop, below on Mobile) */}
          <div className="flex justify-center order-2">
            {isAuthenticated && (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2 text-green-200">
                  <FaUser /> <span>Welcome, {user?.user_name || user?.name || 'User'}</span>
                </div>
                <button onClick={() => { dispatch(logoutUser()); navigate('/'); }} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* APP STORE & PARTNER/SHARE SECTION */}
        <div className="flex flex-col md:flex-row md:justify-between lg:justify-center md:gap-8 mb-8">
          {/* App Links */}
          <div className="flex justify-center gap-4 mb-4 md:mb-0">
            <a href="https://apps.apple.com/in/app/zet-health/id6749360221" target="_blank" rel="noopener noreferrer"
               className="flex items-center bg-black rounded-xl px-5 py-3 gap-2 shadow-lg hover:bg-green-800 transition">
              <FaApple className="text-2xl" />
              <span className="font-semibold tracking-wide text-base">App Store</span>
            </a>
            <a href="https://play.google.com/store/apps/details?id=com.healthexpress" target="_blank" rel="noopener noreferrer"
               className="flex items-center bg-black rounded-xl px-5 py-3 gap-2 shadow-lg hover:bg-green-800 transition">
              <FaGooglePlay className="text-2xl" />
              <span className="font-semibold tracking-wide text-base">Google Play</span>
            </a>
          </div>
          {/* Partner and Share */}
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/partner')}
              className="flex items-center gap-2 bg-black rounded-xl px-5 py-3 gap-2 shadow-lg hover:bg-green-800 transition"
            >
              <FaHandshake /> <span>Partner with Us</span>
            </button>
            <button
              onClick={handleShareApp}
              className="flex items-center gap-2 bg-black rounded-xl px-5 py-3 gap-2 shadow-lg hover:bg-green-800 transition"
            >
              <FaShareAlt /> <span>Share App</span>
            </button>
          </div>
        </div>

        {/* CONTACT, POLICIES, SUPPORT */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8 mb-8">
          {/* Contact Info */}
          <div className="flex-1 text-center mb-6 lg:mb-0">
            <h3 className="text-2xl font-bold mb-3 text-green-300">Contact Us</h3>
            <div className="flex flex-col gap-2 items-center">
              <a href="https://wa.me/9148914858" target="_blank" rel="noopener noreferrer"
                 className="flex items-center gap-2 hover:text-green-400 transition">
                <FaWhatsapp /> <span>WhatsApp: +91 9148914858</span>
              </a>
              <a href="tel:+919148914858" className="flex items-center gap-2 hover:text-green-400 transition">
                <FaPhoneAlt /> <span>Phone: +91 9148914858</span>
              </a>
              <a href="mailto:hello@zethealth.com" className="flex items-center gap-2 hover:text-green-400 transition">
                <FaEnvelope /> <span>Email: hello@zethealth.com</span>
              </a>
            </div>
          </div>
          {/* Policies and Support */}
          <div className="flex-1 flex flex-wrap justify-center gap-6 items-center">
            <a href="https://zethealth.com/privacy-policy/" className="hover:text-green-400 transition font-medium">Privacy Policy</a>
            <a href="https://zethealth.com/terms-and-conditions/" className="hover:text-green-400 transition font-medium">Terms & Conditions</a>
            <a href="https://zethealth.com/support/" className="hover:text-green-400 transition font-medium">Support</a>
            <a href="https://zethealth.com/delete-account/" className="hover:text-green-400 transition font-medium">Delete Account</a>
            <button onClick={() => navigate('/about')} className="hover:text-green-400 transition font-medium bg-transparent border-none cursor-pointer">About Us</button>
            <button onClick={() => navigate('/contact')} className="hover:text-green-400 transition font-medium bg-transparent border-none cursor-pointer">Contact Us</button>
          </div>
        </div>

        {/* COPYRIGHT */}
        <div className="text-center text-xs text-gray-300 pt-2 border-t border-green-700">
          <p>&copy; {new Date().getFullYear()} ZetHealth. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
