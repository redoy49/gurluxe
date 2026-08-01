"use client";

import { Minus, Plus } from "lucide-react";

export default function QuantitySelector({
  quantity,
  onDecrease,
  onIncrease,
  min = 1,
  max = 99,
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={onDecrease}
        disabled={quantity <= min}
        aria-label="Decrease quantity"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:border-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus size={15} strokeWidth={2.2} />
      </button>

      <span className="min-w-[24px] text-center text-xs font-medium text-gray-900">
        {quantity}
      </span>

      <button
        type="button"
        onClick={onIncrease}
        disabled={quantity >= max}
        aria-label="Increase quantity"
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-300 text-gray-700 transition hover:border-gray-900 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus size={15} strokeWidth={2.2} />
      </button>
    </div>
  );
}
