"use client";

import { normalizeColor } from "@/lib/utils/normalizeColor";

const BANGLA_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

function toBanglaDigits(number) {
  return number
    .toString()
    .split("")
    .map((digit) => BANGLA_DIGITS[digit] ?? digit)
    .join("");
}

export default function ProductOptions({
  product,
  selectedColor,
  onColorChange,
  selectedSize,
  onSizeChange,
  quantity,
  updateQty,
}) {
  // Colors are usually plain strings, but some products store { name, code } objects
  const colors = Array.isArray(product?.colors)
    ? product.colors
    : product?.colors
      ? [product.colors]
      : [];

  const sizes = Array.isArray(product?.sizes)
    ? product.sizes
    : product?.sizes
      ? [product.sizes]
      : [];

  const maxQty = product?.stock > 0 ? product.stock : 1;

  return (
    // প্রডাক্ট সিলেক্টর অপশনস
    <div className="space-y-3.5 pt-1">
      {/* পছন্দের কালার নির্বাচন */}
      {colors.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-800 min-w-15">
            কালার:
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            {colors.map((color) => {
              const { label, swatch } = normalizeColor(color);
              const isActive = selectedColor === label;

              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => onColorChange(label)}
                  className={`color-btn w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? "border-2 border-white ring-2 ring-pink-600 shadow-xs"
                      : "border border-slate-200/80 hover:scale-105 shadow-2xs"
                  }`}
                  style={{ backgroundColor: swatch }}
                  title={label}
                >
                  {isActive && (
                    <i className="fa-solid fa-check text-white text-[9px]"></i>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* সাইজ নির্বাচন */}
      {sizes.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-slate-800 min-w-15">
            সাইজ:
          </span>

          <div className="flex items-center gap-2">
            {sizes.map((size) => {
              const isActive = selectedSize === size;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => onSizeChange(size)}
                  className={`size-btn w-8 h-8 rounded-full text-xs font-bold flex items-center justify-center transition-all cursor-pointer font-en shrink-0 ${
                    isActive
                      ? "border-2 border-white ring-2 ring-pink-600 bg-pink-50 text-pink-600 shadow-xs"
                      : "border border-slate-200/80 hover:scale-105 shadow-2xs text-slate-700 bg-white"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* পরিমাণ */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-slate-800 min-w-15">
          পরিমাণ:
        </span>

        <div className="inline-flex items-center gap-1.5 bg-slate-100/80 p-0.5 rounded-full border border-slate-200/50">
          <button
            type="button"
            onClick={() => updateQty(-1, maxQty)}
            className="w-7 h-7 rounded-full bg-white shadow-2xs text-slate-600 hover:text-pink-600 flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer active:scale-95"
            aria-label="Decrease quantity"
          >
            <i className="fa-solid fa-minus"></i>
          </button>

          <span className="text-xs font-extrabold text-slate-900 font-en px-2.5 min-w-[24px] text-center">
            {toBanglaDigits(quantity)}
          </span>

          <button
            type="button"
            onClick={() => updateQty(1, maxQty)}
            className="w-7 h-7 rounded-full bg-white shadow-2xs text-slate-600 hover:text-pink-600 flex items-center justify-center text-[11px] font-bold transition-all cursor-pointer active:scale-95"
            aria-label="Increase quantity"
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        </div>
      </div>
    </div>
  );
}
