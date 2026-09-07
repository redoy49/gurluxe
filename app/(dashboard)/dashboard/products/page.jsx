import Link from "next/link";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { getProducts } from "@/lib/queries/products";
import Image from "next/image";
import DeleteProductButton from "@/components/dashboard/DeleteProductButton";

export default async function ProductsPage({ searchParams }) {
  const { category } = await searchParams;
  const allProducts = await getProducts();

  const products = category
    ? allProducts.filter((p) => p.category?.slug === category)
    : allProducts;

  const categoryName = category
    ? (products[0]?.category?.name ?? category)
    : null;

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all of your store products.
          </p>
        </div>

        <Link
          href="/dashboard/products/add"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {category && (
        <div className="mb-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">Filtering by:</span>
          <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 py-1 pl-3 pr-1 text-sm font-medium text-gray-700">
            {categoryName}
            <Link
              href="/dashboard/products"
              className="rounded-full p-1 text-gray-400 transition hover:bg-gray-200 hover:text-gray-700"
              aria-label="Clear category filter"
            >
              <X size={14} />
            </Link>
          </span>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Product
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Category
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Price
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Stock
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b border-gray-100 last:border-none hover:bg-gray-50"
                >
                  {/* Product */}
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      {product.images?.[0]?.url && (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          width={64}
                          height={64}
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      )}

                      <div>
                        <h3 className="font-medium text-gray-900">
                          {product.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-500">
                          {product.slug}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="px-6 py-5 text-sm text-gray-700">
                    {product.category?.name}
                  </td>

                  {/* Price */}
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-medium text-gray-900">
                        ৳ {product.price}
                      </p>

                      <p className="text-sm text-gray-400 line-through">
                        ৳ {product.comparePrice}
                      </p>
                    </div>
                  </td>

                  {/* Stock */}
                  <td className="px-6 py-5">
                    <span className="text-sm font-medium text-gray-700">
                      {product.stock}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-5">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        product.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {product.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/dashboard/products/edit/${product._id}`}
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-blue-100 hover:text-blue-600"
                      >
                        <Pencil size={18} />
                      </Link>

                      <DeleteProductButton id={product._id.toString()} />
                    </div>
                  </td>
                </tr>
              ))}

              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-16 text-center text-gray-500"
                  >
                    {category
                      ? "No products in this category yet."
                      : "No products found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
