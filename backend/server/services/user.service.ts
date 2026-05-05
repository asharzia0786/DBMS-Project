import type { User } from "@prisma/client";

import { UserRepository } from "../repositories/user.repository";

export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async ensureUserFromClerkId(clerkId: string): Promise<User> {
    const existing = await this.userRepository.findByClerkId(clerkId);
    if (existing) {
      return existing;
    }

    return this.userRepository.create({
      clerkId,
      role: "CUSTOMER",
    });
  }
}
