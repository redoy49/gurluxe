"use client";

import { useState, useTransition } from "react";
import { Tag, X } from "lucide-react";
import { applyCoupon } from "@/app/(shop)/checkout/actions";

export default function CouponInput({ applied, onApply, onRemove }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleApply(e) {
    e.preventDefault();
    if (!code.trim()) return;

    setError("");

    startTransition(async () => {
      const result = await applyCoupon(code);

      if (result.success) {
        onApply({ code: result.code, discount: result.discount });
        setCode("");
      } else {
        setError(result.message);
      }
    });
  }

  if (applied) {
    return (
      <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 px-4 py-3">
        <div className="flex items-center gap-2 text-sm text-green-700">
          <Tag size={14} />
          <span className="font-medium">{applied.code}</span>
          <span className="text-green-600">applied</span>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-green-700 transition hover:text-green-900"
          aria-label="Remove coupon"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleApply} className="space-y-1.5">
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Coupon code"
          className="h-10 flex-1 rounded-lg border border-gray-300 px-3 text-sm uppercase outline-none transition focus:border-black"
        />
        <button
          type="submit"
          disabled={isPending || !code.trim()}
          className="h-10 shrink-0 rounded-lg border border-gray-900 px-4 text-xs font-medium text-gray-900 transition hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isPending ? "Checking..." : "Apply"}
        </button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </form>
  );
}
