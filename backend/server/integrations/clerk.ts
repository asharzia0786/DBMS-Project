import { getAuth } from "@clerk/express";
import type { Request } from "express";

import { AppError } from "../utils/app-error";
import { isClerkConfigured } from "../utils/env";

export function getRequiredClerkUserId(req: Request): string {
  if (!isClerkConfigured) {
    throw new AppError(
      "Authentication provider is not configured on the backend.",
      "AUTH_PROVIDER_NOT_CONFIGURED",
      503,
    );
  }

  let auth;
  try {
    auth = getAuth(req);
  } catch {
    throw new AppError("Authentication context is unavailable.", "AUTH_CONTEXT_MISSING", 503);
  }
  if (!auth.userId) {
    throw new AppError("Authentication required.", "UNAUTHORIZED", 401);
  }

  return auth.userId;
}
