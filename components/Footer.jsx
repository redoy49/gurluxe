"use client";

import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterestP,
  FaTiktok,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-pink-100 bg-pink-50">
      <div className="mx-auto max-w-384 px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:gap-20 md:grid-cols-2 lg:grid-cols-[35%_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <h2 className="bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-2xl font-bold text-transparent">
              Gurluxe
            </h2>

            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Discover elegant handbags crafted for modern women. Designed to
              elevate your everyday style with timeless fashion and premium
              quality.
            </p>

            <div className="mt-5 flex items-center gap-3">
              <a
                href="#"
                className="rounded-full border border-pink-200 p-2 text-pink-500 transition hover:bg-pink-500 hover:text-white"
              >
                <FaFacebookF size={14} />
              </a>

              <a
                href="#"
                className="rounded-full border border-pink-200 p-2 text-pink-500 transition hover:bg-pink-500 hover:text-white"
              >
                <FaInstagram size={14} />
              </a>

              <a
                href="#"
                className="rounded-full border border-pink-200 p-2 text-pink-500 transition hover:bg-pink-500 hover:text-white"
              >
                <FaPinterestP size={14} />
              </a>

              <a
                href="#"
                className="rounded-full border border-pink-200 p-2 text-pink-500 transition hover:bg-pink-500 hover:text-white"
              >
                <FaTiktok size={14} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
              Shop
            </h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-gray-500 transition hover:text-pink-500"
                >
                  All Products
                </Link>
              </li>

              <li>
                <Link
                  href="/collections"
                  className="text-sm text-gray-500 transition hover:text-pink-500"
                >
                  Collections
                </Link>
              </li>

              <li>
                <Link
                  href="/new-arrivals"
                  className="text-sm text-gray-500 transition hover:text-pink-500"
                >
                  New Arrivals
                </Link>
              </li>

              <li>
                <Link
                  href="/best-sellers"
                  className="text-sm text-gray-500 transition hover:text-pink-500"
                >
                  Best Sellers
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
              Customer Care
            </h3>

            <ul className="mt-4 space-y-3">
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-500 transition hover:text-pink-500"
                >
                  Contact Us
                </Link>
              </li>

              <li>
                <Link
                  href="/faq"
                  className="text-sm text-gray-500 transition hover:text-pink-500"
                >
                  FAQ
                </Link>
              </li>

              <li>
                <Link
                  href="/shipping-policy"
                  className="text-sm text-gray-500 transition hover:text-pink-500"
                >
                  Shipping Policy
                </Link>
              </li>

              <li>
                <Link
                  href="/returns"
                  className="text-sm text-gray-500 transition hover:text-pink-500"
                >
                  Returns & Refunds
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-900">
              Contact
            </h3>

            <div className="mt-4 space-y-3 text-sm text-gray-500">
              <p>support@gurluxe.com</p>
              <p>+880 1234-567890</p>
              <p>Available Monday - Saturday</p>
              <p>9:00 AM - 6:00 PM</p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-pink-100 pt-6">
          <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Gurluxe. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                href="/privacy-policy"
                className="text-sm text-gray-500 transition hover:text-pink-500"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="text-sm text-gray-500 transition hover:text-pink-500"
              >
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
