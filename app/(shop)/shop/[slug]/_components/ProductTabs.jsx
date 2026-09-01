export default function ProductTabs({ switchTab, product }) {
  const ratingAverage = product?.rating?.average || 0;
  const ratingCount = product?.rating?.count || 0;
  const materials = Array.isArray(product?.materials)
    ? product.materials.join(", ")
    : product?.materials;

  return (
    // ট্যাব সেকশন
    <div className="mt-10 bg-white rounded-2xl border border-slate-100 shadow-sm p-4 sm:p-7">
      <div className="flex items-center gap-6 sm:gap-8 border-b border-slate-100 overflow-x-auto custom-scrollbar">
        <button
          type="button"
          onClick={() => switchTab("description")}
          id="tab-description"
          className="tab-btn font-bold text-xs sm:text-sm md:text-base text-pink-600 border-b-2 border-pink-600 pb-2.5 transition-all cursor-pointer shrink-0"
        >
          বিবরণ
        </button>
        <button
          type="button"
          onClick={() => switchTab("specifications")}
          id="tab-specifications"
          className="tab-btn font-semibold text-xs sm:text-sm md:text-base text-slate-500 hover:text-slate-800 pb-2.5 transition-all cursor-pointer shrink-0"
        >
          স্পেসিফিকেশন
        </button>
        <button
          type="button"
          onClick={() => switchTab("reviews")}
          id="tab-reviews"
          className="tab-btn font-semibold text-xs sm:text-sm md:text-base text-slate-500 hover:text-slate-800 pb-2.5 transition-all cursor-pointer shrink-0"
        >
          রিভিউ (<span className="font-en">{ratingCount}</span>)
        </button>
        <button
          type="button"
          onClick={() => switchTab("delivery")}
          id="tab-delivery"
          className="tab-btn font-semibold text-xs sm:text-sm md:text-base text-slate-500 hover:text-slate-800 pb-2.5 transition-all cursor-pointer shrink-0"
        >
          ডেলিভারি
        </button>
      </div>

      {/* ট্যাব কন্টেন্ট */}
      <div className="pt-6 text-xs sm:text-sm text-slate-600 leading-relaxed">
        {/* বিবরন */}
        <article id="content-description" className="tab-content space-y-4">
          {product?.shortDescription && (
            <p className="text-slate-800 font-semibold leading-relaxed text-xs sm:text-sm">
              {product.shortDescription}
            </p>
          )}
          <p className="text-slate-700 leading-relaxed text-xs sm:text-sm whitespace-pre-line">
            {product?.description}
          </p>
        </article>

        {/* স্পেসিফিকেশন */}
        <div
          id="content-specifications"
          className="tab-content hidden space-y-2"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
            <div className="flex justify-between p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
              <span className="font-semibold text-slate-700">ব্র্যান্ড:</span>
              <span className="font-en font-medium">Gurluxe</span>
            </div>
            {materials && (
              <div className="flex justify-between p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                <span className="font-semibold text-slate-700">
                  ম্যাটেরিয়াল:
                </span>
                <span className="font-medium">{materials}</span>
              </div>
            )}
            {product?.category?.name && (
              <div className="flex justify-between p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                <span className="font-semibold text-slate-700">ক্যাটাগরি:</span>
                <span className="font-medium">{product.category.name}</span>
              </div>
            )}
            {product?.sku && (
              <div className="flex justify-between p-3 bg-slate-50/70 rounded-2xl border border-slate-100">
                <span className="font-semibold text-slate-700">SKU:</span>
                <span className="font-en font-medium">{product.sku}</span>
              </div>
            )}
          </div>
        </div>

        {/* কাস্টমার রিভিউ */}
        <div id="content-reviews" className="tab-content hidden space-y-4">
          {ratingCount > 0 ? (
            <div className="bg-slate-50/80 p-5 rounded-2xl flex items-center justify-between gap-4 max-w-xl border border-slate-100">
              <div>
                <span className="text-3xl font-black text-slate-900 font-en">
                  {ratingAverage.toFixed(1)}
                </span>
                <span className="text-xs text-slate-400 font-en">/ 5.0</span>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  {ratingCount}টি কাস্টমার ফিডব্যাক এর ভিত্তিতে
                </p>
              </div>
              <div className="flex text-amber-400 text-base">
                {Array.from({ length: 5 }).map((_, i) => (
                  <i
                    key={i}
                    className={
                      i < Math.round(ratingAverage)
                        ? "fa-solid fa-star"
                        : "fa-regular fa-star"
                    }
                  ></i>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-100 max-w-xl text-center text-slate-500">
              এখনো কোনো রিভিউ নেই। প্রথম রিভিউ দিন!
            </div>
          )}
        </div>

        {/* ডেলিভারি ও রিটার্ন */}
        <div id="content-delivery" className="tab-content hidden space-y-4">
          <div className="p-4 bg-pink-50/40 rounded-2xl border border-pink-100/50 max-w-xl">
            <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-2">
              ডেলিভারি পলিসি ও চার্জ:
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 mb-1">
              ঢাকার ভেতরে: ৳৬০ টাকা (২৪-৪৮ ঘন্টা)
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              ঢাকার বাহিরে: ৳১২০ টাকা (২-৩ কার্যদিবস)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
