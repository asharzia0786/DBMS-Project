import { Router } from "express";

import { services } from "../../server/container";
import { getRequiredClerkUserId } from "../../server/integrations/clerk";
import { asyncHandler, sendSuccess } from "../../server/utils/http";
import {
  createOrderSchema,
  orderIdParamsSchema,
  orderListQuerySchema,
  updateOrderStatusSchema,
} from "../../server/validators/order.validator";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);
    const query = orderListQuerySchema.parse(req.query);

    const data = await services.orderService.list({ ...query, userId: user.id });
    return sendSuccess(res, data);
  }),
);

router.get(
  "/admin",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);
    services.authzService.assertAdmin(user);

    const query = orderListQuerySchema.parse(req.query);
    const data = await services.orderService.list(query);
    return sendSuccess(res, data);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);

    const payload = createOrderSchema.parse(req.body);
    const data = await services.orderService.create({
      userId: user.id,
      customerEmail: payload.customerEmail,
      type: payload.type,
      totalAmount: payload.totalAmount,
      paymentStatus: payload.paymentStatus,
    });
    return sendSuccess(res, data, 201);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);
    const params = orderIdParamsSchema.parse(req.params);

    const data = await services.orderService.getForUser({
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

    const payload = updateOrderStatusSchema.parse(req.body);
    const params = orderIdParamsSchema.parse(req.params);
    const data = await services.orderService.updateStatus({
      id: params.id,
      status: payload.status,
    });

    return sendSuccess(res, data);
  }),
);

export default router;
