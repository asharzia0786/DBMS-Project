import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";

import apiRouter from "./app/api";
import { errorHandler } from "./server/middleware/error-handler";
import { allowedFrontendOrigins, env, isClerkConfigured } from "./server/utils/env";

if (
  !process.env.CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
) {
  process.env.CLERK_PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
}

const app = express();

app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: allowedFrontendOrigins,
    credentials: true,
  }),
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("dev"));

if (isClerkConfigured) {
  app.use(clerkMiddleware());
} else {
  // eslint-disable-next-line no-console
  console.warn("Clerk is not fully configured; authenticated routes will be unavailable.");
}

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/api", apiRouter);
app.use((_req, res) => {
  res.status(404).json({ success: false, error: "Route not found." });
});
app.use(errorHandler);

app.listen(env.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${env.PORT}`);
});
