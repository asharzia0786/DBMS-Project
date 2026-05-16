import "dotenv/config";
import { NotificationService } from "../server/services/notification.service";
import { env } from "../server/utils/env";

async function main() {
  const svc = new NotificationService();
  const to = env.EMAIL_FROM || "inquiries@habibandsons.com";
  try {
    await svc.deliver({ type: "order-confirmation", to, orderId: "TESTORDER123", amount: 12500 });
    // eslint-disable-next-line no-console
    console.log("Order confirmation send simulation completed.");
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Order confirmation send failed:", err);
    process.exit(1);
  }
}

void main();
