import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const CartButton = ({ itemCount = 0, onTap }) => {
  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <button
        onClick={onTap}
        className="bg-green-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors duration-200 flex items-center space-x-2"
      >
        <FaShoppingCart className="text-sm" />
        <span className="text-sm font-medium">{itemCount} items in cart</span>
        <span className="text-xs opacity-90">View</span>
      </button>
    </div>
  );
};

export default CartButton;
