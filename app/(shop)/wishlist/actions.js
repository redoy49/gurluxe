"use server";

import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoDb";
import { requireUserAction } from "@/lib/auth/authorize";

export async function removeFromWishlist(productId) {
  const { authorized, user } = await requireUserAction();
  if (!authorized) {
    return { success: false, message: "Please log in first." };
  }

  try {
    const db = await dbConnect();

    await db
      .collection("wishlists")
      .deleteOne({ userId: user.id, productId });

    revalidatePath("/wishlist");

    return { success: true, message: "Removed from wishlist" };
  } catch (error) {
    console.error("REMOVE WISHLIST ERROR:", error);

    return { success: false, message: "Failed to remove item" };
  }
}
