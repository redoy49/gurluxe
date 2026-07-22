import Link from "next/link";

export default function FeaturedProducts({ products }) {
  
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-[#2b1d28] md:text-5xl">
            Our Featured <span className="font-medium italic">Products</span>
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/shop/${product.slug}`}
              className="group w-full"
            >
              {/* Product Image */}
              <div className="overflow-hidden bg-white">
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="sm:h-75 md:h-85 lg:h-110 xl:h-120 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </div>

              {/* Product Info */}
              <div className="px-1 py-3">
                <p className="truncate text-[13px] font-medium text-gray-900">
                  {product.name}
                </p>

                <div className="mt-1 flex items-center gap-3">
                  <p className="text-[13px] text-gray-900">{product.price}</p>

                  <p className="text-[13px] text-gray-400 line-through">
                    {product.comparePrice}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/shop"
            className="rounded-full border border-gray-300 px-8 py-3 text-sm font-medium text-gray-900 transition duration-300 hover:border-pink-500 hover:text-pink-500"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
