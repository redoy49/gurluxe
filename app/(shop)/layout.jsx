import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { getCurrentUser } from "@/lib/auth/session";

export default async function ShopLayout({ children }) {
  const user = await getCurrentUser();

  return (
    <>
      <Navbar user={user} />

      <main className="py-8">
        <div className="mx-auto max-w-[1536px] px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      <Footer />
    </>
  );
}