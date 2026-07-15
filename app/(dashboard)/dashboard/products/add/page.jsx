import ProductForm from "@/components/dashboard/ProductForm";
import { addProduct } from "../action";

export default function AddProductPage() {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>

        <p className="mt-2 text-sm text-gray-500">
          Create a new product for your store.
        </p>
      </div>

      <ProductForm action={addProduct} submitText="Add Product" />
    </div>
  );
}
