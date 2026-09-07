import { z } from "zod";

export const settingsSchema = z.object({
  storeName: z.string().min(1, "Store name is required"),
  supportEmail: z.string().email("Enter a valid email").or(z.literal("")),
  supportPhone: z.string().default(""),
  address: z.string().default(""),
  shippingInsideDhaka: z.coerce.number().min(0, "Cannot be negative"),
  shippingOutsideDhaka: z.coerce.number().min(0, "Cannot be negative"),
  freeShippingThreshold: z.coerce.number().min(0, "Cannot be negative"),
  codEnabled: z.boolean().default(true),
});
