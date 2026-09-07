import { z } from "zod";

export const customerInfoSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  phone: z
    .string()
    .min(11, "Enter a valid phone number")
    .max(15, "Enter a valid phone number"),
  district: z.string().min(1, "Select a district"),
  address: z.string().min(5, "Delivery address is required"),
  email: z.string().email("Enter a valid email").or(z.literal("")).default(""),
});

export const PAYMENT_METHODS = ["cod", "bkash", "nagad", "rocket", "upay"];

export const placeOrderSchema = z.object({
  customer: customerInfoSchema,
  payment: z.enum(PAYMENT_METHODS),
});

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];
