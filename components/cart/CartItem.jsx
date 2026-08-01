"use client";

import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";
import QuantitySelector from "./QuantitySelector";

export default function CartItem({ cartItems }) {
  const [items, setItems] = useState(cartItems);

  const increaseQuantity = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = (id) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(1, item.quantity - 1),
            }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (items.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl border border-gray-200">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Your cart is empty
          </h2>

          <p className="mt-2 text-xs text-gray-500">
            Continue shopping to add products.
          </p>

          <Link
            href="/shop"
            className="mt-7 inline-flex rounded-full bg-black px-7 py-3 text-xs font-medium text-white transition hover:bg-gray-800"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="hidden grid-cols-12 border-b border-gray-200 pb-4 text-[10px] font-medium uppercase tracking-[0.14em] text-gray-400 lg:grid">
        <div className="col-span-5 pl-1">Product</div>
        <div className="col-span-2">Price</div>
        <div className="col-span-3 pl-1">Quantity</div>
        <div className="col-span-2 pl-1">Total</div>
      </div>

      <div>
        {items.map((item) => (
          <div
            key={item.id}
            className="border-b border-gray-100 py-6 lg:grid lg:grid-cols-12 lg:items-center"
          >
            {/* Product */}
            <div className="col-span-5 flex gap-4">
              <Link
                href={`/shop/${item.slug}`}
                className="h-16 w-16 shrink-0 bg-gray-50"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-16 w-16 object-cover"
                />
              </Link>

              <div className="flex flex-col justify-center space-y-1">
                <Link
                  href={`/shop/${item.slug}`}
                  className="text-sm font-medium text-gray-900 transition hover:text-black"
                >
                  {item.name}
                </Link>

                <p className="text-[11px] text-gray-400">SKU: {item.sku}</p>

                <p className="text-[11px] text-gray-500">
                  Color:
                  <span className="ml-1 text-gray-900">{item.color}</span>
                </p>
              </div>
            </div>

            {/* Price */}
            <div className="col-span-2 mt-4 lg:mt-0">
              <p className="text-xs font-medium text-gray-900">
                ৳ {item.price.toLocaleString()}
              </p>
            </div>

            {/* Quantity */}
            <div className="col-span-3 mt-4 lg:mt-0">
              <QuantitySelector
                quantity={item.quantity}
                onDecrease={() => decreaseQuantity(item.id)}
                onIncrease={() => increaseQuantity(item.id)}
              />
            </div>

            {/* Total */}
            <div className="col-span-2 mt-4 flex items-center justify-between lg:mt-0 lg:justify-start lg:gap-4">
              <p className="text-xs font-semibold text-gray-900">
                ৳ {(item.price * item.quantity).toLocaleString()}
              </p>

              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label="Remove item"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-500 transition hover:border-red-400 hover:bg-red-50 hover:text-red-500"
              >
                <X size={16} strokeWidth={2.2} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
