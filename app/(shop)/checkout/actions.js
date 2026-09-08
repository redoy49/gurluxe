"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoDb";
import { getCurrentCart } from "@/lib/queries/cart";
import { getStoreSettings } from "@/lib/queries/settings";
import { validateCouponForOrder } from "@/lib/queries/coupons";
import { placeOrderSchema } from "@/lib/validations/order.schema";

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `GRX-${stamp}${random}`;
}

// Live preview used by the coupon input at checkout — recomputed
// authoritatively again inside placeOrder, so this is just UX feedback and
// is never trusted as the final discount.
export async function applyCoupon(code) {
  try {
    const cart = await getCurrentCart();
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const result = await validateCouponForOrder(code, subtotal);

    if (!result.valid) {
      return { success: false, message: result.message };
    }

    return {
      success: true,
      code: result.coupon.code,
      discount: result.discount,
      message: `Coupon applied — ৳ ${result.discount.toLocaleString()} off`,
    };
  } catch (error) {
    console.error("APPLY COUPON ERROR:", error);

    return { success: false, message: "Failed to apply coupon" };
  }
}

export async function placeOrder(input) {
  try {
    const parsed = placeOrderSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid order details",
      };
    }

    const { customer, payment, couponCode, transactionId, senderNumber } =
      parsed.data;

    const cart = await getCurrentCart();

    if (!cart.items || cart.items.length === 0) {
      return { success: false, message: "Your cart is empty" };
    }

    const db = await dbConnect();
    const settings = await getStoreSettings();

    if (payment === "cod" && !settings.codEnabled) {
      return { success: false, message: "Cash on Delivery is not available" };
    }

    if (payment !== "cod" && !settings[`${payment}Number`]) {
      return { success: false, message: "This payment method is not available" };
    }

    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const freeShipping =
      settings.freeShippingThreshold > 0 &&
      subtotal >= settings.freeShippingThreshold;

    const shipping = freeShipping
      ? 0
      : customer.district === "Dhaka"
        ? settings.shippingInsideDhaka
        : settings.shippingOutsideDhaka;

    // Never trust a client-supplied discount amount — re-validate the code
    // against the real subtotal right here, at the moment of purchase.
    let discount = 0;
    let appliedCoupon = null;

    if (couponCode) {
      const couponResult = await validateCouponForOrder(couponCode, subtotal);

      if (!couponResult.valid) {
        return { success: false, message: couponResult.message };
      }

      discount = couponResult.discount;
      appliedCoupon = couponResult.coupon;
    }

    const total = subtotal + shipping - discount;

    const orderNumber = generateOrderNumber();
    const now = new Date();

    // COD is settled at delivery; every other method is a manual mobile
    // banking transfer that needs a human to check the transaction id
    // against what actually landed in the merchant account.
    const paymentStatus = payment === "cod" ? "unpaid" : "pending_verification";

    const order = {
      orderNumber,
      customer,
      payment: {
        method: payment,
        status: paymentStatus,
        transactionId: payment === "cod" ? null : transactionId,
        senderNumber: payment === "cod" ? null : senderNumber,
        verifiedAt: null,
        refundedAt: null,
      },
      items: cart.items.map((item) => ({
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        sku: item.sku,
        image: item.image,
        color: item.color ?? null,
        size: item.size ?? null,
        price: item.price,
        quantity: item.quantity,
      })),
      amounts: { subtotal, shipping, discount, total },
      couponCode: appliedCoupon?.code || null,
      status: "pending",
      statusHistory: [{ status: "pending", at: now }],
      tracking: { courier: null, trackingNumber: null },
      createdAt: now,
      updatedAt: now,
    };

    await db.collection("orders").insertOne(order);

    if (appliedCoupon) {
      await db
        .collection("coupons")
        .updateOne({ _id: new ObjectId(appliedCoupon._id) }, { $inc: { usedCount: 1 } });
    }

    // Reflect the sale in inventory: decrement stock (floored at 0), bump soldCount.
    const soldByProduct = new Map();
    for (const item of cart.items) {
      if (!item.productId) continue;
      soldByProduct.set(
        item.productId,
        (soldByProduct.get(item.productId) || 0) + item.quantity,
      );
    }

    if (soldByProduct.size > 0) {
      const validIds = [...soldByProduct.keys()].filter((id) =>
        ObjectId.isValid(id),
      );

      const products = await db
        .collection("products")
        .find({ _id: { $in: validIds.map((id) => new ObjectId(id)) } })
        .project({ stock: 1 })
        .toArray();

      const stockById = new Map(
        products.map((p) => [p._id.toString(), p.stock ?? 0]),
      );

      const bulkOps = validIds.map((productId) => {
        const qty = soldByProduct.get(productId);
        const nextStock = Math.max(0, (stockById.get(productId) ?? 0) - qty);

        return {
          updateOne: {
            filter: { _id: new ObjectId(productId) },
            update: {
              $set: { stock: nextStock, updatedAt: new Date() },
              $inc: { soldCount: qty },
            },
          },
        };
      });

      if (bulkOps.length > 0) {
        await db.collection("products").bulkWrite(bulkOps);
      }
    }

    // Order placed — clear the cart it was built from.
    await db
      .collection("carts")
      .updateOne(
        { cartId: cart.cartId },
        { $set: { items: [], updatedAt: new Date() } },
      );

    revalidatePath("/cart");
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/products");
    revalidatePath("/dashboard/customers");
    revalidatePath("/dashboard/coupons");

    return { success: true, orderNumber };
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);

    return { success: false, message: "Failed to place order" };
  }
}
