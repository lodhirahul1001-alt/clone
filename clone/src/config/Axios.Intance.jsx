// src/config/Axios.Intance.jsx

import axios from "axios";
import { store } from "../store/store";
import { removeUser } from "../features/reducers/AuthSlice";

// Prefer env, fallback to localhost for dev
const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

// Create Axios Instance
export const AxiosIntance = axios.create({
  baseURL: API_BASE_URL,        // -> e.g. https://prdigital-backend-3sjn.onrender.com/api
  withCredentials: true,        // cookie bhejne/leneke liye IMPORTANT
  timeout: 30000,               // Render ke liye thoda zyada time
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// OPTIONAL: Request interceptor (abhi sirf pass-through)
AxiosIntance.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Response interceptor – 401 pe logout + redirect
AxiosIntance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Redux se user hatao
      store.dispatch(removeUser(null));

      // Agar CMS ke andar ho to home pe bhej do
      if (window.location.pathname.startsWith("/cms")) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);
