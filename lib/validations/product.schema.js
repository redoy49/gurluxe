import { z } from "zod";

// Empty inputs (cleared number fields) arrive as "" or NaN rather than
// undefined, which would otherwise slip past an .optional()/.default() check.
const emptyToUndefined = (val) =>
  val === "" || val === null || (typeof val === "number" && Number.isNaN(val))
    ? undefined
    : val;

const optionalNumber = (message) =>
  z.preprocess(emptyToUndefined, z.coerce.number().min(0, message).default(0));

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  sku: z.string().min(2, "SKU is required"),
  category: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
  }),
  price: z.coerce.number().min(1, "Price is required"),
  comparePrice: optionalNumber("Compare price cannot be negative"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  soldCount: optionalNumber("Sold count cannot be negative"),
  status: z.enum(["active", "draft", "inactive"]).default("active"),
  shortDescription: z.string().min(5, "Short description is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  sizes: z.array(z.string()).default([]),
  colors: z
    .array(
      z.object({
        name: z.string().min(1),
        code: z.string().min(1),
      }),
    )
    .default([]),
  materials: z.string().default(""),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
});
