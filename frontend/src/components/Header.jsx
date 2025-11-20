import React, { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import Drawer from './Drawer';
import SearchBar from './SearchBar';
import logoimage from "../assets/logo/app_logo.png";
import { FaLocationCrosshairs, FaLocationDot, FaChevronDown } from 'react-icons/fa6';

const Header = ({ onLocationTap, displayAddress, cartCount, onCartTap, onSearch, drawerOnLogo = false }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const toggleDrawer = () => setIsDrawerOpen(prev => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);

  const toggleDropdown = () => setIsDropdownOpen(prev => !prev);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch {
      navigate('/login');
    }
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center h-16">

            {/* Left: Logo, SearchBar, Location */}
            <div className="flex items-center space-x-4 flex-1">
              {/* Logo */}
              <div className="flex-shrink-0">
                <img
                  src={logoimage}
                  alt="ZetHealth Logo"
                  className="h-10 w-auto cursor-pointer"
                  onClick={toggleDrawer}
                />
              </div>

              {/* SearchBar - hidden on mobile, visible on md+ */}
              <div className="hidden md:flex flex-1 max-w-2xl">
                <SearchBar onSearch={onSearch} />
              </div>
              {/* Location Button - mobile only */}
              {onLocationTap && displayAddress && (
                <button
                  onClick={onLocationTap}
                  className="md:hidden flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 rounded-full px-4 py-2 border border-gray-300 shadow-sm transition duration-300 max-w-[180px] truncate"
                  aria-label="Select location"
                >
                  <FaLocationCrosshairs className="text-green-600" />
                  <span className="text-gray-800 text-sm truncate">{displayAddress}</span>
                  <FaLocationDot className="text-green-600" />
                </button>
              )}
            </div>

            {/* Right: Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-6">

              {/* Location Button - desktop */}
              {onLocationTap && displayAddress && (
                <button
                  onClick={onLocationTap}
                  className="flex items-center space-x-2 bg-gray-50 hover:bg-green-100 rounded-full px-3 py-2 border border-gray-300 shadow-md font-medium text-gray-700 text-sm transition duration-300 max-w-[200px] truncate"
                  aria-label="Select location"
                >
                  <FaLocationCrosshairs className="text-green-600" />
                  <span className="truncate">{displayAddress}</span>
                  <FaLocationDot className="text-green-600" />
                </button>
              )}

              {/* User Profile Dropdown */}
              {isAuthenticated ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className="flex items-center space-x-2 px-5 py-2 rounded-md bg-gradient-to-r from-white to-white shadow-lg text-black font-semibold hover:from-green-100 hover:to-green-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-haspopup="true"
                    aria-expanded={isDropdownOpen}
                  >
                    <span>{user ? user.user_name || user.name : 'User'}</span>
                    <FaChevronDown className="text-sm" />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                      <div className="py-1">
                        <button
                          onClick={handleProfileClick}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 transition text-sm"
                        >
                          Your Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-green-50 transition text-sm"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <a
                  href="/login"
                  className="text-gray-700 px-4 py-2 rounded-md hover:bg-green-50 hover:text-green-700 transition font-medium text-sm"
                >
                  Login
                </a>
              )}

              {/* Notification */}
              <button
                className="relative p-2 rounded-full hover:bg-green-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Notifications"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center transition duration-300 hover:bg-green-200">
                  <span role="img" aria-label="notification" className="text-xl select-none">
                    🔔
                  </span>
                </div>
              </button>

              {/* Cart */}
              <button
                onClick={onCartTap}
                className="relative p-2 rounded-full hover:bg-green-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Cart"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center transition duration-300 hover:bg-green-200">
                  <span role="img" aria-label="cart" className="text-xl select-none">
                    🛒
                  </span>
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
            </nav>

            {/* Mobile notification + cart on right side */}
            <div className="flex items-center space-x-3 md:hidden order-3">
              <button
                className="relative p-2 rounded-full hover:bg-green-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Notifications"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center transition duration-300 hover:bg-green-200">
                  <span role="img" aria-label="notification" className="text-xl select-none">
                    🔔
                  </span>
                </div>
              </button>
              <button
                onClick={onCartTap}
                className="relative p-2 rounded-full hover:bg-green-100 transition duration-300 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Cart"
              >
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center transition duration-300 hover:bg-green-200">
                  <span role="img" aria-label="cart" className="text-xl select-none">
                    🛒
                  </span>
                </div>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>

          </div>



          {/* Sub-navigation bar */}
          <nav className="hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-8">
              <div className="flex justify-center md:justify-start items-center space-x-8 py-3 font-semibold select-none text-gray-700">

                {[
                  'Booking',
                  'Insights',
                  'Reports',
                  'Add Address',
                  'Address List',
                  { name: 'Popular Package', href: '#popular-packages' },
                  { name: 'Lifestyle Packages', href: '#lifestyle-packages' },
                ].map((item) => {
                  const isStringItem = typeof item === 'string';
                  const itemName = isStringItem ? item : item.name;
                  const itemHref = isStringItem ? null : item.href;

                  const handleClick = (e) => {
                    if (isStringItem) {
                      e.preventDefault();
                      if (itemName === 'Add Address') {
                        navigate('/add-address');
                      } else if (itemName === 'Address List') {
                        navigate('/address-list');
                      } else {
                        // For other string items, could add more routes if needed
                        console.log(`Navigate to ${itemName}`);
                      }
                    }
                    // For object items, let the href handle it
                  };

                  return (
                    <a
                      key={itemName}
                      href={itemHref || '#'}
                      onClick={handleClick}
                      className="relative group px-4 py-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 hover:text-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 select-none"
                      aria-label={itemName}
                    >
                      <span className="relative z-10">{itemName}</span>
                      {/* Gradient underline */}
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-green-600 scale-x-0 group-hover:scale-x-100 transition-transform origin-left rounded"></span>

                      {/* Glow effect on hover */}
                      <span
                        className="absolute inset-0 rounded-md opacity-0 bg-green-200 blur-md group-hover:opacity-60 transition-opacity duration-300 pointer-events-none"
                        aria-hidden="true"
                      ></span>
                    </a>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      </header>
      <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
};

export default Header;
