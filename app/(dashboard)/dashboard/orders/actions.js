"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoDb";
import { ORDER_STATUSES } from "@/lib/validations/order.schema";

export async function updateOrderStatus(id, status) {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, message: "Invalid order" };
    }

    if (!ORDER_STATUSES.includes(status)) {
      return { success: false, message: "Invalid status" };
    }

    const db = await dbConnect();

    const result = await db.collection("orders").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Order not found" };
    }

    revalidatePath("/dashboard/orders");
    revalidatePath(`/dashboard/orders/${id}`);
    revalidatePath("/dashboard");

    return { success: true, message: "Order status updated" };
  } catch (error) {
    console.error("UPDATE ORDER STATUS ERROR:", error);

    return { success: false, message: "Failed to update order status" };
  }
}
