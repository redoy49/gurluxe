"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoDb";
import { couponSchema } from "@/lib/validations/coupon.schema";
import { requireAdminAction } from "@/lib/auth/authorize";

export async function createCoupon(rawData) {
  const { authorized } = await requireAdminAction();
  if (!authorized) {
    return { success: false, message: "Forbidden: admin access required." };
  }

  const parsed = couponSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid coupon",
    };
  }

  try {
    const db = await dbConnect();
    const coupons = db.collection("coupons");

    const existing = await coupons.findOne({ code: parsed.data.code });
    if (existing) {
      return { success: false, message: "A coupon with this code already exists." };
    }

    await coupons.insertOne({
      ...parsed.data,
      expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
      maxDiscount: parsed.data.maxDiscount || null,
      usageLimit: parsed.data.usageLimit || null,
      usedCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    revalidatePath("/dashboard/coupons");

    return { success: true, message: "Coupon created" };
  } catch (error) {
    console.error("CREATE COUPON ERROR:", error);

    return { success: false, message: "Failed to create coupon" };
  }
}

export async function updateCoupon(id, rawData) {
  const { authorized } = await requireAdminAction();
  if (!authorized) {
    return { success: false, message: "Forbidden: admin access required." };
  }

  if (!ObjectId.isValid(id)) {
    return { success: false, message: "Invalid coupon" };
  }

  const parsed = couponSchema.safeParse(rawData);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message || "Invalid coupon",
    };
  }

  try {
    const db = await dbConnect();
    const coupons = db.collection("coupons");

    const existing = await coupons.findOne({
      code: parsed.data.code,
      _id: { $ne: new ObjectId(id) },
    });
    if (existing) {
      return { success: false, message: "A coupon with this code already exists." };
    }

    const result = await coupons.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...parsed.data,
          expiresAt: parsed.data.expiresAt ? new Date(parsed.data.expiresAt) : null,
          maxDiscount: parsed.data.maxDiscount || null,
          usageLimit: parsed.data.usageLimit || null,
          updatedAt: new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Coupon not found" };
    }

    revalidatePath("/dashboard/coupons");

    return { success: true, message: "Coupon updated" };
  } catch (error) {
    console.error("UPDATE COUPON ERROR:", error);

    return { success: false, message: "Failed to update coupon" };
  }
}

export async function toggleCouponActive(id, active) {
  const { authorized } = await requireAdminAction();
  if (!authorized) {
    return { success: false, message: "Forbidden: admin access required." };
  }

  if (!ObjectId.isValid(id)) {
    return { success: false, message: "Invalid coupon" };
  }

  try {
    const db = await dbConnect();

    await db.collection("coupons").updateOne(
      { _id: new ObjectId(id) },
      { $set: { active, updatedAt: new Date() } },
    );

    revalidatePath("/dashboard/coupons");

    return {
      success: true,
      message: active ? "Coupon activated" : "Coupon deactivated",
    };
  } catch (error) {
    console.error("TOGGLE COUPON ERROR:", error);

    return { success: false, message: "Failed to update coupon" };
  }
}

export async function deleteCoupon(id) {
  const { authorized } = await requireAdminAction();
  if (!authorized) {
    return { success: false, message: "Forbidden: admin access required." };
  }

  if (!ObjectId.isValid(id)) {
    return { success: false, message: "Invalid coupon" };
  }

  try {
    const db = await dbConnect();
    const result = await db
      .collection("coupons")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, message: "Coupon not found" };
    }

    revalidatePath("/dashboard/coupons");

    return { success: true, message: "Coupon deleted" };
  } catch (error) {
    console.error("DELETE COUPON ERROR:", error);

    return { success: false, message: "Failed to delete coupon" };
  }
}
