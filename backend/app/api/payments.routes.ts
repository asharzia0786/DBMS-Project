import { Router } from "express";

import { services } from "../../server/container";
import { getRequiredClerkUserId } from "../../server/integrations/clerk";
import { asyncHandler, sendSuccess } from "../../server/utils/http";
import { createSafepaySessionSchema } from "../../server/validators/payment.validator";

const router = Router();

router.post(
  "/safepay/session",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);
    const payload = createSafepaySessionSchema.parse(req.body);
    const data = await services.paymentService.createSafepaySession({
      ...payload,
      userId: user.id,
    });
    return sendSuccess(res, data, 201);
  }),
);

export default router;
