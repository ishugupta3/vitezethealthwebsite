import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import CartButton from '../components/CartButton';
import { showToast } from '../components/Toast';

const PackageDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedLocation } = useSelector((state) => state.location);

  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const pkg = location.state?.package;

  useEffect(() => {
    if (!pkg) {
      navigate(-1);
      return;
    }
    loadCartData();
  }, [pkg, navigate]);

  const loadCartData = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      const newCartItems = [...cartItems, pkg];
      setCartItems(newCartItems);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
      showToast('Added to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFromCart = () => {
    setIsLoading(true);
    try {
      const newCartItems = cartItems.filter(item => item.id !== pkg.id);
      setCartItems(newCartItems);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
      showToast('Removed from cart');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewCart = () => {
    showToast('View cart coming soon');
  };

  const isInCart = () => {
    return cartItems.some(item => item.id === pkg.id);
  };

  if (!pkg) {
    return null;
  }

  return (
    <div
      className={`
        min-h-screen w-full
        bg-gradient-to-br from-indigo-100 via-white/90 to-blue-100
        font-sans overflow-hidden relative
        sm:bg-[url('/images/mobile-bg.svg')] sm:bg-cover sm:bg-no-repeat
        md:bg-[url('/images/laptop-bg.jpg')] md:bg-cover md:bg-no-repeat
      `}
      style={{ transition: 'background-image 0.5s' }}
    >
      {/* Accent Blur (Laptop Only) */}
      <div className="hidden md:block absolute top-[-80px] right-[-90px] h-[400px] w-[400px] rounded-full bg-blue-300 opacity-30 blur-3xl z-0"></div>
      {/* Accent Blur (Mobile Only) */}
      <div className="block md:hidden absolute left-[-40px] top-[60px] h-52 w-52 rounded-full bg-pink-200 opacity-40 blur-2xl z-0"></div>

      {/* Header */}
      <Header
        onLocationTap={() => navigate('/location')}
        displayAddress={selectedLocation ? selectedLocation.name : "Detect My Location"}
        cartCount={cartItems.length}
        onCartTap={handleViewCart}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center py-8 px-2 sm:px-4 md:px-10 max-w-2xl mx-auto">
        <button
          className="mt-2 self-start mb-3 flex items-center gap-1 px-4 py-1 rounded-full bg-[rgba(232,240,255,0.7)] backdrop-blur hover:bg-blue-100 transition shadow"
          onClick={() => navigate(-1)}
        >
          <span className="text-xl">←</span>
          <span className="text-base font-semibold tracking-wide">Back</span>
        </button>

        {/* Package Image */}
        <div className="w-full -mt-6 mb-6 relative flex justify-center">
          <div className="
            h-64 w-50 md:h-76 md:w-56 rounded-3xl overflow-hidden shadow-xl
            bg-white/40 backdrop-blur-md
            hover:scale-105 hover:shadow-2xl transition duration-300
          ">
            <img
              src={pkg.image || '/placeholder-image.jpg'}
              alt={pkg.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
            />
          </div>
        </div>

        {/* Main Card */}
        <div className="w-full bg-white/70 md:bg-white/60 backdrop-blur-xl rounded-3xl
           shadow-2xl px-4 py-7 md:px-12 transition duration-300 animate-fade-in
        ">
          {/* Package Info */}
          <div className="mb-5">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{pkg.name}</h1>
            <div className="flex flex-wrap gap-2 items-center mb-3">
              <span className="inline-block bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-1 rounded-full text-base font-semibold shadow">
                ₹{pkg.price}
              </span>
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold shadow">
                {pkg.type}
              </span>
              {pkg.testTime && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700 shadow">
                  ⏱️ {pkg.testTime}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {pkg.description && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-1">Description</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{pkg.description}</p>
            </div>
          )}

          {/* Lab Info */}
          {(pkg.labName || pkg.labAddress) && (
            <div className="mb-4">
              <h3 className="font-semibold text-gray-800 mb-1">Lab Information</h3>
              {pkg.labName && (
                <p className="text-gray-700 text-sm mb-1">
                  <span className="font-semibold">Lab:</span> {pkg.labName}
                </p>
              )}
              {pkg.labAddress && (
                <p className="text-gray-700 text-sm"><span className="font-semibold">Address:</span> {pkg.labAddress}</p>
              )}
            </div>
          )}

          {/* Test Items */}
          {pkg.itemDetail && pkg.itemDetail.length > 0 && (
            <div className="mb-2">
              <h3 className="font-semibold text-gray-900 mb-2">Tests Included <span className="text-xs">({pkg.itemDetail.length})</span></h3>
              <div className="flex flex-wrap gap-2">
                {pkg.itemDetail.map((item, idx) => (
                  <div key={idx} className="bg-gray-100 px-3 py-1 rounded-lg text-gray-800 text-xs flex items-center gap-1 shadow">
                    <span className="text-green-400">●</span>{item.name}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add/Remove Button */}
          <button
            onClick={isInCart() ? handleRemoveFromCart : handleAddToCart}
            disabled={isLoading}
            className={`
              mt-6 w-full py-4 rounded-2xl font-semibold text-lg 
              shadow-xl transition-all duration-300 transform hover:scale-[1.025] focus:outline-none border-none
              ${isInCart()
                ? 'bg-gradient-to-tr from-red-500 to-pink-400 text-white hover:shadow-pink-200'
                : 'bg-gradient-to-tr from-emerald-500 to-green-400 text-white hover:shadow-green-200'
              }
              ${isLoading ? 'opacity-60 pointer-events-none' : ''}
            `}
            style={{
              boxShadow: isInCart()
                ? '0 4px 24px 3px rgba(255, 99, 132, 0.12)'
                : '0 4px 24px 3px rgba(52, 211, 153, 0.12)'
            }}
          >
            {isLoading
              ? <span className="animate-pulse">Processing...</span>
              : isInCart()
                ? <><span className="mr-2">🛒</span>Remove from Cart</>
                : <><span className="mr-2">➕</span>Add to Cart</>
            }
          </button>
        </div>
      </div>

      {/* Floating Cart Button */}
      <CartButton
        itemCount={cartItems.length}
        onTap={handleViewCart}
        className="fixed bottom-8 right-8 shadow-[0_6px_16px_rgba(73,94,148,0.18)] z-50"
        style={{
          background: 'linear-gradient(135deg, #ecf0f3 88%, #e1e8ef 100%)',
          boxShadow: '6px 12px 24px #dbe1ee, -6px -12px 24px #ffffff'
        }}
      />
    </div>
  );
};

export default PackageDetail;
