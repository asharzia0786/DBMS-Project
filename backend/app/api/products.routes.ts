import { Router } from "express";

import { services } from "../../server/container";
import { getRequiredClerkUserId } from "../../server/integrations/clerk";
import { asyncHandler, sendSuccess } from "../../server/utils/http";
import {
  createProductSchema,
  productIdParamsSchema,
  productListQuerySchema,
  productSlugParamsSchema,
  updateProductSchema,
} from "../../server/validators/product.validator";

const router = Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const query = productListQuerySchema.parse(req.query);
    const data = await services.productService.listProducts(query);
    return sendSuccess(res, data);
  }),
);

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);
    services.authzService.assertAdmin(user);

    const payload = createProductSchema.parse(req.body);
    const data = await services.productService.createProduct(payload);
    return sendSuccess(res, data, 201);
  }),
);

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const params = productSlugParamsSchema.parse(req.params);
    const data = await services.productService.getBySlug(params.slug);
    return sendSuccess(res, data);
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);
    services.authzService.assertAdmin(user);

    const params = productIdParamsSchema.parse(req.params);
    const payload = updateProductSchema.parse(req.body);
    const data = await services.productService.updateProduct(params.id, payload);
    return sendSuccess(res, data);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const clerkId = getRequiredClerkUserId(req);
    const user = await services.userService.ensureUserFromClerkId(clerkId);
    services.authzService.assertAdmin(user);

    const params = productIdParamsSchema.parse(req.params);
    const data = await services.productService.deleteProduct(params.id);
    return sendSuccess(res, data);
  }),
);

export default router;
