import axios from "axios";
import { checkToken, clearToken, refreshAccessToken } from "../utils/tokenHandler";
// let access_token=""
// if(localStorage.getItem('persist:root')){
//   access_token = JSON.parse(JSON.parse(localStorage.getItem("persist:root"))?.UserAuthLogin).data.token || "";
// }
const baseURL = import.meta.env.VITE_BASEURL;

const Api = {
    get: async (url, params) => {
        try {
            let newurl = baseURL + url;
            const response = await axios.get(newurl, { params });
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
            let newurl = baseURL + url;
            const response = await axios.put(newurl, data, { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    delete: async (url, params) => {
        try {
            let newurl = baseURL + url;
            const response = await axios.delete(newurl, { params });
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
                    "Authorization" :'Bearer '+Token
                }
            };
            const response = await axios.get(newurl,config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    postWithtoken: async (url,params) => {
        try {
            let newurl = baseURL+url;
            const Token = localStorage.getItem('access_token');
            let config = {
                headers: 
                {
                    "Authorization" :'Bearer '+Token
                }
            };
            const response = await axios.post(newurl, params,config);
            return response.data;
        } catch (error) {
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
                    "Authorization" :'Bearer '+Token
                }
            };
            const response = await axios.put(newurl, params,config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    patchWithtoken: async (url,params) => {
        try {
            let newurl = baseURL+url;
            const Token = localStorage.getItem('access_token');
            let config = {
                headers: 
                {
                    "Authorization" :'Bearer '+Token
                }
            };
            const response = await axios.patch(newurl, params,config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Specialized method for file uploads with enhanced error handling
    postFileWithtoken: async (url, formData) => {
        const newurl = baseURL + url;
        const Token = localStorage.getItem('access_token');
        
        console.log('🚀 Starting file upload...');
        console.log('📍 Upload URL:', newurl);
        console.log('🔑 Token exists:', !!Token);
        
        if (!Token) {
            throw new Error('Authentication token not found. Please login again.');
        }

        try {
            const config = {
                headers: {
                    "Authorization": `Bearer ${Token}`,
                    // Let axios handle Content-Type for multipart/form-data
                },
                timeout: 60000, // 60 seconds timeout
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    console.log(`📊 Upload progress: ${percentCompleted}%`);
                }
            };
            
            const response = await axios.post(newurl, formData, config);
            console.log('✅ Upload successful:', response.data);
            return response.data;
            
        } catch (error) {
            console.error('❌ Upload error details:', {
                status: error?.response?.status,
                statusText: error?.response?.statusText,
                message: error?.message,
                data: error?.response?.data,
                url: newurl
            });
            
            // Enhanced error with user-friendly messages
            let enhancedError = new Error();
            
            if (error?.response?.status === 401) {
                enhancedError.message = 'Authentication failed. Please refresh the page and login again.';
                enhancedError.code = 'AUTH_ERROR';
            } else if (error?.response?.status === 413) {
                enhancedError.message = 'File too large. Please select a smaller image (max 5MB).';
                enhancedError.code = 'FILE_TOO_LARGE';
            } else if (error?.response?.status === 415) {
                enhancedError.message = 'Unsupported file type. Please select JPG, PNG, or WEBP images only.';
                enhancedError.code = 'INVALID_FILE_TYPE';
            } else if (error?.response?.status === 422) {
                enhancedError.message = 'Invalid file data. Please try selecting the image again.';
                enhancedError.code = 'INVALID_FILE_DATA';
            } else if (error?.response?.status >= 500) {
                enhancedError.message = 'Server error. Please try again in a few moments.';
                enhancedError.code = 'SERVER_ERROR';
            } else if (error?.code === 'ECONNABORTED' || error?.message?.includes('timeout')) {
                enhancedError.message = 'Upload timed out. Please check your connection and try again.';
                enhancedError.code = 'TIMEOUT_ERROR';
            } else if (!navigator.onLine) {
                enhancedError.message = 'No internet connection. Please check your network and try again.';
                enhancedError.code = 'NETWORK_ERROR';
            } else {
                enhancedError.message = error?.response?.data?.message || error?.message || 'Upload failed. Please try again.';
                enhancedError.code = 'UNKNOWN_ERROR';
            }
            
            enhancedError.originalError = error;
            enhancedError.response = error?.response;
            throw enhancedError;
        }
    },
    
   
    deleteWithtoken: async (url, params) => {
        try {
            let newurl = baseURL + url;
            const Token = localStorage.getItem('access_token');
            let config = {
                headers: 
                {
                    "Authorization" :'Bearer '+Token
                }
            };
            const response = await axios.delete(newurl, config);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default Api;
