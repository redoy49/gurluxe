import { FaWhatsapp } from "react-icons/fa";

export default function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/8801795580257"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-20 right-4 lg:bottom-8 lg:right-8 bg-emerald-500 hover:bg-emerald-600 text-white w-12 h-12 lg:w-14 lg:h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-30 group"
      title="হোয়াটসঅ্যাপে চ্যাট করুন"
    >
      <FaWhatsapp className="text-2xl lg:text-3xl" />

      {/* Tooltip */}
      <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg opacity-0 invisible scale-95 translate-x-1 group-hover:opacity-100 group-hover:visible group-hover:scale-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none">
        Ask a Question
        <span className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-900"></span>
      </span>
    </a>
  );
}
