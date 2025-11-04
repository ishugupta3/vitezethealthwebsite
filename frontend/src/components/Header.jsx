import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../store/slices/authSlice';
import Drawer from './Drawer';
import logoimage from "../assets/logo/app_logo.png";

const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if logout fails, clear local state
      navigate('/login');
    }
  };

  return (
    <>
      <header className="bg-green-200 shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img
                src={logoimage}
                alt="ZetHealth Logo"
                className="h-12 w-auto "
              />
            </div>

            {/* Menu Bar - Hidden on mobile */}
            <nav className="hidden md:flex space-x-8 items-center">
              <a
                href="/home"
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
              >
                Home
              </a>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Logout
                </button>
              ) : (
                <a
                  href="/login"
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Login
                </a>
              )}

              {/* Profile Button - Prominent and Green */}
              <button
                onClick={() => navigate('/profile')}
                className="px-4 py-2 rounded-md text-base font-semibold text-white bg-green-600 hover:bg-green-700 transition-colors duration-200 shadow-sm"
              >
                {isAuthenticated && user ? user.user_name || user.name : 'Profile'}
              </button>

              {/* Hamburger menu button for desktop */}
              <button
                onClick={toggleDrawer}
                className="text-gray-700 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleDrawer}
                className="text-gray-700 hover:text-blue-600 p-2 rounded-md hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Drawer */}
      <Drawer isOpen={isDrawerOpen} onClose={closeDrawer} />
    </>
  );
};

export default Header;
