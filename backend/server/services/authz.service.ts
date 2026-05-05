import type { User } from "@prisma/client";

import { AppError } from "../utils/app-error";

export class AuthzService {
  public assertAdmin(user: User): void {
    if (user.role !== "ADMIN") {
      throw new AppError("Admin access required.", "FORBIDDEN", 403);
    }
  }
}
