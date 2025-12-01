import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CartButton from '../components/CartButton';
import { showToast } from '../components/Toast';
import { apiService } from '../services/apiService';

const pageSize = 18; // items per page

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

  const [currentPage, setCurrentPage] = useState({
    lab_tests: 1,
    packages: 1,
  });

  const [currentSearchPage, setCurrentSearchPage] = useState(1);

  const [selectedCategories, setSelectedCategories] = useState('lab_tests');

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
      const cityName = selectedLocation.name;
      let response;

      if (query && isSearching) {
        response = await apiService.searchTests(query, cityName);
      } else {
        response = await apiService.getAllTests(cityName);
        response = { status: 200, result: response };
      }

      if (response && response.status && response.result) {
        const normalizedResult = {
          lab_tests: response.result.lab_tests || [],
          packages: response.result.packages || [],
          profile_tests: response.result.profile_tests || [],
          radiology_tests: response.result.radiology_tests || [],
        };

        if (isSearching) {
          setSearchResults(normalizedResult);
        } else {
          setTests(normalizedResult);
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
          if (response && response.result) {
            const normalizedResult = {
              lab_tests: response.result.lab_tests || [],
              packages: response.result.packages || [],
              profile_tests: response.result.profile_tests || [],
              radiology_tests: [], // Exclude radiology_tests for Pathology page
            };
            setSearchResults(normalizedResult);
          } else {
            setSearchResults({ lab_tests: [], packages: [], profile_tests: [], radiology_tests: [] });
          }
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults({ lab_tests: [], packages: [], profile_tests: [], radiology_tests: [] });
        }
      }, 500); // 500ms debounce
    } else {
      setIsSearching(false);
      setSearchResults({ lab_tests: [], packages: [], profile_tests: [], radiology_tests: [] });
    }

    // Reset pagination on new search
    setCurrentPage({ lab_tests: 1, packages: 1 });
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
  let { lab_tests = [], packages = [], profile_tests = [], radiology_tests = [] } = displayTests;

  const handlePageChange = (section, newPage) => {
    setCurrentPage(prev => ({ ...prev, [section.toLowerCase().replace(' ', '_')]: newPage }));
  };

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
      <Header
        onLocationTap={() => navigate('/location')}
        displayAddress={selectedLocation ? selectedLocation.name : "Detect My Location"}
        cartCount={cartItems.length}
        onCartTap={handleViewCart}
      />

      {/* Arrow button to redirect to home */}
      <button
        onClick={() => navigate('/home')}
        className="fixed top-20 left-4 z-40 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200 border border-gray-200"
        aria-label="Go to Home"
      >
        <FaArrowLeft className="text-gray-700 text-lg" />
      </button>

      <div className="px-4 py-4 block md:hidden">
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search tests..."
        />
      </div>

      <div className="pb-24 pt-4">
        {isSearching ? (
          <SearchResults
            lab_tests={lab_tests}
            packages={packages}
            profile_tests={profile_tests}
            radiology_tests={radiology_tests}
            isInCart={isInCart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            currentPage={currentSearchPage}
            onPageChange={setCurrentSearchPage}
          />
        ) : (
          <PopularTests
            lab_tests={lab_tests}
            packages={packages}
            profile_tests={profile_tests}
            radiology_tests={radiology_tests}
            isInCart={isInCart}
            onAddToCart={handleAddToCart}
            onRemoveFromCart={handleRemoveFromCart}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
          />
        )}
      </div>

      <CartButton itemCount={cartItems.length} onTap={handleViewCart} />
    </div>
  );
};

