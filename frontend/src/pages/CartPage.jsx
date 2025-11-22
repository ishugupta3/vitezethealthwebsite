import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaTrash } from 'react-icons/fa';
import { showToast } from '../components/Toast';

const CartPage = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showClearCart, setShowClearCart] = useState(false);

  useEffect(() => {
    loadCartData();
  }, []);

  const loadCartData = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
    setShowClearCart(cart.length > 0);
  };

  const handleRemoveFromCart = async (itemId) => {
    setIsLoading(true);
    try {
      const newCartItems = cartItems.filter(item => item.id !== itemId);
      setCartItems(newCartItems);
      localStorage.setItem('cart', JSON.stringify(newCartItems));
      showToast('Removed from cart');
      setShowClearCart(newCartItems.length > 0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCart = () => {
    setCartItems([]);
    localStorage.setItem('cart', JSON.stringify([]));
    showToast('Cart cleared');
    setShowClearCart(false);
  };

  const handleCheckout = () => {
    showToast('Checkout coming soon');
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  const calculateSubTotal = () => {
    return calculateTotal();
  };

  const serviceCharge = 0; // Placeholder
  const couponDiscount = 0; // Placeholder
  const payableAmount = calculateTotal() + serviceCharge - couponDiscount;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header with Cart Image */}
        <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <button onClick={() => navigate(-1)} className="mr-4">
                  ←
                </button>
                <h1 className="text-xl font-bold">🛒 My Cart</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="flex flex-col items-center justify-center py-16 px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Empty Cart!</h2>
            <p className="text-gray-600 mb-6">Your cart is empty! Please Add items</p>
            <button
              onClick={() => navigate('/')}
              className="bg-green-500 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-green-600 transition"
            >
              Browse Packages
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Cart Image */}
      <header className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button onClick={() => navigate(-1)} className="mr-4">
                ←
              </button>
              <h1 className="text-xl font-bold">🛒 My Cart</h1>
            </div>
            {showClearCart && (
              <button
                onClick={handleClearCart}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Cart Items</h2>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center bg-gray-50 rounded-xl p-4">
                  <img
                    src={item.image || '/placeholder-image.jpg'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl mr-4"
                    onError={(e) => { e.target.src = '/placeholder-image.jpg'; }}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{item.name}</h3>
                    <p className="text-green-600 font-bold">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveFromCart(item.id)}
                    disabled={isLoading}
                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition disabled:opacity-50"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-800">Total Amount</span>
                <span className="text-xl font-bold text-green-600">₹{calculateSubTotal()}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-lg font-semibold text-gray-800">Collection Charges</span>
                <span className="text-xl font-bold text-green-600">₹{serviceCharge}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between items-center mb-2">
                  <span className="text-lg font-semibold text-gray-800">Coupon Discount</span>
                  <span className="text-xl font-bold text-green-600">-₹{couponDiscount}</span>
                </div>
              )}
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-800">Payable Amount</span>
                <span className="text-xl font-bold text-green-600">₹{payableAmount}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={handleCheckout}
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-2xl font-semibold text-lg shadow-xl transition-all duration-300 transform hover:scale-105"
        >
          Checkout Now
        </button>
      </div>
    </div>
  );
};

export default CartPage;
