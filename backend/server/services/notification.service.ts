import { getResendClient } from "../integrations/resend";
import { AppError } from "../utils/app-error";

export class NotificationService {
  public async sendQuoteResponse(input: {
    to: string;
    orderId: string;
    quoteAmount: number;
  }): Promise<void> {
    try {
      const resend = getResendClient();
      await resend.emails.send({
        from: "no-reply@luxury-cnc.local",
        to: input.to,
        subject: `Quote ready (#${input.orderId})`,
        html: `<p>Your quote is ready.</p><p>Amount: ${input.quoteAmount}</p>`,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, "EMAIL_DELIVERY_FAILED", 502);
      }
      throw new AppError("Email delivery failed.", "EMAIL_DELIVERY_FAILED", 502);
    }
  }

  public async sendOrderConfirmation(input: {
    to: string;
    orderId: string;
    amount: number;
  }): Promise<void> {
    try {
      const resend = getResendClient();
      await resend.emails.send({
        from: "no-reply@luxury-cnc.local",
        to: input.to,
        subject: `Order confirmed (#${input.orderId})`,
        html: `<p>Your order has been confirmed.</p><p>Amount: ${input.amount}</p>`,
      });
    } catch (error) {
      if (error instanceof Error) {
        throw new AppError(error.message, "EMAIL_DELIVERY_FAILED", 502);
      }
      throw new AppError("Email delivery failed.", "EMAIL_DELIVERY_FAILED", 502);
    }
  }
}
