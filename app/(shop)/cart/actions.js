"use server";

import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { dbConnect } from "@/lib/mongoDb";
import { CART_COOKIE, getCurrentCart } from "@/lib/queries/cart";

const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 180; // 180 days

async function getOrCreateCartId() {
  const cookieStore = await cookies();
  let cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) {
    cartId = randomUUID();
    cookieStore.set(CART_COOKIE, cartId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: CART_COOKIE_MAX_AGE,
      path: "/",
    });
  }

  return cartId;
}

// Adds an item, or increments quantity when the same product + SKU + color + size already exists
export async function addToCart(item) {
  try {
    const db = await dbConnect();
    const cartId = await getOrCreateCartId();
    const carts = db.collection("carts");

    const variantFilter = {
      cartId,
      "items.productId": item.productId,
      "items.sku": item.sku,
      "items.color": item.color ?? null,
      "items.size": item.size ?? null,
    };

    const updated = await carts.updateOne(variantFilter, {
      $inc: { "items.$.quantity": item.quantity },
      $set: { updatedAt: new Date() },
    });

    if (updated.matchedCount === 0) {
      const newItem = {
        itemId: randomUUID(),
        productId: item.productId,
        slug: item.slug,
        name: item.name,
        sku: item.sku,
        image: item.image,
        color: item.color ?? null,
        size: item.size ?? null,
        price: item.price,
        quantity: item.quantity,
      };

      await carts.updateOne(
        { cartId },
        {
          $push: { items: newItem },
          $set: { updatedAt: new Date() },
          $setOnInsert: { cartId, userId: null, createdAt: new Date() },
        },
        { upsert: true },
      );
    }

    revalidatePath("/cart");

    return {
      success: true,
      message: "Added to cart",
      cart: await getCurrentCart(),
    };
  } catch (error) {
    console.error("ADD TO CART ERROR:", error);

    return { success: false, message: "Failed to add item to cart" };
  }
}

export async function updateCartItemQuantity(itemId, quantity) {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE)?.value;

    if (!cartId) {
      return { success: false, message: "Cart not found" };
    }

    const db = await dbConnect();

    await db.collection("carts").updateOne(
      { cartId, "items.itemId": itemId },
      {
        $set: {
          "items.$.quantity": Math.max(1, quantity),
          updatedAt: new Date(),
        },
      },
    );

    revalidatePath("/cart");

    return { success: true, cart: await getCurrentCart() };
  } catch (error) {
    console.error("UPDATE CART ITEM ERROR:", error);

    return { success: false, message: "Failed to update quantity" };
  }
}

export async function removeCartItem(itemId) {
  try {
    const cookieStore = await cookies();
    const cartId = cookieStore.get(CART_COOKIE)?.value;

    if (!cartId) {
      return { success: false, message: "Cart not found" };
    }

    const db = await dbConnect();

    await db
      .collection("carts")
      .updateOne(
        { cartId },
        { $pull: { items: { itemId } }, $set: { updatedAt: new Date() } },
      );

    revalidatePath("/cart");

    return {
      success: true,
      message: "Item removed from cart",
      cart: await getCurrentCart(),
    };
  } catch (error) {
    console.error("REMOVE CART ITEM ERROR:", error);

    return { success: false, message: "Failed to remove item" };
  }
}
