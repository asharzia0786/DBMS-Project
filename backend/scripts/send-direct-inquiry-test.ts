import "dotenv/config";
import { services } from "../server/container";

async function main() {
  const to = process.argv[2] || process.env.EMAIL_TEST_TARGET;
  if (!to) {
    console.error("Usage: tsx scripts/send-direct-inquiry-test.ts <email>");
    process.exit(1);
  }

  try {
    await services.notificationService.sendInquiryResponse({
      to,
      subject: "[Test] Inquiry response",
      message: "This is a test resend to verify delivery from the backend."
    });
    console.log("sendInquiryResponse completed.");
  } catch (err) {
    console.error("sendInquiryResponse failed:", err);
    process.exit(1);
  }
}

void main();
