import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import { store } from './store/store';
import WelcomeScreen from "./components/WelcomeScreen";
import Login from "./pages/Login";
import Register from "./pages/Register";
import OtpVerify from "./pages/OtpVerify";
import Home from "./pages/home";
import PartnerWithUs from "./pages/PartnerWithUs";
import ContactUs from "./pages/ContactUs";
import Toast from "./components/Toast";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toast />
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/otp" element={<OtpVerify />} />
          <Route path="/verify-otp" element={<OtpVerify />} />
          <Route path="/home" element={<Home />} />
          <Route path="/partner" element={<PartnerWithUs />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
