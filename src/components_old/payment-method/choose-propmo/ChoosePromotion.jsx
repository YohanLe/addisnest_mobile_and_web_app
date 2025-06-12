import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import Api from '../../../Apis/Api.js';
import { getToken } from '../../../utils/tokenHandler';
import { GetPropertyList } from '../../../Redux-store/Slices/PropertyListSlice';
import '../../../assets/css/choose-promotion.css';

const ChoosePromotion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const propertyData = location.state?.AllData || {};
  const propertyId = location.state?.propertyId || null;
  const testMode = location.state?.testMode || false;
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState({
    basic: null,
    vip: null,
    diamond: null
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [savingProperty, setSavingProperty] = useState(false);
  // Test mode hidden from UI but enabled for fallback
  const [isTestMode, setIsTestMode] = useState(false);

  const promotionPlans = {
    basic: {
      name: 'Basic Plan',
      price: 0,
      durations: [
        { days: 30, price: 0, label: '30 Days' }
      ],
      features: [
        'Standard listing visibility',
        'Basic search placement',
        'Photo gallery (up to 10 photos)',
        'Email contact form',
        'Property details page'
      ]
    },
    vip: {
      name: 'VIP Plan',
      price: 500,
      durations: [
        { days: 15, price: 500, label: '15 Days' },
        { days: 28, price: 850, label: '28 Days' }
      ],
      features: [
        'Featured on homepage',
        'Higher search rankings',
        'Enhanced photo gallery (up to 20 photos)',
        'Property video tour',
        'Priority customer support',
        'Featured tag on listing'
      ]
    },
    diamond: {
      name: 'Diamond Plan',
      price: 1500,
      durations: [
        { days: 30, price: 1500, label: '1 Month' },
        { days: 90, price: 3500, label: '3 Month' }
      ],
      features: [
        'Top search results placement',
        'Featured on homepage banner',
        'Social media promotion',
        'Premium listing badge',
        'Advanced analytics',
        'Priority customer support',
        'Unlimited photos',
        'Virtual tour integration'
      ]
    }
  };

  // Calculate total price based on selected plan and duration
  useEffect(() => {
    if (!selectedPlan) {
      setTotalPrice(0);
      return;
    }
    
    const plan = promotionPlans[selectedPlan];
    const duration = selectedDuration[selectedPlan];
    
    if (!duration) {
      setTotalPrice(0);
      return;
    }
    
    const durationOption = plan.durations.find(d => d.days === duration);
    setTotalPrice(durationOption ? durationOption.price : 0);
  }, [selectedPlan, selectedDuration]);

  // Handle plan selection - only one plan can be selected at a time
  const handlePlanSelect = (planKey) => {
    // If already selected, don't do anything (prevents deselection)
    if (selectedPlan === planKey) return;
    
    // Clear any error message
    setErrorMessage('');
    
    // Set the new selected plan (only one can be active)
    setSelectedPlan(planKey);
    
    // Automatically select the first duration option for this plan if not already selected
    if (!selectedDuration[planKey]) {
      setSelectedDuration({
        ...selectedDuration,
        [planKey]: promotionPlans[planKey].durations[0].days
      });
    }
    
    // Visual feedback for selection
    toast.info(`${promotionPlans[planKey].name} selected`, {
      autoClose: 1500,
      position: "top-center",
      hideProgressBar: true
    });
  };

  // Handle duration selection
  const handleDurationSelect = (planKey, days) => {
    // Only allow duration selection for the currently selected plan
    if (selectedPlan !== planKey) {
      // If user tries to select duration for a non-selected plan, select that plan first
      handlePlanSelect(planKey);
    }
    
    // Then update the duration for this plan
    setSelectedDuration({
      ...selectedDuration,
      [planKey]: days
    });
    
    // Visual feedback
    toast.info(`${days} days selected`, {
      autoClose: 1000,
      position: "top-center",
      hideProgressBar: true
    });
  };

  const handleContinue = async () => {
    if (!selectedPlan) {
      setErrorMessage('Please select a promotion plan to continue');
      return;
    }

    setSavingProperty(true);

    const token = getToken();
    if (!token) {
      toast.error('Authentication error. Please log in again.');
      setSavingProperty(false);
      navigate('/login');
      return;
    }

    // Format the promotion type to match the enum in the Property model
    const promotionTypeMap = {
      'basic': 'Basic',
      'vip': 'VIP',
      'diamond': 'Diamond'
    };

    // Ensure address contains all required fields with defaults
    const payload = {
      ...propertyData,
      promotion_package: selectedPlan,
      promotionType: promotionTypeMap[selectedPlan], // Add the promotionType field
      address: {
        ...propertyData.address,
        // Add empty zipCode if not present to avoid validation errors
        zipCode: propertyData.address?.zipCode || '',
        // Add default city if not present to avoid validation errors
        city: propertyData.address?.city || 'Addis Ababa',
        // Ensure other required address fields have defaults
        street: propertyData.address?.street || 'Unknown Street',
        state: propertyData.address?.state || 'Addis Ababa City Administration',
        country: propertyData.address?.country || 'Ethiopia'
      }
    };

    try {
      const response = await Api.postWithtoken('properties', payload);

      if (response) {
        const savedProperty = response;
        toast.success('Your property has been listed successfully!');
        dispatch(GetPropertyList());

        if (selectedPlan === 'basic') {
          navigate('/account-management', {
            state: {
              propertyData: savedProperty,
              showPropertyAlert: true,
              listing: 'new',
              plan: 'basic',
              planName: promotionPlans.basic.name,
            },
            replace: true,
          });
        } else {
          navigate('/payment-method/payment-process', {
            state: {
              propertyData: savedProperty,
              plan: selectedPlan,
              planName: promotionPlans[selectedPlan].name,
              duration: selectedDuration[selectedPlan],
              totalPrice,
              redirectAfterPayment: '/account-management',
              redirectState: { showPropertyAlert: true },
            },
          });
        }
      } else {
        throw new Error('Invalid response from API');
      }
    } catch (error) {
      console.error('Error saving property:', error);
      toast.error(`Failed to save property: ${error.response?.data?.message || error.message || 'Unknown error'}`);
    } finally {
      setSavingProperty(false);
    }
  };

  return (
    <div className="promotion-container">
      {/* Promotion Steps */}
      <div className="promotion-steps">
        <div className="step active">
          <div className="step-number">1</div>
          <div className="step-label">Choose Promotion</div>
        </div>
        <div className="step">
          <div className="step-number">2</div>
          <div className="step-label">Make Payment</div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-label">Confirmation</div>
        </div>
      </div>

      {/* Promotion Header */}
      <div className="promotion-header">
        <h2>Boost Your Property Listing</h2>
        <p>Choose a promotion plan to attract more buyers or renters.</p>
      </div>

      {/* Loading indicator */}
      {savingProperty && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            textAlign: 'center',
            maxWidth: '400px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              border: '5px solid #f3f3f3',
              borderTop: '5px solid #3498db',
              borderRadius: '50%',
              margin: '0 auto 20px',
              animation: 'spin 1s linear infinite'
            }}></div>
            <h3>Saving Your Property</h3>
            <p>Please wait while we save your property listing...</p>
            <style>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* Promotion Plans */}
      <div className="promotion-plans">
        {/* Basic Plan */}
        <div 
          className={`promotion-plan basic-plan ${selectedPlan === 'basic' ? 'selected' : ''}`}
          onClick={() => handlePlanSelect('basic')}
        >
          <div className="plan-header">
            <h3 className="plan-name">Basic Plan - Free</h3>
            <p className="plan-price">Free</p>
            <div className="plan-decoration"></div>
          </div>
          <div className="plan-body">
            <ul className="plan-features">
              {promotionPlans.basic.features.map((feature, index) => (
                <li key={index}>
                  <span className="feature-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="duration-options">
            <p className="duration-label">Duration:</p>
            <div className="duration-buttons">
              {promotionPlans.basic.durations.map((duration, index) => (
                <div
                  key={index}
                  className={`duration-button ${selectedDuration.basic === duration.days ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDurationSelect('basic', duration.days);
                  }}
                >
                  {duration.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VIP Plan */}
        <div 
          className={`promotion-plan vip-plan ${selectedPlan === 'vip' ? 'selected' : ''}`}
          onClick={() => handlePlanSelect('vip')}
        >
          <div className="popular-tag">POPULAR</div>
          <div className="plan-header">
            <h3 className="plan-name">VIP Plan</h3>
            <p className="plan-price">From ETB 500</p>
            <div className="plan-decoration"></div>
          </div>
          <div className="plan-body">
            <ul className="plan-features">
              {promotionPlans.vip.features.map((feature, index) => (
                <li key={index}>
                  <span className="feature-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="duration-options">
            <p className="duration-label">Select Days:</p>
            <div className="duration-buttons">
              {promotionPlans.vip.durations.map((duration, index) => (
                <div
                  key={index}
                  className={`duration-button ${selectedDuration.vip === duration.days ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDurationSelect('vip', duration.days);
                  }}
                >
                  {duration.label}
                  <br />
                  <small>ETB {duration.price}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Diamond Plan */}
        <div 
          className={`promotion-plan diamond-plan ${selectedPlan === 'diamond' ? 'selected' : ''}`}
          onClick={() => handlePlanSelect('diamond')}
        >
          <div className="plan-header">
            <h3 className="plan-name">Diamond Plan / Top Spot</h3>
            <p className="plan-price">From ETB 1,500</p>
            <div className="plan-decoration"></div>
          </div>
          <div className="plan-body">
            <ul className="plan-features">
              {promotionPlans.diamond.features.map((feature, index) => (
                <li key={index}>
                  <span className="feature-icon">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>
          <div className="duration-options">
            <p className="duration-label">Select Days:</p>
            <div className="duration-buttons">
              {promotionPlans.diamond.durations.map((duration, index) => (
                <div
                  key={index}
                  className={`duration-button ${selectedDuration.diamond === duration.days ? 'selected' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDurationSelect('diamond', duration.days);
                  }}
                >
                  {duration.label}
                  <br />
                  <small>ETB {duration.price}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Summary and Action Buttons */}
      <div className="promotion-summary">
        <h3 className="summary-header">Order Summary</h3>
        <div className="summary-detail">
          <span className="summary-label">Selected Plan</span>
          <span className="summary-value">
            {selectedPlan ? promotionPlans[selectedPlan].name : 'No Plan Selected'}
          </span>
        </div>
        <div className="summary-detail">
          <span className="summary-label">Duration</span>
          <span className="summary-value">
            {selectedPlan && selectedDuration[selectedPlan] 
              ? `${selectedDuration[selectedPlan]} Days` 
              : '-'}
          </span>
        </div>
        <div className="summary-detail">
          <span className="summary-label">Total</span>
          <span className="summary-value">ETB {totalPrice}</span>
        </div>
      </div>

      {errorMessage && (
        <div className="error-alert" style={{
          backgroundColor: '#ffebee',
          color: '#d32f2f',
          padding: '15px 20px',
          borderRadius: '8px',
          marginBottom: '20px',
          fontWeight: 'bold',
          textAlign: 'center',
          border: '1px solid #ef9a9a',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '24px', marginBottom: '5px' }}>⚠️</div>
          {errorMessage}
        </div>
      )}

      <div className="action-buttons">
        <Link to="/property-list-form" className="back-button">
          <span className="button-icon">←</span>
          Back to Property Form
        </Link>
        <button 
          className="continue-button"
          onClick={handleContinue}
          disabled={!selectedPlan || savingProperty}
        >
          {savingProperty ? 'Saving...' : selectedPlan === 'basic' ? 'Continue' : 'Make Payment'}
          <span className="button-icon" style={{ marginLeft: '8px', marginRight: 0 }}>→</span>
        </button>
      </div>

      {/* Test Mode section removed */}
    </div>
  );
};

export default ChoosePromotion;
