"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { couponSchema } from "@/lib/validations/coupon.schema";

export default function CouponForm({ coupon, action, submitText = "Save Coupon" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: coupon?.code || "",
      type: coupon?.type || "percent",
      value: coupon?.value ?? "",
      minOrderValue: coupon?.minOrderValue ?? 0,
      maxDiscount: coupon?.maxDiscount ?? "",
      usageLimit: coupon?.usageLimit ?? "",
      expiresAt: coupon?.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
      active: coupon?.active ?? true,
    },
  });

  const type = watch("type");

  function onSubmit(data) {
    startTransition(async () => {
      const result = await action(data);

      if (result.success) {
        toast.success(result.message);
        router.push("/dashboard/coupons");
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Coupon Code" error={errors.code?.message}>
            <input
              {...register("code")}
              placeholder="SUMMER20"
              className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm uppercase outline-none transition focus:border-black"
            />
          </Field>

          <Field label="Discount Type" error={errors.type?.message}>
            <select
              {...register("type")}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 text-sm outline-none transition focus:border-black"
            >
              <option value="percent">Percentage (%)</option>
              <option value="fixed">Fixed Amount (৳)</option>
            </select>
          </Field>

          <Field
            label={type === "percent" ? "Discount (%)" : "Discount (৳)"}
            error={errors.value?.message}
          >
            <input
              type="number"
              step="any"
              {...register("value")}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
            />
          </Field>

          <Field
            label="Minimum Order Value (৳)"
            error={errors.minOrderValue?.message}
            hint="0 means no minimum"
          >
            <input
              type="number"
              step="any"
              {...register("minOrderValue")}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
            />
          </Field>

          {type === "percent" && (
            <Field
              label="Max Discount Cap (৳)"
              error={errors.maxDiscount?.message}
              hint="Leave blank for no cap"
            >
              <input
                type="number"
                step="any"
                {...register("maxDiscount")}
                className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
              />
            </Field>
          )}

          <Field
            label="Usage Limit"
            error={errors.usageLimit?.message}
            hint="Leave blank for unlimited uses"
          >
            <input
              type="number"
              step="1"
              {...register("usageLimit")}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
            />
          </Field>

          <Field
            label="Expires On"
            error={errors.expiresAt?.message}
            hint="Leave blank for no expiry"
          >
            <input
              type="date"
              {...register("expiresAt")}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
            />
          </Field>
        </div>

        <label className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            {...register("active")}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">
            Active — customers can use this coupon
          </span>
        </label>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          {isPending ? "Saving..." : submitText}
        </button>
      </div>
    </form>
  );
}

function Field({ label, hint, error, children }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-gray-400">{hint}</p>
      )}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
