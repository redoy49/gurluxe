"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { TbSearch } from "react-icons/tb";
import { FiUser } from "react-icons/fi";
import { IoBagHandleOutline, IoChevronBackOutline } from "react-icons/io5";
import { ChevronRight } from "lucide-react";
import { RiMenu3Line } from "react-icons/ri";
import { useCart } from "@/components/cart/CartProvider";
import { logoutUser } from "@/app/(auth)/logout/actions";

export default function Navbar({ user }) {
  const [visible, setVisible] = useState(false);
  const { itemCount } = useCart();

  const isAuthenticated = Boolean(user);
  const isAdmin = user?.role === "admin";
  const mobileAccountHref = isAuthenticated
    ? isAdmin
      ? "/dashboard"
      : "/profile"
    : "/login";
  const mobileAccountLabel = isAuthenticated
    ? isAdmin
      ? "Dashboard"
      : "My Account"
    : "Login";

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-pink-100 bg-white/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-16 max-w-384 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text text-2xl font-bold text-transparent">
              Gurluxe
            </span>
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden items-center gap-8 md:flex">
            <li>
              <Link
                href="/"
                className="text-sm font-medium text-gray-700 transition hover:text-pink-500"
              >
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/shop"
                className="text-sm font-medium text-gray-700 transition hover:text-pink-500"
              >
                Shop
              </Link>
            </li>

            <li>
              <Link
                href="/collections"
                className="text-sm font-medium text-gray-700 transition hover:text-pink-500"
              >
                Collections
              </Link>
            </li>

            <li>
              <Link
                href="/products/new-arrivals"
                className="text-sm font-medium text-gray-700 transition hover:text-pink-500"
              >
                New Arrivals
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className="text-sm font-medium text-gray-700 transition hover:text-pink-500"
              >
                Contact
              </Link>
            </li>
          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-5">
            {/* Search */}
            <button
              type="button"
              className="cursor-pointer text-slate-600 transition hover:text-pink-500"
            >
              <TbSearch size={24} />
            </button>

            {/* User */}
            <div className="group relative hidden md:block">
              <Link href={isAuthenticated ? "#" : "/login"}>
                {isAuthenticated && user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || "Account"}
                    width={26}
                    height={26}
                    className="h-[26px] w-[26px] cursor-pointer rounded-full object-cover ring-1 ring-pink-100 transition hover:ring-pink-300"
                  />
                ) : (
                  <FiUser
                    size={22}
                    className="cursor-pointer text-slate-600 transition hover:text-pink-500"
                  />
                )}
              </Link>

              {isAuthenticated && (
                <div className="absolute right-0 hidden pt-5 group-hover:block">
                  <div className="w-56 rounded-2xl border border-pink-100 bg-white p-2 text-sm shadow-xl">
                    <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name || "Account"}
                          width={36}
                          height={36}
                          className="h-9 w-9 shrink-0 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                          <FiUser size={18} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-medium text-gray-900">
                          {user.name}
                        </p>
                        <p className="truncate text-xs text-gray-400">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <div className="my-1 h-px bg-pink-50" />

                    <ul>
                    {isAdmin ? (
                    <li>
                      <Link
                        href="/dashboard"
                        className="block rounded-xl px-4 py-2 text-gray-600 transition hover:bg-pink-50 hover:text-pink-500"
                      >
                        Dashboard
                      </Link>
                    </li>
                    ) : (
                    <>
                    <li>
                      <Link
                        href="/profile"
                        className="block rounded-xl px-4 py-2 text-gray-600 transition hover:bg-pink-50 hover:text-pink-500"
                      >
                        Profile
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/orders"
                        className="block rounded-xl px-4 py-2 text-gray-600 transition hover:bg-pink-50 hover:text-pink-500"
                      >
                        My Orders
                      </Link>
                    </li>

                    <li>
                      <Link
                        href="/wishlist"
                        className="block rounded-xl px-4 py-2 text-gray-600 transition hover:bg-pink-50 hover:text-pink-500"
                      >
                        Wishlist
                      </Link>
                    </li>
                    </>
                    )}

                    <li>
                      <form action={logoutUser}>
                        <button
                          type="submit"
                          className="block w-full rounded-xl px-4 py-2 text-left text-gray-600 transition hover:bg-pink-50 hover:text-pink-500"
                        >
                          Logout
                        </button>
                      </form>
                    </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative">
              <IoBagHandleOutline
                size={24}
                className="text-slate-600 transition hover:text-pink-500"
              />

              <span className="absolute -bottom-2 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-linear-to-r from-pink-500 to-rose-500 text-[11px] font-semibold text-white text-center leading-4 aspect-square">
                {itemCount}
              </span>
            </Link>

            {/* Mobile Menu */}
            <button
              type="button"
              onClick={() => setVisible(true)}
              className="cursor-pointer text-slate-600 md:hidden"
            >
              <RiMenu3Line size={24} />
            </button>
          </div>
        </nav>
      </header>

      {/* Backdrop */}
      <div
        onClick={() => setVisible(false)}
        className={`fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-all duration-300 md:hidden ${
          visible
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Mobile Drawer */}
      <div
        className={`fixed right-0 top-0 z-60 h-screen overflow-hidden border-l border-pink-100 bg-white transition-all duration-300 md:hidden ${
          visible ? "w-[85%] max-w-sm" : "w-0"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div
            onClick={() => setVisible(false)}
            className="flex cursor-pointer items-center gap-3 border-b border-pink-100 p-5"
          >
            <IoChevronBackOutline size={22} className="text-pink-500" />

            <span className="font-medium text-gray-700">Back</span>
          </div>

          <ul className="flex flex-col py-4">
            <li className="border-b border-pink-50">
              <Link
                href="/"
                onClick={() => setVisible(false)}
                className="flex items-center justify-between px-6 py-4 text-gray-700 transition hover:bg-pink-50 hover:text-pink-500"
              >
                <span>Home</span>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            </li>

            <li className="border-b border-pink-50">
              <Link
                href="/shop"
                onClick={() => setVisible(false)}
                className="flex items-center justify-between px-6 py-4 text-gray-700 transition hover:bg-pink-50 hover:text-pink-500"
              >
                <span>Shop</span>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            </li>

            <li className="border-b border-pink-50">
              <Link
                href="/collections"
                onClick={() => setVisible(false)}
                className="flex items-center justify-between px-6 py-4 text-gray-700 transition hover:bg-pink-50 hover:text-pink-500"
              >
                <span>Collections</span>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            </li>

            <li className="border-b border-pink-50">
              <Link
                href="/new-arrivals"
                onClick={() => setVisible(false)}
                className="flex items-center justify-between px-6 py-4 text-gray-700 transition hover:bg-pink-50 hover:text-pink-500"
              >
                <span>New Arrivals</span>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                onClick={() => setVisible(false)}
                className="flex items-center justify-between px-6 py-4 text-gray-700 transition hover:bg-pink-50 hover:text-pink-500"
              >
                <span>Contact</span>
                <ChevronRight size={18} className="text-gray-400" />
              </Link>
            </li>
          </ul>

          {/* Bottom CTA */}
          <div className="mt-auto border-t border-pink-100 p-5">
            {isAuthenticated && (
              <div className="mb-3 flex items-center gap-3 px-1">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || "Account"}
                    width={36}
                    height={36}
                    className="h-9 w-9 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-500">
                    <FiUser size={18} />
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {user.name}
                  </p>
                  <p className="truncate text-xs text-gray-400">
                    {user.email}
                  </p>
                </div>
              </div>
            )}

            <Link
              href={mobileAccountHref}
              onClick={() => setVisible(false)}
              className="block w-full rounded-xl border border-pink-200 px-4 py-3 text-center text-sm font-medium text-pink-500 transition hover:bg-pink-50"
            >
              {mobileAccountLabel}
            </Link>

            {isAuthenticated && (
              <form action={logoutUser}>
                <button
                  type="submit"
                  onClick={() => setVisible(false)}
                  className="mt-3 block w-full rounded-xl border border-pink-200 px-4 py-3 text-center text-sm font-medium text-pink-500 transition hover:bg-pink-50"
                >
                  Logout
                </button>
              </form>
            )}

            <Link
              href="/shop"
              onClick={() => setVisible(false)}
              className="mt-3 block w-full rounded-xl bg-linear-to-r from-pink-400 to-rose-500 px-4 py-3 text-center text-sm font-semibold text-white shadow-md transition hover:shadow-lg"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
