import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import Toast from '../components/Toast';
import { apiService } from '../services/apiService';

const AddressList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    if (isAuthenticated) {
      loadAddresses();
    }
  }, [isAuthenticated]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAddressList();
      if (response.status) {
        setAddresses(response.address_list || []);
        const savedSelected = localStorage.getItem('selectedAddress');
        if (savedSelected) {
          setSelectedAddress(JSON.parse(savedSelected));
        } else if (response.address_list && response.address_list.length > 0) {
          setSelectedAddress(response.address_list[0]);
        }
      }
    } catch (error) {
      setToast({ show: true, message: error.message || 'Failed to load addresses', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    localStorage.setItem('selectedAddress', JSON.stringify(address));
    setToast({ show: true, message: 'Address selected successfully', type: 'success' });
    navigate('/home');
  };

  const handleEditAddress = address => {
    navigate('/add-address', { state: { editAddress: address } });
  };

  const handleDeleteAddress = async address => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        const response = await apiService.deleteAddress(address.id);
        if (response.status) {
          setToast({ show: true, message: 'Address deleted successfully', type: 'success' });
          loadAddresses();
        } else {
          setToast({ show: true, message: response.message || 'Failed to delete address', type: 'error' });
        }
      } catch {
        setToast({ show: true, message: 'Error deleting address', type: 'error' });
      }
    }
  };

  // Animated AddressCard with hover and shadow effects
  const AddressCard = ({
    address,
    isSelected,
    onSelect,
    onEdit,
    onDelete
  }) => (
    <div
      className={`relative border rounded-lg p-5 mb-6 transition-all duration-300 ease-in-out transform cursor-pointer
        ${isSelected ? 'border-green-500 bg-green-50 shadow-lg scale-105' : 'border-gray-300 bg-white hover:shadow-xl hover:-translate-y-1'}
        `}
      onClick={() => onSelect(address)}
      onKeyPress={(e) => { if (e.key === 'Enter') onSelect(address); }}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
    >
      {address.addressType && (
        <span className="absolute top-3 right-3 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-4 py-1 rounded-tl-lg rounded-br-lg text-xs font-semibold shadow-lg select-none">
          {address.addressType}
        </span>
      )}
      <div className="flex items-center mb-4">
        <div className="w-9 h-9 mr-4 flex items-center justify-center rounded-full bg-green-100 text-green-600 shadow-inner">
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
            aria-hidden="true"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{address.address}</h3>
          <p className="text-sm text-gray-700 mt-1">
            {address.houseNo && address.houseNo !== '-' && `House No: ${address.houseNo}, `}
            {address.landmark && address.landmark !== '-' && `Landmark: ${address.landmark}, `}
            {address.location && `Location: ${address.location}`}
          </p>
        </div>
      </div>

      <div className="flex gap-6 mb-5 text-sm text-gray-600">
        <div className="flex-1 bg-gray-100 px-3 py-2 rounded-lg select-none">
          <span className="font-medium text-gray-800">City:</span> {address.city || 'N/A'}
        </div>
        <div className="flex-1 bg-gray-100 px-3 py-2 rounded-lg select-none">
          <span className="font-medium text-gray-800">Pincode:</span> {address.pincode || 'N/A'}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          text="Home"
          onClick={(e) => { e.stopPropagation(); onSelect(address); }}
          className="text-xs px-5 py-2 rounded-full bg-green-600 text-white shadow-md transition-shadow duration-300"
        />
        <div className="flex gap-3">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(address); }}
            aria-label="Edit address"
            className="p-2 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(address); }}
            aria-label="Delete address"
            className="p-2 rounded-lg text-red-600 hover:bg-red-100 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  const LoginRequired = () => (
    <div className="min-h-screen bg-gradient-to-tr from-green-100 to-blue-200 flex items-center justify-center p-6">
      <div className="max-w-md text-center bg-white rounded-xl shadow-lg p-12 animate-fadeIn">
        <div className="w-20 h-20 flex items-center justify-center mx-auto mb-6 bg-green-200 rounded-full">
          <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Please log in first</h2>
        <p className="text-gray-600 mb-8">You need to be logged in to view or manage your addresses.</p>
        <Button
          text="Login"
          onClick={() => navigate('/login')}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg shadow-md"
        />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-green-600"></div>
          <p className="text-lg text-green-800 font-medium">Loading addresses...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginRequired />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-tr from-green-50 to-blue-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-extrabold text-green-800 drop-shadow-sm">My Addresses</h1>
          <Button
            text="Add Address"
            onClick={() => navigate('/add-address')}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5"
          />
        </div>

        {addresses.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center animate-fadeIn">
            <div className="mx-auto w-20 h-20 mb-6 bg-green-200 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-green-900">No addresses added yet</h3>
            <p className="mb-6 text-green-700">Start by adding your first address.</p>
            <Button
              text="Add Address"
              onClick={() => navigate('/add-address')}
              className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-md hover:bg-green-700 transition-transform transform hover:-translate-y-1"
            />
          </div>
        ) : (
          <div>
            <p className="mb-6 text-sm text-green-700 font-semibold tracking-wide">Saved Addresses</p>
            {addresses.map(address => (
              <AddressCard
                key={address.id}
                address={address}
                isSelected={selectedAddress?.id === address.id}
                onSelect={handleSelectAddress}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
              />
            ))}
          </div>
        )}

        {toast.show && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast({ ...toast, show: false })}
          />
        )}
      </div>
    </div>
  );
};

export default AddressList;
