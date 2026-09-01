"use client";

import CartStepper from "@/components/cart/CartStepper";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { useCart } from "@/components/cart/CartProvider";

export default function CartPage() {
  const { cart } = useCart();

  return (
    <section className="py-6">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <CartStepper />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_380px]">
          <CartItem cartItems={cart.items} />

          <CartSummary cartItems={cart.items} />
        </div>
      </div>
    </section>
  );
}
