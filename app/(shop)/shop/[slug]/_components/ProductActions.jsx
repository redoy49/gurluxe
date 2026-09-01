export default function ProductActions({ addToCart, buyNow, inStock }) {
  return (
    // একশন বাটনসমূহ
    <div className="space-y-3 pt-1 max-w-md">
      {/* Primary Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={!inStock}
          onClick={addToCart}
          className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-bold h-10 px-3 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i className="fa-solid fa-cart-shopping text-xs sm:text-sm"></i>
          <span>Add to Cart</span>
        </button>

        <button
          type="button"
          disabled={!inStock}
          onClick={buyNow}
          className="w-full bg-pink-600 hover:bg-pink-700 active:scale-[0.98] text-white font-bold h-10 px-3 rounded-full text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-pink-200 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <i className="fa-solid fa-bolt text-xs sm:text-sm"></i>
          <span>Buy Now</span>
        </button>
      </div>

      {/* Secondary Chat Actions */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href="https://m.me/gurluxe"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-blue-50 text-messenger hover:bg-blue-100 font-bold h-9 px-3 rounded-full text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <i className="fa-brands fa-facebook-messenger text-sm"></i>
          <span>মেসেঞ্জারে চ্যাট করুন</span>
        </a>

        <a
          href="https://wa.me/8801795580257"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-bold h-9 py-2 rounded-full text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
        >
          <i className="fa-brands fa-whatsapp text-lg"></i>
          <span>হোয়াটসঅ্যাপ মেসেজ</span>
        </a>
      </div>
    </div>
  );
}
