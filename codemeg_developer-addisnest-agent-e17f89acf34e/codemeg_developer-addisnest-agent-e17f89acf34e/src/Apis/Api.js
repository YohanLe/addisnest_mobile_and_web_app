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
                    "Authorization" :Token
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
                    "Authorization" :Token
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
                    "Authorization" :Token
                }
            };
            const response = await axios.put(newurl, params,config);
            return response.data;
        } catch (error) {
            throw error;
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
