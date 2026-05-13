import { z } from "zod";

export const createSafepaySessionSchema = z.object({
  orderId: z.string().uuid(),
  amount: z.number().int().positive(),
});

export const safepayWebhookSchema = z.object({
  orderId: z.string().uuid().optional(),
  trackerToken: z.string().trim().min(1).optional(),
  status: z.string().trim().optional(),
});
