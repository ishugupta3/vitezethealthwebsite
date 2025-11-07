import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaTimes, FaTimes as FaClose } from 'react-icons/fa';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import {
  detectLocation,
  setLocation,
  setManualLocation,
  loadPersistedLocation,
  clearError
} from '../store/slices/locationSlice';
import LocationCard from '../components/LocationCard';
import Button from '../components/Button';


const LocationSelection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    availableCities,
    detectedLocation,
    selectedLocation,
    loading: locationLoading,
    error: locationError
  } = useSelector((state) => state.location);

  const [searchQuery, setSearchQuery] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    // Load persisted location on component mount
    dispatch(loadPersistedLocation());
  }, [dispatch, navigate]);

  // Removed the useEffect that automatically detects and sets location

  const handleDetectLocation = () => {
    dispatch(clearError());
    dispatch(detectLocation());
  };

  const handleLocationSelect = (cityKey, subLocation) => {
    dispatch(setLocation({ cityKey, subLocation }));
    navigate('/home');
  };

  const handleClose = () => {
    if (selectedLocation) {
      // If location is already selected, go directly to home
      navigate('/home');
    } else {
      // If no location selected, set default to Delhi and go to home
      dispatch(setLocation({ cityKey: 'delhi', subLocation: 'Delhi' }));
      navigate('/home');
    }
  };

  const filteredCities = Object.keys(availableCities).filter(cityKey => {
    const cityName = availableCities[cityKey].name;
    const query = searchQuery.toLowerCase();
    return cityName.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleClose}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            className="p-2 rounded-md bg-white text-gray-600 shadow-lg shadow-green-300 active:shadow-none focus:outline-none transition-all duration-200"
          >
            <FaClose className="text-gray-600" />
          </button>
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">Select Location</p>
          </div>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center bg-white rounded-full px-4 py-3 shadow-sm border border-gray-200">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Detect Location */}
        <div className="text-center">
          <button
            onClick={handleDetectLocation}
            disabled={locationLoading}
            className="text-red-500 font-medium hover:text-red-700 underline text-sm flex items-center justify-center"
          >
            <FaLocationCrosshairs className="mr-2" />
            {locationLoading ? 'Detecting Location...' : 'Detect My Location'}
          </button>
        </div>



        {/* All Cities Grid */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Cities</h3>
          <div className="grid grid-cols-3 gap-4">
            {filteredCities.map((cityKey) => (
              <button
                key={cityKey}
                onClick={() => handleLocationSelect(cityKey, availableCities[cityKey].name)}
                className="bg-white rounded-lg p-4 flex flex-col items-center hover:bg-green-100 transition-colors"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-500 mb-2">
                  <img
                    src={availableCities[cityKey].image}
                    alt={availableCities[cityKey].name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/assets/images/default-city.jpg';
                    }}
                  />
                </div>
                <p className="text-sm font-medium text-gray-900 text-center">{availableCities[cityKey].name}</p>
              </button>
            ))}
          </div>
        </div>



        {/* Coming Soon Message */}
        {showComingSoon && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Coming Soon to Your City!</h3>
            <p className="text-yellow-700 text-sm">
              We're currently available in Delhi, Mumbai, Bangalore, Hyderabad, and Odisha.
              Stay tuned as we expand to more cities soon!
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="mt-3 text-yellow-600 hover:text-yellow-800 underline text-sm"
            >
              Choose from available cities
            </button>
          </div>
        )}

        {/* Skip Button */}
        <div className="text-center">
          <button
            onClick={handleClose}
            className="text-gray-500 text-sm hover:text-gray-700 underline"
          >
            Skip for now (Delhi will be selected)
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSelection;
