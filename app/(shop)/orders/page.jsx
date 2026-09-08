import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ChevronRight, Package } from "lucide-react";
import { requireUserPage } from "@/lib/auth/authorize";
import { getOrdersByEmail } from "@/lib/queries/orders";
import AccountShell from "@/components/account/AccountShell";
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function OrdersPage() {
  const user = await requireUserPage();

  // Admin accounts manage orders from /dashboard/orders, not a personal
  // order history — this is a customer-only page.
  if (user.role === "admin") redirect("/dashboard/orders");

  const orders = await getOrdersByEmail(user.email);

  return (
    <AccountShell user={user}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="mt-1 text-sm text-gray-500">
          {orders.length > 0
            ? `${orders.length} order${orders.length === 1 ? "" : "s"} placed with this email.`
            : "Your order history will show up here."}
        </p>
      </div>

      {orders.length === 0 ? (
        <EmptyOrders />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              href={`/orders/${order._id}`}
              className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-pink-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div
                      key={i}
                      className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-gray-100"
                    >
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="min-w-0">
                  <p className="font-semibold text-gray-900">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(order.createdAt)} · {order.items.length} item
                    {order.items.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 sm:gap-6">
                <OrderStatusBadge status={order.status} />
                <p className="text-sm font-semibold text-gray-900">
                  ৳ {order.amounts.total.toLocaleString()}
                </p>
                <ChevronRight size={18} className="hidden shrink-0 text-gray-300 sm:block" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </AccountShell>
  );
}

function EmptyOrders() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-400">
        <Package size={28} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-gray-900">
        No orders yet
      </h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">
        When you place an order, it will show up here so you can track its
        status anytime.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex rounded-full bg-linear-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-pink-200 transition hover:shadow-lg"
      >
        Start Shopping
      </Link>
    </div>
  );
}
