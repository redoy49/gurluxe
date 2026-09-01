import { cookies } from "next/headers";
import { dbConnect } from "../mongoDb";

// No login/session system exists yet, so the cart is identified by an
// anonymous cartId cookie set from a Server Action on first "Add to Cart".
export const CART_COOKIE = "cartId";

const EMPTY_CART = { items: [] };

// Cart tied to the current browser's cartId cookie
export async function getCurrentCart() {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE)?.value;

  if (!cartId) return EMPTY_CART;

  const db = await dbConnect();
  const cart = await db.collection("carts").findOne({ cartId });

  if (!cart) return EMPTY_CART;

  return JSON.parse(JSON.stringify(cart));
}
