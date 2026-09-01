"use client";

import { useState } from "react";
import { toast } from "sonner";
import QuantitySelector from "@/components/cart/QuantitySelector";

// The real WhatsApp/phone contact number already published in components/Footer.jsx
const CONTACT_PHONE_DIGITS = "8801234567890";

export default function ProductDetails({ product }) {
  const colorList = Array.isArray(product.colors)
    ? product.colors
    : product.colors
      ? [product.colors]
      : [];

  const [selectedColor, setSelectedColor] = useState(colorList[0] || null);
  const [quantity, setQuantity] = useState(1);

  const inStock = product.stock > 0;
  const maxQuantity = inStock ? product.stock : 1;

  const isBestSeller = product.flags?.bestSeller;
  const ratingAverage = product.rating?.average || 0;
  const ratingCount = product.rating?.count || 0;
  const soldCount = product.soldCount || 0;

  const showComparePrice = product.comparePrice > 0;
  const hasDiscount = product.comparePrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.comparePrice - product.price) / product.comparePrice) * 100,
      )
    : 0;

  const handleAddToCart = () => {
    toast.success("কার্টে যোগ করা হয়েছে!", {
      description: `আপনি ${quantity} টি পণ্য কার্টে যোগ করেছেন।`,
    });
  };

  const handleBuyNow = () => {
    toast.info("অর্ডার প্রসেসিং", {
      description: "খুব শীঘ্রই আপনাকে চেকআউট পেজে নিয়ে যাওয়া হবে।",
    });
  };

  return (
    <>
      <div className="flex flex-col justify-start space-y-5 lg:col-span-6">
        <div className="space-y-4">
          {/* BEST SELLER ব্যাজ ও স্টক স্ট্যাটাস */}
          <div className="flex flex-wrap items-center gap-2">
            {isBestSeller && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200/50 bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                <i className="fa-solid fa-star text-[10px] text-amber-500" />
                BEST SELLER
              </span>
            )}

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                inStock
                  ? "border-emerald-200/50 bg-emerald-50 text-emerald-700"
                  : "border-red-200/50 bg-red-50 text-red-700"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  inStock ? "animate-pulse bg-emerald-500" : "bg-red-500"
                }`}
              />
              {inStock ? "স্টকে আছে" : "স্টক শেষ"}
            </span>
          </div>

          {/* Product Title */}
          <h1 className="text-xl font-extrabold leading-snug tracking-tight text-slate-900 sm:text-2xl lg:text-3xl">
            {product.name}
          </h1>

          {/* Rating, Reviews & Sold Stats */}
          {(ratingCount > 0 || soldCount > 0) && (
            <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-600 sm:text-sm">
              {ratingCount > 0 && (
                <>
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <i
                        key={i}
                        className={
                          i < Math.round(ratingAverage)
                            ? "fa-solid fa-star"
                            : "fa-regular fa-star"
                        }
                      />
                    ))}
                  </div>

                  <span className="font-bold text-slate-900">
                    {ratingAverage.toFixed(1)}
                  </span>
                  <span className="text-slate-500">
                    ({ratingCount}টি রিভিউ)
                  </span>
                </>
              )}

              {ratingCount > 0 && soldCount > 0 && (
                <span className="text-slate-300">|</span>
              )}

              {soldCount > 0 && (
                <div className="flex items-center gap-1 font-medium text-slate-700">
                  <i className="fa-solid fa-fire text-orange-500" />
                  <span>{soldCount}+ বিক্রি হয়েছে</span>
                </div>
              )}
            </div>
          )}

          {/* প্রাইস সেকশন */}
          <div className="flex items-baseline gap-2.5">
            <span className="text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
              ৳{product.price}
            </span>

            {showComparePrice && (
              <span className="text-base font-medium text-slate-400 line-through">
                ৳{product.comparePrice}
              </span>
            )}

            {hasDiscount && (
              <span className="rounded-full border border-pink-100 bg-pink-50 px-2 py-0.5 text-[11px] font-bold text-pink-600">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* প্রডাক্ট সিলেক্টর অপশনস */}
          <div className="space-y-3.5 pt-1">
            {colorList.length > 0 && (
              <div className="flex items-center gap-3">
                <span className="min-w-[60px] text-sm font-bold text-slate-800">
                  কালার:
                </span>

                <div className="flex flex-wrap items-center gap-2">
                  {colorList.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      title={color}
                      style={{ backgroundColor: color }}
                      className={`flex h-7 w-7 cursor-pointer items-center justify-center rounded-full shadow-2xs transition-all ${
                        selectedColor === color
                          ? "border-2 border-white ring-2 ring-pink-600"
                          : "border border-slate-200/80 hover:scale-105"
                      }`}
                    >
                      {selectedColor === color && (
                        <i className="fa-solid fa-check text-[9px] text-white" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="min-w-[60px] text-sm font-bold text-slate-800">
                পরিমাণ:
              </span>

              <QuantitySelector
                quantity={quantity}
                onDecrease={() => setQuantity((qty) => Math.max(1, qty - 1))}
                onIncrease={() =>
                  setQuantity((qty) => Math.min(maxQuantity, qty + 1))
                }
                min={1}
                max={maxQuantity}
              />
            </div>
          </div>

          {/* একশন বাটনসমূহ */}
          <div className="max-w-md space-y-3 pt-1">
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={!inStock}
                onClick={handleAddToCart}
                className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-900 px-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
              >
                <i className="fa-solid fa-cart-shopping text-xs sm:text-sm" />
                <span>Add to Cart</span>
              </button>

              <button
                type="button"
                disabled={!inStock}
                onClick={handleBuyNow}
                className="flex h-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-pink-600 px-3 text-xs font-bold text-white shadow-md shadow-pink-200 transition-all hover:bg-pink-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
              >
                <i className="fa-solid fa-bolt text-xs sm:text-sm" />
                <span>Buy Now</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <a
                href={`tel:+${CONTACT_PHONE_DIGITS}`}
                className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-slate-100 px-3 text-xs font-bold text-slate-700 transition-all hover:bg-slate-200"
              >
                <i className="fa-solid fa-phone text-xs" />
                <span>কল করুন</span>
              </a>

              <a
                href={`https://wa.me/${CONTACT_PHONE_DIGITS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-emerald-50 py-2 text-xs font-bold text-emerald-600 transition-all hover:bg-emerald-100"
              >
                <i className="fa-brands fa-whatsapp text-lg" />
                <span>হোয়াটসঅ্যাপ মেসেজ</span>
              </a>
            </div>
          </div>
        </div>

        {/* ট্রাস্ট সার্ভিস ব্যাজ */}
        <div className="grid max-w-md grid-cols-3 gap-2.5 border-t border-slate-100 pt-3">
          <div className="flex flex-col items-center rounded-2xl border border-slate-100/80 p-2 text-center shadow-2xs">
            <i className="fa-solid fa-truck-fast mb-1 text-base text-pink-600" />
            <span className="text-xs font-bold text-slate-800">
              দ্রুত ডেলিভারি
            </span>
            <span className="text-[11px] text-slate-500">
              সারাদেশে হোম ডেলিভারি
            </span>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-slate-100/80 p-2 text-center shadow-2xs">
            <i className="fa-solid fa-rotate-left mb-1 text-base text-pink-600" />
            <span className="text-xs font-bold text-slate-800">
              সহজ রিটার্ন
            </span>
            <span className="text-[11px] text-slate-500">৭ দিনের পলিসি</span>
          </div>

          <div className="flex flex-col items-center rounded-2xl border border-slate-100/80 p-2 text-center shadow-2xs">
            <i className="fa-solid fa-shield-halved mb-1 text-base text-pink-600" />
            <span className="text-xs font-bold text-slate-800">১০০% আসল</span>
            <span className="text-[11px] text-slate-500">
              কোয়ালিটি গ্যারান্টি
            </span>
          </div>
        </div>
      </div>

      {/* মোবাইল ডিভাইসের জন্য ফিক্সড বাটন বার */}
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-100 bg-white/95 p-3 shadow-2xl backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-2.5">
          <button
            type="button"
            disabled={!inStock}
            onClick={handleAddToCart}
            className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-slate-900 px-3 text-xs font-bold text-white shadow-sm transition-all hover:bg-slate-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
          >
            <i className="fa-solid fa-cart-shopping text-sm" />
            <span className="whitespace-nowrap">Add to Cart</span>
          </button>

          <button
            type="button"
            disabled={!inStock}
            onClick={handleBuyNow}
            className="flex h-10 flex-1 cursor-pointer items-center justify-center gap-2 rounded-full bg-pink-600 px-3 text-xs font-bold text-white shadow-md shadow-pink-200 transition-all hover:bg-pink-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
          >
            <i className="fa-solid fa-bolt text-sm" />
            <span className="whitespace-nowrap">Buy Now</span>
          </button>
        </div>
      </div>

      {/* ফ্লোটিং হোয়াটসঅ্যাপ আইকন */}
      <a
        href={`https://wa.me/${CONTACT_PHONE_DIGITS}`}
        target="_blank"
        rel="noopener noreferrer"
        title="হোয়াটসঅ্যাপে চ্যাট করুন"
        className="group fixed bottom-20 right-4 z-30 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-emerald-600 active:scale-95 lg:bottom-8 lg:right-8 lg:h-14 lg:w-14"
      >
        <i className="fa-brands fa-whatsapp text-2xl lg:text-3xl" />
        <span className="absolute right-14 hidden whitespace-nowrap rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 sm:block">
          কথা বলুন
        </span>
      </a>
    </>
  );
}
