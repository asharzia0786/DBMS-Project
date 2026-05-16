import "dotenv/config";
import { prisma } from "../server/utils/prisma";
import { services } from "../server/container";

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error("Usage: tsx scripts/resend-inquiry-by-email.ts <email>");
    process.exit(1);
  }

  const inquiry = await prisma.inquiry.findFirst({ where: { email }, orderBy: { createdAt: 'desc' } });
  if (!inquiry) {
    console.error("No inquiry found for", email);
    process.exit(1);
  }

  console.log("Found inquiry:", { id: inquiry.id, status: inquiry.status, email: inquiry.email });

  try {
    const updated = await services.inquiryService.updateStatus({ id: inquiry.id, status: "RESPONDED", responseMessage: "Reply from support: Thank you for reaching out. We will follow up shortly." });
    console.log("Update result:", { id: updated.id, status: updated.status });
  } catch (err) {
    console.error("Failed to update/respond:", err);
    process.exit(1);
  }

  process.exit(0);
}

void main();
