import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  sku: z.string().min(2, "SKU is required"),
  category: z.object({
    name: z.string().min(1),
    slug: z.string().min(1),
  }),
  images: z.any().optional(),
  price: z.coerce.number().min(1, "Price is required"),
  comparePrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  shortDescription: z.string().min(5, "Short description is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  colors: z.string().optional(),
  materials: z.string().optional(),
  featured: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  bestSeller: z.boolean().default(false),
});
