import CouponForm from "@/components/dashboard/CouponForm";
import { createCoupon } from "../actions";

export default function AddCouponPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create Coupon</h1>
        <p className="mt-2 text-sm text-gray-500">
          Add a new discount code customers can apply at checkout.
        </p>
      </div>

      <CouponForm action={createCoupon} submitText="Create Coupon" />
    </div>
  );
}
