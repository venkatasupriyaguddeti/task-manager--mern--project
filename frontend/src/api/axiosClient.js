import axios from "axios";
import { clearAuth, getAuth } from "../utils/storage";


const baseURL =import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

//one client of axios, that handles everythong from the baseURL

const axiosClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use(
  (config) => {
    const auth = getAuth();
    const token = auth?.token; //error
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(errror),
);

axiosClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    if (status == 401) {
      clearAuth();
      window.location.assign("\login");
    }
    return Promise.reject(error);
  },
);

export default axiosClient;