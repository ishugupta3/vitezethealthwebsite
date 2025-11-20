import React, { useState, useEffect, useRef } from 'react';
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

    loadTests();
    loadCartData();
  }, [selectedLocation, navigate]);

  const loadTests = async (query = null) => {
    try {
      setIsLoading(true);
      const cityName = selectedLocation.name.toLowerCase();

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
        const response = await apiService.getRadiologyTests(cityName);
        console.log('Radiology response in component:', response);
        if (response && response.data) {
          console.log('Setting tests:', response.data);
          setTests(response.data);
        } else {
          console.log('Setting tests to empty array');
          setTests([]);
        }
      }
    } catch (error) {
      console.error('Error loading radiology tests:', error);
      showToast('Failed to load radiology tests');
      setTests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCartData = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const searchTimeoutRef = useRef(null);

  const handleSearch = (query) => {
    setSearchQuery(query);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length >= 3) {
      searchTimeoutRef.current = setTimeout(async () => {
        setIsSearching(true);
        try {
          const cityName = selectedLocation.name;
          const response = await apiService.searchTests(query, cityName);
          if (response && response.result && response.result.radiology_tests) {
            setSearchResults(response.result.radiology_tests);
          } else {
            setSearchResults([]);
          }
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        }
      }, 500); // 500ms debounce
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }

    // Reset pagination on new search
    setCurrentPage(1);
  };

  const handleViewCart = () => {
    showToast('View cart coming soon');
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

      <div className="px-4 py-4 block md:hidden">
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
      <SearchResultsSection
        items={tests}
        isInCart={isInCart}
        onAddToCart={onAddToCart}
        onRemoveFromCart={onRemoveFromCart}
        currentPage={currentPage}
        onPageChange={onPageChange}
      />
    )}
  </div>
);

// -------------------- Search Results Section --------------------
// This component is already defined in Pathology.jsx, but Radiology.jsx is missing it.
// Since Radiology.jsx uses it, we need to define it here or import it.
// For now, I'll define it inline.
const SearchResultsSection = ({ items, isInCart, onAddToCart, onRemoveFromCart, currentPage, onPageChange }) => {
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(items.length / pageSize);

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        {paginatedItems.map((item) => (
          <SearchResultCard
            key={item.id}
            item={item}
            isInCart={isInCart}
            onAddToCart={onAddToCart}
            onRemoveFromCart={onRemoveFromCart}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">{currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// -------------------- Search Result Card --------------------
// This component is already defined in Pathology.jsx, but Radiology.jsx is missing it.
// Since Radiology.jsx uses it, we need to define it here or import it.
// For now, I'll define it inline.
const SearchResultCard = ({ item, isInCart, onAddToCart, onRemoveFromCart }) => {
  const lab = item.labs?.[0] || {};
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-1">{item.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{lab.labName || 'N/A'}</p>
          <p className="text-xs text-gray-600">{item.type || 'Radiology'}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-green-600">{item.price}</p>
        </div>
      </div>
      <button
        onClick={() => isInCart(item.id) ? onRemoveFromCart(item.id) : onAddToCart(item)}
        className={`w-full py-2 rounded-full text-sm font-medium ${isInCart(item.id) ? 'bg-red-500 text-white' : 'bg-green-400 text-white'}`}
      >
        {isInCart(item.id) ? 'Remove' : 'Add to Cart'}
      </button>
    </div>
  );
};

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
  const safeItems = Array.isArray(items) ? items : [];
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = safeItems.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(safeItems.length / pageSize);

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        {paginatedItems.map(item => (
          <Component key={item.id || item.name} test={item} isInCart={isInCart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} />
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
