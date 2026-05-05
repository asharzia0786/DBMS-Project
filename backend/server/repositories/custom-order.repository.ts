import type { CustomOrder, Prisma } from "@prisma/client";

import { prisma } from "../utils/prisma";

export class CustomOrderRepository {
  public findById(id: string): Promise<CustomOrder | null> {
    return prisma.customOrder.findUnique({ where: { id } });
  }

  public findAll(params: {
    skip: number;
    take: number;
    userId?: string;
    status?: string;
  }): Promise<[CustomOrder[], number]> {
    const where: Prisma.CustomOrderWhereInput = {
      ...(params.userId ? { userId: params.userId } : {}),
      ...(params.status ? { status: params.status } : {}),
    };

    return prisma.$transaction([
      prisma.customOrder.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.customOrder.count({ where }),
    ]);
  }

  public create(data: Prisma.CustomOrderCreateInput): Promise<CustomOrder> {
    return prisma.customOrder.create({ data });
  }

  public updateStatus(
    id: string,
    status: string,
    quotedPrice?: number,
  ): Promise<CustomOrder> {
    return prisma.customOrder.update({
      where: { id },
      data: {
        status,
        quotedPrice,
      },
    });
  }
}
