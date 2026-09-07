"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateOrderStatus } from "@/app/(dashboard)/dashboard/orders/actions";
import { ORDER_STATUSES } from "@/lib/validations/order.schema";

export default function OrderStatusControl({ orderId, status }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const nextStatus = e.target.value;

    startTransition(async () => {
      const result = await updateOrderStatus(orderId, nextStatus);

      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      className="h-11 rounded-lg border border-gray-300 px-4 text-sm font-medium capitalize outline-none transition focus:border-black disabled:opacity-60"
    >
      {ORDER_STATUSES.map((s) => (
        <option key={s} value={s} className="capitalize">
          {s}
        </option>
      ))}
    </select>
  );
}
