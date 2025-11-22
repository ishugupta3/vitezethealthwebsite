import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
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
import card from "./pages/CartPage";

function AppContent() {
  const location = useLocation();
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
        <Route path="/CardPage" element={<card />} />
      </Routes>
      {location.pathname !== "/" && <Footer />}
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
