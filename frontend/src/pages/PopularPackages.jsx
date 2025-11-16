import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import PackageCard from '../components/PackageCard';
import CartButton from '../components/CartButton';
import { showToast } from '../components/Toast';
import { apiService } from '../services/apiService';

const PopularPackages = () => {
  const navigate = useNavigate();
  const { selectedLocation } = useSelector((state) => state.location);

  const [cartItems, setCartItems] = useState([]);
  const [popularPackages, setPopularPackages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if location is selected, if not redirect to location selection
    if (!selectedLocation) {
      navigate('/location', { replace: true });
      return;
    }

    loadPopularPackages();
    loadCartData();
  }, [selectedLocation, navigate]);

  const loadPopularPackages = async () => {
    try {
      setIsLoading(true);

      // Fetch popular packages from API
      const cityName = (selectedLocation?.name || 'delhi').toLowerCase();
      const pincode = selectedLocation?.pincode || '110001';
      const popularPackagesRes = await apiService.getPopularPackages(cityName, pincode);

      if (popularPackagesRes.success && popularPackagesRes.data) {
        // Transform API data to match PackageCard format
        // Always filter for Popular type packages only
        const transformedPackages = popularPackagesRes.data
          .filter(pkg => pkg.type === 'Popular')
          .map(pkg => ({
            id: pkg.id,
            name: pkg.name,
            price: pkg.price,
            image: pkg.image,
            itemDetail: pkg.itemDetail ? pkg.itemDetail.split(';').map(item => ({ name: item.trim() })) : [],
            type: pkg.type,
            description: pkg.description,
            testTime: pkg.testTime,
            labName: pkg.labName,
            labAddress: pkg.labAddress
          }));

        setPopularPackages(transformedPackages);
        console.log('Loaded packages:', transformedPackages);
      } else {
        console.error('Failed to load popular packages:', popularPackagesRes);
        setPopularPackages([]);
      }
    } catch (error) {
      console.error('Error loading popular packages:', error);
      setPopularPackages([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadCartData = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
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

      {/* Content */}
      <div className="pb-24 pt-20">
        <div className="px-4 py-4">
          <div className="flex items-center mb-6">
            <button
              onClick={() => navigate('/home')}
              className="mr-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold">
              <span className="text-blue-600">Popular</span> Packages
            </h1>
          </div>



          {popularPackages.length > 0 ? (
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
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No popular packages available at the moment.</p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Cart Button */}
      <CartButton itemCount={cartItems.length} onTap={handleViewCart} />
    </div>
  );
};

export default PopularPackages;
