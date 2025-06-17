/**
 * Addisnest API Endpoint Test Tool
 * 
 * This script helps troubleshoot API connection issues after deploying to Netlify.
 * Copy and paste this into your browser console while on your Netlify site to test
 * the connection to your backend API.
 */

// Configuration - Update these values
const CONFIG = {
  // Your backend API base URL (update this with your actual backend URL)
  apiBaseUrl: 'https://your-backend-api-url.com',
  
  // Endpoints to test (add or modify based on your API structure)
  endpoints: {
    healthCheck: '/health', // Simple health check endpoint
    login: '/api/auth/login', // Login endpoint
    users: '/api/users',     // Users endpoint
    properties: '/api/properties' // Properties endpoint
  },
  
  // Test credentials (only used for login test)
  testCredentials: {
    email: 'test@example.com',
    password: 'test123'
  }
};

// Utility function to log results with styling
function logResult(message, success = true) {
  console.log(
    `%c ${success ? '✓' : '✗'} ${message}`,
    `color: ${success ? 'green' : 'red'}; font-weight: bold;`
  );
}

// Utility function for making API requests
async function makeRequest(endpoint, options = {}) {
  const url = `${CONFIG.apiBaseUrl}${endpoint}`;
  
  try {
    console.log(`Testing endpoint: ${url}`);
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      credentials: 'include' // Include cookies for auth if needed
    };
    
    const fetchOptions = { ...defaultOptions, ...options };
    
    // Add authorization header if localStorage has a token
    const token = localStorage.getItem('authToken') || localStorage.getItem('token');
    if (token && !fetchOptions.headers.Authorization) {
      fetchOptions.headers.Authorization = `Bearer ${token}`;
    }
    
    const startTime = Date.now();
    const response = await fetch(url, fetchOptions);
    const endTime = Date.now();
    
    const responseTime = endTime - startTime;
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }
    
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      data,
      responseTime,
      headers: Object.fromEntries([...response.headers])
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      details: error.toString()
    };
  }
}

// Test basic connectivity
async function testBasicConnectivity() {
  console.group('1. Basic API Connectivity Test');
  
  try {
    const healthEndpoint = CONFIG.endpoints.healthCheck;
    const result = await makeRequest(healthEndpoint);
    
    if (result.success) {
      logResult(`Successfully connected to API (${result.responseTime}ms)`);
      console.log('Response:', result.data);
    } else {
      logResult(`Failed to connect to API health endpoint: ${result.status} ${result.statusText}`, false);
      console.log('Details:', result);
    }
  } catch (error) {
    logResult(`API connectivity test failed with error: ${error.message}`, false);
    console.error(error);
  }
  
  console.groupEnd();
}

// Test login endpoint
async function testLoginEndpoint() {
  console.group('2. Login API Test');
  
  try {
    const loginEndpoint = CONFIG.endpoints.login;
    const credentials = CONFIG.testCredentials;
    
    const result = await makeRequest(loginEndpoint, {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
    
    if (result.success) {
      logResult(`Login API endpoint is working (${result.responseTime}ms)`);
      console.log('Response:', result.data);
      
      // Check if we got an auth token in the response
      if (result.data.token || result.data.accessToken || result.data.access_token) {
        logResult('Authentication token received successfully');
      } else {
        logResult('Warning: No authentication token found in response', false);
      }
    } else {
      logResult(`Login API test failed: ${result.status} ${result.statusText}`, false);
      console.log('Details:', result);
    }
  } catch (error) {
    logResult(`Login API test failed with error: ${error.message}`, false);
    console.error(error);
  }
  
  console.groupEnd();
}

// Test authenticated endpoint
async function testAuthenticatedEndpoint() {
  console.group('3. Authenticated Endpoint Test');
  
  try {
    const endpoint = CONFIG.endpoints.users;
    const result = await makeRequest(endpoint);
    
    if (result.success) {
      logResult(`Authenticated endpoint test successful (${result.responseTime}ms)`);
      console.log('Response:', result.data);
    } else {
      logResult(`Authenticated endpoint test failed: ${result.status} ${result.statusText}`, false);
      
      if (result.status === 401) {
        logResult('Authentication error: Your token may be invalid or expired', false);
      }
      
      console.log('Details:', result);
    }
  } catch (error) {
    logResult(`Authenticated endpoint test failed with error: ${error.message}`, false);
    console.error(error);
  }
  
  console.groupEnd();
}

// Check for environment variables
function checkEnvironmentVariables() {
  console.group('4. Environment Variables Check');
  
  try {
    // For React apps
    if (typeof window.process !== 'undefined' && window.process.env) {
      const envVars = Object.keys(window.process.env)
        .filter(key => key.startsWith('REACT_APP_'));
      
      if (envVars.length > 0) {
        logResult(`Found ${envVars.length} React environment variables`);
        envVars.forEach(key => {
          // Only show that variables exist, not their values for security
          console.log(`- ${key}: ${window.process.env[key] ? '✓ (set)' : '✗ (empty)'}`);
        });
      } else {
        logResult('No React environment variables found', false);
      }
    } 
    // For Vite apps
    else if (typeof import.meta !== 'undefined' && import.meta.env) {
      const envVars = Object.keys(import.meta.env)
        .filter(key => key.startsWith('VITE_'));
      
      if (envVars.length > 0) {
        logResult(`Found ${envVars.length} Vite environment variables`);
        envVars.forEach(key => {
          // Only show that variables exist, not their values for security
          console.log(`- ${key}: ${import.meta.env[key] ? '✓ (set)' : '✗ (empty)'}`);
        });
      } else {
        logResult('No Vite environment variables found', false);
      }
    } else {
      logResult('Could not detect environment variables', false);
    }
  } catch (error) {
    logResult(`Error checking environment variables: ${error.message}`, false);
  }
  
  console.groupEnd();
}

// Run CORS test
async function testCORS() {
  console.group('5. CORS Configuration Test');
  
  try {
    const result = await makeRequest(CONFIG.endpoints.healthCheck, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'GET'
      }
    });
    
    if (result.success || result.status === 204) {
      logResult('CORS preflight request successful');
      
      // Check if CORS headers are present
      const corsHeaders = [
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Headers'
      ];
      
      const presentHeaders = corsHeaders.filter(header => 
        result.headers && result.headers[header.toLowerCase()]
      );
      
      if (presentHeaders.length === corsHeaders.length) {
        logResult('All required CORS headers are present');
      } else {
        logResult(`Missing some CORS headers. Found ${presentHeaders.length} of ${corsHeaders.length}`, false);
        console.log('Available headers:', result.headers);
      }
    } else {
