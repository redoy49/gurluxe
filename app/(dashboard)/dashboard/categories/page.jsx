import Image from "next/image";
import Link from "next/link";
import { FolderTree, Package } from "lucide-react";
import { getCategoryStats } from "@/lib/queries/categories";

function currency(value) {
  return `৳ ${Math.round(value).toLocaleString("en-US")}`;
}

export default async function CategoriesPage() {
  const categories = await getCategoryStats();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
        <p className="mt-1 text-sm text-gray-500">
          How your catalog breaks down by category.
        </p>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white py-16 text-center text-gray-500">
          No categories yet.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/dashboard/products?category=${category.slug}`}
              className="group overflow-hidden rounded-xl border border-gray-200 bg-white transition hover:border-gray-300 hover:shadow-sm"
            >
              <div className="relative h-32 w-full bg-gray-100">
                {category.image ? (
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    sizes="400px"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gray-300">
                    <FolderTree className="h-10 w-10" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">
                    {category.name}
                  </h3>

                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                    <Package className="h-3 w-3" />
                    {category.totalProducts}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-gray-400">Active</p>
                    <p className="mt-0.5 font-medium text-gray-900">
                      {category.activeProducts}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">In stock</p>
                    <p className="mt-0.5 font-medium text-gray-900">
                      {category.totalStock.toLocaleString()} units
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Avg. price</p>
                    <p className="mt-0.5 font-medium text-gray-900">
                      {currency(category.avgPrice)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400">Inventory value</p>
                    <p className="mt-0.5 font-medium text-gray-900">
                      {currency(category.inventoryValue)}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
