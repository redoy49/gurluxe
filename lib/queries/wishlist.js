import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/mongoDb";

// Wishlist entries are stored as their own collection (userId + productId)
// rather than an array on the user document, so lookups in either direction
// stay cheap as a customer's list grows.
export async function getWishlistEntries(userId) {
  const db = await dbConnect();

  return db
    .collection("wishlists")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

// Full product documents for everything a customer has saved, newest first.
// Entries pointing at a since-deleted product are silently dropped.
export async function getWishlistProducts(userId) {
  const entries = await getWishlistEntries(userId);
  if (entries.length === 0) return [];

  const db = await dbConnect();
  const ids = entries
    .map((entry) => entry.productId)
    .filter((id) => ObjectId.isValid(id))
    .map((id) => new ObjectId(id));

  const products = await db
    .collection("products")
    .find({ _id: { $in: ids } })
    .toArray();

  const productsById = new Map(products.map((p) => [p._id.toString(), p]));
  const ordered = entries
    .map((entry) => productsById.get(entry.productId))
    .filter(Boolean);

  return JSON.parse(JSON.stringify(ordered));
}

export async function getWishlistProductIds(userId) {
  const entries = await getWishlistEntries(userId);
  return entries.map((entry) => entry.productId);
}
