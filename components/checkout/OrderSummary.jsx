"use client";

import Image from "next/image";
import { ShieldCheck } from "lucide-react";

export default function OrderSummary({
  cartItems = [],
  shipping = 60,
  discount = 0,
  onPlaceOrder,
}) {
  const subtotal = cartItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0,
  );

  const total = subtotal + shipping - discount;

  return (
    <aside className="sticky top-24 h-fit rounded-xl border border-gray-100 bg-white p-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Order Summary
        </h2>

        <p className="mt-1 text-xs text-gray-500">
          Review your items before placing order.
        </p>
      </div>


      {/* Products */}
      <div className="mt-6 space-y-4">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3"
          >
            {/* Image */}
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>


            {/* Details */}
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-sm font-medium text-gray-900">
                {item.name}
              </h3>

              <p className="mt-1 text-xs text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>


            {/* Price */}
            <p className="text-sm font-medium text-gray-900">
              ৳{" "}
              {(
                item.price * item.quantity
              ).toLocaleString()}
            </p>
          </div>
        ))}
      </div>


      {/* Price Breakdown */}
      <div className="mt-6 space-y-4 border-y border-gray-100 py-5">

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Subtotal
          </span>

          <span className="text-sm font-medium text-gray-900">
            ৳ {subtotal.toLocaleString()}
          </span>
        </div>


        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">
            Shipping
          </span>

          <span className="text-sm font-medium text-gray-900">
            {shipping === 0
              ? "Free"
              : `৳ ${shipping.toLocaleString()}`}
          </span>
        </div>


        {discount > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Discount
            </span>

            <span className="text-sm font-medium text-green-600">
              - ৳ {discount.toLocaleString()}
            </span>
          </div>
        )}

      </div>


      {/* Total */}
      <div className="mt-5 flex items-center justify-between">
        <span className="text-base font-semibold text-gray-900">
          Total
        </span>

        <span className="text-xl font-bold text-gray-900">
          ৳ {total.toLocaleString()}
        </span>
      </div>


      {/* Delivery Info */}
      <div className="mt-5 rounded-xl bg-gray-50 p-4">
        <p className="text-xs font-medium text-gray-900">
          Estimated Delivery
        </p>

        <p className="mt-1 text-xs text-gray-500">
          Inside Dhaka: 1-2 days
          <br />
          Outside Dhaka: 2-4 days
        </p>
      </div>


      {/* Place Order */}
      <button
        type="button"
        onClick={onPlaceOrder}
        className="mt-6 flex h-14 w-full items-center justify-center rounded-full bg-black text-xs font-medium text-white transition hover:bg-[#2b1d28]"
      >
        Place Order
      </button>


      {/* Terms */}
      <p className="mt-4 text-center text-[11px] leading-5 text-gray-400">
        By placing your order, you agree to our
        Terms & Privacy Policy.
      </p>


      {/* Security */}
      <div className="mt-5 flex items-center justify-center gap-2 rounded-lg bg-gray-50 p-3">
        <ShieldCheck
          size={15}
          className="text-gray-500"
        />

        <p className="text-[11px] text-gray-500">
          Secure Checkout
        </p>
      </div>
    </aside>
  );
}