import { FaFireFlameCurved } from "react-icons/fa6";
import { MdOutlineStar } from "react-icons/md";

export default function ProductSummary({ product }) {
  const isBestSeller = Boolean(product?.flags?.bestSeller);
  const inStock = (product?.stock || 0) > 0;

  const ratingAverage = product?.rating?.average || 0;
  const ratingCount = product?.rating?.count || 0;
  const soldCount = product?.soldCount || 0;

  const price = product?.price ?? 0;
  const comparePrice = product?.comparePrice ?? 0;
  const hasDiscount = comparePrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((comparePrice - price) / comparePrice) * 100)
    : 0;

  return (
    <>
      {/* BEST SELLER ব্যাজ, টাইটেল, রেটিং ও সেলস কাউন্ট */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            {/* BEST SELLER Tag */}
            {isBestSeller && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-bold font-en border border-amber-200/50">
                <MdOutlineStar className="text-amber-500 text-[18px]" />
                BEST SELLER
              </span>
            )}

            {/* স্টক স্ট্যাটাস */}
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                inStock
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200/50"
                  : "bg-red-50 text-red-700 border-red-200/50"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  inStock ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                }`}
              ></span>
              {inStock ? "স্টকে আছে" : "স্টক শেষ"}
            </span>
          </div>
        </div>

        {/* Product Title */}
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 leading-snug font-en tracking-tight">
          {product?.name}
        </h1>

        {/* Rating, Reviews & Sold Stats */}
        {(ratingCount > 0 || soldCount > 0) && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-slate-600 font-en">
            {ratingCount > 0 && (
              <>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const rating = ratingAverage;
                    const fillPercentage =
                      Math.min(Math.max(rating - i, 0), 1) * 100;

                    return (
                      <div key={i} className="relative">
                        {/* Outline */}
                        <MdOutlineStar className="text-[18px] text-gray-300" />

                        {/* Filled portion */}
                        {fillPercentage > 0 && (
                          <div
                            className="absolute inset-0 overflow-hidden"
                            style={{ width: `${fillPercentage}%` }}
                          >
                            <MdOutlineStar className="text-[18px] text-amber-500" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <span className="font-bold text-slate-900">
                  {ratingAverage.toFixed(1)}
                </span>
                <span className="text-slate-500">({ratingCount} টি রিভিউ)</span>
              </>
            )}

            {ratingCount > 0 && soldCount > 0 && (
              <span className="text-slate-300">|</span>
            )}

            {soldCount > 0 && (
              <div className="flex justify-center gap-1 font-medium text-slate-700">
                <FaFireFlameCurved className="text-orange-500 text-base" />
                <span>{soldCount}+ sold this week</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* প্রাইস সেকশন */}
      <div className="flex items-baseline gap-2.5">
        <span
          id="unitPrice"
          className="text-2xl sm:text-3xl font-black text-slate-900 font-en tracking-tight"
        >
          ৳{price}
        </span>
        {comparePrice > 0 && (
          <span className="text-base text-slate-400 line-through font-en font-medium">
            ৳{comparePrice}
          </span>
        )}
        {hasDiscount && (
          <span className="text-[11px] font-bold text-pink-600 bg-pink-50 border border-pink-100 px-2 py-0.5 rounded-full font-en">
            {discountPercent}% OFF
          </span>
        )}
      </div>
    </>
  );
}
