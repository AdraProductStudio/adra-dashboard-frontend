import axios from "axios";
import { toast } from "react-hot-toast";


const axiosInstance = axios.create({
  baseURL: "https://your-api-url.com", 
  timeout: 10000, 
});


axiosInstance.interceptors.request.use(
    (config) => {      
      const token = localStorage.getItem('token'); 
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`; 
      }
      return config;
    },
    (error) => {
     
      return Promise.reject(error);
    }
  );


  axiosInstance.interceptors.response.use(
    (response) => {
      toast.success(response.data.message);
      return response.data; 
    },
    async (error) => {
      if (error.response) {        
        console.error('Response error:', error.response.data);
        toast.error(error.response.data.message || "An error occurred!");
        
        if (error.response.status === 401) {
          try {
            const refreshToken = localStorage.getItem('token');
            const response = await axios.post('/refresh-token', { token: refreshToken });
            const newToken = response.data.token;
          
            localStorage.setItem('token', newToken);
                        
            error.config.headers['Authorization'] = `Bearer ${newToken}`;
            return axiosInstance(error.config);
          } catch (refreshError) {
            console.error('Refresh token error:', refreshError);
            toast.error("Session expired, please log in again.");
            // Optionally redirect to login
          }
        }
      } else if (error.request) {
        console.error('Request error:', error.request);
        toast.error("No response received from the server.");
      } else {
        console.error('Axios error:', error.message);
        toast.error("Axios error: " + error.message);
      }
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;