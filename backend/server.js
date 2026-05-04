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
import messageRoutes from "./src/routes/message.routes.js";

// Load environment variables BEFORE anything else
dotenv.config();

import connectDB from "./src/config/database.js";
import errorHandler from "./src/middleware/errorHandler.js";
import notFound from "./src/middleware/notFound.js";

// Import routes
import authRoutes from "./src/routes/auth.routes.js";
import eventRoutes from "./src/routes/event.routes.js";
import categoryRoutes from "./src/routes/category.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import reviewRoutes from "./src/routes/review.routes.js";
// import userRoutes from "./src/routes/user.routes.js";

// Import socket handlers (will be added in Slice 6)
import { initSocket } from "./src/sockets/index.js";

// ============================================
// Initialize app
// ============================================
const app = express();
const httpServer = createServer(app);

// Socket.io setup
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  },
});

// Make io accessible to routes
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

// HTTP request logger (development only)
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

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/attendances", attendanceRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
// app.use("/api/users", userRoutes);

// ============================================
// Error handling
// ============================================
app.use(notFound);
app.use(errorHandler);

// ============================================
// Socket.io connection
// ============================================

initSocket(io);

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
      console.log(
        `║   🌍 Environment: ${(process.env.NODE_ENV || "development").padEnd(20)} ║`
      );
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


process.on("unhandledRejection", (reason) => {
  console.error("❌ Unhandled Rejection:", reason);
});