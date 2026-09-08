import { z } from "zod";

export const COUPON_TYPES = ["percent", "fixed"];

export const couponSchema = z
  .object({
    code: z
      .string()
      .trim()
      .min(3, "Code must be at least 3 characters")
      .max(20, "Code must be 20 characters or fewer")
      .transform((value) => value.toUpperCase()),
    type: z.enum(COUPON_TYPES),
    value: z.coerce.number().positive("Value must be greater than 0"),
    minOrderValue: z.coerce.number().min(0, "Cannot be negative").default(0),
    maxDiscount: z.coerce.number().min(0, "Cannot be negative").optional(),
    usageLimit: z.coerce
      .number()
      .int("Must be a whole number")
      .min(0, "Cannot be negative")
      .optional(),
    expiresAt: z.string().optional().or(z.literal("")),
    active: z.boolean().default(true),
  })
  .superRefine((data, ctx) => {
    if (data.type === "percent" && data.value > 100) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["value"],
        message: "A percentage discount can't exceed 100",
      });
    }
  });
