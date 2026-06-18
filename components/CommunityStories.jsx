"use client";

import { FaStar } from "react-icons/fa";

const stories = [
  {
    id: 1,
    name: "Siam Ahmed",
    location: "Dhaka, Bangladesh",
    image: "/community/story-1.jpg",
    avatar: "/community/avatar-1.jpg",
    review:
      "Absolutely loved this product! The build quality is excellent and exceeded my expectations. Highly recommend for anyone looking for reliability and style.",
    height: "h-[480px]",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    location: "Chattogram, Bangladesh",
    image: "/community/story-2.jpg",
    avatar: "/community/avatar-2.jpg",
    review:
      "Absolutely loved this product! The build quality is excellent and exceeded my expectations. Highly recommend for anyone looking for reliability and style.",
    height: "h-[230px]",
  },
  {
    id: 3,
    name: "Tanvir Hasan",
    location: "Sylhet, Bangladesh",
    image: "/community/story-3.jpg",
    avatar: "/community/avatar-3.jpg",
    review:
      "Absolutely loved this product! The build quality is excellent and exceeded my expectations. Highly recommend for anyone looking for reliability and style.",
    height: "h-[230px]",
  },
  {
    id: 4,
    name: "Mehjabin Chowdhury",
    location: "Khulna, Bangladesh",
    image: "/community/story-4.jpg",
    avatar: "/community/avatar-4.jpg",
    review:
      "Absolutely loved this product! The build quality is excellent and exceeded my expectations. Highly recommend for anyone looking for reliability and style.",
    height: "h-[480px]",
  },
  {
    id: 5,
    name: "Sadia Islam",
    location: "Rajshahi, Bangladesh",
    image: "/community/story-5.jpg",
    avatar: "/community/avatar-5.jpg",
    review:
      "Absolutely loved this product! The build quality is excellent and exceeded my expectations. Highly recommend for anyone looking for reliability and style.",
    height: "h-[230px]",
  },
  {
    id: 6,
    name: "Fahim Rahman",
    location: "Barishal, Bangladesh",
    image: "/community/story-6.jpg",
    avatar: "/community/avatar-6.jpg",
    review:
      "Absolutely loved this product! The build quality is excellent and exceeded my expectations. Highly recommend for anyone looking for reliability and style.",
    height: "h-[230px]",
  },
  {
    id: 7,
    name: "Rafi Ahmed",
    location: "Dhaka, Bangladesh",
    image: "/community/story-7.jpg",
    avatar: "/community/avatar-7.jpg",
    review:
      "Absolutely loved this product! The build quality is excellent and exceeded my expectations. Highly recommend for anyone looking for reliability and style.",
    height: "h-[480px]",
  },
  {
    id: 8,
    name: "Tanjina Akter",
    location: "Cumilla, Bangladesh",
    image: "/community/story-8.jpg",
    avatar: "/community/avatar-8.jpg",
    review:
      "Absolutely loved this product! The build quality is excellent and exceeded my expectations. Highly recommend for anyone looking for reliability and style.",
    height: "h-[230px]",
  },
  {
    id: 9,
    name: "Mahmud Hasan",
    location: "Mymensingh, Bangladesh",
    image: "/community/story-9.jpg",
    avatar: "/community/avatar-9.jpg",
    review:
      "Absolutely loved this product! The build quality is excellent and exceeded my expectations. Highly recommend for anyone looking for reliability and style.",
    height: "h-[230px]",
  },
  {
    id: 10,
    name: "Mahmud Hasan",
    location: "Mymensingh, Bangladesh",
    image: "/community/story-9.jpg",
    avatar: "/community/avatar-9.jpg",
    review:
      "Absolutely loved this product! The build quality is excellent and exceeded my expectations. Highly recommend for anyone looking for reliability and style.",
    height: "h-[230px]",
  },
];

export default function CommunityStories() {
  const renderStory = (story) => (
    <div
      key={story.id}
      className={`group relative w-[225px] overflow-hidden rounded-lg ${story.height}`}
    >
      {/* Image */}
      <img
        src={story.image}
        alt={story.name}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition duration-300 group-hover:bg-black/70" />

      {/* Default Name */}
      <div className="absolute bottom-4 left-4 transition duration-300 group-hover:opacity-0">
        <h3 className="text-[15px] font-bold leading-tight text-white">
          {story.name}
        </h3>
      </div>

      {/* Hover Review */}
      <div className="absolute inset-0 flex translate-y-4 flex-col justify-between p-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <div>
          <div className="mb-3 flex gap-1 text-white">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={12} />
            ))}
          </div>

          <p className="text-[11px] leading-relaxed text-white">
            {story.review}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <img
            src={story.image}
            alt={story.name}
            className="h-8 w-8 rounded-full object-cover"
          />

          <div>
            <p className="text-xs font-semibold text-white">{story.name}</p>
            <p className="text-[10px] text-white/80">{story.location}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section className="overflow-hidden bg-[radial-gradient(circle_at_top_left,#f8d9e6_0%,#f7f6ef_50%,#dff8ef_100%)] py-24">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold text-[#2b1d28] md:text-5xl">
            Stories From Our{" "}
            <span className="font-medium italic">Community</span>
          </h2>
        </div>

        {/* Desktop Pattern: 1 → 2 → 1 → 2 → 1 → 2 */}
        <div className="hidden justify-center gap-5 xl:flex">
          {/* 1 */}
          <div className="flex items-center">{renderStory(stories[0])}</div>

          {/* 2 */}
          <div className="flex flex-col gap-5">
            {renderStory(stories[1])}
            {renderStory(stories[2])}
          </div>

          {/* 1 */}
          <div className="flex items-center">{renderStory(stories[3])}</div>

          {/* 2 */}
          <div className="flex flex-col gap-5">
            {renderStory(stories[4])}
            {renderStory(stories[5])}
          </div>

          {/* 1 */}
          <div className="flex items-center">{renderStory(stories[6])}</div>

          {/* 2 */}
          <div className="flex flex-col gap-5">
            {renderStory(stories[7])}
            {renderStory(stories[8])}
          </div>
        </div>

        {/* Tablet */}
        <div className="hidden grid-cols-3 gap-5 md:grid xl:hidden">
          {stories.map((story) => (
            <div
              key={story.id}
              className={`group relative overflow-hidden rounded-lg ${story.height}`}
            >
              <img
                src={story.image}
                alt={story.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition duration-300 group-hover:bg-black/70" />

              <div className="absolute bottom-4 left-4 transition duration-300 group-hover:opacity-0">
                <h3 className="text-[15px] font-bold leading-tight text-white">
                  {story.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile */}
        <div className="grid grid-cols-2 gap-2 md:hidden">
          {stories.map((story) => (
            <div
              key={story.id}
              className="group relative h-[280px] overflow-hidden rounded-lg"
            >
              <img
                src={story.image}
                alt={story.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

              <div className="absolute bottom-4 left-4">
                <h3 className="text-[14px] font-bold text-white">
                  {story.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
