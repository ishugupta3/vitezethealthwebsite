import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CartButton from '../components/CartButton';
import { showToast } from '../components/Toast';
import { apiService } from '../services/apiService';

const pageSize = 15; // items per page

const Radiology = () => {
  const navigate = useNavigate();
  const { selectedLocation } = useSelector((state) => state.location);

  const [cartItems, setCartItems] = useState([]);
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!selectedLocation) {
      navigate('/location', { replace: true });
      return;
    }

    loadTests();
    loadCartData();
  }, [selectedLocation, navigate]);

  const loadTests = async () => {
    try {
      setIsLoading(true);
      const cityName = selectedLocation.name;
      const response = await apiService.getRadiologyTests(cityName);

      if (response && response.status === 200 && response.result) {
        setTests(response.result.lab_tests || []);
      }
    } catch (error) {
      console.error('Error loading radiology tests:', error);
      showToast('Failed to load radiology tests');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCartData = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const handleAddToCart = (item) => {
    const newCartItems = [...cartItems, item];
    setCartItems(newCartItems);
    localStorage.setItem('cart', JSON.stringify(newCartItems));
    showToast('Added to cart');
  };

  const handleRemoveFromCart = (itemId) => {
    const newCartItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(newCartItems);
    localStorage.setItem('cart', JSON.stringify(newCartItems));
    showToast('Removed from cart');
  };

  const handleViewCart = () => {
    showToast('View cart coming soon');
  };

  const isInCart = (itemId) => cartItems.some(item => item.id === itemId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading radiology tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        onLocationTap={() => navigate('/location')}
        displayAddress={selectedLocation ? selectedLocation.name : "Detect My Location"}
        cartCount={cartItems.length}
        onCartTap={handleViewCart}
      />

      <div className="px-4 py-4 block md:hidden">
        <SearchBar
          onSearch={() => {}}
          placeholder="Search radiology tests..."
        />
      </div>

      <div className="pb-24 pt-4">
        {selectedTest ? (
          <TestDetails
            test={selectedTest}
            onBack={() => {
              setSelectedTest(null);
              setCurrentPage(1);
            }}
            isInCart={isInCart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
          />
        ) : (
          <TestList
            tests={tests}
            onTestClick={(test) => {
              setSelectedTest(test);
              setCurrentPage(1);
            }}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        )}
      </div>

      <CartButton itemCount={cartItems.length} onTap={handleViewCart} />
    </div>
  );
};

const TestList = ({ tests, onTestClick, currentPage, onPageChange }) => {
  const navigate = useNavigate();

  const startIndex = (currentPage - 1) * pageSize;
  const paginatedTests = tests.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(tests.length / pageSize);

  return (
    <div className="px-4 mb-6">
      <button
        onClick={() => navigate('/home')}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-full text-sm font-medium flex items-center gap-2"
      >
        <img src="/src/assets/icons/back_arrow.svg" alt="Back" className="w-4 h-4" />
        Back to Home
      </button>
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <p className="text-lg font-semibold mb-2">Radiology Tests</p>
        <p className="text-gray-600">Select a test to view available labs</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {paginatedTests.map(test => (
          <TestCard key={test.id} test={test} onClick={() => onTestClick(test)} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 bg-green-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">{currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 bg-green-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

const TestCard = ({ test, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <h3 className="font-medium text-sm mb-2">{test.name}</h3>
      <p className="text-xs text-gray-600">
        {test.labs ? `${test.labs.length} labs available` : 'Labs available'}
      </p>
    </div>
  );
};

const TestDetails = ({ test, onBack, isInCart, onAddToCart, onRemoveFromCart }) => {
  return (
    <div className="px-4 mb-6">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-gray-200 rounded-full text-sm font-medium flex items-center gap-2"
      >
        <img src="/src/assets/icons/back_arrow.svg" alt="Back" className="w-4 h-4" />
        Back to Tests
      </button>

      <h2 className="text-lg font-semibold mb-4">{test.name}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {test.labs &&
          test.labs.map((lab, index) => (
            <LabCard
              key={`${test.id}-${lab.id ?? index}`}
              lab={lab}
              test={test}
              index={index}
              isInCart={isInCart}
              onAddToCart={onAddToCart}
              onRemoveFromCart={onRemoveFromCart}
            />
          ))}
      </div>
    </div>
  );
};

const LabCard = ({ lab, test, index, isInCart, onAddToCart, onRemoveFromCart }) => {
  // Unique ID for each lab under a test
  const labKey = lab.id ?? index;
  const uniqueId = `${test.id}-${labKey}`;

  // Minimal cart item
  const item = {
    id: uniqueId,
    testId: test.id,
    testName: test.name,
    labId: lab.id ?? null,
    labName: lab.labName,
    price: lab.price ?? 0,
    address: lab.labAddress || lab.address || '',
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-1">{lab.labName}</h3>
          <p className="text-xs text-gray-600 mb-2">
            {lab.labAddress || lab.address || 'Address not available'}
          </p>
          {lab.latitude && lab.longitude && (
            <p className="text-xs text-gray-600">
              Lat: {lab.latitude}, Lng: {lab.longitude}
            </p>
          )}
        </div>

        <p className="font-semibold text-green-600">₹{lab.price ?? 'N/A'}</p>
      </div>

      <button
        onClick={() =>
          isInCart(uniqueId)
            ? onRemoveFromCart(uniqueId)
            : onAddToCart(item)
        }
        className={`w-full py-2 rounded-full text-sm font-medium ${
          isInCart(uniqueId)
            ? 'bg-red-500 text-white'
            : 'bg-green-400 text-white'
        }`}
      >
        {isInCart(uniqueId) ? 'Remove' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default Radiology;
