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

      // Fetch packages data
      const packagesRes = await homeApi.getPackages();
      if (packagesRes.status && packagesRes.result) {
        // Transform packages data
        const transformedPackages = packagesRes.result.map(pkg => ({
          id: pkg.id,
          name: pkg.name,
          price: `₹${pkg.price}`,
          image: pkg.image || '/assets/images/packages/default.jpg',
          itemDetail: pkg.tests ? pkg.tests.map(test => ({ name: test.name })) : [],
        }));
        setPopularPackages(transformedPackages.slice(0, 2)); // First 2 as popular
        setLifestylePackages(transformedPackages.slice(2, 4)); // Next 2 as lifestyle
      }
    } catch (error) {
      console.error('Error loading home data:', error);
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

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      setIsSearching(true);
      // Mock search results - replace with actual API
      setSearchResults([
        { id: 1, name: 'Blood Test', type: 'test', price: '₹500' },
        { id: 2, name: 'Diabetes Package', type: 'package', price: '₹1499' },
      ]);
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
      <Header />

      {/* Search Bar */}
      <SearchBar
        onSearch={handleSearch}
        onLocationTap={() => navigate('/location')}
        displayAddress={selectedLocation ? selectedLocation.displayName : "Select Location"}
        cartCount={cartItems.length}
        onCartTap={handleViewCart}
      />

      {/* Content */}
      <div className="pb-24 pt-20">
        {isSearching ? (
          // Search Results
          <div className="px-4 py-4">
            <h2 className="text-lg font-semibold mb-4">Search Results</h2>
            {searchResults.map((item) => (
              <div key={item.id} className="bg-white rounded-lg p-4 mb-2 shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-blue-600">{item.price}</p>
                    <button
                      onClick={() => isInCart(item.id) ? handleRemoveFromCart(item.id) : handleAddToCart(item)}
                      className={`px-4 py-2 rounded-full text-sm font-medium ${
                        isInCart(item.id)
                          ? 'bg-red-500 text-white'
                          : 'bg-blue-500 text-white'
                      }`}
                    >
                      {isInCart(item.id) ? 'Remove' : 'Add'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
            <div className="px-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  <span className="text-blue-600">Popular</span> Packages
                </h2>
                <button className="text-blue-600 text-sm font-medium">
                  View all »
                </button>
              </div>

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

            {/* Lifestyle Packages */}
            <div className="px-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  <span className="text-blue-600">Lifestyle</span> Packages
                </h2>
                <button className="text-blue-600 text-sm font-medium">
                  View all »
                </button>
              </div>

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
          </>
        )}
      </div>

      {/* Floating Cart Button */}
      <CartButton itemCount={cartItems.length} onTap={handleViewCart} />
    </div>
  );
};

export default Home;