// -------------------- Helper Components --------------------
const SearchResults = ({ lab_tests, packages, profile_tests, radiology_tests, isInCart, onAddToCart, onRemoveFromCart, currentPage, onPageChange }) => {
  // Combine all search results into one list
  const allItems = [
    ...lab_tests.map(item => ({ ...item, type: 'Lab' })),
    ...profile_tests.map(item => ({ ...item, type: 'Profile' })),
    ...packages.map(item => ({ ...item, type: 'Package' })),
    ...radiology_tests.map(item => ({ ...item, type: 'Radiology' }))
  ];

  return (
    <div className="px-4 py-4">
      <h2 className="text-lg font-semibold mb-4">Search Results</h2>
      {allItems.length === 0 ? (
        <p className="text-gray-600">No tests found</p>
      ) : (
        <SearchResultsSection
          items={allItems}
          isInCart={isInCart}
          onAddToCart={onAddToCart}
          onRemoveFromCart={onRemoveFromCart}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

const PopularTests = ({ lab_tests, packages, profile_tests, radiology_tests, isInCart, onAddToCart, onRemoveFromCart, currentPage, onPageChange, selectedCategories, setSelectedCategories }) => {
  const toggleCategory = (category) => {
    setSelectedCategories(category);
  };

  // Merge profile_tests into lab_tests for display
  const combinedLabTests = [...lab_tests, ...profile_tests];

  return (
    <div className="px-4 mb-6">
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
        <p className="text-lg font-semibold mb-2">You can select multiple tests</p>
        <p className="text-gray-600">We assist you in lab test booking</p>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <button
          onClick={() => toggleCategory('lab_tests')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategories === 'lab_tests' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Lab Tests
        </button>
        <button
          onClick={() => toggleCategory('packages')}
          className={`px-4 py-2 rounded-full text-sm font-medium ${selectedCategories === 'packages' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Packages
        </button>
      </div>
      {selectedCategories === 'lab_tests' && combinedLabTests.length > 0 && <Section title="" items={combinedLabTests} Component={TestCard} isInCart={isInCart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} page={currentPage.lab_tests} onPageChange={onPageChange} sectionKey="lab_tests" />}
      {selectedCategories === 'packages' && packages.length > 0 && <Section title="" items={packages} Component={PackageCard} isInCart={isInCart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} page={currentPage.packages} onPageChange={onPageChange} sectionKey="packages" />}
      {radiology_tests.length > 0 && <Section title="Radiology Tests" items={radiology_tests} Component={TestCard} isInCart={isInCart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} page={1} onPageChange={() => {}} />}
    </div>
  );
};

const Section = ({ title, items, Component, isInCart, onAddToCart, onRemoveFromCart, page, onPageChange, sectionKey }) => {
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = items.slice(startIndex, startIndex + pageSize);
  const totalPages = Math.ceil(items.length / pageSize);

  return (
    <div className="mb-6">
      <h3 className="text-md font-semibold mb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-2">
        {paginatedItems.map(item => (
          <Component key={item.id} {...{ [Component === PackageCard ? 'package' : 'test']: item, isInCart, onAddToCart, onRemoveFromCart }} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-2">
          <button
            disabled={page === 1}
            onClick={() => onPageChange(sectionKey, page - 1)}
            className="px-3 py-1 bg-green-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(sectionKey, page + 1)}
            className="px-3 py-1 bg-green-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// -------------------- Search Results Section --------------------
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
            onClick={() => onPageChange('lab_tests', currentPage - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">{currentPage} / {totalPages}</span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange('lab_tests', currentPage + 1)}
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
const SearchResultCard = ({ item, isInCart, onAddToCart, onRemoveFromCart }) => {
  const lab = item.labs?.[0] || {};
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-1">{item.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{lab.labName || 'N/A'}</p>
          <p className="text-xs text-gray-600">{item.type || 'Lab'}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-green-600">{item.price || lab.price || 'N/A'}</p>
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

// -------------------- Test & Package Cards --------------------
const TestCard = ({ test, isInCart, onAddToCart, onRemoveFromCart }) => {
  const lab = test.labs?.[0] || {};
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="font-medium text-sm">{test.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-green-600">₹{lab.price || 'N/A'}</p>
          <button
            onClick={() => isInCart(test.id) ? onRemoveFromCart(test.id) : onAddToCart(test)}
            className={`px-4 py-1 rounded-full text-xs font-medium ${isInCart(test.id) ? 'bg-red-500 text-white' : 'bg-green-400 text-white'}`}
          >
            {isInCart(test.id) ? 'Remove' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

const PackageCard = ({ package: pkg, isInCart, onAddToCart, onRemoveFromCart }) => {
  const lab = pkg.labs?.[0] || {};
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="font-medium text-sm">{pkg.name}</h3>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-semibold text-blue-600">₹{lab.price || 'N/A'}</p>
          <button
            onClick={() => isInCart(pkg.id) ? onRemoveFromCart(pkg.id) : onAddToCart(pkg)}
            className={`px-4 py-1 rounded-full text-xs font-medium ${isInCart(pkg.id) ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}
          >
            {isInCart(pkg.id) ? 'Remove' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pathology;
