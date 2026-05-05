import { Router } from "express";

import { services } from "../../server/container";
import { getRequiredClerkUserId } from "../../server/integrations/clerk";
import { asyncHandler, sendSuccess } from "../../server/utils/http";
import {
  createInquirySchema,
  inquiryListQuerySchema,
} from "../../server/validators/inquiry.validator";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);
    services.authzService.assertAdmin(user);

    const query = inquiryListQuerySchema.parse(req.query);
    const data = await services.inquiryService.listInquiries(query);
    return sendSuccess(res, data);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const payload = createInquirySchema.parse(req.body);
    const data = await services.inquiryService.createInquiry(payload);
    return sendSuccess(res, data, 201);
  }),
);

export default router;
