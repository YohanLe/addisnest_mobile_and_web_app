import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { getToken } from '../../../utils/tokenHandler';
import './PaymentProcess.css';

const PaymentProcess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get data from location state (passed from ChoosePromotion component)
  const { 
    propertyData, 
    plan, 
    planName, 
    duration, 
    totalPrice,
    redirectAfterPayment, 
    redirectState 
  } = location.state || {};

  // Component state
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [listingId, setListingId] = useState(null);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [error, setError] = useState(null);
  const [cardErrors, setCardErrors] = useState({});

  useEffect(() => {
    // Validate we have the necessary data to proceed
    if (!propertyData || !plan) {
      toast.error('Missing property information. Please try again.');
      navigate('/payment-method/choose-promotion');
      return;
    }

    // Initialize payment flow - submit property to get listingId and payment intent
    initializePayment();
  }, [propertyData, plan]);

  // Initialize payment by submitting property to get listingId and payment intent
  const initializePayment = async () => {
    try {
      setProcessing(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        toast.error('Authentication required. Please log in.');
        navigate('/login');
        return;
      }

      // Get property data from state or use property already saved via ChoosePromotion component
      const propertyId = propertyData._id;
      if (propertyId) {
        console.log('Property already submitted with ID:', propertyId);
        setListingId(propertyId);
        toast.info('Property already submitted. Ready for payment.');
        return;
      }

      console.log('Submitting property to get listing ID and payment intent');
      
      // Submit the property to get a listing ID and payment intent
      const response = await axios.post('/api/submitListing', 
        {
          ...propertyData,
          promotion_package: plan,
          duration: duration
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('submitListing response:', response.data);

      if (response.data.success) {
        // Save the listing ID and payment intent information
        setListingId(response.data.property._id);
        setPaymentIntent(response.data.paymentIntent);
        toast.success('Property submitted successfully. Ready for payment.');
      } else {
        setError(response.data.message || 'Failed to initialize payment process');
        toast.error('Failed to prepare payment. Please try again.');
      }
    } catch (err) {
      console.error('Error initializing payment:', err);
      setError(err.response?.data?.message || 'Failed to connect to payment service');
      toast.error('Payment service error. Please try again later.');
    } finally {
      setProcessing(false);
    }
  };

  // Handle payment method selection
  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    // Clear any previous card errors when switching methods
    setCardErrors({});
  };

  // Handle card input changes
  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    // Update the payment details
    setPaymentDetails({
      ...paymentDetails,
      [name]: value
    });
    
    // Clear specific error when field is being edited
    if (cardErrors[name]) {
      setCardErrors({
        ...cardErrors,
        [name]: null
      });
    }
  };

  // Validate card details before submitting
  const validateCardDetails = () => {
    const errors = {};
    
    // Simple validation rules
    if (!paymentDetails.cardNumber.trim()) {
      errors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(paymentDetails.cardNumber.replace(/\s/g, ''))) {
      errors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!paymentDetails.cardName.trim()) {
      errors.cardName = 'Cardholder name is required';
    }
    
    if (!paymentDetails.expiryDate.trim()) {
      errors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentDetails.expiryDate)) {
      errors.expiryDate = 'Use MM/YY format';
    }
    
    if (!paymentDetails.cvv.trim()) {
      errors.cvv = 'CVV is required';
    } else if (!/^\d{3,4}$/.test(paymentDetails.cvv)) {
      errors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Process payment and finalize listing
  const processPayment = async () => {
    if (!selectedMethod) {
      toast.warning('Please select a payment method');
      return;
    }

    if (selectedMethod === 'credit-card' && !validateCardDetails()) {
      toast.error('Please correct the card information');
      return;
    }

    try {
      setProcessing(true);
      setError(null);
      
      const token = getToken();
      if (!token) {
        toast.error('Authentication required. Please log in.');
        navigate('/login');
        return;
      }

      // In a real implementation, we would use Stripe or another payment processor here
      // For this implementation, we'll simulate a successful payment
      
      // Use payment intent from submitListing or generate a mock one if not available
      const paymentIntentId = paymentIntent ? paymentIntent.id : `pi_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
      
      console.log(`Finalizing listing ${listingId} with payment intent ${paymentIntentId}`);
      
      // Call the finalize endpoint
      const response = await axios.post('/api/finalizeListing', 
        {
          listingId: listingId,
          paymentIntentId: paymentIntentId
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log('finalizeListing response:', response.data);

      if (response.data.success) {
        setPaymentSuccess(true);
        toast.success('Payment successful! Your property has been listed.');
        
        // Navigate to the success page after a short delay
        setTimeout(() => {
          // Navigate to the redirectAfterPayment path, or fallback to account-management
          navigate(redirectAfterPayment || '/account-management', { 
            state: { 
              ...redirectState,
              propertyData,
              listing: 'new',
              plan,
              planName,
              message: `Your property has been listed successfully with ${planName} payment.`
            }
          });
        }, 2000);
      } else {
        setError(response.data.message || 'Failed to finalize payment');
        toast.error('Payment could not be completed. Please try again.');
      }
    } catch (err) {
      console.error('Error processing payment:', err);
      setError(err.response?.data?.message || 'Payment processing failed');
      toast.error('Payment failed. Please try again later.');
    } finally {
      setProcessing(false);
    }
  };

  // Format credit card number with spaces
  const formatCardNumber = (input) => {
    const cleaned = input.replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : cleaned;
  };

  // Mobile Money specific processing
  const processMobilePayment = async () => {
    try {
      setProcessing(true);
      
      // In a real implementation, we would integrate with a mobile payment provider
      // For this demo, we simulate a successful payment
      toast.info('Processing mobile payment...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the same finalize function
      await processPayment();
    } catch (error) {
      console.error('Mobile payment error:', error);
      toast.error('Mobile payment failed. Please try again.');
      setProcessing(false);
    }
  };

  // Bank Transfer specific processing
  const processBankTransfer = async () => {
    try {
      setProcessing(true);
      
      // In a real implementation, we would provide bank details and track the transfer
      // For this demo, we simulate a successful transfer confirmation
      toast.info('Confirming bank transfer...');
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Call the same finalize function
      await processPayment();
    } catch (error) {
      console.error('Bank transfer error:', error);
      toast.error('Bank transfer confirmation failed. Please try again.');
      setProcessing(false);
    }
  };

  // If payment was successful, show success screen
  if (paymentSuccess) {
    return (
      <div className="payment-success-container">
        <div className="payment-success-card">
          <div className="success-icon">✓</div>
          <h2>Payment Successful!</h2>
          <p>Your property has been listed successfully.</p>
          <p>Redirecting to your account dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-process-container">
      {/* Payment Steps */}
      <div className="payment-steps">
        <div className="step">
          <div className="step-number">1</div>
          <div className="step-label">Choose Promotion</div>
        </div>
        <div className="step active">
          <div className="step-number">2</div>
          <div className="step-label">Make Payment</div>
        </div>
        <div className="step">
          <div className="step-number">3</div>
          <div className="step-label">Confirmation</div>
        </div>
      </div>

      {/* Header */}
      <div className="payment-process-header">
        <h2>Complete Your Payment</h2>
        <p>Secure your property listing with a simple payment</p>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      {/* Payment Content */}
      <div className="payment-content">
        {/* Payment Form */}
        <div className="payment-form-container">
          {/* Payment Methods */}
          <div className="payment-methods">
            <h3>Select Payment Method</h3>
            <div className="payment-method-options">
              <div 
                className={`payment-method-option ${selectedMethod === 'credit-card' ? 'selected' : ''}`}
                onClick={() => handleMethodSelect('credit-card')}
              >
                <div className="method-icon">💳</div>
                <div>Credit Card</div>
              </div>
              <div 
                className={`payment-method-option ${selectedMethod === 'mobile-money' ? 'selected' : ''}`}
                onClick={() => handleMethodSelect('mobile-money')}
              >
                <div className="method-icon">📱</div>
                <div>Mobile Money</div>
              </div>
              <div 
                className={`payment-method-option ${selectedMethod === 'bank-transfer' ? 'selected' : ''}`}
                onClick={() => handleMethodSelect('bank-transfer')}
              >
                <div className="method-icon">🏦</div>
                <div>Bank Transfer</div>
              </div>
            </div>
          </div>

          {/* Credit Card Form */}
          {selectedMethod === 'credit-card' && (
            <div className="card-payment-form">
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formatCardNumber(paymentDetails.cardNumber)}
                  onChange={handleCardInputChange}
                  maxLength="19"
                />
                {cardErrors.cardNumber && <div className="error-text">{cardErrors.cardNumber}</div>}
              </div>
              <div className="form-group">
                <label htmlFor="cardName">Cardholder Name</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  placeholder="John Doe"
                  value={paymentDetails.cardName}
                  onChange={handleCardInputChange}
                />
                {cardErrors.cardName && <div className="error-text">{cardErrors.cardName}</div>}
              </div>
              <div className="form-row">
                <div className="form-group half">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    placeholder="MM/YY"
                    maxLength="5"
                    value={paymentDetails.expiryDate}
                    onChange={handleCardInputChange}
                  />
                  {cardErrors.expiryDate && <div className="error-text">{cardErrors.expiryDate}</div>}
                </div>
                <div className="form-group half">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    placeholder="123"
                    maxLength="4"
                    value={paymentDetails.cvv}
                    onChange={handleCardInputChange}
                  />
                  {cardErrors.cvv && <div className="error-text">{cardErrors.cvv}</div>}
                </div>
              </div>
              <div className="payment-actions">
                <button 
                  className="pay-button" 
                  onClick={processPayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="spinner"></span>
                      Processing...
                    </>
                  ) : (
                    <>Pay ETB {totalPrice}</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Mobile Money Form */}
          {selectedMethod === 'mobile-money' && (
            <div className="mobile-money-instructions">
              <h3>Mobile Money Payment</h3>
              <p>Follow these steps to complete your payment using mobile money:</p>
              <ol>
                <li>Open your mobile money app on your phone</li>
                <li>Select "Pay for Services" or "Pay Merchant"</li>
                <li>Enter our merchant code: <strong>ADDISNEST123</strong></li>
                <li>Enter the amount: <strong>ETB {totalPrice}</strong></li>
                <li>Use reference: <strong>PROP{listingId ? listingId.substring(0, 8) : 'PENDING'}</strong></li>
                <li>Confirm the payment on your device</li>
              </ol>
              <p>Once you've completed the payment on your device, click the button below:</p>
              <div className="payment-actions">
                <button 
                  className="pay-button" 
                  onClick={processMobilePayment}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="spinner"></span>
                      Verifying Payment...
                    </>
                  ) : (
                    <>I've Completed the Mobile Payment</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Bank Transfer Form */}
          {selectedMethod === 'bank-transfer' && (
            <div className="bank-transfer-instructions">
              <h3>Bank Transfer Payment</h3>
              <p>Please transfer the exact amount to the following bank account:</p>
              <div className="bank-details">
                <div className="bank-detail">
                  <span>Bank Name:</span>
                  <span>Commercial Bank of Ethiopia</span>
                </div>
                <div className="bank-detail">
                  <span>Account Name:</span>
                  <span>AddiSnest Real Estate Ltd</span>
                </div>
                <div className="bank-detail">
                  <span>Account Number:</span>
                  <span>1000123456789</span>
                </div>
                <div className="bank-detail">
                  <span>Reference:</span>
                  <span>PROP{listingId ? listingId.substring(0, 8) : 'PENDING'}</span>
                </div>
                <div className="bank-detail">
                  <span>Amount:</span>
                  <span>ETB {totalPrice}</span>
                </div>
              </div>
              <p className="note">Important: Please use the reference number above in your transfer description to help us identify your payment.</p>
              <p>After completing the bank transfer, click the button below to confirm:</p>
              <div className="payment-actions">
                <button 
                  className="pay-button" 
                  onClick={processBankTransfer}
                  disabled={processing}
                >
                  {processing ? (
                    <>
                      <span className="spinner"></span>
                      Confirming Transfer...
                    </>
                  ) : (
                    <>I've Completed the Bank Transfer</>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* When no payment method is selected */}
          {!selectedMethod && (
            <div className="select-method-prompt" style={{ textAlign: 'center', margin: '30px 0' }}>
              <p style={{ color: '#666' }}>Please select a payment method above to continue</p>
            </div>
          )}
        </div>

        {/* Payment Summary */}
        <div className="payment-summary">
          <h3>Payment Summary</h3>
          <div className="summary-detail">
            <span>Plan</span>
            <span>{planName || 'Premium'}</span>
          </div>
          <div className="summary-detail">
            <span>Duration</span>
            <span>{duration} Days</span>
          </div>
          <div className="summary-detail">
            <span>Property Type</span>
            <span>{propertyData?.property_type || '-'}</span>
          </div>
          <div className="summary-detail">
            <span>Listing Type</span>
            <span>{propertyData?.property_for || '-'}</span>
          </div>
          <div className="summary-detail total">
            <span>Total</span>
            <span>ETB {totalPrice}</span>
          </div>

          <div className="secure-payment-notice">
            <span className="secure-icon">🔒</span>
            <span>Your payment information is secure and encrypted</span>
          </div>

          <div className="back-link">
            <Link to="/payment-method/choose-promotion">← Back to promotion selection</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentProcess;
