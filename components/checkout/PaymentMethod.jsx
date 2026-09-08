"use client";

import Image from "next/image";
import { Check } from "lucide-react";

const METHOD_META = {
  cod: { title: "Cash on Delivery" },
  bkash: { logo: "/payment/bkash.svg", alt: "bKash" },
  nagad: { logo: "/payment/nagad.svg", alt: "Nagad" },
  rocket: { logo: "/payment/rocket.svg", alt: "Rocket" },
  upay: { logo: "/payment/upay.svg", alt: "Upay" },
};

export default function PaymentMethod({
  payment,
  setPayment,
  settings,
  transactionId,
  senderNumber,
  onTransactionFieldChange,
  errors = {},
}) {
  const methods = [
    { id: "cod", available: settings.codEnabled },
    { id: "bkash", available: Boolean(settings.bkashNumber) },
    { id: "nagad", available: Boolean(settings.nagadNumber) },
    { id: "rocket", available: Boolean(settings.rocketNumber) },
    { id: "upay", available: Boolean(settings.upayNumber) },
  ].filter((method) => method.available);

  const merchantNumber = payment !== "cod" ? settings[`${payment}Number`] : null;

  return (
    <section className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Payment Method
        </h2>

        <p className="mt-1 text-sm text-gray-500">
          Choose how you want to pay.
        </p>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {methods.map((method) => {
          const meta = METHOD_META[method.id];
          const active = payment === method.id;

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => setPayment(method.id)}
              className={`relative flex h-20 items-center justify-center rounded-xl border transition-all duration-200 ${
                active
                  ? "border-black bg-gray-50"
                  : "border-gray-200 hover:border-gray-400 hover:bg-gray-50"
              }`}
            >
              {/* Selected Indicator */}
              {active && (
                <span className="absolute right-2 top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-white">
                  <Check size={12} strokeWidth={3} />
                </span>
              )}

              {/* Cash on Delivery */}
              {method.id === "cod" ? (
                <div className="flex flex-col items-center">
                  <span className="text-3xl">💵</span>

                  <span className="mt-2 text-center text-sm font-medium text-gray-900">
                    Cash on Delivery
                  </span>
                </div>
              ) : (
                <Image
                  src={meta.logo}
                  alt={meta.alt}
                  width={90}
                  height={32}
                  className="h-8 w-auto object-cover"
                  priority
                />
              )}
            </button>
          );
        })}
      </div>

      {methods.length === 0 && (
        <p className="mt-4 text-sm text-red-500">
          No payment methods are currently available. Please contact support.
        </p>
      )}

      {/* Manual mobile banking transfer instructions — no payment gateway
          is connected, so the customer pays directly and the admin
          verifies the transaction id before confirming the order. */}
      {payment !== "cod" && merchantNumber && (
        <div className="mt-5 space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-sm text-gray-700">
            Send the total amount to{" "}
            <span className="font-semibold text-gray-900">
              {merchantNumber}
            </span>{" "}
            ({METHOD_META[payment].alt} Personal/Merchant), then enter the
            details below. Your order will be confirmed once we verify the
            payment.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Transaction ID
                <span className="ml-1 text-red-500">*</span>
              </label>
              <input
                type="text"
                name="transactionId"
                value={transactionId}
                onChange={onTransactionFieldChange}
                placeholder="e.g. 8N7A6X5B4C"
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-black"
              />
              {errors.transactionId && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.transactionId}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-gray-700">
                Number You Paid From
                <span className="ml-1 text-red-500">*</span>
              </label>
              <input
                type="tel"
                inputMode="numeric"
                name="senderNumber"
                value={senderNumber}
                onChange={onTransactionFieldChange}
                placeholder="01XXXXXXXXX"
                className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-black"
              />
              {errors.senderNumber && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.senderNumber}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
