import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getOrderById } from "@/lib/queries/orders";
import OrderStatusBadge from "@/components/dashboard/OrderStatusBadge";
import PaymentStatusBadge from "@/components/dashboard/PaymentStatusBadge";
import OrderActions from "@/components/dashboard/OrderActions";
import OrderTimeline from "@/components/OrderTimeline";

const PAYMENT_LABELS = {
  cod: "Cash on Delivery",
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
  upay: "Upay",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default async function OrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) notFound();

  return (
    <div>
      <Link
        href="/dashboard/orders"
        className="mb-6 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black"
      >
        <ArrowLeft size={16} />
        Back to Orders
      </Link>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <PaymentStatusBadge status={order.payment.status} />
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Manage Order</h3>
        <OrderActions
          orderId={order._id}
          status={order.status}
          paymentStatus={order.payment.status}
          paymentMethod={order.payment.method}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white lg:col-span-2">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="font-semibold text-gray-900">Items</h3>
          </div>

          <ul className="divide-y divide-gray-100">
            {order.items.map((item, i) => (
              <li key={i} className="flex items-center gap-4 px-6 py-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    SKU: {item.sku}
                    {item.size ? ` · Size: ${item.size}` : ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    ৳ {item.price.toLocaleString()} × {item.quantity}
                  </p>
                </div>

                <p className="shrink-0 text-sm font-semibold text-gray-900">
                  ৳ {(item.price * item.quantity).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>

          <div className="space-y-2 border-t border-gray-100 bg-gray-50 px-6 py-4 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span>৳ {order.amounts.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Shipping</span>
              <span>
                {order.amounts.shipping === 0
                  ? "Free"
                  : `৳ ${order.amounts.shipping.toLocaleString()}`}
              </span>
            </div>
            {order.amounts.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>
                  Discount{order.couponCode ? ` (${order.couponCode})` : ""}
                </span>
                <span>- ৳ {order.amounts.discount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2 text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>৳ {order.amounts.total.toLocaleString()}</span>
            </div>
          </div>

          {/* Order timeline */}
          <div className="border-t border-gray-100 px-6 py-6">
            <h3 className="mb-4 font-semibold text-gray-900">Order Timeline</h3>
            <OrderTimeline
              status={order.status}
              statusHistory={order.statusHistory || []}
              tracking={order.tracking}
            />
          </div>
        </div>

        {/* Customer & payment */}
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Customer</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-gray-400">Name</dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {order.customer.name}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Phone</dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {order.customer.phone}
                </dd>
              </div>
              {order.customer.email && (
                <div>
                  <dt className="text-xs text-gray-400">Email</dt>
                  <dd className="mt-0.5 font-medium text-gray-900">
                    {order.customer.email}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-xs text-gray-400">Delivery Address</dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {order.customer.address}, {order.customer.district}
                </dd>
              </div>
            </dl>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">Payment</h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-gray-400">Method</dt>
                <dd className="mt-0.5 font-medium text-gray-900">
                  {PAYMENT_LABELS[order.payment.method] ||
                    order.payment.method}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-gray-400">Status</dt>
                <dd className="mt-0.5">
                  <PaymentStatusBadge status={order.payment.status} />
                </dd>
              </div>
              {order.payment.transactionId && (
                <div>
                  <dt className="text-xs text-gray-400">Transaction ID</dt>
                  <dd className="mt-0.5 font-mono font-medium text-gray-900">
                    {order.payment.transactionId}
                  </dd>
                </div>
              )}
              {order.payment.senderNumber && (
                <div>
                  <dt className="text-xs text-gray-400">Sent From</dt>
                  <dd className="mt-0.5 font-medium text-gray-900">
                    {order.payment.senderNumber}
                  </dd>
                </div>
              )}
              {order.payment.verifiedAt && (
                <div>
                  <dt className="text-xs text-gray-400">Verified</dt>
                  <dd className="mt-0.5 font-medium text-gray-900">
                    {formatDate(order.payment.verifiedAt)}
                  </dd>
                </div>
              )}
              {order.payment.refundedAt && (
                <div>
                  <dt className="text-xs text-gray-400">Refunded</dt>
                  <dd className="mt-0.5 font-medium text-gray-900">
                    {formatDate(order.payment.refundedAt)}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {order.status === "cancelled" && order.cancelReason && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <h3 className="mb-2 font-semibold text-red-800">
                Cancellation Reason
              </h3>
              <p className="text-sm text-red-700">{order.cancelReason}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
