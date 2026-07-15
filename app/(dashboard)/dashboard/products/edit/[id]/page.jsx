import ProductForm from "@/components/dashboard/ProductForm";
import { getProductById, updateProduct } from "../../action";

export default async function EditProductPage({ params }) {
  const { id } = await params;

  const product = await getProductById(id);

  return (
    <ProductForm
      product={product}
      action={updateProduct}
      submitText="Update Product"
    />
  );
}
