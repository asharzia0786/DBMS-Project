import type { NextFunction, Request, Response } from "express";

import { toAppError } from "../utils/app-error";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  const appError = toAppError(error);
  // Keep stack traces in server logs without letting inspection failures break the response path.
  // eslint-disable-next-line no-console
  console.error(
    error instanceof Error ? error.stack || `${appError.code}: ${appError.message}` : `${appError.code}: ${appError.message}`,
  );
  return res.status(appError.statusCode).json({
    success: false,
    error: appError.message,
  });
}
