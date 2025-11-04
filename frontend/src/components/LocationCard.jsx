import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const LocationCard = ({ cityKey, cityData, onLocationSelect, isExpanded, onToggle }) => {
  const handleCityClick = () => {
    onToggle(cityKey);
  };

  const handleSubLocationClick = (subLocation) => {
    onLocationSelect(cityKey, subLocation);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      {/* City Header */}
      <button
        onClick={handleCityClick}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            <img
              src={cityData.image}
              alt={cityData.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/assets/images/default-city.jpg'; // Fallback image
              }}
            />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900">{cityData.name}</h3>
            <p className="text-sm text-gray-600">{cityData.subLocations.length} locations</p>
          </div>
        </div>
        <div className="flex items-center">
          {isExpanded ? (
            <FaChevronUp className="text-gray-500" />
          ) : (
            <FaChevronDown className="text-gray-500" />
          )}
        </div>
      </button>

      {/* Sub-locations */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {cityData.subLocations.map((subLocation, index) => (
            <button
              key={index}
              onClick={() => handleSubLocationClick(subLocation)}
              className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">{subLocation}</span>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationCard;
