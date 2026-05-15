import { getResendClient } from "../integrations/resend";
import { enqueueNotificationJob } from "../integrations/queue";
import type { NotificationJobData } from "../types/notification-jobs";
import { env } from "../utils/env";
import { AppError } from "../utils/app-error";

function money(value: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function fromAddress(): string {
  return env.EMAIL_FROM || "no-reply@example.com";
}

async function sendEmail(input: { to: string; subject: string; html: string }) {
  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: fromAddress(),
      to: input.to,
      subject: input.subject,
      html: input.html,
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(error.message, "EMAIL_DELIVERY_FAILED", 502);
    }
    throw new AppError("Email delivery failed.", "EMAIL_DELIVERY_FAILED", 502);
  }
}

export class NotificationService {
  public async deliver(job: NotificationJobData): Promise<void> {
    if (job.type === "quote-response") {
      await this.deliverQuoteResponse(job);
      return;
    }

    if (job.type === "order-confirmation") {
      await this.deliverOrderConfirmation(job);
      return;
    }

    if (job.type === "order-status-update") {
      await this.deliverOrderStatusUpdate(job);
      return;
    }

    await this.deliverInquiryResponse(job);
  }

  public async sendQuoteResponse(input: {
    to: string;
    orderId: string;
    quoteAmount: number;
  }): Promise<void> {
    await enqueueNotificationJob("quote-response", {
      type: "quote-response",
      ...input,
    });
  }

  private async deliverQuoteResponse(input: {
    to: string;
    orderId: string;
    quoteAmount: number;
  }): Promise<void> {
    await sendEmail({
      to: input.to,
      subject: `Quote ready (#${input.orderId.slice(0, 8)})`,
      html: `
        <h1>Your custom order quote is ready</h1>
        <p>Our workshop has reviewed your custom request.</p>
        <p><strong>Quote:</strong> ${money(input.quoteAmount)}</p>
        <p>Reply to this email or sign in to approve the quote.</p>
      `,
    });
  }

  public async sendOrderConfirmation(input: {
    to: string;
    orderId: string;
    amount: number;
  }): Promise<void> {
    await enqueueNotificationJob("order-confirmation", {
      type: "order-confirmation",
      ...input,
    });
  }

  private async deliverOrderConfirmation(input: {
    to: string;
    orderId: string;
    amount: number;
  }): Promise<void> {
    await sendEmail({
      to: input.to,
      subject: `Order received (#${input.orderId.slice(0, 8)})`,
      html: `
        <h1>We received your order</h1>
        <p>Thank you for placing your order with Habib and Sons.</p>
        <p><strong>Total:</strong> ${money(input.amount)}</p>
        <p>Our team will confirm production and delivery details shortly.</p>
      `,
    });
  }

  public async sendOrderStatusUpdate(input: {
    to: string;
    orderId: string;
    status: string;
  }): Promise<void> {
    await enqueueNotificationJob("order-status-update", {
      type: "order-status-update",
      ...input,
    });
  }

  private async deliverOrderStatusUpdate(input: {
    to: string;
    orderId: string;
    status: string;
  }): Promise<void> {
    await sendEmail({
      to: input.to,
      subject: `Order status updated (#${input.orderId.slice(0, 8)})`,
      html: `
        <h1>Your order status changed</h1>
        <p>Your order is now <strong>${input.status}</strong>.</p>
      `,
    });
  }

  public async sendInquiryResponse(input: {
    to: string;
    subject: string;
    message: string;
  }): Promise<void> {
    await enqueueNotificationJob("inquiry-response", {
      type: "inquiry-response",
      ...input,
    });
  }

  private async deliverInquiryResponse(input: {
    to: string;
    subject: string;
    message: string;
  }): Promise<void> {
    await sendEmail({
      to: input.to,
      subject: input.subject,
      html: `<p>${input.message.replace(/\n/g, "<br />")}</p>`,
    });
  }
}
