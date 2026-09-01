import Link from "next/link";

export default function Breadcrumb({ product }) {
  const categoryName = product?.category?.name;
  const categorySlug = product?.category?.slug;

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 pb-2 text-xs text-slate-600 font-medium">
      <div className="flex items-center gap-2 flex-wrap">
        <Link href="/" className="hover:text-pink-600 transition-colors">
          হোম
        </Link>
        <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
        {categoryName && (
          <>
            <Link
              href={categorySlug ? `/collections/${categorySlug}` : "/shop"}
              className="hover:text-pink-600 transition-colors"
            >
              {categoryName}
            </Link>
            <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
          </>
        )}
        <span className="text-slate-900 font-semibold truncate">
          {product?.name}
        </span>
      </div>
    </nav>
  );
}
