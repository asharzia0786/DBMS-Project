import type { NextFunction, Request, Response } from "express";

export function sendSuccess<T>(
  res: Response,
  data: T,
  statusCode = 200,
): Response {
  return res.status(statusCode).json({
    success: true,
    data,
  });
}

export function asyncHandler(
  handler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    void handler(req, res, next).catch(next);
  };
}
