import { redirect } from "next/navigation";
import { requireUserPage } from "@/lib/auth/authorize";
import { getWishlistProducts } from "@/lib/queries/wishlist";
import AccountShell from "@/components/account/AccountShell";
import WishlistGrid from "@/components/account/WishlistGrid";

export default async function WishlistPage() {
  const user = await requireUserPage();

  // Wishlisting is a shopping feature — admin accounts manage the store,
  // they don't shop through it, so this page isn't part of their role.
  if (user.role === "admin") redirect("/dashboard");

  const products = await getWishlistProducts(user.id);

  return (
    <AccountShell user={user}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
        <p className="mt-1 text-sm text-gray-500">
          {products.length > 0
            ? `${products.length} item${products.length === 1 ? "" : "s"} saved for later.`
            : "Products you save will show up here."}
        </p>
      </div>

      <WishlistGrid products={products} />
    </AccountShell>
  );
}
