import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Carousel from '../components/Carousel';
import SearchBar from '../components/SearchBar';
import AiAnalysisWidget from '../components/AiAnalysisWidget';
import PackageCard from '../components/PackageCard';
import CartButton from '../components/CartButton';
import { showToast } from '../components/Toast';
import { homeApi, cartApi } from '../utils/homeApi';
import { apiService } from '../services/apiService';

// Default data to avoid duplication
const defaultCarouselItems = [
  { image: 'https://apihealth.zethealth.com/images/Slider/1748866325432.jpg', title: 'Super Fast Sample Collection' },
  { image: 'https://apihealth.zethealth.com/images/Slider/1748866375563.jpg', title: 'Do your full body check up' },
  { image: 'https://apihealth.zethealth.com/images/Slider/1759156182297.png', title: 'GST Utsav' },
  { image: 'https://apihealth.zethealth.com/images/Slider/1759156213866.jpg', title: 'Zet Health Navratri' },
  { image: 'https://apihealth.zethealth.com/images/Slider/1759156234176.jpg', title: 'Home Collection' },
  { image: 'https://apihealth.zethealth.com/images/Slider/1760725669273.png', title: 'Diwali Sale' },
];

const defaultPopularPackages = [
  {
    id: 1,
    name: 'Complete Health Checkup',
    price: '₹2999',
    image: '/assets/images/packages/health-checkup.jpg',
    itemDetail: [
      { name: 'Blood Test' },
      { name: 'Urine Test' },
      { name: 'ECG' },
      { name: 'X-Ray' },
    ],
  },
  {
    id: 2,
    name: 'Diabetes Package',
    price: '₹1499',
    image: '/assets/images/packages/diabetes.jpg',
    itemDetail: [
      { name: 'Fasting Blood Sugar' },
      { name: 'HbA1c' },
      { name: 'Lipid Profile' },
    ],
  },
];

const defaultLifestylePackages = [
  {
    id: 3,
    name: 'Fitness Package',
    price: '₹1999',
    image: '/assets/images/packages/fitness.jpg',
    itemDetail: [
      { name: 'BMI Check' },
      { name: 'Body Fat Analysis' },
      { name: 'Fitness Assessment' },
    ],
  },
];

