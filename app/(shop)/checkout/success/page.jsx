import Image from "next/image";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getOrderByNumber } from "@/lib/queries/orders";

const PAYMENT_LABELS = {
  cod: "Cash on Delivery",
  bkash: "bKash",
  nagad: "Nagad",
  rocket: "Rocket",
  upay: "Upay",
};

export default async function CheckoutSuccessPage({ searchParams }) {
  const { order: orderNumber } = await searchParams;
  const order = orderNumber ? await getOrderByNumber(orderNumber) : null;

  if (!order) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-screen-md px-4 text-center sm:px-6 lg:px-8">
          <p className="text-lg font-medium text-gray-900">
            We couldn&apos;t find that order.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-xs font-medium text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10">
      <div className="mx-auto max-w-screen-md px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <CheckCircle2 className="h-14 w-14 text-green-500" />
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Order Placed Successfully
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Thank you, {order.customer.name}. Your order{" "}
            <span className="font-medium text-gray-900">
              {order.orderNumber}
            </span>{" "}
            has been received.
          </p>
        </div>

        <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-4">
            <div>
              <p className="text-xs text-gray-500">Payment Method</p>
              <p className="text-sm font-medium text-gray-900">
                {PAYMENT_LABELS[order.payment.method] || order.payment.method}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Delivery To</p>
              <p className="text-sm font-medium text-gray-900">
                {order.customer.district}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
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
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  ৳ {(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 border-t border-gray-100 pt-4 text-sm">
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
            <div className="flex justify-between border-t border-gray-100 pt-2 text-base font-semibold text-gray-900">
              <span>Total</span>
              <span>৳ {order.amounts.total.toLocaleString()}</span>
            </div>
          </div>

          {order.payment.method !== "cod" && (
            <p className="mt-4 rounded-lg bg-amber-50 px-4 py-3 text-xs text-amber-700">
              We&apos;re verifying your {PAYMENT_LABELS[order.payment.method]}{" "}
              payment — you&apos;ll see your order confirmed once that&apos;s
              done.
            </p>
          )}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/shop"
            className="rounded-full bg-black px-6 py-3 text-xs font-medium text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </section>
  );
}
