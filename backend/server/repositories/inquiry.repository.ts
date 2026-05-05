import type { Inquiry, Prisma } from "@prisma/client";

import { prisma } from "../utils/prisma";

export class InquiryRepository {
  public findAll(params: {
    skip: number;
    take: number;
    status?: string;
  }): Promise<[Inquiry[], number]> {
    const where: Prisma.InquiryWhereInput = {
      ...(params.status ? { status: params.status } : {}),
    };

    return prisma.$transaction([
      prisma.inquiry.findMany({
        where,
        skip: params.skip,
        take: params.take,
        orderBy: { createdAt: "desc" },
      }),
      prisma.inquiry.count({ where }),
    ]);
  }

  public create(data: Prisma.InquiryCreateInput): Promise<Inquiry> {
    return prisma.inquiry.create({ data });
  }
}
