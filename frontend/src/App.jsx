import React, { useEffect, useState } from "react";
import { HashRouter, Routes, Route, useLocation, useNavigate, Navigate, Link } from "react-router-dom";
import { Provider, useDispatch } from 'react-redux';
import { store } from './store/store';
import { loadPersistedLocation } from './store/slices/locationSlice';
import WelcomeScreen from "./components/WelcomeScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerify from "./pages/OtpVerify";
import LocationSelection from "./pages/LocationSelection";
import Home from "./pages/home";
import PartnerWithUs from "./pages/PartnerWithUs";
import ContactUs from "./pages/ContactUs";
import AboutUs from "./pages/AboutUs";
import AddAddress from "./pages/AddAddress";
import AddressList from "./pages/AddressList";
import Pathology from "./pages/Pathology";
import Radiology from "./pages/Radiology";
import PopularPackages from "./pages/PopularPackages";
import LifestylePackages from "./pages/LifestylePackages";
import PackageDetail from "./pages/PackageDetail";
import Toast from "./components/Toast";
import Footer from "./components/Footer"; 
import useCurrentAddress from "./hooks/useCurrentAddress";

import { initializeAuth } from './store/slices/authSlice';


function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Dispatch initializeAuth on mount to restore auth state from localStorage
  React.useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const { currentAddress, loading: locationLoading, error } = useCurrentAddress();
  const [locationLoaded, setLocationLoaded] = useState(false);

  useEffect(() => {
    dispatch(loadPersistedLocation());
    setLocationLoaded(true);
  }, [dispatch]);

  // Save last route to sessionStorage on route change
  useEffect(() => {
    if (location.pathname !== "/") {
      sessionStorage.setItem("lastRoute", location.pathname);
    }
  }, [location]);

  // On app load, redirect to last visited route if exists and current path is "/"
  useEffect(() => {
    if (location.pathname === "/" && locationLoaded) {
      const lastRoute = sessionStorage.getItem("lastRoute");
      // Avoid redirecting to "/location" automatically to prevent unwanted redirects
      if (lastRoute && lastRoute !== "/" && lastRoute !== "/location") {
        navigate(lastRoute, { replace: true });
      }
    }
  }, [location, navigate, locationLoaded]);

  if (!locationLoaded) {
    return <div>Loading...</div>;
  }
  
  return (
    <>
      <Toast />
      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/otp" element={<OtpVerify />} />
        <Route path="/verify-otp" element={<OtpVerify />} />
        <Route path="/location" element={<LocationSelection />} />
        <Route path="/home" element={<Home />} />
        <Route path="/partner" element={<PartnerWithUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/add-address" element={<AddAddress />} />
        <Route path="/address-list" element={<AddressList />} />
        <Route path="/pathology" element={<Pathology />} />
        <Route path="/radiology" element={<Radiology />} />
        <Route path="/popular-packages" element={<PopularPackages />} />
        <Route path="/lifestyle-packages" element={<LifestylePackages />} />
        <Route path="/package-detail" element={<PackageDetail />} />
        {/* Wildcard route to handle unmatched paths */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {location.pathname !== "/" && <Footer />}
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </HashRouter>
    </Provider>
  );
}

export default App;
