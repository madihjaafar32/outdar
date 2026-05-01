/**
 * AuthContext
 *
 * Provides authentication state and methods to the entire app.
 * Wrap your app in <AuthProvider>, then use the useAuth() hook anywhere.
 *
 * Example:
 *   const { user, isAuth, login, logout } = useAuth();
 */

import { createContext, useContext, useEffect, useState } from "react";
import * as authService from "../services/auth.service.js";

// 1. Create the context (default value rarely used)
const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and provides auth state to children.
 * Place this near the top of your component tree (below BrowserRouter).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * On app boot — check if there's a token in localStorage.
   * If yes, ask the backend "who am I?" to fetch the user.
   * This way, refreshing the page keeps the user logged in.
   */
  useEffect(() => {
    const bootAuth = async () => {
      const token = authService.getToken();

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authService.getMe();
        setUser(response.data.user);
      } catch (error) {
        // Token invalid or expired — clear it
        console.warn("Auth check failed:", error.message);
        authService.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    bootAuth();
  }, []);

  /**
   * Register a new user — auto-logs them in on success
   */
  const register = async (data) => {
    const response = await authService.register(data);
    authService.saveToken(response.data.token);
    setUser(response.data.user);
    return response;
  };

  /**
   * Login an existing user
   */
  const login = async (credentials) => {
    const response = await authService.login(credentials);
    authService.saveToken(response.data.token);
    setUser(response.data.user);
    return response;
  };

  /**
   * Logout — clear token and user
   */
  const logout = () => {
    authService.clearToken();
    setUser(null);
  };

  const value = {
    user,
    isAuth: !!user,
    isLoading,
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth — custom hook for accessing auth state/methods
 * Must be used inside <AuthProvider>
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}