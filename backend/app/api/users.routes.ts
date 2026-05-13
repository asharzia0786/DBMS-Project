import { Router } from "express";

import { services } from "../../server/container";
import { getRequiredClerkUserId } from "../../server/integrations/clerk";
import { asyncHandler, sendSuccess } from "../../server/utils/http";

const router = Router();

router.get(
  "/me",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);

    return sendSuccess(res, {
      id: user.id,
      clerkId: user.clerkId,
      role: user.role,
    });
  }),
);

export default router;
