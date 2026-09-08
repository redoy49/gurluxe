import Link from "next/link";
import { Pencil, Plus, Tag } from "lucide-react";
import { getCoupons } from "@/lib/queries/coupons";
import DeleteCouponButton from "@/components/dashboard/DeleteCouponButton";
import ToggleCouponButton from "@/components/dashboard/ToggleCouponButton";

function formatDate(iso) {
  if (!iso) return "No expiry";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatValue(coupon) {
  return coupon.type === "percent" ? `${coupon.value}%` : `৳ ${coupon.value}`;
}

export default async function CouponsPage() {
  const coupons = await getCoupons();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Coupons</h1>
          <p className="mt-1 text-sm text-gray-500">
            Discount codes customers can apply at checkout.
          </p>
        </div>

        <Link
          href="/dashboard/coupons/add"
          className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
        >
          <Plus size={18} />
          Create Coupon
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Code
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Discount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Min. Order
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Usage
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Expires
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {coupons.map((coupon) => (
                <tr
                  key={coupon._id}
                  className="border-b border-gray-100 last:border-none hover:bg-gray-50"
                >
                  <td className="px-6 py-5">
                    <span className="font-mono text-sm font-semibold text-gray-900">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-700">
                    {formatValue(coupon)}
                    {coupon.type === "percent" && coupon.maxDiscount
                      ? ` (max ৳${coupon.maxDiscount})`
                      : ""}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-700">
                    {coupon.minOrderValue > 0
                      ? `৳ ${coupon.minOrderValue.toLocaleString()}`
                      : "None"}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-700">
                    {coupon.usedCount || 0}
                    {coupon.usageLimit ? ` / ${coupon.usageLimit}` : ""}
                  </td>
                  <td className="px-6 py-5 text-sm text-gray-500">
                    {formatDate(coupon.expiresAt)}
                  </td>
                  <td className="px-6 py-5">
                    <ToggleCouponButton id={coupon._id} active={coupon.active} />
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-center gap-2">
                      <Link
                        href={`/dashboard/coupons/edit/${coupon._id}`}
                        className="rounded-lg p-2 text-gray-600 transition hover:bg-blue-100 hover:text-blue-600"
                      >
                        <Pencil size={18} />
                      </Link>
                      <DeleteCouponButton id={coupon._id} />
                    </div>
                  </td>
                </tr>
              ))}

              {coupons.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-16 text-center text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                      <Tag className="h-8 w-8 text-gray-300" />
                      No coupons yet. Create one to offer a discount.
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
