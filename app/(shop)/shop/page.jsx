import Link from "next/link";
import { PackageSearch } from "lucide-react";
import FilterSidebar from "@/components/FilterSidebar";
import SortSelect from "@/components/SortSelect";
import { getProducts } from "@/lib/queries/products";
import { PRICE_RANGES, SHOP_PAGE_SIZE } from "@/lib/constants/filters";

function applyFilters(products, { categories, priceRanges, availability }) {
  return products.filter((product) => {
    if (categories.length > 0 && !categories.includes(product.category?.slug)) {
      return false;
    }

    if (priceRanges.length > 0) {
      const inRange = priceRanges.some((rangeId) => {
        const range = PRICE_RANGES.find((r) => r.id === rangeId);
        if (!range) return false;
        return (
          product.price >= range.min &&
          (range.max === null || product.price <= range.max)
        );
      });
      if (!inRange) return false;
    }

    if (availability.length > 0) {
      const inStock = (product.stock || 0) > 0;
      const matches =
        (availability.includes("in") && inStock) ||
        (availability.includes("out") && !inStock);
      if (!matches) return false;
    }

    return true;
  });
}

function sortProducts(products, sort) {
  const sorted = [...products];

  switch (sort) {
    case "bestselling":
      return sorted.sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0));
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
    default:
      return sorted.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
      );
  }
}

export default async function ShopPage({ searchParams }) {
  const params = await searchParams;
  const categories = params.category?.split(",").filter(Boolean) || [];
  const priceRanges = params.price?.split(",").filter(Boolean) || [];
  const availability = params.availability?.split(",").filter(Boolean) || [];
  const sort = params.sort || "newest";
  const page = Math.max(1, Number(params.page) || 1);

  const allProducts = await getProducts();
  const filtered = applyFilters(allProducts, { categories, priceRanges, availability });
  const sorted = sortProducts(filtered, sort);

  const totalPages = Math.max(1, Math.ceil(sorted.length / SHOP_PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const products = sorted.slice(
    (currentPage - 1) * SHOP_PAGE_SIZE,
    currentPage * SHOP_PAGE_SIZE,
  );

  function pageHref(targetPage) {
    const next = new URLSearchParams(params);
    next.set("page", String(targetPage));
    return `/shop?${next.toString()}`;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <aside className="hidden lg:block">
        <FilterSidebar />
      </aside>

      {/* Shop Content */}
      <section>
        {/* Top Bar */}
        <div className="mb-8 flex flex-col gap-4 border-b border-gray-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-sans text-sm text-gray-500">
            Showing {sorted.length === 0 ? 0 : (currentPage - 1) * SHOP_PAGE_SIZE + 1}
            {"–"}
            {Math.min(currentPage * SHOP_PAGE_SIZE, sorted.length)} of{" "}
            {sorted.length} Products
          </p>

          <SortSelect />
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-200 py-24 text-center">
            <PackageSearch className="h-10 w-10 text-gray-300" />
            <p className="text-lg font-medium text-gray-900">No products match these filters</p>
            <Link
              href="/shop"
              className="mt-2 rounded-full border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-900 transition hover:border-pink-500 hover:text-pink-500"
            >
              Clear Filters
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/shop/${product.slug}`}
                className="group"
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={product.images[0]?.url}
                    alt={product.images[0]?.alt || product.name}
                    className="aspect-[5/6.5] w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Wishlist */}
                  <button
                    type="button"
                    className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow-sm"
                  >
                    ♡
                  </button>
                </div>

                {/* Content */}
                <div className="pt-4">
                  <h3 className="font-sans text-sm font-medium text-[#2b1d28]">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="font-sans text-sm font-semibold text-black">
                      ৳ {product.price}
                    </span>

                    {product.comparePrice > 0 && (
                      <span className="font-sans text-sm text-gray-400 line-through">
                        ৳ {product.comparePrice}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Link
                key={p}
                href={pageHref(p)}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm transition ${
                  p === currentPage
                    ? "bg-black text-white"
                    : "border border-gray-200 hover:border-gray-400"
                }`}
              >
                {p}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
