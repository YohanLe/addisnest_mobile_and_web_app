import axios from "axios";

// Base URL from environment
const baseURL = import.meta.env.VITE_BASEURL;

// Axios Interceptor for handling 401 errors
axios.interceptors.response.use(
  (response) => response, // Success case: return response as is
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 Unauthorized: Trigger logout
      localStorage.removeItem('access_token'); // Clear token
      localStorage.removeItem('persist:root'); // Clear any persisted state if needed
     localStorage.removeItem('isLogin');
      localStorage.removeItem('userId');
      // Redirect to login page
      window.location.href = '/login'; // Adjust the login route as per your app
      // Optionally show a toast notification
      // toast.error('Session expired. Please log in again.');
    }
    return Promise.reject(error); // Pass error to caller
  }
);

const Api = {
  get: async (url, params) => {
    try {
      const response = await axios.get(url, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  post: async (url, data, params) => {
    try {
      let newurl = baseURL + url;
      console.log("newurl", newurl);
      console.log("data", data);
      const response = await axios.post(newurl, data, { params });
      console.log("response", response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  put: async (url, data, params) => {
    try {
      let newurl = baseURL + url; // Fixed: Use newurl for consistency
      const response = await axios.put(newurl, data, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (url, params) => {
    try {
      let newurl = baseURL + url; // Fixed: Use newurl for consistency
      const response = await axios.delete(newurl, { params });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getWithtoken: async (url) => {
    try {
      let newurl = baseURL + url;
      const Token = localStorage.getItem('access_token');
      let config = {
        headers: {
          Authorization: 'Bearer ' + Token,
        },
      };
      const response = await axios.get(newurl, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  postWithtoken: async (url, params) => {
    try {
      let newurl = baseURL + url;
      const Token = localStorage.getItem('access_token');
      let config = {
        headers: {
          Authorization: 'Bearer ' + Token,
        },
      };
      const response = await axios.post(newurl, params, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  putWithtoken: async (url, params) => {
    try {
      let newurl = baseURL + url;
      const Token = localStorage.getItem('access_token');
      let config = {
        headers: {
          Authorization: 'Bearer ' + Token, // Fixed: Added 'Bearer' for consistency
        },
      };
      const response = await axios.put(newurl, params, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteWithtoken: async (url) => {
    try {
      let newurl = baseURL + url;
      const Token = localStorage.getItem('access_token');
      let config = {
        headers: {
          Authorization: 'Bearer ' + Token,
        },
      };
      const response = await axios.delete(newurl, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default Api;