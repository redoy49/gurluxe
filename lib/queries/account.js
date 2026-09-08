import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/mongoDb";
import { getOrdersByEmail } from "./orders";

// Profile details plus lightweight order stats for the customer account
// pages. Orders are matched by email (same best-effort approach used
// elsewhere) since checkout doesn't attach a userId to the order.
export async function getAccountOverview(userId, email) {
  const db = await dbConnect();

  const dbUser = await db.collection("users").findOne(
    { _id: new ObjectId(userId) },
    { projection: { password: 0 } },
  );

  const orders = await getOrdersByEmail(email);
  const validOrders = orders.filter((o) => o.status !== "cancelled");
  const totalSpent = validOrders.reduce(
    (sum, o) => sum + (o.amounts?.total || 0),
    0,
  );

  return {
    profile: {
      id: dbUser._id.toString(),
      name: dbUser.name,
      email: dbUser.email,
      phone: dbUser.phone || "",
      avatar: dbUser.avatar || null,
      role: dbUser.role || "user",
      provider: dbUser.provider || "credentials",
      hasPassword: Boolean(dbUser.password),
      joinedAt: dbUser.createdAt
        ? new Date(dbUser.createdAt).toISOString()
        : null,
    },
    stats: {
      totalOrders: orders.length,
      totalSpent,
    },
  };
}
