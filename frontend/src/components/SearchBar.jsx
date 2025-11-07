import React, { useState, useRef } from 'react';
import { FaSearch, FaCamera, FaFilePdf, FaTimes, FaUpload } from 'react-icons/fa';
import { FaLocationDot, FaLocationCrosshairs } from 'react-icons/fa6';

const SearchBar = ({
  onSearch,
  onLocationTap,
  displayAddress = "Select Location",
  cartCount = 0,
  onCartTap
}) => {
  const [query, setQuery] = useState('');
  const searchInputRef = useRef(null);

  const handleSearch = (value) => {
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleUploadPrescription = () => {
    // Handle prescription upload logic
    console.log('Upload prescription clicked');
  };

  return (
    <div className="bg-white px-4 py-3">
      {/* Location Bar */}
      <div className="flex items-center mb-3">
        <button
          onClick={onLocationTap}
          className="flex-1 flex items-center bg-gray-50 rounded-full px-4 py-2 mr-3 border border-gray-200"
        >
          <FaLocationCrosshairs className="text-blue-500 mr-2 flex-shrink-0" />
          <span className="flex-1 text-left text-sm text-gray-700 truncate">
            {displayAddress}
          </span>
          <FaLocationDot className="text-blue-500 ml-2 flex-shrink-0" />
        </button>

        {/* Notification and Cart buttons */}
        <button className="p-2 mr-2">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs">🔔</span>
          </div>
        </button>

        <button onClick={onCartTap} className="p-2 relative">
          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
            <span className="text-xs">🛒</span>
          </div>
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center bg-gray-50 rounded-full px-4 py-2 border border-gray-200">
        <FaSearch className="text-blue-500 mr-3" />

        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search for tests and packages"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          className="flex-1 bg-transparent outline-none text-sm"
        />

        {query && (
          <button onClick={clearSearch} className="mr-3">
            <FaTimes className="text-gray-400" />
          </button>
        )}

        <button
          onClick={handleUploadPrescription}
          className="bg-blue-500 text-white p-2 rounded-full ml-2"
        >
          <FaUpload className="text-sm" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
