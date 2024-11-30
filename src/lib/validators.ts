import * as z from "zod";

export const baseSearchParamsSchema = z.object({
  page: z.coerce.number().default(1),
  per_page: z.coerce.number().default(10),
  cursor: z.string().optional(),
  sort: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  operator: z.enum(["and", "or"]).optional(),
});

export type BaseSearchParams = z.infer<typeof baseSearchParamsSchema>;
