import { createNotificationWorker, getNotificationQueueEvents, getUpstashRedis } from "./queue";
import { NotificationService } from "../services/notification.service";

export function startNotificationWorker() {
  const notificationService = new NotificationService();

  void getUpstashRedis()
    .ping()
    .then(() => {
      // eslint-disable-next-line no-console
      console.log("Upstash Redis REST connection verified.");
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error("Upstash Redis REST connection failed.", error);
      process.exit(1);
    });

  const worker = createNotificationWorker(async (job) => {
    await notificationService.deliver(job.data);
  });

  const events = getNotificationQueueEvents();

  worker.on("completed", (job) => {
    // eslint-disable-next-line no-console
    console.log(`Notification job completed: ${job.name} ${job.id}`);
  });

  worker.on("failed", (job, error) => {
    // eslint-disable-next-line no-console
    console.error(`Notification job failed: ${job?.name} ${job?.id}`, error);
  });

  events.on("waiting", ({ jobId }) => {
    // eslint-disable-next-line no-console
    console.log(`Notification job waiting: ${jobId}`);
  });

  async function shutdown() {
    await Promise.all([worker.close(), events.close()]);
    process.exit(0);
  }

  process.on("SIGINT", () => void shutdown());
  process.on("SIGTERM", () => void shutdown());

  // eslint-disable-next-line no-console
  console.log("Notification worker started.");

  return { worker, events };
}
