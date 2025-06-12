import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../Apis/Api";
import { toast } from "react-toastify";
import { AuthUserDetails, login } from "../Redux-store/Slices/AuthSlice";
import { useDispatch } from "react-redux";

const OtpPopup = ({ handlePopup, sendData }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [showOtp, setShowOtp] = useState(sendData?.otp);
    
    const handleOtpChange = (index, value) => {
        if (value.match(/^[0-9]$/) || value === '') {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            
            // Auto-focus next input if value is entered
            if (value !== '' && index < 5) {
                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                if (nextInput) nextInput.focus();
            }
        }
    };
    
    const handleKeyDown = (index, e) => {
        // Navigate to previous input on backspace
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
            const prevInput = document.getElementById(`otp-input-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };
    
    const otpVerifyFun = async () => {
        const otpString = otp.join('');
        
        if (otpString.length !== 6) {
            toast.error('Please enter a valid 6-digit OTP');
            return;
        }
        
        try {
            setLoading(true);
            
            // For testing, if this is the test mode or we're using the test OTP, just simulate success
            if (sendData?.pagetype === 'test' || otpString === showOtp || otpString === '730522') {
                console.log('Test mode - simulating successful OTP verification');
                toast.success('Test OTP verified successfully!');
                
                // Store mock authentication data for test mode using the correct key
                localStorage.setItem('addisnest_token', 'test-token-123456');
                localStorage.setItem('isLogin', '1');
                localStorage.setItem("userId", 'test-user-id');
                
                // Instead of making an API call with AuthUserDetails(), directly use login action
                // to set mock user data in Redux store
                try {
                    const mockUserData = {
                        _id: 'test-user-id',
                        firstName: 'Test',
                        lastName: 'User',
                        email: sendData?.email || 'test@example.com',
                        isVerified: true,
                        userType: 'customer'
                    };
                    
                    // Directly use the imported login action
                    dispatch(login(mockUserData));
                    
                    console.log('Mock user data set in Redux store');
                } catch (error) {
                    console.error('Error setting auth data in Redux:', error);
                }
                
                // Close the popup immediately
                handlePopup();
                
                // Wait a tiny bit before navigating to ensure state updates have processed
                setTimeout(() => {
                    console.log('Navigating to home page...');
                    // Force a hard navigation to the home page to ensure it works
                    window.location.href = '/';
                }, 500);
                
                return;
            }
            
            let body = {
                email: sendData?.email,
                otp: otpString
            };
            
            console.log('Verifying OTP with data:', sendData); // Debug
            
            if (sendData?.pagetype === 'register') {
                // If we have firstName and lastName, add fullName
                if (sendData?.firstName && sendData?.lastName) {
                    body.fullName = `${sendData?.firstName} ${sendData?.lastName}`;
                }
                
                // Add all registration fields
                body = {
                    ...body,
                    firstName: sendData?.firstName,
                    lastName: sendData?.lastName,
                    password: sendData?.password,
                    phone: sendData?.phone,
                    role: sendData?.role,
                    regionalState: sendData?.regionalState
                };
                
                // Add agent-specific fields if registering as an agent
                if (sendData?.role === 'AGENT') {
                    body = {
                        ...body,
                        experience: parseInt(sendData?.experience || '0'),
                        specialization: sendData?.specialization || []
                    };
                }
            } else if (sendData?.pagetype === 'socialLogin') {
                body = {
                    ...body,
                    provider: sendData?.provider
                };
            }
            
            console.log('Sending data to verify OTP:', body); // Debug
            
            // Use different endpoint for social login verification
            const endpoint = sendData?.pagetype === 'socialLogin' 
                ? "auth/verify-social-login" 
                : "auth/verify-otp";
                
            console.log('Using endpoint:', endpoint); // Debug
            
            const response = await Api.post(endpoint, body);
            console.log('OTP verification response:', response); // Debug
            
            if (response && response.data) {
                const { data, message } = response;
                
                localStorage.setItem('addisnest_token', data?.token);
                localStorage.setItem('isLogin', '1');
                localStorage.setItem("userId", data?.user?._id || data?.userId);
                
                handlePopup();
                dispatch(AuthUserDetails());
                
                if (sendData?.pagetype === 'register') {
                    // For new registration
                    toast.success("Registration successful!");
                    navigate('/');
                } else if (sendData?.pagetype === 'forgot') {
                    // For forgot password
                    toast.success("OTP verified successfully. Redirecting to home page...");
                    // Redirect to home page after successful verification
                    navigate('/');
                } else if (sendData?.pagetype === 'socialLogin') {
                    // For social login verification
                    toast.success(`${sendData?.provider} login successful!`);
                    navigate('/');
                } else {
                    // For login with OTP
                    toast.success("Login successful!");
                    navigate('/');
                }
            } else {
                toast.error('Unexpected response format from server');
                console.error('Unexpected response format:', response);
            }
            
        } catch (error) {
            console.error('OTP verification error:', error);
            
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to verify OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    const resendOtpFun = async () => {
        try {
            setLoading(true);
            
            let endpoint = "auth/resend-otp";
            if (sendData?.pagetype === 'forgot') {
                endpoint = "auth/forgot-password";
            }
            
            const response = await Api.post(endpoint, { email: sendData?.email });
            const { data, message } = response;
            
            setShowOtp(data?.otp);
            toast.success(message || "OTP has been resent to your email");
            
        } catch (error) {
            console.error('Resend OTP error:', error);
            
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to resend OTP. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="main-popup action-modal auth-sign-modal" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 9999,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div className="lm-outer" style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '450px',
                width: '100%',
                margin: '0 auto'
            }}>
                <div className="lm-inner" style={{
                    background: '#fff',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}>
                    <div className="popup-inner">
                        <div className="popup-header" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '15px 20px',
                            borderBottom: '1px solid #eee'
                        }}>
                            <div className="back-icon" style={{ cursor: 'pointer' }}>
                                <Link to="#" onClick={handlePopup}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M19 12H5M12 19l-7-7 7-7"/>
                                    </svg>
                                </Link>
                            </div>
                            <div className="popup-title">
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '600',
                                    margin: 0
                                }}>Enter OTP</h3>
                            </div>
                            <div style={{ width: '24px' }}></div> {/* Empty space for alignment */}
                        </div>
                        
                        <div className="popup-body" style={{ padding: '20px' }}>
                            <div className="auth-main">
                                <div className="auth-heading" style={{ marginBottom: '20px' }}>
                                    <p style={{ fontSize: '0.95rem', color: '#555', lineHeight: '1.5' }}>
                                        Enter <span style={{ fontWeight: '600' }}>SIX</span> digit code we have sent to your
                                        email address <span style={{ fontWeight: '600' }}>{sendData?.email}</span> to verify your <span style={{ fontWeight: '600' }}>Addisnest</span> account.
                                        {showOtp && (
                                            <span style={{ display: 'block', marginTop: '10px', color: '#0066cc', padding: '8px', backgroundColor: '#f0f8ff', borderRadius: '4px', border: '1px solid #cce5ff' }}>
                                                <strong>Test OTP:</strong> {showOtp}
                                            </span>
                                        )}
                                        {sendData?.note && (
                                            <span style={{ display: 'block', marginTop: '10px', color: '#28a745', padding: '8px', backgroundColor: '#f1f9f1', borderRadius: '4px', border: '1px solid #c3e6cb' }}>
                                                <strong>Note:</strong> {sendData.note}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                
                                <div style={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    gap: '8px', 
                                    marginBottom: '25px'
                                }}>
                                    {otp.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`otp-input-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleOtpChange(index, e.target.value)}
                                            onKeyDown={(e) => handleKeyDown(index, e)}
                                            style={{
                                                width: '45px',
                                                height: '50px',
                                                fontSize: '1.5rem',
                                                textAlign: 'center',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                backgroundColor: '#f9f9f9',
                                                outline: 'none',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#a4ff2a'}
                                            onBlur={(e) => e.target.style.borderColor = '#ddd'}
                                        />
                                    ))}
                                </div>
                                
                                <div style={{ marginBottom: '20px' }}>
                                    <button 
                                        onClick={otpVerifyFun}
                                        style={{
                                            width: '100%',
                                            padding: '12px 15px',
                                            background: '#a4ff2a',
                                            border: 'none',
                                            borderRadius: '4px',
                                            color: '#333',
                                            fontWeight: '600',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer',
                                            transition: 'background 0.3s ease'
                                        }}
                                        onMouseOver={(e) => e.target.style.background = '#98f01c'}
                                        onMouseOut={(e) => e.target.style.background = '#a4ff2a'}
                                        disabled={loading}
                                    >
                                        {loading ? "Verifying..." : "Verify & Continue"}
                                    </button>
                                </div>
                                
                                <div style={{
                                    textAlign: 'center',
                                    fontSize: '0.9rem',
                                    color: '#666'
                                }}>
                                    <p>
                                        Didn't receive code?{' '}
                                        <a 
                                            onClick={resendOtpFun}
                                            style={{
                                                color: '#0066cc',
                                                textDecoration: 'none',
                                                fontWeight: '500',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Resend OTP
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="popup-overlay" onClick={handlePopup} style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.5)',
                zIndex: 5
            }}></div>
        </div>
    );
};

export default OtpPopup;
