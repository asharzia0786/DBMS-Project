import { Redis } from "@upstash/redis";
import { Queue, QueueEvents, Worker, type JobsOptions } from "bullmq";
import IORedis from "ioredis";

import { env } from "../utils/env";
import { AppError } from "../utils/app-error";
import type {
  NotificationJobData,
  NotificationJobName,
} from "../types/notification-jobs";

let upstashClient: Redis | null = null;
let bullConnection: IORedis | null = null;
let notificationQueue: Queue<NotificationJobData> | null = null;
let notificationQueueEvents: QueueEvents | null = null;

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

export function getBullConnection(): IORedis {
  if (!env.REDIS_URL) {
    throw new AppError("REDIS_URL is not configured.", "REDIS_CONFIG_MISSING", 500);
  }

  if (!bullConnection) {
    bullConnection = new IORedis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }

  return bullConnection;
}

export function getNotificationQueue(): Queue<NotificationJobData> {
  const connection = getBullConnection();

  if (!notificationQueue) {
    notificationQueue = new Queue<NotificationJobData>("notifications", { connection });
  }

  return notificationQueue;
}

export function getNotificationQueueEvents(): QueueEvents {
  const connection = getBullConnection();

  if (!notificationQueueEvents) {
    notificationQueueEvents = new QueueEvents("notifications", { connection });
  }

  return notificationQueueEvents;
}

export async function enqueueNotificationJob(
  name: NotificationJobName,
  data: NotificationJobData,
  options?: JobsOptions,
) {
  const queue = getNotificationQueue();
  return queue.add(name, data, {
    attempts: 5,
    backoff: {
      type: "exponential",
      delay: 30_000,
    },
    removeOnComplete: {
      age: 60 * 60 * 24 * 7,
      count: 1000,
    },
    removeOnFail: {
      age: 60 * 60 * 24 * 30,
    },
    ...options,
  });
}

export function createNotificationWorker(
  processor: ConstructorParameters<typeof Worker<NotificationJobData>>[1],
) {
  return new Worker<NotificationJobData>("notifications", processor, {
    connection: getBullConnection(),
    concurrency: 5,
  });
}
