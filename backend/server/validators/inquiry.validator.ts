import { z } from "zod";

import { INQUIRY_STATUSES } from "../types/workflow";

export const createInquirySchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(255),
  phone: z.string().trim().min(7).max(30),
  city: z.string().trim().min(2).max(120),
  message: z.preprocess(
    (value) =>
      typeof value === "string" && value.trim().length === 0
        ? "Consultation requested from website."
        : value,
    z.string().trim().min(10).max(2000),
  ),
});

export const inquiryListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(INQUIRY_STATUSES).optional(),
});

export const inquiryIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum(INQUIRY_STATUSES),
  responseMessage: z.string().trim().min(1).max(4000).optional(),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type InquiryListQuery = z.infer<typeof inquiryListQuerySchema>;
