import CartStepper from "@/components/cart/CartStepper";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";

export default function CartPage() {
  const cartItems = [
    {
      id: 1,
      slug: "croissant-chic-crossbody-bag",
      name: "Croissant Chic Crossbody Bag",
      sku: "SKU-189418",
      color: "Gray",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      price: 852,
      quantity: 1,
    },
    {
      id: 2,
      slug: "croissant-chic-crossbody-bag",
      name: "Croissant Chic Crossbody Bag",
      sku: "SKU-189418",
      color: "Gray",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      price: 852,
      quantity: 1,
    },
    {
      id: 3,
      slug: "croissant-chic-crossbody-bag",
      name: "Croissant Chic Crossbody Bag",
      sku: "SKU-189418",
      color: "Gray",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      price: 852,
      quantity: 1,
    },
    {
      id: 4,
      slug: "croissant-chic-crossbody-bag",
      name: "Croissant Chic Crossbody Bag",
      sku: "SKU-189418",
      color: "Gray",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      price: 852,
      quantity: 1,
    },
    {
      id: 5,
      slug: "croissant-chic-crossbody-bag",
      name: "Croissant Chic Crossbody Bag",
      sku: "SKU-189418",
      color: "Gray",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      price: 852,
      quantity: 1,
    },
  ];

  return (
    <section className="py-6">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <CartStepper />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_380px]">
          <CartItem cartItems={cartItems} />

          <CartSummary cartItems={cartItems} />
        </div>
      </div>
    </section>
  );
}
