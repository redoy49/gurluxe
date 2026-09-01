"use client";

import { toast } from "sonner";
import Breadcrumb from "./Breadcrumb";
import ProductGallery from "./ProductGallery";
import ProductSummary from "./ProductSummary";
import ProductOptions from "./ProductOptions";
import ProductActions from "./ProductActions";
import TrustBadges from "./TrustBadges";
import ProductTabs from "./ProductTabs";
import MobileStickyBar from "./MobileStickyBar";
import FloatingWhatsApp from "./FloatingWhatsApp";

// জাভাস্ক্রিপ্ট লজিক
let currentQty = 1;
let cartItemsCount = 2;

// ছবির থাম্বনেইল পরিবর্তন
function changeImage(src, btnElement) {
  document.getElementById("mainProductImage").src = src;
  document.querySelectorAll(".thumb-btn").forEach((btn) => {
    btn.classList.remove("border-pink-600");
    btn.classList.add("border-transparent");
  });
  btnElement.classList.remove("border-transparent");
  btnElement.classList.add("border-pink-600");
}

// পরিমাণ পরিবর্তন
function updateQty(change, maxQty = Infinity) {
  currentQty += change;
  if (currentQty < 1) currentQty = 1;
  if (currentQty > maxQty) currentQty = maxQty;

  const banglaNums = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  const convertedQty = currentQty
    .toString()
    .split("")
    .map((digit) => banglaNums[parseInt(digit)] || digit)
    .join("");

  document.getElementById("productQty").innerText = convertedQty;
}

// কার্টে যোগ করা
function addToCart() {
  cartItemsCount += currentQty;
  const cartBadge = document.getElementById("headerCartBadge");
  if (cartBadge) {
    const banglaNums = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    cartBadge.innerText = cartItemsCount
      .toString()
      .split("")
      .map((digit) => banglaNums[parseInt(digit)] || digit)
      .join("");
  }

  toast.success("কার্টে যোগ করা হয়েছে!", {
    description: `আপনি ${currentQty} টি ব্যাগ কার্টে যোগ করেছেন।`,
  });
}

// বাই নাও
function buyNow() {
  toast.info("অর্ডার পপআপ", {
    description: "খুব শীঘ্রই চেকআউট পেজে রিডাইরেক্ট করা হবে।",
  });
}

// ট্যাব সুইচিং লজিক
function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach((content) => {
    content.classList.add("hidden");
  });

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.className =
      "tab-btn font-semibold text-xs sm:text-sm md:text-base text-slate-500 hover:text-slate-800 pb-2.5 transition-all cursor-pointer truncate";
  });

  const activeContent = document.getElementById(`content-${tabId}`);
  if (activeContent) activeContent.classList.remove("hidden");

  const activeTab = document.getElementById(`tab-${tabId}`);
  if (activeTab) {
    activeTab.className =
      "tab-btn font-bold text-xs sm:text-sm md:text-base text-pink-600 border-b-2 border-pink-600 pb-2.5 transition-all cursor-pointer truncate";
  }
}

export default function ProductPage({ product }) {
  const inStock = (product?.stock || 0) > 0;

  return (
    <>
      {/* নেভিগেশন ব্রেডক্রাম্ব */}
      <Breadcrumb product={product} />

      {/* মেইন প্রডাক্ট কন্টেন্ট */}
      <main className="max-w-7xl mx-auto sm:px-6 py-3">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-stretch">
          <ProductGallery product={product} changeImage={changeImage} />

          {/* ডান পাশ: প্রডাক্ট ডিটেইলস ও অপশনস */}
          <div className="lg:col-span-6 flex flex-col justify-start space-y-5">
            <div className="space-y-4">
              <ProductSummary product={product} />
              <ProductOptions product={product} updateQty={updateQty} />
              <ProductActions
                addToCart={addToCart}
                buyNow={buyNow}
                inStock={inStock}
              />
            </div>

            <TrustBadges />
          </div>
        </div>

        <ProductTabs switchTab={switchTab} product={product} />
      </main>

      {/* মোবাইল ডিভাইসের জন্য ফিক্সড বাটন বার (Sticky Bottom Bar) */}
      <MobileStickyBar />

      <FloatingWhatsApp />
    </>
  );
}
