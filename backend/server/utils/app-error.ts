import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export class AppError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(message: string, code: string, statusCode: number) {
    super(message);
    this.code = code;
    this.statusCode = statusCode;
  }
}

export function toAppError(error: unknown): AppError {
  if (error instanceof AppError) {
    return error;
  }

  if (
    error instanceof SyntaxError &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.toLowerCase().includes("json")
  ) {
    return new AppError("Invalid JSON payload.", "INVALID_JSON", 400);
  }

  if (error instanceof ZodError) {
    const message = error.issues.map((issue) => issue.message).join("; ");
    return new AppError(message || "Validation failed.", "VALIDATION_ERROR", 400);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return new AppError("Invalid database query input.", "PRISMA_VALIDATION_ERROR", 400);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return new AppError("Duplicate value violates unique constraint.", "CONFLICT", 409);
    }
    if (error.code === "P2025") {
      return new AppError("Requested record was not found.", "NOT_FOUND", 404);
    }
    if (error.code === "P2003") {
      return new AppError(
        "Operation violates relational integrity constraints.",
        "RELATION_CONFLICT",
        409,
      );
    }
    return new AppError("Database request failed.", "DATABASE_REQUEST_FAILED", 400);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return new AppError("Database connection failed.", "DATABASE_UNAVAILABLE", 503);
  }

  if (error instanceof Prisma.PrismaClientRustPanicError) {
    return new AppError("Database engine failed unexpectedly.", "DATABASE_ENGINE_ERROR", 500);
  }

  if (error instanceof Error && process.env.NODE_ENV !== "production") {
    return new AppError(error.message || "Internal server error.", "INTERNAL_ERROR", 500);
  }

  return new AppError("Internal server error.", "INTERNAL_ERROR", 500);
}
