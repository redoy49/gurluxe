"use client";

import Image from "next/image";
import { Check } from "lucide-react";

export default function PaymentMethod({
  payment,
  setPayment,
}) {
  const methods = [
    {
      id: "cod",
      title: "Cash on Delivery",
      icon: "💵",
    },
    {
      id: "bkash",
      logo: "/payment/bkash.svg",
      alt: "bKash",
    },
    {
      id: "nagad",
      logo: "/payment/nagad.svg",
      alt: "Nagad",
    },
    {
      id: "rocket",
      logo: "/payment/rocket.svg",
      alt: "Rocket",
    },
    {
      id: "upay",
      logo: "/payment/upay.svg",
      alt: "Upay",
    },
  ];

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
                  src={method.logo}
                  alt={method.alt}
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

      {/* Payment Gateway Notice */}
      {payment !== "cod" && (
        <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="text-xs leading-5 text-gray-500">
            You will be redirected to the secure payment gateway
            after placing your order.
          </p>
        </div>
      )}
    </section>
  );
}