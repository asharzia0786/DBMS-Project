import type { Prisma } from "@prisma/client";

import { OrderRepository } from "../repositories/order.repository";
import { NotificationService } from "./notification.service";
import type { OrderStatus } from "../types/workflow";
import { AppError } from "../utils/app-error";
import { prisma } from "../utils/prisma";
import type { OrderListQuery } from "../validators/order.validator";
import type { OrderItemInput } from "../validators/order.validator";

const CANCELLABLE_STATUSES: OrderStatus[] = ["PENDING", "PAID", "PROCESSING"];

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

  public async create(input: {
    userId: string;
    customerEmail?: string;
    type: string;
    totalAmount: number;
    paymentStatus: string;
    paymentMethod?: string;
    items: OrderItemInput[];
  }) {
    const order = await prisma.$transaction(async (tx) => {
      const productIds = input.items.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, stock: true },
      });

      if (products.length !== productIds.length) {
        throw new AppError("One or more products were not found.", "PRODUCT_NOT_FOUND", 404);
      }

      for (const item of input.items) {
        const product = products.find((entry) => entry.id === item.productId);
        if (!product || product.stock < item.quantity) {
          throw new AppError(
            `Not enough stock for ${product?.name || "a product"}.`,
            "INSUFFICIENT_STOCK",
            400,
          );
        }
      }

      for (const item of input.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          user: { connect: { id: input.userId } },
          customerEmail: input.customerEmail,
          type: input.type,
          items: input.items as unknown as Prisma.InputJsonValue,
          totalAmount: input.totalAmount,
          paymentStatus: input.paymentStatus,
          paymentMethod: input.paymentMethod,
          status: "PENDING",
        },
      });
    });

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

  public async cancel(input: { id: string; userId: string; isAdmin: boolean }) {
    const order = await this.orderRepository.findById(input.id);
    if (!order) {
      throw new AppError("Order not found.", "ORDER_NOT_FOUND", 404);
    }

    if (!input.isAdmin && order.userId !== input.userId) {
      throw new AppError("Order not found.", "ORDER_NOT_FOUND", 404);
    }

    if (order.status === "CANCELLED") {
      throw new AppError("Order is already cancelled.", "ORDER_ALREADY_CANCELLED", 400);
    }

    if (!CANCELLABLE_STATUSES.includes(order.status as OrderStatus)) {
      throw new AppError(
        "This order can no longer be cancelled.",
        "ORDER_NOT_CANCELLABLE",
        400,
      );
    }

    const updated = await prisma.$transaction(async (tx) => {
      const currentOrder = await tx.order.findUnique({ where: { id: input.id } });
      if (!currentOrder) {
        throw new AppError("Order not found.", "ORDER_NOT_FOUND", 404);
      }

      const orderItems = Array.isArray(currentOrder.items)
        ? (currentOrder.items as Array<{ productId?: string; quantity?: number }>)
        : [];

      for (const item of orderItems) {
        if (!item.productId || !item.quantity) {
          continue;
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }

      return tx.order.update({
        where: { id: input.id },
        data: { status: "CANCELLED" },
      });
    });
    if (updated.customerEmail && this.notificationService) {
      await this.notificationService
        .sendOrderStatusUpdate({
          to: updated.customerEmail,
          orderId: updated.id,
          status: updated.status,
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.error("Order cancellation email failed", error);
        });
    }

    return updated;
  }
}
