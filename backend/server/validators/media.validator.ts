import { z } from "zod";

export const mediaSignatureQuerySchema = z.object({
  folder: z.string().trim().min(1).default("luxury-cnc"),
});
