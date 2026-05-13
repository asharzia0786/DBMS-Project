import { CustomOrderRepository } from "../repositories/custom-order.repository";
import { NotificationService } from "./notification.service";
import {
  CUSTOM_ORDER_TRANSITIONS,
  type CustomOrderStatus,
} from "../types/workflow";
import { AppError } from "../utils/app-error";
import { assertStateTransition } from "../utils/state-machine";
import type { CustomOrderListQuery } from "../validators/custom-order.validator";

export class CustomOrderService {
  constructor(
    private readonly customOrderRepository: CustomOrderRepository,
    private readonly notificationService?: NotificationService,
  ) {}

  public async list(params: CustomOrderListQuery & { userId?: string }) {
    const skip = (params.page - 1) * params.pageSize;
    const [items, total] = await this.customOrderRepository.findAll({
      skip,
      take: params.pageSize,
      userId: params.userId,
      status: params.status,
    });

    return {
      items,
      page: params.page,
      pageSize: params.pageSize,
      total,
      totalPages: Math.ceil(total / params.pageSize) || 1,
    };
  }

  public async getForUser(input: { id: string; userId: string; isAdmin: boolean }) {
    const order = await this.customOrderRepository.findById(input.id);
    if (!order) {
      throw new AppError("Custom order not found.", "CUSTOM_ORDER_NOT_FOUND", 404);
    }
    if (!input.isAdmin && order.userId !== input.userId) {
      throw new AppError("Custom order not found.", "CUSTOM_ORDER_NOT_FOUND", 404);
    }
    return order;
  }

  public create(input: {
    userId: string;
    customerEmail?: string;
    description: string;
    referenceImages: string[];
    dimensions?: string;
    material?: string;
  }) {
    return this.customOrderRepository.create({
      user: { connect: { id: input.userId } },
      customerEmail: input.customerEmail,
      description: input.description,
      referenceImages: input.referenceImages,
      dimensions: input.dimensions,
      material: input.material,
      status: "REQUESTED",
    });
  }

  public async updateStatus(input: {
    id: string;
    status: CustomOrderStatus;
    quotedPrice?: number;
  }) {
    const order = await this.customOrderRepository.findById(input.id);
    if (!order) {
      throw new AppError("Custom order not found.", "CUSTOM_ORDER_NOT_FOUND", 404);
    }

    assertStateTransition(
      order.status as CustomOrderStatus,
      input.status,
      CUSTOM_ORDER_TRANSITIONS,
      "custom order",
    );

    if (input.status === "QUOTED" && !input.quotedPrice) {
      throw new AppError(
        "quotedPrice is required when status is QUOTED.",
        "QUOTED_PRICE_REQUIRED",
        400,
      );
    }

    if (input.status === "APPROVED" && !order.quotedPrice) {
      throw new AppError(
        "Custom order must be quoted before approval.",
        "QUOTE_REQUIRED_BEFORE_APPROVAL",
        400,
      );
    }

    const updated = await this.customOrderRepository.updateStatus(
      input.id,
      input.status,
      input.quotedPrice,
    );
    if (
      updated.customerEmail &&
      this.notificationService &&
      input.status === "QUOTED" &&
      input.quotedPrice
    ) {
      await this.notificationService
        .sendQuoteResponse({
          to: updated.customerEmail,
          orderId: updated.id,
          quoteAmount: input.quotedPrice,
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error("Quote email failed", error);
        });
    }
    return updated;
  }
}
