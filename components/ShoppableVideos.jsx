"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

const stories = [
  {
    id: 1,
    video: "/videos/bag-1.mp4",
    title: "Eve Micro Bag",
    price: "৳ 1,949",
    oldPrice: "৳ 2,999",
  },
  {
    id: 2,
    video: "/videos/bag-2.mp4",
    title: "Effie Shoulder Bag",
    price: "৳ 2,599",
    oldPrice: "৳ 3,999",
  },
  {
    id: 3,
    video: "/videos/bag-3.mp4",
    title: "Mindy Crossbody Bag",
    price: "৳ 2,299",
    oldPrice: "৳ 3,499",
  },
  {
    id: 4,
    video: "/videos/bag-4.mp4",
    title: "Luxe Tote Bag",
    price: "৳ 3,199",
    oldPrice: "৳ 4,499",
  },
  {
    id: 5,
    video: "/videos/bag-5.mp4",
    title: "Classic Tote",
    price: "৳ 2,799",
    oldPrice: "৳ 3,999",
  },
  {
    id: 6,
    video: "/videos/bag-5.mp4",
    title: "Classic Tote",
    price: "৳ 2,799",
    oldPrice: "৳ 3,999",
  },
];

export default function StoriesSection() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="relative mb-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#2b1d28] md:text-5xl">
              Watch Videos <span className="font-medium italic"> and Shop</span>
            </h2>
          </div>

          {/* Navigation */}
          <div className="absolute right-0 top-1/2 hidden -translate-y-1/2 gap-3 md:flex">
            <button className="stories-prev flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-pink-300 hover:text-pink-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            <button className="stories-next flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white transition hover:border-pink-300 hover:text-pink-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation]}
          navigation={{
            prevEl: ".stories-prev",
            nextEl: ".stories-next",
          }}
          slidesPerView={"auto"}
          spaceBetween={16} // same as gap-4
        >
          {stories.map((story) => (
            <SwiperSlide
              key={story.id}
              className="w-80!" // same width as before
            >
              <Link href={`/products/${story.id}`} className="group block">
                {/* Video Card */}
                <div className="overflow-hidden bg-white">
                  <video
                    src={story.video}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-105 w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                  />
                </div>

                {/* Product Info */}
                <div className="px-1 py-3">
                  <p className="truncate text-[13px] font-medium text-gray-900">
                    {story.title}
                  </p>

                  <div className="mt-1 flex items-center gap-3">
                    <p className="text-[13px] text-gray-900">{story.price}</p>

                    <p className="text-[13px] text-gray-400 line-through">
                      {story.oldPrice}
                    </p>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
