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
import Toast from "./components/Toast";
import Footer from "./components/Footer";

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
      </Routes>
      {location.pathname !== "/" && <Footer />}
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
