import Link from "next/link";
import FilterSidebar from "@/components/FilterSidebar";
import { getProducts } from "@/lib/queries/products";

export default async function ShopPage() {
  const products = await getProducts();

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
            Showing {products.length} Products
          </p>

          <select className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-gray-400">
            <option>Newest First</option>
            <option>Best Selling</option>
            <option>Price Low To High</option>
            <option>Price High To Low</option>
          </select>
        </div>

        {/* Product Grid */}
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

        {/* Pagination */}
        <div className="mt-12 flex justify-center gap-2">
          <button className="h-10 w-10 rounded-lg bg-black text-sm text-white">
            1
          </button>

          <button className="h-10 w-10 rounded-lg border border-gray-200 text-sm">
            2
          </button>

          <button className="h-10 w-10 rounded-lg border border-gray-200 text-sm">
            3
          </button>
        </div>
      </section>
    </div>
  );
}
