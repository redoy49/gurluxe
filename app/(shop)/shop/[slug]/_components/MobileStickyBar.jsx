"use client";

import { useEffect, useState } from "react";

export default function MobileStickyBar() {
  const [showSticky, setShowSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Product action section পার হওয়ার পর sticky bar দেখাবে
      setShowSticky(window.scrollY > 960);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!showSticky) return null;

  return (
    // মোবাইল ডিভাইসের জন্য ফিক্সড বাটন বন্ড (Sticky Bottom Bar)
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200/80 p-3 md:hidden z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="max-w-md mx-auto flex items-center gap-2.5">
        <button
          type="button"
          className="flex-1 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold h-10 px-3 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <i className="fa-solid fa-cart-shopping text-sm"></i>
          <span className="whitespace-nowrap">Add to Cart</span>
        </button>

        <button
          type="button"
          className="flex-1 bg-pink-600 hover:bg-pink-700 active:scale-[0.98] text-white font-bold h-10 px-3 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-pink-200"
        >
          <i className="fa-solid fa-bolt text-sm"></i>
          <span className="whitespace-nowrap">Buy Now</span>
        </button>
      </div>
    </div>
  );
}
