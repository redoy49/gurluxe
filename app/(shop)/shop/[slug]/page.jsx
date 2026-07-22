import Link from "next/link";
import { getProductBySlug } from "@/lib/queries/products";

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
      </div>
    );
  }

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-8 text-sm text-gray-500">
        <Link href="/" className="hover:text-black">
          Home
        </Link>

        <span className="mx-2">/</span>

        <Link href="/shop" className="hover:text-black">
          Shop
        </Link>

        <span className="mx-2">/</span>

        <span className="text-black">{product.name}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="overflow-hidden rounded-xl bg-gray-100">
            <img
              src={product.images?.[0]?.url || "/placeholder.jpg"}
              alt={product.images?.[0]?.alt || product.name}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>

          {product.images?.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  className="overflow-hidden rounded-lg border border-gray-200"
                >
                  <img
                    src={image.url}
                    alt={image.alt || product.name}
                    className="aspect-square w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <h1 className="text-3xl font-bold text-[#2b1d28]">{product.name}</h1>

          <div className="mt-4 flex items-center gap-3">
            <span className="text-3xl font-bold">৳ {product.price}</span>

            {product.comparePrice > 0 && (
              <span className="text-lg text-gray-400 line-through">
                ৳ {product.comparePrice}
              </span>
            )}
          </div>

          <p className="mt-6 leading-7 text-gray-600">{product.description}</p>

          {/* Stock */}
          <div className="mt-6">
            <span className="font-medium">Availability:</span>{" "}
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock})</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          {/* Category */}
          <div className="mt-3">
            <span className="font-medium">Category:</span>{" "}
            {product.category?.name}
          </div>

          {/* Material */}
          <div className="mt-3">
            <span className="font-medium">Material:</span>{" "}
            {Array.isArray(product.materials)
              ? product.materials.join(", ")
              : product.materials}
          </div>

          {/* SKU */}
          <div className="mt-3">
            <span className="font-medium">SKU:</span> {product.sku}
          </div>

          {/* Colors */}
          {product.colors?.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 font-semibold">Available Colors</h3>

              <div className="flex flex-wrap gap-3">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm transition hover:border-black"
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-8">
            <h3 className="mb-3 font-semibold">Quantity</h3>

            <div className="flex w-fit items-center rounded-lg border">
              <button className="px-4 py-2">−</button>

              <span className="px-6">1</span>

              <button className="px-4 py-2">+</button>
            </div>
          </div>

          {/* Buttons */}
          <div className="mt-10 flex flex-wrap gap-4">
            <button className="rounded-lg bg-black px-8 py-3 font-medium text-white transition hover:bg-gray-800">
              Add to Cart
            </button>

            <button className="rounded-lg border border-black px-8 py-3 font-medium transition hover:bg-black hover:text-white">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <section className="mt-20 border-t pt-10">
        <h2 className="mb-4 text-2xl font-bold">Product Description</h2>

        <p className="max-w-4xl leading-8 text-gray-600">
          {product.description}
        </p>
      </section>
    </div>
  );
}
