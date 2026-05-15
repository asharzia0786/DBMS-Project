import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().trim().min(3),
  slug: z
    .string()
  .trim()
    .min(3)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase words separated by hyphens."),
  description: z.string().trim().optional(),
  basePrice: z.number().int().positive(),
  stock: z.number().int().min(0).default(0),
  category: z.string().trim().min(2).max(120).optional(),
  material: z.string().trim().min(2).max(120).optional(),
  finish: z.string().trim().min(2).max(120).optional(),
  metadata: z.record(z.unknown()).optional(),
  images: z
    .array(
      z.object({
        imageUrl: z.string().url(),
        altText: z.string().trim().min(1).max(200).optional(),
      }),
    )
    .default([]),
});

export const updateProductSchema = createProductSchema
  .partial()
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one product field is required.",
  });

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().min(1).max(120).optional(),
  category: z.string().trim().min(1).max(120).optional(),
  material: z.string().trim().min(1).max(120).optional(),
  finish: z.string().trim().min(1).max(120).optional(),
});

export const productSlugParamsSchema = z.object({
  slug: z.string().trim().min(3),
});

export const productIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ProductListQuery = z.infer<typeof productListQuerySchema>;
