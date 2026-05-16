import "dotenv/config";
import { getNotificationQueue } from "../server/integrations/queue";
import { NotificationService } from "../server/services/notification.service";

async function main() {
  const override = process.argv[2] || process.env.EMAIL_OVERRIDE || process.env.EMAIL_FROM || "";
  const queue = getNotificationQueue();
  const svc = new NotificationService();

  function maskEmail(email?: string) {
    if (!email) return "";
    const parts = String(email).split("@");
    if (parts.length !== 2) return "";
    return parts[0].slice(0, 1) + "***@" + parts[1];
  }

  // fetch jobs in common states
  const jobs = await queue.getJobs(["waiting", "active", "delayed", "failed", "paused"]);
  console.log(`Found ${jobs.length} jobs to process.`);

  for (const job of jobs) {
    try {
      console.log(`Processing job ${job.id} (${job.name}) -> original to=${maskEmail((job.data as any).to)}`);
      const data = {
        ...(job.data as any),
        to: override,
      };
      await svc.deliver(data as any);
      // remove job from queue after successful deliver
      await job.remove();
      console.log(`Job ${job.id} delivered and removed.`);
    } catch (err) {
      console.error(`Failed to deliver job ${job.id}:`, err);
    }
  }

  console.log("Processing complete.");
  process.exit(0);
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
