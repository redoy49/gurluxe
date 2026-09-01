"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteProduct } from "@/app/(dashboard)/dashboard/products/action";

export default function DeleteProductButton({ id }) {
  const router = useRouter();

  async function confirmDelete() {
    const result = await deleteProduct(id);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  function handleDelete() {
    // Ask for confirmation via an action toast instead of window.confirm
    toast("Delete this product?", {
      description: "This action cannot be undone.",
      action: {
        label: "Delete",
        onClick: confirmDelete,
      },
      cancel: {
        label: "Cancel",
      },
    });
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
