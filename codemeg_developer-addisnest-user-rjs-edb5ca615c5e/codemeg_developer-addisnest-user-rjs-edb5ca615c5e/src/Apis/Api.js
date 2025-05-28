import axios from "axios";
import { checkToken, clearToken, refreshAccessToken } from "../utils/tokenHandler";
// let access_token=""
// if(localStorage.getItem('persist:root')){
//   access_token = JSON.parse(JSON.parse(localStorage.getItem("persist:root"))?.UserAuthLogin).data.token || "";
// }
// Use proxy during development, fallback to external URL in production
const baseURL = import.meta.env.DEV ? '/api/' : import.meta.env.VITE_BASEURL;

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
            let newurl = baseURL+url;
            const response = await axios.post(newurl, data, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    
    put: async (url, data, params) => {
        try {
            let newurl = baseURL+url+params;
            const response = await axios.put(url, data, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    delete: async (url, params) => {
        try {
            let newurl = baseURL+url+params;
            const response = await axios.delete(url, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getWithtoken: async (url) => {
        try {
            let newurl = baseURL+url;
            const Token = localStorage.getItem('access_token');
            console.log(Token)
            let config = {
                headers: 
                {
                    "Authorization": Token ? `Bearer ${Token}` : ""
                }
            };
            const response = await axios.get(newurl,config);
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response?.data || error.message);
            throw error;
        }
    },
    postWithtoken: async (url, params) => {
        try {
            let newurl = baseURL + url;
            const Token = localStorage.getItem('access_token');
            
            // Check if token exists
            if (!Token) {
                throw new Error('Authentication token not found. Please login again.');
            }
            
            // Check if params is FormData (for file uploads)
            const isFormData = params instanceof FormData;
            
            let config = {
                headers: {
                    "Authorization": `Bearer ${Token}`
                },
                timeout: isFormData ? 60000 : 30000, // 60s for file uploads, 30s for regular requests
                maxContentLength: Infinity,
                maxBodyLength: Infinity
            };
            
            // For FormData, let axios set the Content-Type automatically
            // For regular data, set Content-Type to application/json
            if (!isFormData) {
                config.headers["Content-Type"] = "application/json";
            }
            
            console.log('Making API request to:', newurl);
            console.log('Request config:', { ...config, headers: { ...config.headers, Authorization: '[HIDDEN]' } });
            
            const response = await axios.post(newurl, params, config);
            return response.data;
        } catch (error) {
            console.error('API Error Details:', {
                url: baseURL + url,
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                message: error.message,
                code: error.code
            });
            
            // Handle specific error cases
            if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
                throw new Error('Network connection failed. Please check your internet connection and try again.');
            } else if (error.response?.status === 401) {
                throw new Error('Authentication failed. Please login again.');
            } else if (error.response?.status === 413) {
                throw new Error('File too large. Please select a smaller image.');
            } else if (error.response?.status === 500) {
                throw new Error('Server error. Please try again later.');
            } else if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            
            throw error;
        }
    },
    
    putWithtoken: async (url,params) => {
        try {
            let newurl = baseURL+url;
            const Token = localStorage.getItem('access_token');
            let config = {
                headers: 
                {
                    "Authorization": Token ? `Bearer ${Token}` : ""
                }
            };
            const response = await axios.put(newurl, params,config);
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response?.data || error.message);
            throw error;
        }
    },
    
   
    deleteWithtoken: async (url, params) => {
        try {
            let newurl = baseURL+url+params;
            const Token = localStorage.getItem('access_token');
            let config = {
                headers: 
                {
                    "Authorization": Token ? `Bearer ${Token}` : ""
                }
            };
            const response = await axios.delete(newurl, config);
            return response.data;
        } catch (error) {
            console.error('API Error:', error.response?.data || error.message);
            throw error;
        }
    },
};

export default Api;
