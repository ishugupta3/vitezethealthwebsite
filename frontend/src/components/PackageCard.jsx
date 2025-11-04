import React, { useState } from 'react';
import { FaClock, FaRupeeSign } from 'react-icons/fa';

const PackageCard = ({
  package: pkg,
  isInCart = false,
  onAddToCart,
  onRemoveFromCart
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCartAction = async () => {
    setIsLoading(true);
    try {
      if (isInCart) {
        await onRemoveFromCart(pkg.id);
      } else {
        await onAddToCart(pkg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 shadow-lg border border-gray-100 mb-4">
      {/* Image and Content Row */}
      <div className="flex mb-4">
        {/* Image */}
        <div className="flex-1 mr-4">
          <img
            src={pkg.image || '/placeholder-image.jpg'}
            alt={pkg.name}
            className="w-full h-32 object-cover rounded-2xl"
            onError={(e) => {
              e.target.src = '/placeholder-image.jpg';
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-[1.5] flex flex-col">
          <h3 className="font-bold text-gray-800 text-lg mb-2 line-clamp-2">
            {pkg.name}
          </h3>

          {/* Time Badge */}
          <div className="flex items-center bg-gray-100 rounded-full px-3 py-1 mb-2 w-fit">
            <FaClock className="text-blue-500 mr-1 text-xs" />
            <span className="text-gray-600 text-xs">2-4 Hours</span>
          </div>

          {/* Price */}
          <div className="bg-blue-500 text-white rounded-full px-3 py-1 w-fit mb-3">
            <span className="text-sm font-semibold">At {pkg.price} ₹ only</span>
          </div>

          {/* Test Items */}
          {pkg.itemDetail && pkg.itemDetail.length > 0 && (
            <div className="flex-1 overflow-hidden">
              <div className="space-y-1">
                {pkg.itemDetail.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-blue-500 mr-2 mt-1">◈</span>
                    <span className="text-gray-600 text-sm line-clamp-1">
                      {item.name}
                    </span>
                  </div>
                ))}
                {pkg.itemDetail.length > 3 && (
                  <span className="text-gray-400 text-xs">
                    +{pkg.itemDetail.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleCartAction}
        disabled={isLoading}
        className={`w-full py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${
          isInCart
            ? 'bg-red-500 text-white hover:bg-red-600'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isLoading ? 'Processing...' : (isInCart ? 'Remove from Cart' : 'Add to Cart')}
      </button>
    </div>
  );
};

export default PackageCard;
