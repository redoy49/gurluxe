import Link from "next/link";
import { getOrders } from "@/lib/queries/orders";
import { ORDER_STATUSES } from "@/lib/validations/order.schema";
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";

const PAYMENT_LABELS = {
  cod: "Cash on Delivery",
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
  upay: "Upay",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function OrdersPage({ searchParams }) {
  const { status } = await searchParams;
  const allOrders = await getOrders();

  const orders = status
    ? allOrders.filter((o) => o.status === status)
    : allOrders;

  const counts = ORDER_STATUSES.reduce((acc, s) => {
    acc[s] = allOrders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const tabs = [
    { key: null, label: "All", count: allOrders.length },
    ...ORDER_STATUSES.map((s) => ({ key: s, label: s, count: counts[s] })),
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          Track and manage customer orders.
        </p>
      </div>

      {/* Status tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const active = (status || null) === tab.key;

          return (
            <Link
              key={tab.label}
              href={tab.key ? `/dashboard/orders?status=${tab.key}` : "/dashboard/orders"}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium capitalize transition ${
                active
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {tab.label}
              <span
                className={`rounded-full px-1.5 py-0.5 text-xs ${
                  active ? "bg-white/20" : "bg-gray-100"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Payment
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Date
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b border-gray-100 last:border-none hover:bg-gray-50"
                >
                  <td className="px-6 py-5">
                    <Link
                      href={`/dashboard/orders/${order._id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>

                  <td className="px-6 py-5">
                    <p className="text-sm font-medium text-gray-900">
                      {order.customer?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.customer?.phone}
                    </p>
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-700">
                    {order.items?.length} item
                    {order.items?.length === 1 ? "" : "s"}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-700">
                    {PAYMENT_LABELS[order.payment?.method] ||
                      order.payment?.method}
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-gray-900">
                    ৳ {order.amounts?.total?.toLocaleString()}
                  </td>

                  <td className="px-6 py-5">
                    <OrderStatusBadge status={order.status} />
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-16 text-center text-gray-500"
                  >
                    {status
                      ? `No ${status} orders.`
                      : "No orders yet. Orders will appear here once customers check out."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