const Home = () => {
  const navigate = useNavigate();
  const { selectedLocation } = useSelector((state) => state.location);

  const [cartItems, setCartItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [popularPackages, setPopularPackages] = useState(defaultPopularPackages);
  const [lifestylePackages, setLifestylePackages] = useState(defaultLifestylePackages);
  const [carouselItems, setCarouselItems] = useState(defaultCarouselItems);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if location is selected, if not redirect to location selection
    if (!selectedLocation) {
      navigate('/location', { replace: true });
      return;
    }

    loadHomeData();
    loadCartData();
  }, [selectedLocation, navigate]);

  const loadHomeData = async () => {
    try {
      setIsLoading(true);

      // Fetch popular packages from new API
      const cityName = 'delhi';
      const popularPackagesRes = await apiService.getPopularPackages(cityName);

      if (popularPackagesRes.success && popularPackagesRes.data) {
        // Transform API data to match PackageCard format
        const transformedPackages = popularPackagesRes.data.map(pkg => ({
          id: pkg.id,
          name: pkg.name,
          price: `₹${pkg.price}`,
          image: pkg.image,
          itemDetail: pkg.itemDetail ? pkg.itemDetail.split(';').map(item => ({ name: item.trim() })) : [],
          type: pkg.type,
          description: pkg.description,
          testTime: pkg.testTime,
          labName: pkg.labName,
          labAddress: pkg.labAddress
        }));

        // Filter packages by type
        const popular = transformedPackages.filter(pkg => pkg.type === 'Popular');
        const lifestyle = transformedPackages.filter(pkg => pkg.type === 'Lifestyle');

        setPopularPackages(popular);
        setLifestylePackages(lifestyle);
      } else {
        // Fallback to default data if API fails
        setPopularPackages(defaultPopularPackages);
        setLifestylePackages(defaultLifestylePackages);
      }
    } catch (error) {
      console.error('Error loading home data:', error);
      // Fallback to default data
      setPopularPackages(defaultPopularPackages);
      setLifestylePackages(defaultLifestylePackages);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCartData = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const handleLocationTap = () => {
    // Handle location selection
    showToast('Location selection coming soon');
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      try {
        const cityName = selectedLocation ? selectedLocation.name : 'delhi';
        console.log('Searching for:', query, 'in city:', cityName);
        const response = await apiService.searchTests(query, cityName);
        console.log('Search API Response:', response);

        if (response && response.radiology_tests && response.radiology_tests.length > 0) {
          // Transform API response to match our UI format
          const transformedResults = response.radiology_tests.map(test => {
            // Find the lowest price from labs
            const lowestPrice = Math.min(...test.labs.map(lab => lab.price));
            return {
              id: test.id,
              name: test.name,
              type: 'radiology',
              price: `₹${lowestPrice}`,
              originalPrice: lowestPrice,
              labs: test.labs
            };
          });
          console.log('Transformed results:', transformedResults);
          setSearchResults(transformedResults);
        } else {
          console.log('No radiology tests found');
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching tests:', error);
        setSearchResults([]);
      }
    } else {
      setIsSearching(false);
      setSearchResults([]);
    }
  };

  const handleUploadPrescription = () => {
    // Handle prescription upload
    showToast('Prescription upload coming soon');
  };

  const handleAddToCart = async (item) => {
    const newCartItems = [...cartItems, item];
    setCartItems(newCartItems);
    localStorage.setItem('cart', JSON.stringify(newCartItems));
    showToast('Added to cart');
  };

  const handleRemoveFromCart = async (itemId) => {
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
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
      <div className="px-4 py-4 md:hidden">
        <SearchBar
          onSearch={handleSearch}
        />
      </div>

      {/* Pathology and Radiology Cards */}
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center', padding: '16px' }}>
        {/* Pathology Card */}
        <div
          style={{ background: '#eadcf7', borderRadius: '16px', width: '250px', padding: '24px', cursor: 'pointer' }}
          onClick={() => navigate('/pathology')}
        >
          <h2 style={{ color: '#404040', fontSize: '1.5em', margin: '0' }}>Pathology</h2>
          <p style={{ color: '#6b6b6b', margin: '10px 0 20px 0' }}>Lab Tests, Profiles & Packages</p>
          {/* Pathology Icon (Example SVG, insert relevant image if available) */}
          <svg width="48" height="48" style={{ display: 'block', margin: 'auto' }}>
            {/* Example content: microscope icon */}
            <circle cx="24" cy="24" r="20" fill="#d1b3ee" />
            {/* Add further SVG elements for details */}
          </svg>
        </div>

        {/* Radiology Card */}
        <div style={{ background: '#fff5cc', borderRadius: '16px', width: '250px', padding: '24px' }}>
          <h2 style={{ color: '#404040', fontSize: '1.5em', margin: '0' }}>Radiology</h2>
          <p style={{ color: '#6b6b6b', margin: '10px 0 20px 0' }}>Scans & Imaging</p>
          {/* Radiology Icon (Example SVG, insert relevant image if available) */}
          <svg width="48" height="48" style={{ display: 'block', margin: 'auto' }}>
            {/* Example content: scan table */}
            <rect x="8" y="24" width="32" height="12" fill="#a09cd6" />
            {/* Add further SVG elements for details */}
          </svg>
        </div>
      </div>

      {/* Content */}
      <div className="pb-24 pt-20">
        {isSearching ? (
          // Search Results
          <div className="px-4 py-4">
            <h2 className="text-lg font-semibold mb-4">Search Results</h2>
            {searchResults.length > 0 ? (
              searchResults.map((item) => (
                <div key={item.id} className="bg-white rounded-lg p-4 mb-2 shadow-sm border">
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">Radiology Test</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-semibold text-blue-600 text-lg">{item.price}</p>
                      <button
                        onClick={() => isInCart(item.id) ? handleRemoveFromCart(item.id) : handleAddToCart(item)}
                        className={`px-4 py-2 rounded-full text-sm font-medium mt-2 ${
                          isInCart(item.id)
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        } transition-colors`}
                      >
                        {isInCart(item.id) ? 'Remove' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No results found. Try searching for "MRI", "X-Ray", or "CT Scan".</p>
              </div>
            )}
          </div>
        ) : (
          // Default Home Content
          <>
            {/* Carousel */}
            <div className="px-2 py-2">
              <Carousel items={carouselItems} />
            </div>

            {/* AI Analysis Widget */}
            <AiAnalysisWidget onUploadClick={handleUploadPrescription} />

            {/* Popular Packages */}
            <div id="popular-packages" className="px-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  <span className="text-blue-600">Popular</span> Packages
                </h2>
                <button
                  className="text-blue-600 text-sm font-medium"
                  onClick={() => navigate('/popular-packages')}
                >
                  View all »
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularPackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    package={pkg}
                    isInCart={isInCart(pkg.id)}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    onViewDetails={() => showToast('View details coming soon')}
                  />
                ))}
              </div>
            </div>

            {/* Lifestyle Packages */}
            <div id="lifestyle-packages" className="px-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  <span className="text-blue-600">Lifestyle</span> Packages
                </h2>
                <button
                  className="text-blue-600 text-sm font-medium"
                  onClick={() => navigate('/lifestyle-packages')}
                >
                  View all »
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {lifestylePackages.map((pkg) => (
                  <PackageCard
                    key={pkg.id}
                    package={pkg}
                    isInCart={isInCart(pkg.id)}
                    onAddToCart={handleAddToCart}
                    onRemoveFromCart={handleRemoveFromCart}
                    onViewDetails={() => showToast('View details coming soon')}
                  />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Cart Button */}
      <CartButton itemCount={cartItems.length} onTap={handleViewCart} />
    </div>
  );
};

export default Home;
