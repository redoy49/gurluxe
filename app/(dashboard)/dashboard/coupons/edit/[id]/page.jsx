import { notFound } from "next/navigation";
import CouponForm from "@/components/dashboard/CouponForm";
import { getCouponById } from "@/lib/queries/coupons";
import { updateCoupon } from "../../actions";

export default async function EditCouponPage({ params }) {
  const { id } = await params;
  const coupon = await getCouponById(id);

  if (!coupon) notFound();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Coupon</h1>
        <p className="mt-2 text-sm text-gray-500">
          Update the details for {coupon.code}.
        </p>
      </div>

      <CouponForm
        coupon={coupon}
        action={updateCoupon.bind(null, id)}
        submitText="Update Coupon"
      />
    </div>
  );
}
