import type { Prisma, User } from "@prisma/client";

import { prisma } from "../utils/prisma";

export class UserRepository {
  public findByClerkId(clerkId: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { clerkId } });
  }

  public create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  public updateRole(id: string, role: string): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: { role },
    });
  }
}
