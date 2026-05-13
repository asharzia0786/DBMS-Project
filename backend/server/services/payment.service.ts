import { OrderRepository } from "../repositories/order.repository";
import {
  getSafepayClient,
  getSafepayMerchantApiKey,
} from "../integrations/safepay";
import { env } from "../utils/env";
import { AppError } from "../utils/app-error";

function readSafepayToken(response: unknown): string | undefined {
  const body = response as {
    data?: {
      token?: string;
      tracker?: { token?: string };
    } | string;
  };

  if (typeof body.data === "string") {
    return body.data;
  }

  return body.data?.token || body.data?.tracker?.token;
}

export class PaymentService {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async createSafepaySession(input: {
    orderId: string;
    amount: number;
    userId: string;
  }) {
    const order = await this.orderRepository.findById(input.orderId);
    if (!order) {
      throw new AppError("Order not found.", "ORDER_NOT_FOUND", 404);
    }

    if (order.userId !== input.userId) {
      throw new AppError("Order not found.", "ORDER_NOT_FOUND", 404);
    }

    const safepay = getSafepayClient();
    const [session, passport] = await Promise.all([
      safepay.payments.session.setup({
        merchant_api_key: getSafepayMerchantApiKey(),
        user: input.userId,
        intent: env.SAFEPAY_INTENT,
        mode: "payment",
        entry_mode: "raw",
        currency: "PKR",
        amount: input.amount,
        metadata: {
          order_id: input.orderId,
        },
      }),
      safepay.client.passport.create(),
    ]);

    const trackerToken = readSafepayToken(session);
    if (!trackerToken) {
      throw new AppError(
        "SafePay did not return a tracker token.",
        "SAFEPAY_TRACKER_MISSING",
        502,
      );
    }

    await this.orderRepository.updatePayment(input.orderId, {
      paymentMethod: "SAFEPAY",
      paymentStatus: "PENDING",
      safepayTrackerToken: trackerToken,
    });

    return {
      trackerToken,
      clientToken: readSafepayToken(passport),
      environment: env.SAFEPAY_ENVIRONMENT,
      merchantApiKey: getSafepayMerchantApiKey(),
    };
  }

  public async markSafepayPaymentSucceeded(input: {
    orderId?: string;
    trackerToken?: string;
  }) {
    const order = input.orderId
      ? await this.orderRepository.findById(input.orderId)
      : input.trackerToken
        ? await this.orderRepository.findBySafepayTrackerToken(input.trackerToken)
        : null;

    if (!order) {
      return { updated: false };
    }

    await this.orderRepository.updatePayment(order.id, {
      paymentMethod: "SAFEPAY",
      paymentStatus: "PAID",
      status: "PAID",
      paidAt: new Date(),
    });

    return { updated: true };
  }
}
