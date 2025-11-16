import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import SearchBar from '../components/SearchBar';
import CartButton from '../components/CartButton';
import { showToast } from '../components/Toast';
import { apiService } from '../services/apiService';

const pageSize = 6; // items per page

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
    profile_tests: 1,
  });

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

  const handleSearch = async (query) => {
    setSearchQuery(query);
    setCurrentQuery(query);

    if (query.trim()) {
      setIsSearching(true);
      await loadTests(query);
    } else {
      setIsSearching(false);
      setSearchResults({ lab_tests: [], packages: [], profile_tests: [], radiology_tests: [] });
      setCurrentQuery('men');
      await loadTests('men');
    }

    // Reset pagination on new search
    setCurrentPage({ lab_tests: 1, packages: 1, profile_tests: 1 });
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

  // ------------------ Filter search results dynamically ------------------
  if (isSearching && searchQuery.trim()) {
    const queryLower = searchQuery.toLowerCase();
    lab_tests = lab_tests.filter(t => t.name.toLowerCase().includes(queryLower));
    packages = packages.filter(p => p.name.toLowerCase().includes(queryLower));
    profile_tests = profile_tests.filter(t => t.name.toLowerCase().includes(queryLower));
    radiology_tests = radiology_tests.filter(t => t.name.toLowerCase().includes(queryLower));
  }

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
            currentPage={currentPage}
            onPageChange={handlePageChange}
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
          />
        )}
      </div>

      <CartButton itemCount={cartItems.length} onTap={handleViewCart} />
    </div>
  );
};

// -------------------- Helper Components --------------------
const SearchResults = ({ lab_tests, packages, profile_tests, radiology_tests, isInCart, onAddToCart, onRemoveFromCart, currentPage, onPageChange }) => (
  <div className="px-4 py-4">
    <h2 className="text-lg font-semibold mb-4">Search Results</h2>
    {lab_tests.length === 0 && packages.length === 0 && profile_tests.length === 0 && radiology_tests.length === 0 ? (
      <p className="text-gray-600">No tests found</p>
    ) : (
      <>
        {lab_tests.length > 0 && <Section title="Lab Tests" items={lab_tests} Component={TestCard} isInCart={isInCart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} page={currentPage.lab_tests} onPageChange={onPageChange} />}
        {packages.length > 0 && <Section title="Packages" items={packages} Component={PackageCard} isInCart={isInCart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} page={currentPage.packages} onPageChange={onPageChange} />}
        {profile_tests.length > 0 && <Section title="Profile Tests" items={profile_tests} Component={TestCard} isInCart={isInCart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} page={currentPage.profile_tests} onPageChange={onPageChange} />}
        {radiology_tests.length > 0 && <Section title="Radiology Tests" items={radiology_tests} Component={TestCard} isInCart={isInCart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} page={1} onPageChange={() => {}} />}
      </>
    )}
  </div>
);

const PopularTests = ({ lab_tests, packages, profile_tests, radiology_tests, isInCart, onAddToCart, onRemoveFromCart, currentPage, onPageChange }) => (
  <div className="px-4 mb-6">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">
        <span className="text-blue-600">Popular</span> Tests
      </h2>
    </div>
    {lab_tests.length > 0 && <Section title="Lab Tests" items={lab_tests} Component={TestCard} isInCart={isInCart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} page={currentPage.lab_tests} onPageChange={onPageChange} />}
    {packages.length > 0 && <Section title="Packages" items={packages} Component={PackageCard} isInCart={isInCart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} page={currentPage.packages} onPageChange={onPageChange} />}
    {profile_tests.length > 0 && <Section title="Profile Tests" items={profile_tests} Component={TestCard} isInCart={isInCart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} page={currentPage.profile_tests} onPageChange={onPageChange} />}
    {radiology_tests.length > 0 && <Section title="Radiology Tests" items={radiology_tests} Component={TestCard} isInCart={isInCart} onAddToCart={onAddToCart} onRemoveFromCart={onRemoveFromCart} page={1} onPageChange={() => {}} />}
  </div>
);

const Section = ({ title, items, Component, isInCart, onAddToCart, onRemoveFromCart, page, onPageChange }) => {
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
            onClick={() => onPageChange(title, page - 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1">{page} / {totalPages}</span>
          <button
            disabled={page === totalPages}
            onClick={() => onPageChange(title, page + 1)}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

// -------------------- Test & Package Cards --------------------
const TestCard = ({ test, isInCart, onAddToCart, onRemoveFromCart }) => {
  const lab = test.labs?.[0] || {};
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-1">{test.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{lab.labName || 'N/A'}</p>
          <p className="text-xs text-gray-600">{lab.type || 'N/A'}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-blue-600">₹{lab.price || 'N/A'}</p>
        </div>
      </div>
      <button
        onClick={() => isInCart(test.id) ? onRemoveFromCart(test.id) : onAddToCart(test)}
        className={`w-full py-2 rounded-full text-sm font-medium ${isInCart(test.id) ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
      >
        {isInCart(test.id) ? 'Remove' : 'Add to Cart'}
      </button>
    </div>
  );
};

const PackageCard = ({ package: pkg, isInCart, onAddToCart, onRemoveFromCart }) => {
  const lab = pkg.labs?.[0] || {};
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <h3 className="font-medium text-sm mb-1">{pkg.name}</h3>
          <p className="text-xs text-gray-600 mb-2">{lab.labName || 'N/A'}</p>
          <p className="text-xs text-gray-600 mb-2">{pkg.itemDetail ? pkg.itemDetail.replace(/\n/g, ', ') : 'N/A'}</p>
          <p className="text-xs text-gray-600">{lab.type || 'N/A'}</p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-blue-600">₹{lab.price || 'N/A'}</p>
        </div>
      </div>
      <button
        onClick={() => isInCart(pkg.id) ? onRemoveFromCart(pkg.id) : onAddToCart(pkg)}
        className={`w-full py-2 rounded-full text-sm font-medium ${isInCart(pkg.id) ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'}`}
      >
        {isInCart(pkg.id) ? 'Remove' : 'Add to Cart'}
      </button>
    </div>
  );
};

export default Pathology;
