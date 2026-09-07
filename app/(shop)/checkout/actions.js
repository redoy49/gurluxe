"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoDb";
import { getCurrentCart } from "@/lib/queries/cart";
import { getStoreSettings } from "@/lib/queries/settings";
import { placeOrderSchema } from "@/lib/validations/order.schema";

function generateOrderNumber() {
  const stamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `GRX-${stamp}${random}`;
}

// No coupon system exists yet, so discounts always come out to 0 — this
// stays real rather than faking a promo the storefront can't actually apply.
export async function placeOrder(input) {
  try {
    const parsed = placeOrderSchema.safeParse(input);

    if (!parsed.success) {
      return {
        success: false,
        message: parsed.error.issues[0]?.message || "Invalid order details",
      };
    }

    const { customer, payment } = parsed.data;

    const cart = await getCurrentCart();

    if (!cart.items || cart.items.length === 0) {
      return { success: false, message: "Your cart is empty" };
    }

    const db = await dbConnect();
    const settings = await getStoreSettings();

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

    const discount = 0;
    const total = subtotal + shipping - discount;

    const orderNumber = generateOrderNumber();

    const order = {
      orderNumber,
      customer,
      payment: {
        method: payment,
        status: "unpaid",
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
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("orders").insertOne(order);

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

    return { success: true, orderNumber };
  } catch (error) {
    console.error("PLACE ORDER ERROR:", error);

    return { success: false, message: "Failed to place order" };
  }
}
