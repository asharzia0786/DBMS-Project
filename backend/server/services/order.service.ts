import { OrderRepository } from "../repositories/order.repository";
import { ORDER_TRANSITIONS, type OrderStatus } from "../types/workflow";
import { AppError } from "../utils/app-error";
import { assertStateTransition } from "../utils/state-machine";
import type { OrderListQuery } from "../validators/order.validator";

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

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
    type: string;
    totalAmount: number;
    paymentStatus: string;
  }) {
    return this.orderRepository.create({
      user: { connect: { id: input.userId } },
      type: input.type,
      totalAmount: input.totalAmount,
      paymentStatus: input.paymentStatus,
      status: "PENDING",
    });
  }

  public async updateStatus(input: { id: string; status: OrderStatus }) {
    const order = await this.orderRepository.findById(input.id);
    if (!order) {
      throw new AppError("Order not found.", "ORDER_NOT_FOUND", 404);
    }

    assertStateTransition(
      order.status as OrderStatus,
      input.status,
      ORDER_TRANSITIONS,
      "order",
    );

    return this.orderRepository.updateStatus(input.id, input.status);
  }
}
