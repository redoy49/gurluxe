import Link from "next/link";

export default function BestSellers({ products }) {
  if (!products || products.length === 0) return null;

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-[#2b1d28] md:text-5xl">
            Our Most Loved{" "}
            <span className="font-medium italic">Best Sellers</span>
          </h2>
        </div>

        {/* Layout */}
        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          {/* Left Large Product */}
          <Link
            href={`/shop/${products[0].slug}`}
            className="group relative block overflow-hidden"
          >
            <img
              src={products[0].images[0].url}
              alt={products[0].name}
              className="h-[500px] w-full object-cover transition duration-700 group-hover:scale-105 lg:h-[650px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

            <div className="absolute bottom-6 left-6">
              <p className="mb-2 text-sm uppercase tracking-[0.2em] text-white/80">
                Best Seller
              </p>

              <h3 className="text-2xl font-bold text-white md:text-3xl">
                {products[0].name}
              </h3>

              <p className="mt-2 text-lg text-white">৳ {products[0].price}</p>

              <span className="mt-4 inline-flex border border-white px-5 py-2 text-sm text-white transition hover:bg-white hover:text-black">
                Shop Now
              </span>
            </div>
          </Link>

          {/* Right Products */}
          <div className="grid gap-4">
            {products.slice(1).map((product) => (
              <Link
                key={product._id}
                href={`/shop/${product.slug}`}
                className="group relative block overflow-hidden"
              >
                <img
                  src={product.images[0].url}
                  alt={product.name}
                  className="h-[240px] w-full object-cover transition duration-700 group-hover:scale-105 lg:h-[317px]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                <div className="absolute bottom-5 left-5">
                  <p className="text-xs uppercase tracking-[0.2em] text-white/80">
                    Top Rated
                  </p>

                  <h3 className="mt-1 text-xl font-semibold text-white">
                    {product.name}
                  </h3>

                  <p className="mt-1 text-white">৳ {product.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Button */}
        <div className="mt-12 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center rounded-full border border-black px-8 py-3 text-sm font-medium uppercase tracking-wider transition hover:bg-black hover:text-white"
          >
            View All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}


// here is my best seller 

// import Link from "next/link";

// export default function BestSellers({products}) {
//   return (
//     <section className="bg-white py-16">
//       <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
//         {/* Heading */}
//         <div className="mb-16 text-center">
//           <h2 className="text-3xl font-bold text-[#2b1d28] md:text-5xl">
//             Our Most Loved{" "}
//             <span className="font-medium italic">Best Sellers</span>
//           </h2>
//         </div>

//         {/* Layout */}
//         <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
//           {/* Left Large Product */}
//           <Link
//             href={products[0].href}
//             className="group relative block overflow-hidden"
//           >
//             <img
//               src={product.images[0].url}
//               alt={products[0].name}
//               className="h-[500px] w-full object-contain transition duration-700 group-hover:scale-105 lg:h-[650px]"
//             />

//             <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

//             <div className="absolute bottom-6 left-6">
//               <p className="mb-2 text-sm uppercase tracking-[0.2em] text-white/80">
//                 Best Seller
//               </p>

//               <h3 className="text-2xl font-bold text-white md:text-3xl">
//                 {products[0].name}
//               </h3>

//               <p className="mt-2 text-lg text-white">{products[0].price}</p>

//               <span className="mt-4 inline-flex border border-white px-5 py-2 text-sm text-white transition hover:bg-white hover:text-black">
//                 Shop Now
//               </span>
//             </div>
//           </Link>

//           {/* Right Products */}
//           <div className="grid gap-4">
//             {products.slice(1).map((product) => (
//               <Link
//                 key={product.id}
//                 href={product.href}
//                 className="group relative block overflow-hidden"
//               >
//                 <img
//                   src={product.image}
//                   alt={product.name}
//                   className="h-[240px] w-full object-contain transition duration-700 group-hover:scale-105 lg:h-[317px]"
//                 />

//                 <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

//                 <div className="absolute bottom-5 left-5">
//                   <p className="text-xs uppercase tracking-[0.2em] text-white/80">
//                     Top Rated
//                   </p>

//                   <h3 className="mt-1 text-xl font-semibold text-white">
//                     {product.name}
//                   </h3>

//                   <p className="mt-1 text-white">{product.price}</p>
//                 </div>
//               </Link>
//             ))}
//           </div>
//         </div>

//         {/* Button */}
//         <div className="mt-12 text-center">
//           <Link
//             href="/products/best-sellers"
//             className="inline-flex items-center justify-center rounded-full border border-black px-8 py-3 text-sm font-medium uppercase tracking-wider transition hover:bg-black hover:text-white"
//           >
//             View All Best Sellers
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }
