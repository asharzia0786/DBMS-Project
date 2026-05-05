import type { NextFunction, Request, Response } from "express";

import { toAppError } from "../utils/app-error";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  // Keep stack traces in server logs for debugging while returning sanitized responses.
  // eslint-disable-next-line no-console
  console.error(error);
  const appError = toAppError(error);
  return res.status(appError.statusCode).json({
    success: false,
    error: appError.message,
  });
}
