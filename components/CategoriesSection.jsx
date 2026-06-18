"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const categories = [
  {
    id: 1,
    name: "Sling Bags",
    image: "/categories/category-1.jpg",
    href: "/collections/sling-bags",
  },
  {
    id: 2,
    name: "Tote Bags",
    image: "/categories/category-2.jpg",
    href: "/collections/tote-bags",
  },
  {
    id: 3,
    name: "Clutches",
    image: "/categories/category-3.jpg",
    href: "/collections/clutches",
  },
  {
    id: 4,
    name: "Satchel Bags",
    image: "/categories/category-4.jpg",
    href: "/collections/satchel-bags",
  },
  {
    id: 5,
    name: "Crossbody Bags",
    image: "/categories/category-5.jpg",
    href: "/collections/crossbody-bags",
  },
  {
    id: 6,
    name: "Hand Bags",
    image: "/categories/category-6.jpg",
    href: "/collections/hand-bags",
  },
  {
    id: 7,
    name: "Hand Bags",
    image: "/categories/category-7.jpg",
    href: "/collections/hand-bags",
  },
  {
    id: 9,
    name: "Hand Bags",
    image: "/categories/category-9.jpg",
    href: "/collections/hand-bags",
  },
];

export default function ShopByCategory() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="relative mb-16">
          {/* Center Heading */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#2b1d28] md:text-5xl">
              Find Your <span className="font-medium italic">Perfect Bag</span>
            </h2>
          </div>

          {/* Navigation */}
          <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 gap-3 md:flex">
            <button className="categories-prev flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-pink-300 hover:text-pink-500">
              <ChevronLeft size={18} />
            </button>

            <button className="categories-next flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-pink-300 hover:text-pink-500">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".categories-prev",
            nextEl: ".categories-next",
          }}
          slidesPerView={"auto"}
          spaceBetween={16}
        >
          {categories.map((category) => (
            <SwiperSlide key={category.id} className="w-80!">
              <Link href={category.href} className="group block">
                {/* Image */}
                <div className="overflow-hidden bg-gray-100">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="h-105 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Category Name */}
                <div className="px-1 py-3">
                  <p className="truncate text-[13px] font-medium text-gray-900">
                    {category.name}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
