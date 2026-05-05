import "dotenv/config";

import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }
  return value;
};

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().int().positive().default(4000),
  FRONTEND_URL: z.string().url().default("http://localhost:5173"),
  DATABASE_URL: z.string().min(1),
  CLERK_PUBLISHABLE_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  CLERK_SECRET_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  RESEND_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  CLOUDINARY_CLOUD_NAME: z.preprocess(emptyToUndefined, z.string().optional()),
  CLOUDINARY_API_KEY: z.preprocess(emptyToUndefined, z.string().optional()),
  CLOUDINARY_API_SECRET: z.preprocess(emptyToUndefined, z.string().optional()),
  UPSTASH_REDIS_REST_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().optional(),
  ),
  UPSTASH_REDIS_REST_TOKEN: z.preprocess(emptyToUndefined, z.string().optional()),
  REDIS_URL: z.preprocess(emptyToUndefined, z.string().optional()),
  FRONTEND_URLS: z.preprocess(emptyToUndefined, z.string().optional()),
});

export const env = envSchema.parse(process.env);

export const allowedFrontendOrigins = (
  env.FRONTEND_URLS
    ? env.FRONTEND_URLS.split(",").map((origin) => origin.trim())
    : [env.FRONTEND_URL]
).filter(Boolean);

export const isClerkConfigured = Boolean(
  env.CLERK_SECRET_KEY && (env.CLERK_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY),
);
