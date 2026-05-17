import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import apiRouter from "./app/api";
import { startNotificationWorker } from "./server/integrations/notification-worker";
import { errorHandler } from "./server/middleware/error-handler";
import { env, isClerkConfigured } from "./server/utils/env";

const app = express();

/**
 * Start background worker
 */
startNotificationWorker();

/**
 * Trust proxy (required on Render)
 */
app.set("trust proxy", 1);

/**
 * Security middleware
 */
app.use(helmet());

/**
 * Logging
 */
app.use(morgan("dev"));

/**
 * Allowed frontend origins
 */
const allowedOrigins = [
  "http://localhost:5173",
  "https://habibandsons.com",
  "https://www.habibandsons.com",
];

/**
 * CORS configuration
 */
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

/**
 * Rate limiter
 */
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/**
 * JSON parser
 */
app.use(express.json({ limit: "2mb" }));

/**
 * Clerk authentication
 */
if (isClerkConfigured) {
  app.use(clerkMiddleware());
} else {
  console.warn(
    "Clerk is not fully configured; authenticated routes will be unavailable."
  );
}

/**
 * Health route
 */
app.get("/health", (_req, res) => {
  res.json({
    success: true,
    data: {
      status: "ok",
    },
  });
});

/**
 * API routes
 */
app.use("/api", apiRouter);

/**
 * 404 handler
 */
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found.",
  });
});

/**
 * Global error handler
 */
app.use(errorHandler);

/**
 * Start server
 */
app.listen(env.PORT, () => {
  console.log(`Backend listening on port ${env.PORT}`);
});