"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";
import { removeFromWishlist } from "@/app/(shop)/wishlist/actions";

export default function WishlistGrid({ products }) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-pink-50 text-pink-400">
          <Heart size={28} />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">
          Your wishlist is empty
        </h3>
        <p className="mt-1 max-w-sm text-sm text-gray-500">
          Save products you love while you browse and they&apos;ll show up
          here.
        </p>
        <Link
          href="/shop"
          className="mt-6 inline-flex rounded-full bg-linear-to-r from-pink-500 to-rose-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-pink-200 transition hover:shadow-lg"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <WishlistCard key={product._id} product={product} />
      ))}
    </div>
  );
}

function WishlistCard({ product }) {
  const [isPending, startTransition] = useTransition();
  const { addItem } = useCart();
  const inStock = (product.stock || 0) > 0;

  function handleRemove() {
    startTransition(async () => {
      const result = await removeFromWishlist(product._id);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  function handleAddToCart() {
    addItem({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      sku: product.sku,
      image: product.images?.[0]?.url || "",
      color: null,
      size: product.sizes?.[0] || null,
      price: product.price,
      quantity: 1,
    });
  }

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:shadow-md">
      <button
        type="button"
        onClick={handleRemove}
        disabled={isPending}
        aria-label="Remove from wishlist"
        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-pink-500 shadow-sm transition hover:bg-pink-50 disabled:opacity-50"
      >
        <Heart size={16} fill="currentColor" />
      </button>

      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[5/6] w-full overflow-hidden bg-gray-100">
          {product.images?.[0]?.url && (
            <Image
              src={product.images[0].url}
              alt={product.name}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link
          href={`/shop/${product.slug}`}
          className="line-clamp-1 text-sm font-medium text-gray-900 hover:text-pink-600"
        >
          {product.name}
        </Link>

        <div className="mt-1.5 flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-900">
            ৳ {product.price}
          </span>
          {product.comparePrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ৳ {product.comparePrice}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!inStock}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-gray-900 py-2.5 text-xs font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ShoppingBag size={14} />
          {inStock ? "Add to Cart" : "Out of Stock"}
        </button>
      </div>
    </div>
  );
}
