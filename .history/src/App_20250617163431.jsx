import React, { useEffect, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import PropertyDetailDebug from './PropertyDetailDebug';
import './assets/css/property-fix.css';
import {
  HomePage,
  PropertyListPage,
  PropertyRentListPage,
  PropertySellListPage,
  SigninPage,
  SignUpPage,
  ForgotPasswordPage,
  NewPasswordPage,
  OTPPage,
  TestOtpFlow,
  AccountManagementPage,
  FindAgentPage,
  MortgageCalculatorDemo
} from './RoutesMain.jsx';
import PropertyDetailMain from './components/property-detail';
import { SimpleMortgageCalculator } from './components/mortgage-calculator';
import TestPropertyDetail from './components/property-detail/TestPropertyDetail';
import ChoosePromotion from './components/payment-method/choose-propmo/sub-component/ChoosePropmotionFixed';
import PaymentMethod from './components/payment-method/payment-process/sub-component/PaymentMethod';
// import BuyPropertyPage from './components/Property-list/BuyPropertyPage';
import EnableTestMode from './helper/EnableTestMode';
import PropertyListForm from './components/property-list-form';
import EditPropertyForm from './components/property-edit-form/sub-component/EditPropertyForm';
import MyListProperty from './components/Property-list/sub-component/MyListProperty';
import MyPropertyListings from './components/Property-list/sub-component/MyPropertyListings';
import MyPropertyListingsPage from './components/Property-list/sub-component/MyPropertyListingsPage';
import Header from './components/common/header/Header';
import Footer from './components/common/footer/Footer';
import LoginPopup from './helper/LoginPopup';

const App = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState('');

  useEffect(() => {
    console.log("App component mounted");
    
    // Add event listener for the custom event from BannerSection
    const handleShowLoginPopup = (event) => {
      setShowLoginPopup(true);
      // Check if there's a redirect target in the event detail
      if (event.detail && event.detail.redirectTo) {
        setRedirectAfterLogin(event.detail.redirectTo);
      } else {
        setRedirectAfterLogin('');
      }
    };
    
    window.addEventListener('showLoginPopup', handleShowLoginPopup);
    
    // Clean up event listener when component unmounts
    return () => {
      window.removeEventListener('showLoginPopup', handleShowLoginPopup);
    };
  }, []);

  return (
    <div className="app-wrapper" style={{ minHeight: '100vh' }}>
      <Header />
      <EnableTestMode />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/buy" element={<PropertyListPage />} />
          <Route path="/property-list" element={<PropertyListPage />} />
          <Route path="/rent" element={<PropertyRentListPage />} />
          <Route path="/sell" element={<PropertySellListPage />} />
          <Route path="/property-list-form" element={<PropertyListForm />} />
          {/* Redirect property listings routes to account management */}
          <Route path="/my-properties" element={<AccountManagementPage />} />
          <Route path="/my-property-listings" element={<AccountManagementPage />} />
          <Route path="/login" element={<SigninPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/new-password" element={<NewPasswordPage />} />
          <Route path="/otp" element={<OTPPage />} />
          <Route path="/test-otp" element={<TestOtpFlow />} />
          <Route path="/testOtpFlow" element={<TestOtpFlow />} />
          <Route path="/payment-method/choose-promotion" element={<ChoosePromotion />} />
          <Route path="/payment-method/confirmation" element={
            <div className="payment-container" style={{
              maxWidth: '800px',
              margin: '40px auto',
              padding: '30px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Payment Confirmation</h2>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{ backgroundColor: '#edfcf3', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '48px', color: '#25c16f', marginBottom: '10px' }}>✓</div>
                  <h3 style={{ color: '#25c16f', marginBottom: '10px' }}>Success!</h3>
                  <p>Your property has been listed successfully!</p>
                </div>
                <p style={{ color: '#666', marginTop: '10px' }}>You can now view and manage your property in your listings.</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/account-management" style={{
                  padding: '12px 30px',
                  backgroundColor: '#4a6cf7',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '500',
                  marginRight: '10px'
                }}>
                  View My Properties
                </Link>
                <Link to="/" style={{
                  padding: '12px 30px',
                  backgroundColor: 'transparent',
                  color: '#4a6cf7',
                  border: '1px solid #4a6cf7',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  Return to Home
                </Link>
              </div>
            </div>
          } />
          <Route path="/payment" element={
            <div className="payment-container" style={{
              maxWidth: '800px',
              margin: '40px auto',
              padding: '30px',
              backgroundColor: '#fff',
              borderRadius: '12px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
            }}>
              <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Payment Page</h2>
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <p>This is a placeholder for the payment gateway integration.</p>
                <p style={{ color: '#666', marginTop: '10px' }}>In the complete implementation, users would enter their payment details here.</p>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/property-list" style={{
                  padding: '12px 30px',
                  backgroundColor: '#4a6cf7',
                  color: 'white',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: '500'
                }}>
                  Simulate Successful Payment
                </Link>
              </div>
            </div>
          } />
          
          <Route path="/payment-method/payment-process" element={<PaymentMethod />} />
          <Route path="/account-management" element={<AccountManagementPage />} />
          <Route path="/property-edit/:id" element={<EditPropertyForm />} />
          {/* Also support query param for backwards compatibility */}
          <Route path="/property-edit" element={<EditPropertyForm />} />
          <Route path="/property/:id" element={<PropertyDetailMain />} />
          <Route path="/debug/property/:id" element={<PropertyDetailDebug />} />
          <Route path="/test-property-detail" element={<TestPropertyDetail />} />
          <Route path="/find-agent/*" element={<FindAgentPage />} />
          <Route path="/mortgage-calculator" element={<SimpleMortgageCalculator currency="$" />} />
        </Routes>
      </main>
      <Footer />
      {showLoginPopup && <LoginPopup 
        handlePopup={() => {
          setShowLoginPopup(false);
          setRedirectAfterLogin('');
        }} 
        redirectAfterLogin={redirectAfterLogin}
      />}
    </div>
  );
};

export default App;
