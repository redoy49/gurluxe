import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/mongoDb";

function serializeCoupon(coupon) {
  return {
    ...coupon,
    _id: coupon._id.toString(),
    expiresAt: coupon.expiresAt
      ? new Date(coupon.expiresAt).toISOString()
      : null,
    createdAt: coupon.createdAt
      ? new Date(coupon.createdAt).toISOString()
      : null,
    updatedAt: coupon.updatedAt
      ? new Date(coupon.updatedAt).toISOString()
      : null,
  };
}

export async function getCoupons() {
  const db = await dbConnect();

  const coupons = await db
    .collection("coupons")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return coupons.map(serializeCoupon);
}

export async function getCouponById(id) {
  if (!ObjectId.isValid(id)) return null;

  const db = await dbConnect();
  const coupon = await db.collection("coupons").findOne({ _id: new ObjectId(id) });

  return coupon ? serializeCoupon(coupon) : null;
}

// Case-insensitive exact match — codes are stored uppercased already, but a
// customer might type it lowercase at checkout.
export async function getCouponByCode(code) {
  if (!code) return null;

  const db = await dbConnect();
  const coupon = await db
    .collection("coupons")
    .findOne({ code: code.trim().toUpperCase() });

  return coupon ? serializeCoupon(coupon) : null;
}

// The single source of truth for "is this code usable for this order right
// now, and what does it discount" — used both for the checkout preview and,
// again, authoritatively inside placeOrder so a client can never dictate its
// own discount amount.
export async function validateCouponForOrder(code, subtotal) {
  if (!code || !code.trim()) {
    return { valid: false, message: "Enter a coupon code" };
  }

  const coupon = await getCouponByCode(code);

  if (!coupon) {
    return { valid: false, message: "Invalid coupon code" };
  }

  if (!coupon.active) {
    return { valid: false, message: "This coupon is no longer active" };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { valid: false, message: "This coupon has expired" };
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: "This coupon has reached its usage limit" };
  }

  if (subtotal < (coupon.minOrderValue || 0)) {
    return {
      valid: false,
      message: `Add ৳ ${(coupon.minOrderValue - subtotal).toLocaleString()} more to use this coupon`,
    };
  }

  let discount =
    coupon.type === "percent" ? (subtotal * coupon.value) / 100 : coupon.value;

  if (coupon.type === "percent" && coupon.maxDiscount) {
    discount = Math.min(discount, coupon.maxDiscount);
  }

  discount = Math.min(Math.round(discount), subtotal);

  return { valid: true, coupon, discount };
}
