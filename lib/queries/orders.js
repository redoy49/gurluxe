import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/mongoDb";

function serializeOrder(order) {
  return {
    ...order,
    _id: order._id.toString(),
    createdAt: order.createdAt ? new Date(order.createdAt).toISOString() : null,
    updatedAt: order.updatedAt ? new Date(order.updatedAt).toISOString() : null,
  };
}

export async function getOrders() {
  const db = await dbConnect();

  const orders = await db
    .collection("orders")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return orders.map(serializeOrder);
}

export async function getOrderById(id) {
  if (!ObjectId.isValid(id)) return null;

  const db = await dbConnect();

  const order = await db
    .collection("orders")
    .findOne({ _id: new ObjectId(id) });

  if (!order) return null;

  return serializeOrder(order);
}

// Checkout is guest-based (no session attached to an order), so a signed-in
// customer's order history can only be recovered by matching email — same
// best-effort approach used in lib/queries/customers.js.
export async function getOrdersByEmail(email) {
  if (!email) return [];

  const db = await dbConnect();

  const orders = await db
    .collection("orders")
    .find({ "customer.email": { $regex: `^${escapeRegex(email)}$`, $options: "i" } })
    .sort({ createdAt: -1 })
    .toArray();

  return orders.map(serializeOrder);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getOrderByNumber(orderNumber) {
  const db = await dbConnect();

  const order = await db.collection("orders").findOne({ orderNumber });

  if (!order) return null;

  return serializeOrder(order);
}
