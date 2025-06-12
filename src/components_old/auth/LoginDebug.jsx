import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from "react-toastify";

/**
 * Debug version of Login component to troubleshoot API connection issues
 */
const LoginDebug = () => {
    const navigate = useNavigate();
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiStatus, setApiStatus] = useState({ checked: false, status: null, message: '' });
    const [connectionErrors, setConnectionErrors] = useState([]);
    
    const togglePasswordVisibility = () => {
        setPasswordVisible(!isPasswordVisible);
    };
    
    const [inps, setInps] = useState({
        email: 'test@addisnest.com',
        password: "testpassword",
    });

    const onInpChanged = (event) => {
        setInps((prevInputs) => ({ ...prevInputs, [event.target.name]: event.target.value }));
    };

    // Function to check API status
    const checkApiStatus = async () => {
        setApiStatus({ checked: false, status: null, message: 'Checking API connection...' });
        setConnectionErrors([]);
        
        try {
            // First, try with direct axios call
            console.log('Testing direct axios call...');
            await axios.get('http://localhost:7000/api/auth', { timeout: 3000 });
            setApiStatus({ 
                checked: true, 
                status: 'success', 
                message: 'API is accessible via direct axios call' 
            });
            return;
        } catch (error) {
            console.log('Direct axios call error:', error);
            let errorMsg = '';
            
            if (error.code === 'ECONNREFUSED') {
                errorMsg = 'Connection refused - server may not be running or port is blocked';
            } else if (error.response) {
                // If we got a response, the API is accessible but returned an error
                setApiStatus({ 
                    checked: true, 
                    status: 'warning', 
                    message: `API is accessible but returned ${error.response.status}: ${JSON.stringify(error.response.data)}` 
                });
                return;
            } else if (error.request) {
                errorMsg = 'No response received from server';
            } else {
                errorMsg = error.message;
            }
            
            setConnectionErrors(prev => [...prev, `Direct axios error: ${errorMsg}`]);
        }
        
        // Try using fetch API
        try {
            console.log('Testing fetch API call...');
            const response = await fetch('http://localhost:7000/api/auth', { 
                method: 'GET'
            });
            
            if (response.ok || response.status) {
                setApiStatus({ 
                    checked: true, 
                    status: 'warning', 
                    message: `API is accessible via fetch (status: ${response.status})` 
                });
                return;
            }
        } catch (error) {
            console.log('Fetch API error:', error);
            setConnectionErrors(prev => [...prev, `Fetch API error: ${error.message}`]);
        }
        
        // Try with different port
        try {
            console.log('Testing alternate port 7000...');
            await axios.get('http://localhost:7000/', { timeout: 3000 });
            setApiStatus({ 
                checked: true, 
                status: 'warning', 
                message: 'Server on port 7000 is accessible but API endpoint may be incorrect' 
            });
            return;
        } catch (error) {
            console.log('Alternate port error:', error);
            setConnectionErrors(prev => [...prev, `Port 7000 check error: ${error.code || error.message}`]);
        }
        
        // If all tests failed
        setApiStatus({ 
            checked: true, 
            status: 'error', 
            message: 'API is not accessible. Check server and network connections.' 
        });
    };

    // Check API status on component mount
    useEffect(() => {
        checkApiStatus();
    }, []);
  
    const loginFun = async () => {
        try {
            setLoading(true);
            setConnectionErrors([]);
            
            console.log('Attempting login with:', inps);
            
            // Try direct axios call
            try {
                const response = await axios.post('http://localhost:7000/api/auth/login', {
                    email: inps.email,
                    password: inps.password
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 5000
                });
                
                console.log('Login response:', response.data);
                toast.success('Login successful via direct axios call');
                setConnectionErrors(prev => [...prev, 'Direct axios login successful']);
                
                // Store token if available
                if (response.data?.token || response.data?.data?.token) {
                    const token = response.data?.token || response.data?.data?.token;
                    localStorage.setItem('addisnest_token', token);
                    localStorage.setItem('isLogin', '1');
                    toast.success('Token stored successfully');
                }
            } catch (error) {
                console.error('Direct login error:', error);
                
                let errorMsg = '';
                if (error.response) {
                    errorMsg = `API responded with ${error.response.status}: ${JSON.stringify(error.response.data)}`;
                    // If we got a 401, the API is working but credentials are wrong
                    if (error.response.status === 401) {
                        toast.warning('Authentication API is working, but credentials are invalid');
                    }
                } else if (error.code === 'ECONNREFUSED') {
                    errorMsg = 'Connection refused - server may not be running or port is blocked';
                } else if (error.request) {
                    errorMsg = 'No response received from server';
                } else {
                    errorMsg = error.message;
                }
                
                setConnectionErrors(prev => [...prev, `Direct login error: ${errorMsg}`]);
                
                // Try with fetch API as fallback
                try {
                    console.log('Trying with fetch API...');
                    const response = await fetch('http://localhost:7000/api/auth/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            email: inps.email,
                            password: inps.password
                        })
                    });
                    
                    const data = await response.json();
                    console.log('Fetch login response:', data);
                    
                    if (response.ok) {
                        toast.success('Login successful via fetch API');
                        setConnectionErrors(prev => [...prev, 'Fetch API login successful']);
                        
                        // Store token if available
                        if (data?.token || data?.data?.token) {
                            const token = data?.token || data?.data?.token;
                            localStorage.setItem('addisnest_token', token);
                            localStorage.setItem('isLogin', '1');
                            toast.success('Token stored successfully');
                        }
                    } else {
                        setConnectionErrors(prev => [...prev, `Fetch API got error response: ${JSON.stringify(data)}`]);
                        
                        // If we got a 401, the API is working but credentials are wrong
                        if (response.status === 401) {
                            toast.warning('Authentication API is working, but credentials are invalid');
                        }
                    }
                } catch (fetchError) {
                    console.error('Fetch login error:', fetchError);
                    setConnectionErrors(prev => [...prev, `Fetch login error: ${fetchError.message}`]);
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            fontFamily: 'Arial, sans-serif',
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px'
        }}>
            <h1 style={{
                color: '#333',
                borderBottom: '1px solid #eee',
                paddingBottom: '10px'
            }}>API Connection Debugger</h1>
            
            <div style={{
                background: '#f5f5f5',
                padding: '15px',
                borderRadius: '5px',
                marginBottom: '20px'
            }}>
                <h2>API Status Check</h2>
                <p>
                    Status: {apiStatus.checked ? (
                        <span style={{
                            color: apiStatus.status === 'success' ? 'green' : 
                                  apiStatus.status === 'warning' ? 'orange' : 'red',
                            fontWeight: 'bold'
                        }}>
                            {apiStatus.message}
                        </span>
                    ) : 'Checking...'}
                </p>
                <button 
                    onClick={checkApiStatus}
                    style={{
                        background: '#4CAF50',
                        color: 'white',
                        border: 'none',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    Check Again
                </button>
            </div>
            
            <div style={{
                background: '#fff',
                padding: '20px',
                borderRadius: '5px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
                <h2>Login Test</h2>
                <div style={{marginBottom: '15px'}}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: 'bold'
                    }}>
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter Your Email Id"
                        onChange={onInpChanged}
                        value={inps?.email}
                        style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
                
                <div style={{marginBottom: '15px'}}>
                    <label style={{
                        display: 'block',
                        marginBottom: '5px',
                        fontWeight: 'bold'
                    }}>
                        Password
                    </label>
                    <div style={{position: 'relative'}}>
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            placeholder="Enter Your Password"
                            name="password"
                            onChange={onInpChanged}
                            value={inps?.password}
                            style={{
                                width: '100%',
                                padding: '10px',
                                paddingRight: '40px',
                                border: '1px solid #ddd',
                                borderRadius: '4px',
                                boxSizing: 'border-box'
                            }}
                        />
                        <div
                            onClick={togglePasswordVisibility}
                            style={{ 
                                position: 'absolute',
                                top: '50%',
                                right: '10px',
                                transform: 'translateY(-50%)',
                                cursor: 'pointer'
                            }}
                        >
                            {isPasswordVisible ? "Hide" : "Show"}
                        </div>
                    </div>
                </div>
                
                <button 
                    onClick={loginFun}
                    disabled={loading}
                    style={{
                        background: '#2196F3',
                        color: 'white',
                        border: 'none',
                        padding: '12px 15px',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        width: '100%',
                        fontWeight: 'bold',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? "Testing Connection..." : "Test Login"}
                </button>
            </div>
            
            {connectionErrors.length > 0 && (
                <div style={{
                    marginTop: '20px',
                    background: '#fff3cd',
                    padding: '15px',
                    borderRadius: '5px',
                    border: '1px solid #ffeeba'
                }}>
                    <h3 style={{color: '#856404'}}>Connection Debug Information</h3>
                    <ul style={{
                        paddingLeft: '20px',
                        color: '#555'
                    }}>
                        {connectionErrors.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}
            
            <div style={{
                marginTop: '20px',
                borderTop: '1px solid #eee',
                paddingTop: '15px',
                color: '#666'
            }}>
                <h3>Troubleshooting Tips</h3>
                <ul>
                    <li>Ensure the backend server is running on port 7000</li>
                    <li>Check for any network/firewall issues that might block connections</li>
                    <li>Verify CORS settings in the backend to allow requests from this origin</li>
                    <li>Try accessing directly in a new tab: <a href="http://localhost:7000/api/auth" target="_blank">http://localhost:7000/api/auth</a></li>
                    <li>Check browser console for additional error details</li>
                </ul>
            </div>
        </div>
    );
};

export default LoginDebug;
