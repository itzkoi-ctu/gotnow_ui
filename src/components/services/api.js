import axios from 'axios';
import { logoutUser } from '../services/authService'
 const BASE_URL= "http://localhost:8080/api/v1"
//const BASE_URL= "https://gotnow-api.onrender.com/api/v1"

export  const  privateApi= axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
 })


 export  const  api= axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    
 })



//  const refreshToken = async () => {
//     try {
//       const response = await api.post("/auth/refresh-token");
//       return response.data.accessToken;
//     } catch (error) {
//       return Promise.reject(error);
//     }
//   };
  const refreshToken = async () => {
    try {
        console.log("Refreshing token...");
        const response = await api.post("/auth/refresh-token");
        console.log("New token received:", response.data.accessToken);
        return response.data.accessToken;
    } catch (error) {
        console.error("Refresh token failed:", error.response?.status);
        return Promise.reject(error);
    }
};
 privateApi.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem("authToken");
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );



  privateApi.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      console.log("Interceptor error:", error.response?.status);

      if (error && !originalRequest._retry) {
        console.log("Access token expired, trying to refresh...");

        originalRequest._retry = true;
        try {
            
          const newAccessToken = await refreshToken();
          console.log("New access token set:", newAccessToken);

          localStorage.setItem("authToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return privateApi(originalRequest);
        } catch (refreshError) {
            console.error("Failed to refresh token, logging out...");

          logoutUser();
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
  

  