"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteCoupon } from "@/app/(dashboard)/dashboard/coupons/actions";

export default function DeleteCouponButton({ id }) {
  const router = useRouter();

  async function confirmDelete() {
    const result = await deleteCoupon(id);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.message);
    }
  }

  function handleDelete() {
    toast("Delete this coupon?", {
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
