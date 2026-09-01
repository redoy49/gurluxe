import { getProductBySlug } from "@/lib/queries/products";
import ProductPage from "./_components/ProductPage";

export default async function ProductDetailsPage({ params }) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-3xl font-bold">প্রোডাক্ট পাওয়া যায়নি</h1>
      </div>
    );
  }

  return <ProductPage product={product} />;
}
