import axios from "axios";
import store from "../StoreIndex";
import { handlerefreshToken } from "Views/Common/Action/Common_action";
import { aesDecrypt, encryptData } from "Security/Crypto/Crypto";


const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

axiosInstance.interceptors.response.use(
  (response) => {
    if (process.env.REACT_APP_ENVIRONMENT === "production") {
      try {
        return { ...response, data: aesDecrypt(response.data) };
      } catch (err) {
        console.error("Decryption failed:", err);
        return response; // fallback
      }
    }
    return response;
  },
  async (error) => {
    let errorData = error || {};

    try {
      // Handle network errors (no response)
      if (!errorData.response) {
        return Promise.reject(errorData);
      }

      const originalRequest = errorData.config;
      const requestUrl = originalRequest._rawRequestUrl || originalRequest.url || "";
      const isRefreshRequest = originalRequest._skipAuthRefresh || requestUrl.includes("/refresh_token");

      if (process.env.REACT_APP_ENVIRONMENT === "production") {
        try {
          const decryptedError = aesDecrypt(errorData.response.data);
          if (decryptedError !== "Invalid id") errorData.response.data = decryptedError;
        } catch (err) {
          console.error("Error decrypting error response:", err);
        }
      }

      // Token expired -> refresh
      if (
        errorData.response.status === 401 &&
        !originalRequest._retry &&
        !isRefreshRequest
      ) {
        originalRequest._retry = true;
        try {
          const token = await store.dispatch(handlerefreshToken());
          originalRequest.url = originalRequest._rawRequestUrl || originalRequest.url;
          if (originalRequest._rawRequestDataSet) originalRequest.data = originalRequest._rawRequestData;
          if (token) originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        } catch (refreshErr) {
          return Promise.reject(refreshErr);
        }
      }

      return Promise.reject(errorData.response.data || errorData);

    } catch (err) {
      console.error("Interceptor error:", err);
      return Promise.reject(err);
    }
  }
);



axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state?.commonState?.token;
  const rawUrl = config._rawRequestUrl || config.url || "";

  if (!config._rawRequestUrl) config._rawRequestUrl = rawUrl;
  if (!config._rawRequestDataSet) {
    config._rawRequestData = config.data;
    config._rawRequestDataSet = true;
  }

  // Split URL into path and query parameters
  const [baseUrl, queryParams] = rawUrl.split('?') || [];

  if (process.env.REACT_APP_ENVIRONMENT === "production") {
    const fullEndpoint = '/api/v1' + (baseUrl || '');

    const now = new Date();
    const future = new Date(now.getTime() + 45 * 1000).toISOString();

    // Include query params in encryption payload
    const encrypted_url = encryptData({ endpoint: fullEndpoint, validating_time: future });
    const encryptedQuery = encryptData({ query_string: queryParams });
    config.url = queryParams ? `${encrypted_url}?${encryptedQuery}` : encrypted_url;

    // Encrypt the request body
    if (config._rawRequestData && !(config._rawRequestData instanceof FormData)) {
      const encrypted = encryptData(config._rawRequestData);
      config.data = { payload: encrypted };
    }
  }
  else config.url = '/api/v1' + rawUrl;

  // Headers
  if (!['/login', '/refresh_token', '/get_registration_roles', '/register_candidate'].includes(baseUrl)) {
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) config.headers['Content-Type'] = 'multipart/form-data';
  else config.headers['Content-Type'] = 'application/json';
  return config;
});


export default axiosInstance;
