// src/utils/authService.js
import { jwtDecode } from 'jwt-decode';

export const authService = {
  // Save token with validation
  setToken: (token) => {
    try {
      if (!token) return false;
      
      const decoded = jwtDecode(token);
      
      // Basic token validation
      if (!decoded.exp || !decoded.role) {
        console.error('Invalid token structure');
        return false;
      }

      localStorage.setItem('access_token', token);
      localStorage.setItem('token_exp', decoded.exp * 1000); // Convert to milliseconds
      localStorage.setItem('user_role', decoded.role);
      
      return true;
    } catch (error) {
      console.error('Error setting token:', error);
      authService.clearToken();
      return false;
    }
  },

  // Get current valid token
  getToken: () => {
    const token = localStorage.getItem('access_token');
    const expiration = localStorage.getItem('token_exp');
    
    if (!token || !expiration) {
      authService.clearToken();
      return null;
    }
    
    // Check if token expired
    if (Date.now() > parseInt(expiration)) {
      authService.clearToken();
      return null;
    }
    
    return token;
  },

  // Clear all auth data
  clearToken: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_exp');
    localStorage.removeItem('user_role');
    localStorage.removeItem('isLogin');
    localStorage.removeItem('userId');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return authService.getToken() !== null;
  },

  // Check if token will expire soon (within 5 minutes)
  willExpireSoon: () => {
    const expiration = localStorage.getItem('token_exp');
    if (!expiration) return true;
    return Date.now() > (parseInt(expiration) - 5 * 60 * 1000);
  },

  // Get user role from token
  getUserRole: () => {
    return localStorage.getItem('user_role');
  },

  // Initialize session monitoring
  initSessionMonitoring: () => {
    // Listen for storage events (other tabs logging out)
    window.addEventListener('storage', (event) => {
      if (event.key === 'logout') {
        authService.clearToken();
        window.location.reload();
      }
    });

    // Broadcast logout to other tabs
    authService.broadcastLogout = () => {
      localStorage.setItem('logout', Date.now());
    };
  }
};

// Initialize session monitoring when imported
authService.initSessionMonitoring();

export default authService;