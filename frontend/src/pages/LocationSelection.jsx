import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaTimes, FaTimes as FaClose } from 'react-icons/fa';
import {
  detectLocation,
  setLocation,
  setManualLocation,
  loadPersistedLocation,
  clearError
} from '../store/slices/locationSlice';
import LocationCard from '../components/LocationCard';
import Button from '../components/Button';
import useCurrentAddress from '../hooks/useCurrentAddress';

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
  const [expandedCity, setExpandedCity] = useState(null);
  const { currentAddress, loading: addressLoading, error: addressError } = useCurrentAddress();
  const [showComingSoon, setShowComingSoon] = useState(false);

  useEffect(() => {
    // Load persisted location on component mount
    dispatch(loadPersistedLocation());
  }, [dispatch, navigate]);

  useEffect(() => {
    // Check if current address is in available cities
    if (currentAddress && currentAddress !== 'Select Location') {
      const availableCityNames = Object.values(availableCities).map(city => city.name.toLowerCase());
      const availableSubLocations = Object.values(availableCities).flatMap(city => city.subLocations.map(sub => sub.toLowerCase()));

      const addressLower = currentAddress.toLowerCase();
      const isAvailable = availableCityNames.some(city => addressLower.includes(city)) ||
                         availableSubLocations.some(sub => addressLower.includes(sub));

      if (!isAvailable) {
        setShowComingSoon(true);
      } else {
        // If available, set the location and navigate to home
        // Find the matching city and sublocation
        let matchedCityKey = null;
        let matchedSubLocation = null;

        for (const [cityKey, cityData] of Object.entries(availableCities)) {
          if (addressLower.includes(cityData.name.toLowerCase())) {
            matchedCityKey = cityKey;
            matchedSubLocation = cityData.name; // Default to city name
            break;
          }
          const matchingSub = cityData.subLocations.find(sub => addressLower.includes(sub.toLowerCase()));
          if (matchingSub) {
            matchedCityKey = cityKey;
            matchedSubLocation = matchingSub;
            break;
          }
        }

        if (matchedCityKey && matchedSubLocation) {
          dispatch(setLocation({ cityKey: matchedCityKey, subLocation: matchedSubLocation }));
          navigate('/home');
        }
      }
    }
  }, [currentAddress, availableCities, dispatch, navigate]);

  const handleDetectLocation = () => {
    dispatch(clearError());
    dispatch(detectLocation());
  };

  const handleLocationSelect = (cityKey, subLocation) => {
    dispatch(setLocation({ cityKey, subLocation }));
    navigate('/home');
  };

  const handleCityToggle = (cityKey) => {
    setExpandedCity(expandedCity === cityKey ? null : cityKey);
  };

  const filteredCities = Object.keys(availableCities).filter(cityKey => {
    const cityName = availableCities[cityKey].name;
    const subLocations = availableCities[cityKey].subLocations;
    const query = searchQuery.toLowerCase();
    return cityName.toLowerCase().includes(query) || subLocations.some(sub => sub.toLowerCase().includes(query));
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/home')}
            className="p-2 hover:bg-gray-100 rounded-full"
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
              placeholder={currentAddress || "Search for a city..."}
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
            className="text-red-500 font-medium hover:text-red-700 underline text-sm"
          >
            {locationLoading ? 'Detecting Location...' : 'Detect My Location'}
          </button>
        </div>



        {/* All Cities Grid */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Cities</h3>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(availableCities).map((cityKey) => (
              <button
                key={cityKey}
                onClick={() => handleCityToggle(cityKey)}
                className="bg-white rounded-lg shadow-sm p-4 flex flex-col items-center hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 mb-2">
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

        {/* Expanded Sub-locations */}
        {expandedCity && (
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h4 className="text-md font-semibold text-gray-900 mb-3">{availableCities[expandedCity].name} Locations</h4>
            <div className="space-y-2">
              {availableCities[expandedCity].subLocations.map((subLocation, index) => (
                <button
                  key={index}
                  onClick={() => handleLocationSelect(expandedCity, subLocation)}
                  className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <span className="text-gray-700 font-medium">{subLocation}</span>
                </button>
              ))}
            </div>
          </div>
        )}

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
            onClick={() => {
              // Set default location to Delhi
              dispatch(setLocation({ cityKey: 'delhi', subLocation: 'Delhi' }));
              navigate('/home');
            }}
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
