import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import appLogo from '../assets/logo/app_logo.png';

const Drawer = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      onClose();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      onClose();
      navigate('/login');
    }
  };

  const handleShare = async (closeDrawer) => {
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
        closeDrawer();
      } catch (error) {
        console.error('Error sharing:', error);
        closeDrawer();
      }
    } else {
      // Fallback: Copy to clipboard
      try {
        await navigator.clipboard.writeText(shareText);
        alert('Share text copied to clipboard!');
        closeDrawer();
      } catch (error) {
        console.error('Error copying to clipboard:', error);
        alert('Unable to share. Please copy the text manually.');
        closeDrawer();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={onClose}
              style={{ WebkitTapHighlightColor: 'transparent' }}
              className="p-2 rounded-md bg-white text-gray-600 shadow-lg shadow-green-300 active:shadow-none focus:outline-none transition-all duration-200"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Profile Section */}
          <div className="px-4 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-16 w-16 rounded-full border-4 border-green-500 flex items-center justify-center">
                <img src={appLogo} alt="ZetHealth Logo" className="h-6 w-14 " />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-semibold text-gray-900">
                  {isAuthenticated && user ? `${user.user_name || user.name}` : 'Guest'}
                </span>
                {isAuthenticated && user && user.user_mobile && (
                  <span className="text-sm text-gray-900 font-bold">
                    {user.user_mobile}
                  </span>
                )}
              </div>
            </div>
          </div>


          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            <Link
              to="/home"
              onClick={onClose}
              style={{ WebkitTapHighlightColor: 'transparent' }}
              className="flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors text-gray-700 hover:text-green-600 hover:bg-green-50"
            >
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="border-b-2 border-green-500">Home Page</span>
            </Link>
            <Link
              to="/partner"
              onClick={onClose}
              style={{ WebkitTapHighlightColor: 'transparent' }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors ${
                location.pathname === '/partner'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="border-b-2 border-green-500">Partner with Us</span>
            </Link>
            <Link
              to="/about"
              onClick={onClose}
              style={{ WebkitTapHighlightColor: 'transparent' }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors ${
                location.pathname === '/about'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="border-b-2 border-green-500">About Us</span>
            </Link>
            <Link
              to="/contact"
              onClick={onClose}
              style={{ WebkitTapHighlightColor: 'transparent' }}
              className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors ${
                location.pathname === '/contact'
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="border-b-2 border-green-500">Contact Us</span>
            </Link>
            <button
              onClick={() => handleShare(onClose)}
              style={{ WebkitTapHighlightColor: 'transparent' }}
              className="flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors text-gray-700 hover:text-green-600 hover:bg-green-50"
            >
              <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              <span className="border-b-2 border-green-500">Share Page</span>
            </button>
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors text-gray-700 hover:text-green-600 hover:bg-green-50"
              >
                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span>Logout</span>
              </button>
            ) : (
              <Link
                to="/login"
                onClick={onClose}
                style={{ WebkitTapHighlightColor: 'transparent' }}
                className={`flex items-center space-x-3 px-4 py-3 rounded-md text-base font-medium transition-colors ${
                  location.pathname === '/login'
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-green-600 hover:bg-green-50'
                }`}
              >
                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span className="border-b-2 border-green-500">Login</span>
              </Link>
            )}
          </nav>

          {/* Footer */}
          <div className="px-4 py-4 border-t border-gray-200 flex flex-col items-center space-y-2">
            <img src={appLogo} alt="ZetHealth Logo" className="h-10 w-25" />
            <span className="text-sm text-gray-600">Version: 2.8.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drawer;
