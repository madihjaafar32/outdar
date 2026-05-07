/**
 * Axios instance for OUTDAR API
 *
 * - Base URL from .env (VITE_API_URL)
 * - Auto-attaches JWT token from localStorage to every request
 * - Auto-handles 401s (logs user out + redirects to login)
 */

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Storage key (matches our convention: outdar_token)
export const TOKEN_KEY = "outdar_token";

/**
 * Pre-configured axios instance — use this everywhere instead of plain `axios`
 */
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10s timeout
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * REQUEST INTERCEPTOR
 * - Auto-attach JWT token to every outgoing request (if available)
 * - Remove Content-Type for FormData so axios sets it automatically
 *   (with the correct multipart/form-data boundary)
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Let axios handle Content-Type automatically for FormData
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * RESPONSE INTERCEPTOR
 * Auto-handle 401 Unauthorized:
 *  - Token might be expired or invalid
 *  - Clear stored token + force re-login
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token (it's invalid)
      localStorage.removeItem(TOKEN_KEY);

      // Only redirect if we're not already on a public page
      const publicPaths = ["/", "/login", "/register", "/about"];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;