import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default function ShopLayout({ children }) {
  return (
    <>
      <Navbar />

      <main className="py-8">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <Footer />
    </>
  );
}