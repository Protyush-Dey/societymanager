import dotenv from "dotenv";
import express, { ErrorRequestHandler } from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import prisma from "./config/prisma";
import initializeModules from "./Module/main.route";

dotenv.config();

const app = express();

const corsOrigin = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",")
  : ["http://localhost:3000", "http://localhost:5173"];

app.use(
  cors({
    origin: corsOrigin,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Health check endpoint for Render/uptime monitors
app.get("/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "healthy", database: "connected" });
  } catch (err: any) {
    res.status(500).json({ status: "unhealthy", error: err.message });
  }
});

// Initialize active modules (User module)
initializeModules(app);

// Global Error Handler
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Something went wrong",
    errors: err.errors || [],
  });
};

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Supabase PostgreSQL Connected via Prisma");

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
};

// Graceful Shutdown
const shutdown = async () => {
  console.log("\n⏳ Gracefully shutting down...");
  await prisma.$disconnect();
  server.close(() => {
    console.log("🛑 Server stopped.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();