"use client";

import { createContext, useContext, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
} from "@/app/(shop)/cart/actions";

const CartContext = createContext(null);

// Single source of truth for cart state, backed by the MongoDB-persisted cart.
// Server Actions return the updated cart so the UI always reflects what was saved.
export function CartProvider({ initialCart, children }) {
  const [cart, setCart] = useState(initialCart);
  const [isPending, startTransition] = useTransition();

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  function addItem(item) {
    startTransition(async () => {
      const result = await addToCart(item);

      if (result.success) {
        setCart(result.cart);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  function updateQuantity(itemId, quantity) {
    startTransition(async () => {
      const result = await updateCartItemQuantity(itemId, quantity);

      if (result.success) {
        setCart(result.cart);
      } else {
        toast.error(result.message);
      }
    });
  }

  function removeItem(itemId) {
    startTransition(async () => {
      const result = await removeCartItem(itemId);

      if (result.success) {
        setCart(result.cart);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        itemCount,
        isPending,
        addItem,
        updateQuantity,
        removeItem,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
