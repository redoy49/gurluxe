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

// Manual mobile-banking payments (no merchant gateway is wired up) need a
// transaction id + sender number so the admin has something to verify
// against — required for every method except Cash on Delivery.
export const placeOrderSchema = z
  .object({
    customer: customerInfoSchema,
    payment: z.enum(PAYMENT_METHODS),
    couponCode: z.string().trim().optional().or(z.literal("")),
    transactionId: z.string().trim().optional().or(z.literal("")),
    senderNumber: z.string().trim().optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.payment === "cod") return;

    if (!data.transactionId || data.transactionId.length < 4) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["transactionId"],
        message: "Enter the Transaction ID from your payment",
      });
    }

    if (!data.senderNumber || data.senderNumber.length < 6) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["senderNumber"],
        message: "Enter the number you paid from",
      });
    }
  });

// The order lifecycle: pending is set automatically at checkout, everything
// after that is a deliberate admin action. Cancellation is only reachable
// while the order hasn't shipped yet — once a courier has it, undoing the
// order is a return/refund, not a cancellation.
export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export const ORDER_TRANSITIONS = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["processing", "cancelled"],
  processing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

// Separate axis from order status: a shipped/delivered order can still be
// unpaid (rare, but the two states shouldn't be conflated).
// - unpaid: Cash on Delivery, nothing collected yet.
// - pending_verification: mobile banking, customer submitted a txn id that
//   hasn't been checked by an admin yet.
// - paid: COD collected on delivery, or a mobile banking txn id verified.
// - failed: a submitted txn id didn't check out.
// - refunded: money was returned to the customer (cancellation after
//   payment, or a post-delivery return handled outside this system).
export const PAYMENT_STATUSES = [
  "unpaid",
  "pending_verification",
  "paid",
  "failed",
  "refunded",
];
