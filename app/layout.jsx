import { Poppins } from "next/font/google";
import { Toaster } from "sonner";
import { CartProvider } from "@/components/cart/CartProvider";
import { getCurrentCart } from "@/lib/queries/cart";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata = {
  title: {
    default: "Gurluxe — Premium Bags & Accessories",
    template: "%s | Gurluxe",
  },
  description:
    "Shop premium sling bags, tote bags, crossbody bags, and clutches at Gurluxe.",
};

export default async function RootLayout({ children }) {
  const cart = await getCurrentCart();

  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <CartProvider initialCart={cart}>
          {children}
          <Toaster position="bottom-right" />
        </CartProvider>
      </body>
    </html>
  );
}
