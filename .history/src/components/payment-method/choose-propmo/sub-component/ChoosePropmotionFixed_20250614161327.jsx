import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import Api from '../../../../Apis/Api';
import { GetPropertyList } from '../../../../Redux-store/Slices/PropertyListSlice';
import { formatPropertyForSubmission, validatePropertyData } from '../../../../fix-property-submission';
import '../../choose-propmo/choose-promotion.css';

// Default fallback images that will be used if no images are uploaded
const DEFAULT_IMAGES = [
  {
    url: "/uploads/test-property-image-1749260861596-438465535.jpg",
    caption: "Default Property Image"
    // Removed custom _id as it causes server issues
  },
  {
    url: "/uploads/1749428928268-710498473-genMid.731631728_27_0.jpg", 
    caption: "Default Property Image 2"
    // Removed custom _id as it causes server issues
  }
];

const ChoosePromotion = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const propertyData = location.state?.AllData || {};
  
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState({
    basic: null,
    vip: null,
    diamond: null
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [savingProperty, setSavingProperty] = useState(false);
  const [isTestMode, setIsTestMode] = useState(false);

  // Define promotion plans
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

  // Enable/disable test mode for development and testing
  const toggleTestMode = () => {
    const newState = !isTestMode;
    console.log(newState ? "Test mode enabled" : "Test mode disabled");
    setIsTestMode(newState);
    toast.info(newState ? 
      "⚠️ Test Mode Enabled - Mock data will be used instead of your property data" : 
      "✅ Test Mode Disabled - Your actual property data will be used", {
      autoClose: 3000,
      position: "top-center"
    });
  };

  // Create mock property data for testing
  const createMockPropertyData = () => {
    console.log("Creating mock property data for test mode");
    return {
      property_type: "House",
      property_for: "For Sale",
      total_price: 5000000,
      property_address: "Test Address, Addis Ababa",
      number_of_bedrooms: "3",
      number_of_bathrooms: "2",
      property_size: "250",
      description: "Test property created in test mode",
      city: "Addis Ababa",
      regional_state: "Addis Ababa City Administration",
      country: "Ethiopia",
      amenities: ["Parking", "Security", "Garden"],
      furnishing: "Unfurnished",
      media_paths: ["https://via.placeholder.com/300x200?text=Test+Property"]
    };
  };
  
  // Simulate saving property in test mode
  const simulateSavePropertyInTestMode = (data, plan) => {
    console.log("Simulating property save in test mode with data:", data);
    
    // Return a mock saved property object
    return {
      _id: "test-property-" + Date.now(),
      ...data,
      isFeatured: plan !== 'basic',
      priority: plan === 'diamond' ? 10 : (plan === 'vip' ? 5 : 0),
      status: "active",
      createdAt: new Date().toISOString()
    };
  };

  /**
   * FIXED VERSION OF savePropertyToDatabase
   * - Uses the utility functions from fix-property-submission.js
   * - Removes status and paymentStatus fields
   * - Lets the server determine these values based on promotionType
   */
  const savePropertyToDatabase = async (data, plan) => {
    try {
      // Log the input data for debugging
      console.log("Original property data from form:", data);
      
      // Validate the property data before submission
      const validation = validatePropertyData(data);
      if (!validation.valid) {
        throw new Error(`Validation failed: ${validation.message}`);
      }
      
      // Use the utility function to format the property data
      const formattedData = formatPropertyForSubmission(data, plan);
      formattedData.address.regionalState = data.regionalState || data.address.regionalState;
      formattedData.regionalState = data.regionalState || data.address.regionalState;
      
      console.log('Attempting to save property with formatted data:', formattedData);
      
      // Add default images if needed
      if (!formattedData.images || !Array.isArray(formattedData.images) || formattedData.images.length === 0) {
        formattedData.images = DEFAULT_IMAGES.map(img => ({ url: img.url }));
      }
      
      console.log('Final formatted data being sent to API:', JSON.stringify(formattedData, null, 2));
      console.log('Images array being sent to API:', formattedData.images);
      console.log('Image count:', formattedData.images.length);
      
      // Make API call to create the property
      let response;
      try {
        console.log('Calling Api.postWithtoken with "properties" and formattedData...');
        response = await Api.postWithtoken('properties', formattedData);
        console.log('Received response from Api.postWithtoken:', response);
      } catch (apiError) {
        console.error('Error during Api.postWithtoken call:', apiError);
        console.error('API error details:', apiError.response?.data);
        throw new Error(`API call failed: ${apiError.message || 'Unknown API error'}`);
      }
      
      // Accept any response with an _id or id as success
      if (response && (response._id || response.id || (response.data && (response.data._id || response.data.id)))) {
        console.log('Property saved successfully via API:', response);
        return response.data || response;
      } else {
        console.error('API indicated failure or unexpected response format:', response);
        throw new Error(response?.message || 'Failed to save property due to API error or invalid response');
      }
    } catch (error) {
      // Log the detailed error from the try block or the re-thrown error from API call catch
      console.error('Detailed error in savePropertyToDatabase:', error); 
      throw error; // Re-throw to be caught by handleContinue
    }
  };

      // Handle continue to payment
  const handleContinue = async () => {
    console.log("handleContinue called with selectedPlan:", selectedPlan);
    console.log("propertyData available:", propertyData);
    console.log("Test mode status:", isTestMode);
    
    // Required data fields for successful property submission:
    const requiredFields = [
      'property_type',      // Type of property (House, Apartment, etc.)
      'property_for',       // For Sale or For Rent
      'property_address',   // Address of the property
      'total_price',        // Price of the property
      'media_paths'         // At least one property image
    ];
    
  // Check if propertyData is valid, but allow proceeding in test mode
  if (!isTestMode && (!propertyData || Object.keys(propertyData).length === 0)) {
    console.log("No property data available:", propertyData);
    
    // Display prominent error message
    toast.error('Property data is missing. Please ensure the property form was completed.', {
      position: "top-center",
      autoClose: 4000
    });
    
    // Navigate back to property form
    setTimeout(() => {
      navigate('/property-list-form');
    }, 1500);
    return;
  }
  
  // No required field validation here; assume property form enforces required fields before navigation.
    
    if (!selectedPlan) {
      console.log("No plan selected - showing error message");
      setErrorMessage('Please select a promotion plan to continue');
      return;
    }

    // Scroll to top before navigation
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    
    console.log("Scrolled to top, preparing to save property with plan:", selectedPlan);
    
    // If in test mode, use mock data
    let dataToUse = isTestMode ? createMockPropertyData() : propertyData;
    
    // Check if we have images, if not, add default ones
    if (!dataToUse.images || !Array.isArray(dataToUse.images) || dataToUse.images.length === 0) {
      console.log("No images found in property data, adding default images");
      dataToUse = {
        ...dataToUse,
        images: [...DEFAULT_IMAGES],
        media_paths: [...DEFAULT_IMAGES]
      };
    }
    
    console.log("Using data for property submission:", isTestMode ? "Mock data (test mode)" : "Real property data");
    console.log("Complete property data being submitted:", dataToUse);

    try {
      // Set saving state to display loader
      setSavingProperty(true);
      
      let savedProperty;
      if (isTestMode) {
        // Use simulation in test mode
        savedProperty = simulateSavePropertyInTestMode(dataToUse, selectedPlan);
        console.log("Using simulated property data (test mode):", savedProperty);
      } else {
        // Actually save to the backend in real mode
        try {
          savedProperty = await savePropertyToDatabase(dataToUse, selectedPlan);
          console.log("Property saved successfully via API:", savedProperty);
        } catch (saveError) {
          toast.error('Failed to save property to the server. Please try again.');
          console.error('Error during property saving in handleContinue:', saveError);
          setSavingProperty(false);
          return;
        }
      }
      
      // Make sure the saved property has images
      if (!savedProperty.images || !Array.isArray(savedProperty.images) || savedProperty.images.length === 0) {
        console.log("No images found in saved property, adding default images to response");
        savedProperty.images = [...DEFAULT_IMAGES];
      }
      
      console.log("Property saved successfully:", savedProperty);
      
      // For Basic Plan (free), navigate to confirmation page
      if (selectedPlan === 'basic') {
        toast.success('Your property has been listed successfully!', {
          autoClose: 3000
        });
        
      // For Basic Plan: Navigate to account-management with showPropertyAlert=true
      console.log("Basic plan selected. Attempting to navigate to /account-management with state:", { 
          propertyData: savedProperty,
          showPropertyAlert: true,
          listing: 'new',
          plan: 'basic',
          planName: promotionPlans[selectedPlan].name
      });
      
      try {
        navigate('/account-management', { 
          state: { 
            propertyData: savedProperty, // Pass the saved property data
            showPropertyAlert: true, // Flag to show the Property Alert tab
            listing: 'new', // Flag to indicate this is a new listing to be added
            plan: 'basic', // Pass the plan type
            planName: promotionPlans[selectedPlan].name // Pass the plan name
          },
          replace: true // Use replace to prevent back navigation issues
        });
        console.log("Navigation to /account-management with showPropertyAlert=true executed");
      } catch (navError) {
        console.error("Error during navigation:", navError);
        // Fallback approach if navigation fails
        window.location.href = '/my-property-listings';
      }
          } 
          // For paid plans, navigate to payment method page
          else {
            toast.info(`Proceeding to payment for ${promotionPlans[selectedPlan].name}`, {
              autoClose: 2000
            });
            console.log("Paid plan selected. Navigating to /payment-method/payment-process with state:", {
                propertyData: savedProperty,
                plan: selectedPlan,
                planName: promotionPlans[selectedPlan].name,
                duration: selectedDuration[selectedPlan],
                totalPrice
            });
            // Note: After successful payment, the payment process will redirect to account-management with showPropertyAlert=true
            navigate('/payment-method/payment-process', { 
              state: { 
                propertyData: savedProperty,
                plan: selectedPlan,
                planName: promotionPlans[selectedPlan].name,
                duration: selectedDuration[selectedPlan],
                totalPrice,
                redirectAfterPayment: '/account-management', // Add a redirect URL for after payment
                redirectState: { showPropertyAlert: true } // Add state for the redirect
              }
            });
          }
        } catch (error) {
          toast.error('Failed to save property. Please try again.');
          console.error('Error during property saving in handleContinue:', error);
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
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}} />
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

      {/* Test Mode Button */}
      <div className="test-mode-container" style={{ 
        textAlign: 'center', 
        marginTop: '20px', 
        padding: '15px',
        border: isTestMode ? '2px dashed #dc3545' : '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: isTestMode ? '#fff8f8' : '#f8f9fa'
      }}>
        <div className="test-mode-label" style={{ 
          marginBottom: '10px',
          fontWeight: 'bold',
          fontSize: '16px',
          color: isTestMode ? '#dc3545' : '#6c757d'
        }}>
          {isTestMode ? '⚠️ TEST MODE ACTIVE ⚠️' : 'Developer Test Mode'}
        </div>
        
        {isTestMode && (
          <div style={{ 
            backgroundColor: '#dc3545', 
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            marginBottom: '15px',
            fontSize: '14px',
            fontWeight: 'bold',
            textAlign: 'left'
          }}>
            <p style={{ margin: '0 0 8px 0' }}>WARNING: Test Mode is currently active!</p>
            <p style={{ margin: '0', fontSize: '13px', fontWeight: 'normal' }}>
              Your actual property information will be replaced with test data.
              To use your real property data, please disable test mode.
            </p>
          </div>
        )}
        
        <button 
          className={`test-mode-button ${isTestMode ? 'active' : ''}`}
          onClick={toggleTestMode}
          style={{
            padding: '10px 16px',
            backgroundColor: isTestMode ? '#dc3545' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
            transition: 'all 0.3s ease'
          }}
        >
          {isTestMode ? 'Disable Test Mode & Use My Data' : 'Enable Test Mode'}
        </button>
        
        {isTestMode && (
          <p style={{ fontSize: '13px', color: '#dc3545', marginTop: '10px', fontStyle: 'italic' }}>
            Mock data ("Test Address, Addis Ababa") will be used instead of your actual property data
          </p>
        )}
      </div>
      
      {/* Fix Information Box */}
      <div style={{
        margin: '30px auto 10px',
        padding: '15px',
        backgroundColor: '#e8f5e9',
        border: '1px solid #81c784',
        borderRadius: '8px',
        maxWidth: '650px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#2e7d32' }}>✅ Fixed Version - Property Submission</h4>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
          This component has been updated to fix the 500 Internal Server Error during property submission.
          The key change is removing the <code>status</code> and <code>paymentStatus</code> fields from the request,
          allowing the server to determine the correct values.
        </p>
        <div style={{ 
          backgroundColor: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '4px', 
          fontSize: '13px',
          fontFamily: 'monospace'
        }}>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
{`// FIXED: Removed these problematic fields
// status: 'active',       // Removed
// paymentStatus: 'none',  // Removed

// Let the server determine these values based on:
promotionType: 'Basic', 'VIP', or 'Diamond'`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ChoosePromotion;
