import "dotenv/config";
import { getResendClient } from "../server/integrations/resend";
import { env } from "../server/utils/env";

async function main() {
  const resend = getResendClient();
  const to = env.EMAIL_FROM || "inquiries@habibandsons.com";
  try {
    const res = await resend.emails.send({
      from: env.EMAIL_FROM || to,
      to,
      subject: "[Test] Order confirmation delivery",
      html: `<p>This is a test email sent by the Habib and Sons backend to verify Resend delivery.</p>`,
    });
    // eslint-disable-next-line no-console
    console.log("Sent test email:", res);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to send test email:", err);
    process.exit(1);
  }
}

void main();
