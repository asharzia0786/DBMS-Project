import { z } from "zod";

export const createInquirySchema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(7).max(30),
  city: z.string().trim().min(2).max(120),
  message: z.string().trim().max(2000).optional(),
});

export const inquiryListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().trim().min(1).max(40).optional(),
});

export type CreateInquiryInput = z.infer<typeof createInquirySchema>;
export type InquiryListQuery = z.infer<typeof inquiryListQuerySchema>;
