import { dbConnect } from "@/lib/mongoDb";

// Checkout is guest-based (no session is attached to an order), so a
// customer's orders can only be linked back to an account by matching email
// addresses — best-effort, not a true foreign key.
export async function getCustomers() {
  const db = await dbConnect();

  const [users, orders] = await Promise.all([
    db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray(),
    db
      .collection("orders")
      .find({}, { projection: { customer: 1, amounts: 1, status: 1, createdAt: 1 } })
      .toArray(),
  ]);

  const userEmails = new Set(
    users.map((u) => u.email?.toLowerCase()).filter(Boolean),
  );

  const ordersByEmail = new Map();
  let guestOrderCount = 0;

  for (const order of orders) {
    const email = order.customer?.email?.toLowerCase();

    if (email && userEmails.has(email)) {
      const list = ordersByEmail.get(email) || [];
      list.push(order);
      ordersByEmail.set(email, list);
    } else {
      guestOrderCount += 1;
    }
  }

  const customers = users.map((u) => {
    const email = u.email?.toLowerCase();
    const userOrders = ordersByEmail.get(email) || [];
    const validOrders = userOrders.filter((o) => o.status !== "cancelled");
    const totalSpent = validOrders.reduce(
      (sum, o) => sum + (o.amounts?.total || 0),
      0,
    );

    return {
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      joinedAt: u.createdAt ? new Date(u.createdAt).toISOString() : null,
      orderCount: userOrders.length,
      totalSpent,
    };
  });

  return {
    customers,
    totalCustomers: users.length,
    guestOrderCount,
  };
}
