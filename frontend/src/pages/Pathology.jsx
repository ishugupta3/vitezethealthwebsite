import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CartButton from '../components/CartButton';
import { showToast } from '../components/Toast';
import { apiService } from '../services/apiService';

const Pathology = () => {
  const navigate = useNavigate();
  const { selectedLocation } = useSelector((state) => state.location);

  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentQuery, setCurrentQuery] = useState('men');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState({ lab_tests: [], packages: [], profile_tests: [], radiology_tests: [] });
  const [tests, setTests] = useState({ lab_tests: [], packages: [], profile_tests: [], radiology_tests: [] });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!selectedLocation) {
      navigate('/location', { replace: true });
      return;
    }

    loadTests(currentQuery);
    loadCartData();
  }, [selectedLocation, navigate, currentQuery]);

  const loadTests = async (query = 'men') => {
    try {
      setIsLoading(true);
      const cityName = selectedLocation.name; // Use city name as is
      const response = await apiService.searchTests(query, cityName);
      if (response.status && response.result) {
        if (isSearching) {
          setSearchResults(response.result);
        } else {
          setTests(response.result);
        }
      }
    } catch (error) {
      console.error('Error loading tests:', error);
      showToast('Failed to load tests');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCartData = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setCurrentQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      await loadTests(query);
    } else {
      setIsSearching(false);
      setSearchResults([]);
      setCurrentQuery('men');
      await loadTests('men');
    }
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

  const isInCart = (itemId) => {
    return cartItems.some(item => item.id === itemId);
  };

  const displayTests = isSearching ? searchResults : tests;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header
        onLocationTap={() => navigate('/location')}
        displayAddress={selectedLocation ? selectedLocation.name : "Detect My Location"}
        cartCount={cartItems.length}
        onCartTap={handleViewCart}
      />

      {/* Search Bar */}
      <div className="px-4 py-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search tests..."
        />
      </div>

      {/* Content */}
      <div className="pb-24 pt-4">
        {isSearching ? (
          // Search Results
          <div className="px-4 py-4">
            <h2 className="text-lg font-semibold mb-4">Search Results</h2>
            {Object.values(displayTests).every(arr => arr.length === 0) ? (
              <p className="text-gray-600">No tests found</p>
            ) : (
              <>
                {displayTests.lab_tests.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold mb-2">Lab Tests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {displayTests.lab_tests.map((test) => (
                        <TestCard
                          key={test.id}
                          test={test}
                          isInCart={isInCart(test.id)}
                          onAddToCart={handleAddToCart}
                          onRemoveFromCart={handleRemoveFromCart}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {displayTests.packages.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold mb-2">Packages</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {displayTests.packages.map((pkg) => (
                        <PackageCard
                          key={pkg.id}
                          package={pkg}
                          isInCart={isInCart(pkg.id)}
                          onAddToCart={handleAddToCart}
                          onRemoveFromCart={handleRemoveFromCart}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {displayTests.profile_tests.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold mb-2">Profile Tests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {displayTests.profile_tests.map((test) => (
                        <TestCard
                          key={test.id}
                          test={test}
                          isInCart={isInCart(test.id)}
                          onAddToCart={handleAddToCart}
                          onRemoveFromCart={handleRemoveFromCart}
                        />
                      ))}
                    </div>
                  </div>
                )}
                {displayTests.radiology_tests.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-md font-semibold mb-2">Radiology Tests</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {displayTests.radiology_tests.map((test) => (
                        <TestCard
                          key={test.id}
                          test={test}
                          isInCart={isInCart(test.id)}
                          onAddToCart={handleAddToCart}
                          onRemoveFromCart={handleRemoveFromCart}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          // Popular Tests
          <div className="px-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                <span className="text-blue-600">Popular</span> Tests
              </h2>
            </div>

            {displayTests.lab_tests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Lab Tests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayTests.lab_tests.map((test) => (
                    <TestCard
                      key={test.id}
                      test={test}
                      isInCart={isInCart(test.id)}
                      onAddToCart={handleAddToCart}
                      onRemoveFromCart={handleRemoveFromCart}
                    />
                  ))}
                </div>
              </div>
            )}
            {displayTests.packages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Packages</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayTests.packages.map((pkg) => (
                    <PackageCard
                      key={pkg.id}
                      package={pkg}
                      isInCart={isInCart(pkg.id)}
                      onAddToCart={handleAddToCart}
                      onRemoveFromCart={handleRemoveFromCart}
                    />
                  ))}
                </div>
              </div>
            )}
            {displayTests.profile_tests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Profile Tests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayTests.profile_tests.map((test) => (
                    <TestCard
                      key={test.id}
                      test={test}
                      isInCart={isInCart(test.id)}
                      onAddToCart={handleAddToCart}
                      onRemoveFromCart={handleRemoveFromCart}
                    />
                  ))}
                </div>
              </div>
            )}
            {displayTests.radiology_tests.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold mb-2">Radiology Tests</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayTests.radiology_tests.map((test) => (
                    <TestCard
                      key={test.id}
                      test={test}
                      isInCart={isInCart(test.id)}
                      onAddToCart={handleAddToCart}
                      onRemoveFromCart={handleRemoveFromCart}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Cart Button */}
      <CartButton itemCount={cartItems.length} onTap={handleViewCart} />
    </div>
  );
};

// Test Card Component
const TestCard = ({ test, isInCart, onAddToCart, onRemoveFromCart }) => {
  const lab = test.labs && test.labs.length > 0 ? test.labs[0] : {};
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-1">{test.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{lab.labName || 'N/A'}</p>
          <p className="text-xs text-gray-600">
            {lab.type || 'N/A'}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-blue-600">₹{lab.price || 'N/A'}</p>
        </div>
      </div>
      <button
        onClick={() => isInCart ? onRemoveFromCart(test.id) : onAddToCart(test)}
        className={`w-full py-2 rounded-full text-sm font-medium ${
          isInCart
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white'
        }`}
      >
        {isInCart ? 'Remove' : 'Add to Cart'}
      </button>
    </div>
  );
};

// Package Card Component
const PackageCard = ({ package: pkg, isInCart, onAddToCart, onRemoveFromCart }) => {
  const lab = pkg.labs && pkg.labs.length > 0 ? pkg.labs[0] : {};
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-1">{pkg.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{lab.labName || 'N/A'}</p>
          <p className="text-xs text-gray-600 mb-2">
            {pkg.itemDetail ? pkg.itemDetail.replace(/\n/g, ', ') : 'N/A'}
          </p>
          <p className="text-xs text-gray-600">
            {lab.type || 'N/A'}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-blue-600">₹{lab.price || 'N/A'}</p>
        </div>
      </div>
      <button
        onClick={() => isInCart ? onRemoveFromCart(pkg.id) : onAddToCart(pkg)}
        className={`w-full py-2 rounded-full text-sm font-medium ${
          isInCart
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white'
        }`}
      >
        {isInCart ? 'Remove' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default Pathology;
