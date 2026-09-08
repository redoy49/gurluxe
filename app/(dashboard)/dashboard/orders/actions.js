"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoDb";
import { ORDER_TRANSITIONS } from "@/lib/validations/order.schema";
import { requireAdminAction } from "@/lib/auth/authorize";

function revalidateOrder(id) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/orders");
  revalidatePath(`/dashboard/orders/${id}`);
  revalidatePath("/orders");
  revalidatePath(`/orders/${id}`);
}

// Restores stock and soldCount for every item in a cancelled order — the
// exact inverse of the deduction placeOrder makes at checkout, so inventory
// isn't permanently lost when an order never ships.
async function restoreInventory(db, items) {
  const byProduct = new Map();
  for (const item of items) {
    if (!item.productId) continue;
    byProduct.set(
      item.productId,
      (byProduct.get(item.productId) || 0) + item.quantity,
    );
  }

  const validIds = [...byProduct.keys()].filter((id) => ObjectId.isValid(id));
  if (validIds.length === 0) return;

  const bulkOps = validIds.map((productId) => ({
    updateOne: {
      filter: { _id: new ObjectId(productId) },
      update: {
        $inc: { stock: byProduct.get(productId), soldCount: -byProduct.get(productId) },
        $set: { updatedAt: new Date() },
      },
    },
  }));

  await db.collection("products").bulkWrite(bulkOps);
}

// Every order-status change funnels through here so the transition table is
// enforced in exactly one place, and every change is appended to
// statusHistory so both dashboards can render the same timeline.
async function transitionOrderStatus(id, nextStatus, extraUpdate = {}) {
  const { authorized } = await requireAdminAction();
  if (!authorized) {
    return { success: false, message: "Forbidden: admin access required." };
  }

  if (!ObjectId.isValid(id)) {
    return { success: false, message: "Invalid order" };
  }

  try {
    const db = await dbConnect();
    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });

    if (!order) {
      return { success: false, message: "Order not found" };
    }

    const allowed = ORDER_TRANSITIONS[order.status] || [];
    if (!allowed.includes(nextStatus)) {
      return {
        success: false,
        message: `Cannot move an order from "${order.status}" to "${nextStatus}"`,
      };
    }

    const now = new Date();
    const set = { status: nextStatus, updatedAt: now, ...extraUpdate };

    if (nextStatus === "cancelled") {
      await restoreInventory(db, order.items);
    }

    // Cash on Delivery is settled the moment the courier hands it over.
    if (nextStatus === "delivered" && order.payment?.method === "cod") {
      set["payment.status"] = "paid";
    }

    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: set,
        $push: { statusHistory: { status: nextStatus, at: now } },
      },
    );

    revalidateOrder(id);

    return { success: true, message: `Order marked as ${nextStatus}` };
  } catch (error) {
    console.error("TRANSITION ORDER STATUS ERROR:", error);

    return { success: false, message: "Failed to update order" };
  }
}

export async function confirmOrder(id) {
  return transitionOrderStatus(id, "confirmed");
}

export async function startProcessing(id) {
  return transitionOrderStatus(id, "processing");
}

export async function markShipped(id, { courier, trackingNumber } = {}) {
  return transitionOrderStatus(id, "shipped", {
    "tracking.courier": courier || null,
    "tracking.trackingNumber": trackingNumber || null,
  });
}

export async function markDelivered(id) {
  return transitionOrderStatus(id, "delivered");
}

export async function cancelOrder(id, reason) {
  return transitionOrderStatus(id, "cancelled", {
    cancelReason: reason || null,
  });
}

export async function verifyPayment(id) {
  const { authorized } = await requireAdminAction();
  if (!authorized) {
    return { success: false, message: "Forbidden: admin access required." };
  }

  if (!ObjectId.isValid(id)) {
    return { success: false, message: "Invalid order" };
  }

  try {
    const db = await dbConnect();
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "payment.status": "paid",
          "payment.verifiedAt": new Date(),
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Order not found" };
    }

    revalidateOrder(id);

    return { success: true, message: "Payment marked as verified" };
  } catch (error) {
    console.error("VERIFY PAYMENT ERROR:", error);

    return { success: false, message: "Failed to update payment" };
  }
}

export async function rejectPayment(id) {
  const { authorized } = await requireAdminAction();
  if (!authorized) {
    return { success: false, message: "Forbidden: admin access required." };
  }

  if (!ObjectId.isValid(id)) {
    return { success: false, message: "Invalid order" };
  }

  try {
    const db = await dbConnect();
    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: { "payment.status": "failed", updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Order not found" };
    }

    revalidateOrder(id);

    return { success: true, message: "Payment marked as failed" };
  } catch (error) {
    console.error("REJECT PAYMENT ERROR:", error);

    return { success: false, message: "Failed to update payment" };
  }
}

// Refunding only ever changes the payment record — it never re-opens the
// order status, since a refund is something that happens after
// cancellation or a post-delivery return handled outside this system.
export async function refundPayment(id) {
  const { authorized } = await requireAdminAction();
  if (!authorized) {
    return { success: false, message: "Forbidden: admin access required." };
  }

  if (!ObjectId.isValid(id)) {
    return { success: false, message: "Invalid order" };
  }

  try {
    const db = await dbConnect();
    const order = await db.collection("orders").findOne({ _id: new ObjectId(id) });

    if (!order) {
      return { success: false, message: "Order not found" };
    }

    if (order.payment?.status !== "paid") {
      return { success: false, message: "Only a paid order can be refunded" };
    }

    await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          "payment.status": "refunded",
          "payment.refundedAt": new Date(),
          updatedAt: new Date(),
        },
      },
    );

    revalidateOrder(id);

    return { success: true, message: "Payment marked as refunded" };
  } catch (error) {
    console.error("REFUND PAYMENT ERROR:", error);

    return { success: false, message: "Failed to update payment" };
  }
}
