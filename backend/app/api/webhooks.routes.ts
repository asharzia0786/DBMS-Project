import { Router } from "express";

import { services } from "../../server/container";
import { asyncHandler, sendSuccess } from "../../server/utils/http";
import { safepayWebhookSchema } from "../../server/validators/payment.validator";

const router = Router();

router.post(
  "/safepay",
  asyncHandler(async (req, res) => {
    const payload = safepayWebhookSchema.parse({
      orderId: req.body?.orderId || req.body?.order_id || req.body?.metadata?.order_id,
      trackerToken:
        req.body?.trackerToken ||
        req.body?.tracker_token ||
        req.body?.token ||
        req.body?.tracker?.token,
      status: req.body?.status || req.body?.event,
    });

    const paidStatuses = new Set(["PAID", "SUCCESS", "SUCCEEDED", "PAYMENT.SUCCEEDED"]);
    if (payload.status && !paidStatuses.has(payload.status.toUpperCase())) {
      return sendSuccess(res, { received: true, updated: false });
    }

    const data = await services.paymentService.markSafepayPaymentSucceeded(payload);
    return sendSuccess(res, data);
  }),
);

export default router;
