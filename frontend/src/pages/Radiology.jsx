import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CartButton from '../components/CartButton';
import { showToast } from '../components/Toast';
import { apiService } from '../services/apiService';

const pageSize = 6; // items per page

const Radiology = () => {
  const navigate = useNavigate();
  const { selectedLocation } = useSelector((state) => state.location);

  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentQuery, setCurrentQuery] = useState('men');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!selectedLocation) {
      navigate('/location', { replace: true });
      return;
    }

    loadTests(currentQuery);
    loadCartData();
  }, [selectedLocation, navigate, currentQuery]);

  const loadTests = async (query = null) => {
    try {
      setIsLoading(true);
      const cityName = selectedLocation.name.toLowerCase();
      let response;

      if (query && isSearching) {
        // For search, we might need to filter from loaded tests or use a search API
        // For now, filter from loaded tests
        if (tests.length > 0) {
          const filtered = tests.filter(test =>
            test.name.toLowerCase().includes(query.toLowerCase())
          );
          setSearchResults(filtered);
        }
      } else {
        response = await apiService.getRadiologyTests(cityName);
        if (response && response.data) {
          setTests(response.data);
        }
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

    // Reset pagination on new search
    setCurrentPage(1);
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

  const displayTests = isSearching ? searchResults : tests;

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

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

      <div className="px-4 py-4">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search radiology tests..."
        />
      </div>

      <div className="pb-24 pt-4">
        {isSearching ? (
          <SearchResults
            tests={displayTests}
            isInCart={isInCart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        ) : (
          <PopularTests
            tests={displayTests}
            isInCart={isInCart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <CartButton itemCount={cartItems.length} onTap={handleViewCart} />
    </div>
  );
};

// -------------------- Helper Components --------------------
const SearchResults = ({ tests, isInCart, onAddToCart, onRemoveFromCart, currentPage, onPageChange }) => (
  <div className="px-4 py-4">
    <h2 className="text-lg font-semibold mb-4">Search Results</h2>
    {tests.length === 0 ? (
      <p className="text-gray-600">No radiology tests found</p>
    ) : (
      <Section
        items={tests}
        Component={TestCard}
        isInCart={isInCart}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
        page={currentPage}
        onPageChange={onPageChange}
      />
    )}
  </div>
);

const PopularTests = ({ tests, isInCart, onAddToCart, onRemoveFromCart, currentPage, onPageChange }) => (
  <div className="px-4 mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">
        <span className="text-green-600">Popular</span> Radiology Tests
      </h2>
    </div>
    {tests.length === 0 ? (
      <p className="text-gray-600">No radiology tests available</p>
    ) : (
      <Section
        items={tests}
        Component={TestCard}
        isInCart={isInCart}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
        page={currentPage}
        onPageChange={onPageChange}
      />
    )}
  </div>
);

const Section = ({ items, Component, isInCart, onAddToCart, onRemoveFromCart, page, onPageChange }) => {
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(items.length / pageSize);

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        {paginatedItems.map(item => (
          <Component key={item.id} test={item} isInCart={isInCart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// -------------------- Test Card --------------------
const TestCard = ({ test, isInCart, onAddToCart, onRemoveFromCart }) => {
  const lab = test.labs?.[0] || {};
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-1">{test.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{lab.labName || 'N/A'}</p>
          <p className="text-xs text-gray-600">{lab.type || 'Radiology'}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-green-600">₹{lab.price || test.price || 'N/A'}</p>
        </div>
      </div>
      <button
        onClick={() => isInCart(test.id) ? onRemoveFromCart(test.id) : onAddToCart(test)}
        className={`w-full py-2 rounded-full text-sm font-medium ${isInCart(test.id) ? 'bg-red-500 text-white' : 'bg-green-400 text-white'}`}
      >
        {isInCart(test.id) ? 'Remove' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default Radiology;
