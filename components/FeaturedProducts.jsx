import Link from "next/link";

const products = [
  {
    id: 1,
    name: "Eve Micro Bag",
    image: "/products/featured/product-1.jpg",
    price: "৳ 1,949",
    oldPrice: "৳ 2,999",
  },
  {
    id: 2,
    name: "Effie Shoulder Bag",
    image: "/products/featured/product-2.jpg",
    price: "৳ 2,599",
    oldPrice: "৳ 3,999",
  },
  {
    id: 3,
    name: "Mindy Crossbody Bag",
    image: "/products/featured/product-3.jpg",
    price: "৳ 2,299",
    oldPrice: "৳ 3,499",
  },
  {
    id: 4,
    name: "Luxe Tote Bag",
    image: "/products/featured/product-4.jpg",
    price: "৳ 3,199",
    oldPrice: "৳ 4,499",
  },
  {
    id: 5,
    name: "Classic Satchel",
    image: "/products/featured/product-5.jpg",
    price: "৳ 2,899",
    oldPrice: "৳ 3,999",
  },
  {
    id: 6,
    name: "Premium Hand Bag",
    image: "/products/featured/product-6.jpg",
    price: "৳ 3,499",
    oldPrice: "৳ 4,999",
  },
  {
    id: 7,
    name: "Luxury Sling Bag",
    image: "/products/featured/product-7.jpg",
    price: "৳ 2,499",
    oldPrice: "৳ 3,699",
  },
  {
    id: 8,
    name: "Daily Tote",
    image: "/products/featured/product-8.jpg",
    price: "৳ 2,799",
    oldPrice: "৳ 3,899",
  },
];

export default function FeaturedProducts() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-[#2b1d28] md:text-5xl">
            Our Featured{" "}
            <span className="font-medium italic">Products</span>
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/featured/${product.id}`}
              className="group w-full"
            >
              {/* Product Image */}
              <div className="overflow-hidden bg-white">
                <img
                  src={product.image}
                  alt={product.name}
                  className="sm:h-75 md:h-85 lg:h-110 xl:h-120 w-full object-cover transition duration-500 group-hover:scale-[1.02] rounded-xl"
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
                    {product.oldPrice}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="mt-12 flex justify-center">
          <Link
            href="/products"
            className="rounded-full border border-gray-300 px-8 py-3 text-sm font-medium text-gray-900 transition duration-300 hover:border-pink-500 hover:text-pink-500"
          >
            View All Products
          </Link>
        </div>
      </div>
    </section>
  );
}
