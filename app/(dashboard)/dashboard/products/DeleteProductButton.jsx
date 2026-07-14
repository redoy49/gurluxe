"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { deleteProduct } from "./add/action";

export default function DeleteProductButton({ id }) {
  const router = useRouter();

  async function handleDelete() {
    if (!window.confirm("Delete this product?")) return;

    const result = await deleteProduct(id);

    if (result.success) {
      router.refresh();
    } else {
      alert(result.message);
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg p-2 text-gray-600 transition hover:bg-red-100 hover:text-red-600"
    >
      <Trash2 size={18} />
    </button>
  );
}
