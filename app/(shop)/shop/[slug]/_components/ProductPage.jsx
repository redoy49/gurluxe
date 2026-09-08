"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/CartProvider";
import { normalizeColor } from "@/lib/utils/normalizeColor";
import Breadcrumb from "./Breadcrumb";
import ProductGallery from "./ProductGallery";
import ProductSummary from "./ProductSummary";
import ProductOptions from "./ProductOptions";
import ProductActions from "./ProductActions";
import TrustBadges from "./TrustBadges";
import ProductTabs from "./ProductTabs";
import MobileStickyBar from "./MobileStickyBar";
import FloatingWhatsApp from "./FloatingWhatsApp";

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
  const maxQty = inStock ? product.stock : 1;

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    normalizeColor(product?.colors?.[0]).label || null,
  );
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || null);

  const { addItem } = useCart();
  const router = useRouter();

  // পরিমাণ পরিবর্তন
  function updateQty(change, max = maxQty) {
    setQuantity((qty) => Math.min(max, Math.max(1, qty + change)));
  }

  function buildCartItem() {
    return {
      productId: product._id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      image: product.images?.[0]?.url || "",
      color: selectedColor,
      size: selectedSize,
      price: product.price,
      quantity,
    };
  }

  // কার্টে যোগ করা
  function addToCart() {
    addItem(buildCartItem());
  }

  // বাই নাও: কার্টে যোগ করে সরাসরি চেকআউটে নিয়ে যাওয়া
  async function buyNow() {
    const result = await addItem(buildCartItem());

    if (result?.success) {
      router.push("/checkout");
    }
  }

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
              <ProductOptions
                product={product}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                quantity={quantity}
                updateQty={updateQty}
              />
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
      <MobileStickyBar
        addToCart={addToCart}
        buyNow={buyNow}
        inStock={inStock}
      />

      <FloatingWhatsApp />
    </>
  );
}
