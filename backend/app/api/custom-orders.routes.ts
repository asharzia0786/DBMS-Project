import { Router } from "express";
import { services } from "../../server/container";
import { getRequiredClerkUserId } from "../../server/integrations/clerk";
import { asyncHandler, sendSuccess } from "../../server/utils/http";
import {
  createCustomOrderSchema,
  customOrderIdParamsSchema,
  customOrderListQuerySchema,
  updateCustomOrderStatusSchema,
} from "../../server/validators/custom-order.validator";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);
    const query = customOrderListQuerySchema.parse(req.query);

    const data = await services.customOrderService.list({
      ...query,
      userId: user.id,
    });
    return sendSuccess(res, data);
  }),
);

router.get(
  "/admin",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);
    services.authzService.assertAdmin(user);

    const query = customOrderListQuerySchema.parse(req.query);
    const data = await services.customOrderService.list(query);
    return sendSuccess(res, data);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);

    const payload = createCustomOrderSchema.parse(req.body);
    const data = await services.customOrderService.create({
      userId: user.id,
      description: payload.description,
      referenceImages: payload.referenceImages,
      dimensions: payload.dimensions,
      material: payload.material,
    });

    return sendSuccess(res, data, 201);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);
    const params = customOrderIdParamsSchema.parse(req.params);

    const data = await services.customOrderService.getForUser({
      id: params.id,
      userId: user.id,
      isAdmin: user.role === "ADMIN",
    });

    return sendSuccess(res, data);
  }),
);

router.patch(
  "/:id/status",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);
    services.authzService.assertAdmin(user);

    const payload = updateCustomOrderStatusSchema.parse(req.body);
    const params = customOrderIdParamsSchema.parse(req.params);
    const data = await services.customOrderService.updateStatus({
      id: params.id,
      status: payload.status,
      quotedPrice: payload.quotedPrice,
    });

    return sendSuccess(res, data);
  }),
);

export default router;
