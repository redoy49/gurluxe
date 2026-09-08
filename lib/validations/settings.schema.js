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

  // Merchant numbers customers manually send money to for mobile banking
  // (no gateway is integrated) — left blank hides that method at checkout.
  bkashNumber: z.string().trim().default(""),
  nagadNumber: z.string().trim().default(""),
  rocketNumber: z.string().trim().default(""),
  upayNumber: z.string().trim().default(""),
});
