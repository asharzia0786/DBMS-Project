import { OrderRepository } from "../repositories/order.repository";
import { NotificationService } from "./notification.service";
import type { OrderStatus } from "../types/workflow";
import { AppError } from "../utils/app-error";
import type { OrderListQuery } from "../validators/order.validator";

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly notificationService?: NotificationService,
  ) {}

  public async list(params: OrderListQuery & { userId?: string }) {
    const skip = (params.page - 1) * params.pageSize;
    const [items, total] = await this.orderRepository.findAll({
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
    const order = await this.orderRepository.findById(input.id);
    if (!order) {
      throw new AppError("Order not found.", "ORDER_NOT_FOUND", 404);
    }
    if (!input.isAdmin && order.userId !== input.userId) {
      throw new AppError("Order not found.", "ORDER_NOT_FOUND", 404);
    }
    return order;
  }

  public create(input: {
    userId: string;
    customerEmail?: string;
    type: string;
    totalAmount: number;
    paymentStatus: string;
    paymentMethod?: string;
  }) {
    return this.orderRepository.create({
      user: { connect: { id: input.userId } },
      customerEmail: input.customerEmail,
      type: input.type,
      totalAmount: input.totalAmount,
      paymentStatus: input.paymentStatus,
      paymentMethod: input.paymentMethod,
      status: "PENDING",
    }).then(async (order) => {
      if (order.customerEmail && this.notificationService) {
        await this.notificationService
          .sendOrderConfirmation({
            to: order.customerEmail,
            orderId: order.id,
            amount: order.totalAmount,
          })
          .catch((error) => {
            // eslint-disable-next-line no-console
            console.error("Order confirmation email failed", error);
          });
      }
      return order;
    });
  }

  public async updateStatus(input: { id: string; status: OrderStatus }) {
    const order = await this.orderRepository.findById(input.id);
    if (!order) {
      throw new AppError("Order not found.", "ORDER_NOT_FOUND", 404);
    }

    const updated = await this.orderRepository.updateStatus(input.id, input.status);
    if (updated.customerEmail && this.notificationService) {
      await this.notificationService
        .sendOrderStatusUpdate({
          to: updated.customerEmail,
          orderId: updated.id,
          status: updated.status,
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error("Order status email failed", error);
        });
    }
    return updated;
  }
}
