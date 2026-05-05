import { z } from "zod";

import { ORDER_STATUSES } from "../types/workflow";

export const createOrderSchema = z.object({
  type: z.string().trim().min(1),
  totalAmount: z.number().int().positive(),
  paymentStatus: z.string().trim().min(1).default("PENDING"),
});

export const orderListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(ORDER_STATUSES).optional(),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(ORDER_STATUSES),
});

export const orderIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export type OrderListQuery = z.infer<typeof orderListQuerySchema>;
