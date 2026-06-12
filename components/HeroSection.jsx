"use client";

import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-pink-50">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(244,114,182,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(244,114,182,0.08)_1px,transparent_1px)] bg-size-[40px_40px]" />

      {/* Glow Effects */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[20%] h-[420px] w-[420px] rounded-full bg-pink-300/40 blur-[120px]" />
        <div className="absolute right-[-10%] top-[10%] h-[420px] w-[420px] rounded-full bg-rose-300/40 blur-[120px]" />
        <div className="absolute left-1/2 top-[-10%] h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-fuchsia-200/30 blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
        {/* Badge */}
        <span className="mb-6 rounded-full border border-pink-200 bg-white/70 px-4 py-1 text-xs text-pink-500 shadow-sm backdrop-blur">
          ✨ New Luxury Collection 2026
        </span>

        {/* Heading */}
        <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-6xl">
          Carry{" "}
          <span className="bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
            Elegance
          </span>{" "}
          Everywhere You Go
        </h1>

        {/* Subtext */}
        <p className="mt-6 max-w-2xl text-base text-gray-500 sm:text-lg">
          Premium ladies handbags crafted for modern style — elegant,
          durable, and designed for every occasion.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/shop"
            className="rounded-xl bg-linear-to-r from-pink-400 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90"
          >
            Shop Now
          </Link>

          <Link
            href="/collections"
            className="rounded-xl border border-pink-200 bg-white/70 px-6 py-3 text-sm font-semibold text-pink-500 backdrop-blur transition hover:border-pink-300"   
          >
            Explore Collections
          </Link>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-14 w-full max-w-3xl">
          <div className="aspect-video rounded-3xl border border-pink-100 bg-white/60 shadow-[0_10px_60px_rgba(244,114,182,.12)] backdrop-blur">
            {/* Replace this with your handbag image */}
            <div className="flex h-full items-center justify-center text-sm text-pink-400">
              Luxury Handbag Showcase
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}