"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

// const products = [
//   {
//     id: 1,
//     name: "New Eve Micro Bag",
//     image: "/products/new-arrivals/new-1.jpg",
//     price: "৳ 2,149",
//     oldPrice: "৳ 2,999",
//   },
//   {
//     id: 2,
//     name: "Urban Tote Bag",
//     image: "/products/new-arrivals/new-2.jpg",
//     price: "৳ 2,699",
//     oldPrice: "৳ 3,499",
//   },
//   {
//     id: 3,
//     name: "Luxury Crossbody",
//     image: "/products/new-arrivals/new-3.jpg",
//     price: "৳ 3,199",
//     oldPrice: "৳ 4,299",
//   },
//   {
//     id: 4,
//     name: "Classic Hand Bag",
//     image: "/products/new-arrivals/new-4.jpg",
//     price: "৳ 2,899",
//     oldPrice: "৳ 3,999",
//   },
//   {
//     id: 5,
//     name: "Premium Tote",
//     image: "/products/new-arrivals/new-5.jpg",
//     price: "৳ 3,499",
//     oldPrice: "৳ 4,699",
//   },
//   {
//     id: 6,
//     name: "Elegant Satchel",
//     image: "/products/new-arrivals/new-6.jpg",
//     price: "৳ 2,799",
//     oldPrice: "৳ 3,799",
//   },
//   {
//     id: 7,
//     name: "Fashion Sling Bag",
//     image: "/products/new-arrivals/new-7.jpg",
//     price: "৳ 2,399",
//     oldPrice: "৳ 3,299",
//   },
//   {
//     id: 8,
//     name: "Daily Carry Tote",
//     image: "/products/new-arrivals/new-8.jpg",
//     price: "৳ 2,999",
//     oldPrice: "৳ 3,999",
//   },
// ];

export default function NewArrivals({ products }) {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative mb-16">
          {/* Center Heading */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#2b1d28] md:text-5xl">
              Discover Our{" "}
              <span className="font-medium italic">New Arrivals</span>
            </h2>
          </div>

          {/* Navigation */}
          <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 gap-3 md:flex">
            <button className="new-arrivals-prev flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-pink-300 hover:text-pink-500">
              <ChevronLeft size={18} />
            </button>

            <button className="new-arrivals-next flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-pink-300 hover:text-pink-500">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".new-arrivals-prev",
            nextEl: ".new-arrivals-next",
          }}
          slidesPerView={"auto"}
          spaceBetween={16}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="w-80!">
              <Link href={`/shop/${product.slug}`} className="group block">
                {/* Product Image */}
                <div className="overflow-hidden bg-white">
                  <img
                    src={product.images[0].url}
                    alt={product.name}
                    className="h-105 w-full rounded-sm object-cover transition duration-500 group-hover:scale-[1.02]"
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
            </SwiperSlide>
          ))}
        </Swiper>

        {/* View All Button */}
        <div className="mt-12 text-center">
          <Link
            href="/products/new-arrivals"
            className="inline-flex items-center justify-center rounded-full border border-black px-8 py-3 text-sm font-medium uppercase tracking-wider transition hover:bg-black hover:text-white"
          >
            All New Arrivals
          </Link>
        </div>
      </div>
    </section>
  );
}
