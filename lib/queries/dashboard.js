import { dbConnect } from "@/lib/mongoDb";
import { ORDER_STATUSES } from "@/lib/validations/order.schema";

const LOW_STOCK_THRESHOLD = 10;

function monthLabel(year, month) {
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

export async function getDashboardData() {
  const db = await dbConnect();

  const [products, users, carts, orders] = await Promise.all([
    db.collection("products").find({}).toArray(),
    db
      .collection("users")
      .find({}, { projection: { password: 0 } })
      .toArray(),
    db.collection("carts").find({}).toArray(),
    db.collection("orders").find({}).toArray(),
  ]);

  // ---- Totals ----
  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.status === "active").length;
  const totalStockUnits = products.reduce((sum, p) => sum + (p.stock || 0), 0);
  const inventoryValue = products.reduce(
    (sum, p) => sum + (p.stock || 0) * (p.price || 0),
    0,
  );
  const totalCustomers = users.length;

  const cartItems = carts.flatMap((c) => c.items || []);
  const cartValue = cartItems.reduce(
    (sum, i) => sum + (i.price || 0) * (i.quantity || 0),
    0,
  );
  const cartItemCount = cartItems.reduce((sum, i) => sum + (i.quantity || 0), 0);

  // ---- Orders & revenue ----
  const totalOrders = orders.length;
  const nonCancelledOrders = orders.filter((o) => o.status !== "cancelled");
  const revenue = nonCancelledOrders.reduce(
    (sum, o) => sum + (o.amounts?.total || 0),
    0,
  );
  const avgOrderValue =
    nonCancelledOrders.length > 0 ? revenue / nonCancelledOrders.length : 0;

  const ordersByStatus = ORDER_STATUSES.reduce((acc, status) => {
    acc[status] = orders.filter((o) => o.status === status).length;
    return acc;
  }, {});

  // ---- Products by category ----
  const categoryMap = new Map();
  for (const p of products) {
    const slug = p.category?.slug || "uncategorized";
    const name = p.category?.name || "Uncategorized";
    const entry = categoryMap.get(slug) || { name, count: 0 };
    entry.count += 1;
    categoryMap.set(slug, entry);
  }
  const categoryDistribution = [...categoryMap.values()].sort(
    (a, b) => b.count - a.count,
  );

  // ---- Stock vs sold per product ----
  const stockVsSold = products
    .map((p) => ({
      name: p.name,
      stock: p.stock || 0,
      sold: p.soldCount || 0,
    }))
    .sort((a, b) => b.sold - a.sold || b.stock - a.stock);

  // ---- Low stock alerts ----
  const lowStockProducts = products
    .filter((p) => (p.stock ?? 0) <= LOW_STOCK_THRESHOLD)
    .sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))
    .map((p) => ({
      id: p._id.toString(),
      name: p.name,
      slug: p.slug,
      category: p.category?.name || "Uncategorized",
      stock: p.stock ?? 0,
      image: p.images?.[0]?.url || null,
    }));

  // ---- Customer growth (monthly signups, cumulative) ----
  const monthMap = new Map();
  for (const u of users) {
    if (!u.createdAt) continue;
    const date = new Date(u.createdAt);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    monthMap.set(key, (monthMap.get(key) || 0) + 1);
  }
  const sortedMonthKeys = [...monthMap.keys()].sort();
  let cumulativeCustomers = 0;
  const customerGrowth = sortedMonthKeys.map((key) => {
    const [year, month] = key.split("-").map(Number);
    cumulativeCustomers += monthMap.get(key);
    return {
      month: monthLabel(year, month),
      signups: monthMap.get(key),
      total: cumulativeCustomers,
    };
  });

  // ---- Cart value by product (what's sitting in carts right now) ----
  const cartByProduct = new Map();
  for (const item of cartItems) {
    const key = item.productId || item.name;
    const entry = cartByProduct.get(key) || {
      name: item.name,
      quantity: 0,
      value: 0,
    };
    entry.quantity += item.quantity || 0;
    entry.value += (item.price || 0) * (item.quantity || 0);
    cartByProduct.set(key, entry);
  }
  const cartValueByProduct = [...cartByProduct.values()].sort(
    (a, b) => b.value - a.value,
  );

  // ---- Merchandising flags ----
  const flagCounts = {
    featured: products.filter((p) => p.flags?.featured).length,
    newArrival: products.filter((p) => p.flags?.newArrival).length,
    bestSeller: products.filter((p) => p.flags?.bestSeller).length,
  };

  // ---- Recently added products ----
  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5)
    .map((p) => ({
      id: p._id.toString(),
      name: p.name,
      category: p.category?.name || "Uncategorized",
      price: p.price,
      stock: p.stock ?? 0,
      status: p.status,
      image: p.images?.[0]?.url || null,
      createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : null,
    }));

  return {
    totals: {
      totalProducts,
      activeProducts,
      totalStockUnits,
      inventoryValue,
      totalCustomers,
      cartValue,
      cartItemCount,
      activeCarts: carts.length,
    },
    categoryDistribution,
    stockVsSold,
    lowStockProducts,
    customerGrowth,
    cartValueByProduct,
    flagCounts,
    recentProducts,
  };
}
