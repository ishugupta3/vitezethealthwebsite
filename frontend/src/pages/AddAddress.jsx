import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import InputField from '../components/InputField';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { apiService } from '../services/apiService';

const AddAddress = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    addressType: 'Home',
    completeAddress: '',
    houseNo: '',
    landmark: '',
    area: '',
    pincode: '',
    city: '',
    latitude: '',
    longitude: ''
  });
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [isCityAutoSelected, setIsCityAutoSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  const addressTypes = ['Home', 'Office', 'Other'];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Load cities from static list
    loadCities();
  }, [isAuthenticated, navigate]);

  const loadCities = () => {
    // Static list of cities - can be expanded as needed
    const staticCities = [
      { id: 1, cityName: 'Bengaluru' },
      { id: 2, cityName: 'Delhi' },
      { id: 3, cityName: 'Mumbai' },
      { id: 4, cityName: 'Hyderabad' },
      { id: 5, cityName: 'Odissa' }
    ];
    setCities(staticCities);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (field === 'completeAddress' && value.trim() === '' && isCityAutoSelected) {
      setIsCityAutoSelected(false);
      setSelectedCity(null);
    }
  };

  const handleAutoFetch = () => {
    // For now, simulate auto-fetch - in real implementation, open map
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // Reverse geocoding to get address
            const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_API_KEY`);
            const data = await response.json();
            if (data.results && data.results[0]) {
              const address = data.results[0].formatted;
              const components = data.results[0].components;

              setFormData(prev => ({
                ...prev,
                completeAddress: address,
                latitude: latitude.toString(),
                longitude: longitude.toString(),
                pincode: components.postcode || '',
                area: components.suburb || components.neighbourhood || '',
                city: components.city || components.town || ''
              }));

              // Auto-select city if found
              const cityMatch = cities.find(c => c.cityName.toLowerCase() === (components.city || components.town || '').toLowerCase());
              if (cityMatch) {
                setSelectedCity(cityMatch);
                setIsCityAutoSelected(true);
              }
            }
          } catch (error) {
            setToast({ show: true, message: 'Failed to fetch location', type: 'error' });
          }
        },
        (error) => {
          setToast({ show: true, message: 'Location access denied', type: 'error' });
        }
      );
    } else {
      setToast({ show: true, message: 'Geolocation not supported', type: 'error' });
    }
  };

  const validateForm = () => {
    if (!formData.completeAddress.trim()) {
      setToast({ show: true, message: 'Please enter complete address', type: 'error' });
      return false;
    }
    if (!formData.area.trim()) {
      setToast({ show: true, message: 'Please enter area', type: 'error' });
      return false;
    }
    if (!formData.pincode.trim()) {
      setToast({ show: true, message: 'Please enter pincode', type: 'error' });
      return false;
    }
    if (formData.pincode.length !== 6) {
      setToast({ show: true, message: 'Please enter valid 6-digit pincode', type: 'error' });
      return false;
    }
    if (!selectedCity) {
      setToast({ show: true, message: 'Please select city', type: 'error' });
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        id: '0', // For new address
        address: formData.completeAddress,
        house_no: formData.houseNo || '-',
        landmark: formData.landmark || '-',
        location: formData.area,
        pincode: formData.pincode,
        city: selectedCity.cityName,
        state: '-',
        longitude: formData.longitude || '0',
        latitude: formData.latitude || '0',
        address_type: formData.addressType
      };

      const response = await apiService.addAddress(payload);
      if (response.status) {
        setToast({ show: true, message: 'Address added successfully', type: 'success' });
        setTimeout(() => navigate('/address-list'), 2000);
      } else {
        setToast({ show: true, message: response.message || 'Failed to add address', type: 'error' });
      }
    } catch (error) {
      setToast({ show: true, message: 'Error adding address', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-xl font-semibold mb-6 text-center">Add Address</h1>

        {/* Address Type Dropdown */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Address Type</label>
          <select
            value={formData.addressType}
            onChange={(e) => handleInputChange('addressType', e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {addressTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {/* Complete Address */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">Complete Address</label>
            <button
              onClick={handleAutoFetch}
              className="px-3 py-1 text-xs bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              Auto Fetch
            </button>
          </div>
          <InputField
            type="text"
            placeholder="Enter complete address"
            value={formData.completeAddress}
            onChange={(value) => handleInputChange('completeAddress', value)}
          />
        </div>

        {/* House/Flat/Block No */}
        <div className="mb-4">
          <InputField
            label="House/Flat/Block No"
            type="text"
            placeholder="Enter house/flat/block no"
            value={formData.houseNo}
            onChange={(value) => handleInputChange('houseNo', value)}
          />
        </div>

        {/* Nearby Landmark */}
        <div className="mb-4">
          <InputField
            label="Nearby Landmark"
            type="text"
            placeholder="Enter landmark"
            value={formData.landmark}
            onChange={(value) => handleInputChange('landmark', value)}
          />
        </div>

        {/* Area and Pincode */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <InputField
              label="Area"
              type="text"
              placeholder="Enter area"
              value={formData.area}
              onChange={(value) => handleInputChange('area', value)}
            />
          </div>
          <div className="flex-1">
            <InputField
              label="Pin Code"
              type="text"
              placeholder="Enter pincode"
              maxLength="6"
              value={formData.pincode}
              onChange={(value) => handleInputChange('pincode', value)}
            />
          </div>
        </div>

        {/* City Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
          <select
            value={selectedCity?.id || ''}
            disabled={isCityAutoSelected}
            onChange={(e) => {
              const city = cities.find(c => c.id.toString() === e.target.value);
              setSelectedCity(city || null);
            }}
            className={`w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              isCityAutoSelected ? 'bg-gray-100 text-gray-500' : ''
            }`}
          >
            <option value="">Select City</option>
            {cities.map(city => (
              <option key={city.id} value={city.id}>{city.cityName}</option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <Button
          text={loading ? 'Saving...' : 'Save Address'}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full"
        />

        {/* Back Button */}
        <button
          onClick={() => navigate('/address-list')}
          className="w-full mt-4 text-gray-600 hover:text-gray-800"
        >
          Back to Address List
        </button>
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
};

export default AddAddress;
