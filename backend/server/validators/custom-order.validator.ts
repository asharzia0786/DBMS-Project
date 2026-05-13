import { z } from "zod";

import { CUSTOM_ORDER_STATUSES } from "../types/workflow";

export const createCustomOrderSchema = z.object({
  customerEmail: z.string().trim().email().optional(),
  description: z.string().trim().min(10),
  referenceImages: z.array(z.string().url()).default([]),
  dimensions: z.string().trim().optional(),
  material: z.string().trim().optional(),
});

export const customOrderListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(CUSTOM_ORDER_STATUSES).optional(),
});

export const updateCustomOrderStatusSchema = z.object({
  status: z.enum(CUSTOM_ORDER_STATUSES),
  quotedPrice: z.number().int().positive().optional(),
});

export const customOrderIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CustomOrderListQuery = z.infer<typeof customOrderListQuerySchema>;
