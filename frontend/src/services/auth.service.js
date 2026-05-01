/**
 * Auth Service
 * Wraps the /api/auth/* endpoints
 */

import api, { TOKEN_KEY } from "./axios.js";

/**
 * Register a new user
 * @param {Object} data - { name, email, password, city, role }
 */
export const register = async (data) => {
  const response = await api.post("/auth/register", data);
  return response.data; // { success, message, data: { user, token } }
};

/**
 * Login an existing user
 * @param {Object} data - { email, password }
 */
export const login = async (data) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

/**
 * Get the currently logged-in user
 * Token is auto-attached by axios interceptor
 */
export const getMe = async () => {
  const response = await api.get("/auth/me");
  return response.data;
};

/**
 * Save token to localStorage
 */
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Get token from localStorage
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove token (logout)
 */
export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};