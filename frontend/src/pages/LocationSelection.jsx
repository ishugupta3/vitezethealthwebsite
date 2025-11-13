import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaTimes, FaTimes as FaClose } from 'react-icons/fa';
import { FaLocationCrosshairs } from 'react-icons/fa6';
import {
  detectLocation,
  setLocation,
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
    loading: locationLoading,
    error: locationError
  } = useSelector((state) => state.location);

  const [searchQuery, setSearchQuery] = useState('');
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    dispatch(loadPersistedLocation());
  }, [dispatch]);

  const handleDetectLocation = () => {
    dispatch(clearError());
    dispatch(detectLocation());
  };

  const handleLocationSelect = (cityKey) => {
    dispatch(setLocation({ cityKey, subLocation: availableCities[cityKey].name }));
    navigate('/home');
  };

  const handleClose = () => {
    navigate('/home');
  };

  const filteredCities = Object.keys(availableCities).filter(cityKey => {
    const cityName = availableCities[cityKey].name;
    const query = searchQuery.toLowerCase();
    return cityName.toLowerCase().includes(query);
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={handleClose}
            style={{ WebkitTapHighlightColor: 'transparent' }}
            className="p-2 rounded-md bg-white text-gray-600 shadow-lg shadow-green-300 active:shadow-none focus:outline-none transition-all duration-200"
            aria-label="Close Location Selection"
          >
            <FaClose className="text-gray-600" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 text-center flex-grow">Select Location</h1>
          <div className="w-10" /> {/* spacer for centering */}
        </div>
      </header>

      <main className="flex-grow max-w-md mx-auto w-full px-4 py-6 space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center bg-white rounded-full px-4 py-3 shadow-sm border border-gray-300">
            <FaSearch className="text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400"
              aria-label="Search Cities"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Clear Search"
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
            className="inline-flex items-center text-red-600 font-semibold hover:text-red-800 underline text-sm focus:outline-none focus:ring-2 focus:ring-red-300 rounded"
            aria-live="polite"
          >
            <FaLocationCrosshairs className="mr-2" aria-hidden="true" />
            {locationLoading ? 'Detecting Location...' : 'Detect My Location'}
          </button>
          {locationError && (
            <p className="mt-2 text-xs text-red-600">{locationError}</p>
          )}
        </div>

        {/* Cities Grid */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Cities</h2>
          {filteredCities.length === 0 ? (
            <p className="text-center text-gray-500 text-sm">No cities found.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              {filteredCities.map((cityKey) => (
                <button
                  key={cityKey}
                  onClick={() => handleLocationSelect(cityKey)}
                  className="bg-white rounded-lg p-4 flex flex-col items-center shadow hover:shadow-lg transition-shadow focus:outline-none focus:ring-2 focus:ring-green-400"
                  aria-label={`Select city ${availableCities[cityKey].name}`}
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-300 mb-3 flex items-center justify-center">
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
          )}
        </section>

        {/* Coming Soon Message */}
        {showComingSoon && (
          <section className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 text-center">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">Coming Soon to Your City!</h3>
            <p className="text-yellow-700 text-sm max-w-xs mx-auto">
              We're currently available in Delhi, Mumbai, Bengaluru, Hyderabad, and Odisha.<br />
              Stay tuned as we expand to more cities soon!
            </p>
            <button
              onClick={() => setShowComingSoon(false)}
              className="mt-3 text-yellow-600 hover:text-yellow-800 underline text-sm focus:outline-none"
            >
              Choose from available cities
            </button>
          </section>
        )}
      </main>
    </div>
  );
};

export default LocationSelection;
