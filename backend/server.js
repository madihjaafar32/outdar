/**
 * OUTDAR Backend — Entry Point
 * Boots Express server + Socket.io + connects to MongoDB
 */

import express from "express";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import dotenv from "dotenv";

// Load environment variables BEFORE anything else
dotenv.config();

import connectDB from "./src/config/database.js";
import errorHandler from "./src/middleware/errorHandler.js";
import notFound from "./src/middleware/notFound.js";

// Import routes (will be added in upcoming slices)
import authRoutes from "./src/routes/auth.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
// import userRoutes from "./src/routes/user.routes.js";
// import eventRoutes from "./src/routes/event.routes.js";

// Import socket handlers (will be added in Slice 6)
// import registerSocketHandlers from "./src/sockets/index.js";

// ============================================
// Initialize app
// ============================================
const app = express();
const httpServer = createServer(app);

// Socket.io setupf
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Make io accessible to routes (for emitting events from controllers)
app.set("io", io);

// ============================================
// Middleware
// ============================================
app.use(helmet());
app.use(compression());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// HTTP request logger (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ============================================
// Routes
// ============================================

// Health check route
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "🚪 OUTDAR API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Welcome route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to OUTDAR API",
    docs: "See /api/health for status",
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/categories", categoryRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/events", eventRoutes);

// ============================================
// Error handling
// ============================================
app.use(notFound);
app.use(errorHandler);

// ============================================
// Socket.io connection
// ============================================
io.on("connection", (socket) => {
  console.log(`🔌 Socket connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// Will register feature handlers in Slice 6
// registerSocketHandlers(io);

// ============================================
// Start server
// ============================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    httpServer.listen(PORT, () => {
      console.log("");
      console.log("╔════════════════════════════════════════╗");
      console.log("║   🚪  OUTDAR API SERVER STARTED        ║");
      console.log("╠════════════════════════════════════════╣");
      console.log(`║   📡 Port:        ${PORT.toString().padEnd(20)} ║`);
      console.log(`║   🌍 Environment: ${(process.env.NODE_ENV || "development").padEnd(20)} ║`);
      console.log(`║   🔗 URL:         http://localhost:${PORT}  ║`);
      console.log("╚════════════════════════════════════════╝");
      console.log("");
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM received, shutting down gracefully");
  httpServer.close(() => {
    console.log("✅ Server closed");
    process.exit(0);
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection:", reason);
});
