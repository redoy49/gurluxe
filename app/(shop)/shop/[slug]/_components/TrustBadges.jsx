export default function TrustBadges() {
  return (
    // ট্রাস্ট সার্ভিস ব্যাজ
    <div className="grid grid-cols-3 gap-2.5 pt-3 border-t border-slate-100 max-w-md">
      <div className="flex flex-col items-center text-center p-2 rounded-2xl bg-white border border-slate-100/80 shadow-2xs">
        <i className="fa-solid fa-truck-fast text-pink-600 text-base mb-1"></i>
        <span className="text-xs font-bold text-slate-800">দ্রুত ডেলিভারি</span>
        <span className="text-[11px] text-slate-500">
          সারাদেশে হোম ডেলিভারি
        </span>
      </div>
      <div className="flex flex-col items-center text-center p-2 rounded-2xl bg-white border border-slate-100/80 shadow-2xs">
        <i className="fa-solid fa-rotate-left text-pink-600 text-base mb-1"></i>
        <span className="text-xs font-bold text-slate-800">সহজ রিটার্ন</span>
        <span className="text-[11px] text-slate-500">৭ দিনের পলিসি</span>
      </div>
      <div className="flex flex-col items-center text-center p-2 rounded-2xl bg-white border border-slate-100/80 shadow-2xs">
        <i className="fa-solid fa-shield-halved text-pink-600 text-base mb-1"></i>
        <span className="text-xs font-bold text-slate-800">১০০% আসল</span>
        <span className="text-[11px] text-slate-500">কোয়ালিটি গ্যারান্টি</span>
      </div>
    </div>
  );
}
