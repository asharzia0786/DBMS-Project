import type { Order, Prisma } from "@prisma/client";

import { prisma } from "../utils/prisma";

export class OrderRepository {
  public findById(id: string): Promise<Order | null> {
    return prisma.order.findUnique({ where: { id } });
  }

  public findAll(params: {
    skip: number;
    take: number;
    userId?: string;
    status?: string;
  }): Promise<[Order[], number]> {
    const where: Prisma.OrderWhereInput = {
      ...(params.userId ? { userId: params.userId } : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    return prisma.$transaction([
      prisma.order.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);
  }

  public create(data: Prisma.OrderCreateInput): Promise<Order> {
    return prisma.order.create({ data });
  }

  public updateStatus(id: string, status: string): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
