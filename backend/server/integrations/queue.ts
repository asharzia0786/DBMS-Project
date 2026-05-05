import { Redis } from "@upstash/redis";
import { Queue } from "bullmq";
import IORedis from "ioredis";

import { env } from "../utils/env";
import { AppError } from "../utils/app-error";

let upstashClient: Redis | null = null;
let bullConnection: IORedis | null = null;
let notificationQueue: Queue | null = null;

export function getUpstashRedis(): Redis {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) {
    throw new AppError(
      "Upstash Redis credentials are not configured.",
      "UPSTASH_CONFIG_MISSING",
      500,
    );
  }

  if (!upstashClient) {
    upstashClient = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }

  return upstashClient;
}

export function getNotificationQueue(): Queue {
  if (!env.REDIS_URL) {
    throw new AppError("REDIS_URL is not configured.", "REDIS_CONFIG_MISSING", 500);
  }

  if (!bullConnection) {
    bullConnection = new IORedis(env.REDIS_URL);
  }

  if (!notificationQueue) {
    notificationQueue = new Queue("notifications", { connection: bullConnection });
  }

  return notificationQueue;
}
