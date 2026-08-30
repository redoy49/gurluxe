"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function CartSummary({ cartItems }) {
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const shipping = 0;
  const discount = 0;

  const total = subtotal + shipping - discount;

  return (
    <aside className="sticky top-24 h-fit rounded-xl border border-gray-100 bg-white p-6">
      {/* Heading */}
      <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>

      {/* Promo */}
      <div className="mt-6">
        <label className="mb-2 block text-xs font-medium text-gray-700">
          Promo Code
        </label>

        <div className="flex overflow-hidden rounded-full border border-gray-300">
          <input
            type="text"
            placeholder="Enter promo code"
            className="h-10 flex-1 bg-transparent px-4 text-xs text-gray-900 outline-none placeholder:text-gray-400"
          />

          <button
            type="button"
            className="m-0.5 rounded-full px-6 text-xs font-medium text-gray-700 transition bg-black text-white"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 space-y-4 border-y border-gray-100 py-5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Subtotal</span>

          <span className="text-xs font-medium text-gray-900">
            ৳ {subtotal.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Shipping</span>

          <span className="text-xs font-medium text-gray-900">
            {shipping === 0 ? "Free" : `৳ ${shipping}`}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Discount</span>

          <span className="text-xs font-medium text-green-600">
            - ৳ {discount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Total */}
      <div className="mt-5 flex items-center justify-between">
        <span className="text-sm font-semibold text-gray-900">Total</span>

        <span className="text-base font-semibold text-gray-900">
          ৳ {total.toLocaleString()}
        </span>
      </div>

      {/* Checkout */}
      <Link
        href="/checkout"
        className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-xs font-medium text-white transition hover:bg-[#2b1d28]"
      >
        Proceed to Checkout
        <ArrowRight size={16} strokeWidth={2} />
      </Link>

      {/* Continue Shopping */}
      <button
        type="button"
        className="mt-3 h-11 w-full rounded-full border border-gray-300 text-xs font-medium text-gray-700 transition hover:border-black hover:bg-gray-50"
      >
        Continue Shopping
      </button>

      {/* Security */}
      <div className="mt-6 rounded-lg bg-gray-50 p-3">
        <p className="text-center text-[11px] leading-5 text-gray-500">
          Secure Checkout
          <br />
          Your payment information is processed securely.
        </p>
      </div>
    </aside>
  );
}
