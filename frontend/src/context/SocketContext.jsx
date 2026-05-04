/**
 * SocketContext
 * Manages Socket.io connection for the entire app
 * Auto-connects when user logs in, disconnects on logout
 */

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";
import { getToken } from "../services/auth.service.js";

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export function SocketProvider({ children }) {
  const { isAuth } = useAuth();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuth) {
      const token = getToken();

      // Connect with JWT
      socketRef.current = io(SOCKET_URL, {
        auth: { token },
        transports: ["websocket", "polling"],
      });

      socketRef.current.on("connect", () => {
        setIsConnected(true);
        console.log("⚡ Socket connected");
      });

      socketRef.current.on("disconnect", () => {
        setIsConnected(false);
        console.log("⚡ Socket disconnected");
      });

      socketRef.current.on("connect_error", (err) => {
        console.warn("Socket connection error:", err.message);
      });

    } else {
      // Disconnect when logged out
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isAuth]);

  return (
    <SocketContext.Provider value={{ socket: socketRef.current, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}