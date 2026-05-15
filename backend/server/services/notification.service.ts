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
  return env.EMAIL_FROM || "business.habibandsons@gmail.com";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function emailShell(title: string, body: string): string {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #222;">
      <h1 style="margin: 0 0 16px;">${escapeHtml(title)}</h1>
      <div>${body}</div>
      <p style="margin-top: 24px;">— Habib and Sons</p>
    </div>
  `;
}

function paragraph(text: string): string {
  return `<p>${text}</p>`;
}

async function sendEmail(input: { to: string; subject: string; html: string; replyTo?: string }) {
  try {
    const resend = getResendClient();
    const payload: {
      from: string;
      to: string;
      subject: string;
      html: string;
      replyTo?: string;
    } = {
      from: fromAddress(),
      to: input.to,
      subject: input.subject,
      html: input.html,
    };
    if (input.replyTo) {
      payload.replyTo = input.replyTo;
    }
    await resend.emails.send(payload);
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
      html: emailShell(
        "Your custom order quote is ready",
        [
          paragraph("Our workshop has reviewed your custom request."),
          paragraph(`<strong>Quote:</strong> ${money(input.quoteAmount)}`),
          paragraph("Reply to this email or sign in to approve the quote."),
        ].join(""),
      ),
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
      html: emailShell(
        "We received your order",
        [
          paragraph("Thank you for placing your order with Habib and Sons."),
          paragraph(`<strong>Total:</strong> ${money(input.amount)}`),
          paragraph("Our team will confirm production and delivery details shortly."),
        ].join(""),
      ),
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
    const isCancelled = input.status === "CANCELLED";
    const isShipped = input.status === "SHIPPED";
    await sendEmail({
      to: input.to,
      subject: isCancelled
        ? `Order cancelled (#${input.orderId.slice(0, 8)})`
        : isShipped
          ? `Your order is on the way (#${input.orderId.slice(0, 8)})`
          : `Order status updated (#${input.orderId.slice(0, 8)})`,
      html: emailShell(
        isCancelled
          ? "Your order was cancelled"
          : isShipped
            ? "Your order is out for delivery"
            : "Your order status changed",
        [
          paragraph(`Your order is now <strong>${escapeHtml(input.status)}</strong>.`),
          isShipped
            ? paragraph("Logistics tracking has started and your shipment is being prepared for dispatch.")
            : paragraph("You can check your order history for the latest status."),
        ].join(""),
      ),
    });
  }

  public async sendInquiryResponse(input: {
    to: string;
    subject: string;
    message: string;
  }): Promise<void> {
    await sendEmail({
      to: input.to,
      subject: input.subject,
      replyTo: fromAddress(),
      html: emailShell(
        "Your inquiry response",
        paragraph(escapeHtml(input.message).replace(/\n/g, "<br />")),
      ),
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
      html: `
        <p>${input.message.replace(/\n/g, "<br />")}</p>
        <p>— Habib and Sons</p>
      `,
    });
  }
}
