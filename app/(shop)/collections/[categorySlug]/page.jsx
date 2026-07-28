import Link from "next/link";
import FilterSidebar from "@/components/FilterSidebar";
import { getProductsByCategory } from "@/lib/queries/products";

export default async function CollectionPage({ params }) {
  const { categorySlug } = await params;

  const products = await getProductsByCategory(categorySlug);

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="hidden lg:block">
        <FilterSidebar />
      </aside>

      <section>
        <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h1 className="text-3xl font-bold">
              {products[0]?.category?.name || "Collection"}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Showing {products.length} Products
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="text-2xl font-semibold">No Products Found</h2>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {products.map((product) => (
              <Link
                key={product._id}
                href={`/shop/${product.slug}`}
                className="group"
              >
                <div className="overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={product.images[0]?.url}
                    alt={product.name}
                    className="aspect-[5/6.5] w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="pt-4">
                  <h3 className="text-sm font-medium text-[#2b1d28]">
                    {product.name}
                  </h3>

                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm font-semibold">
                      ৳ {product.price}
                    </span>

                    {product.comparePrice > 0 && (
                      <span className="text-sm text-gray-400 line-through">
                        ৳ {product.comparePrice}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}