import { Router } from "express";

import { services } from "../../server/container";
import { getRequiredClerkUserId } from "../../server/integrations/clerk";
import { asyncHandler, sendSuccess } from "../../server/utils/http";
import { mediaSignatureQuerySchema } from "../../server/validators/media.validator";

const router = Router();

router.get(
  "/upload-signature",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);
    services.authzService.assertAdmin(user);

    const query = mediaSignatureQuerySchema.parse(req.query);
    const data = services.mediaService.createUploadSignature(query);
    return sendSuccess(res, data);
  }),
);

export default router;
