"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { toast } from "sonner";

import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useCart } from "@/components/cart/CartProvider";
import { placeOrder } from "./actions";

export default function CheckoutClient({ settings }) {
  const { cart, isPending: cartPending } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    district: "",
    address: "",
  });

  const [payment, setPayment] = useState(settings.codEnabled ? "cod" : "");
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [paymentErrors, setPaymentErrors] = useState({});
  const [coupon, setCoupon] = useState(null);
  const [isPlacing, startPlacing] = useTransition();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTransactionFieldChange = (e) => {
    const { name, value } = e.target;
    if (name === "transactionId") setTransactionId(value);
    if (name === "senderNumber") setSenderNumber(value);
  };

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const freeShipping =
    settings.freeShippingThreshold > 0 &&
    subtotal >= settings.freeShippingThreshold;

  const shipping = freeShipping
    ? 0
    : formData.district === "Dhaka"
      ? settings.shippingInsideDhaka
      : formData.district
        ? settings.shippingOutsideDhaka
        : 0;

  const handlePlaceOrder = () => {
    if (cart.items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (payment !== "cod") {
      const errors = {};
      if (!transactionId.trim()) {
        errors.transactionId = "Enter the Transaction ID from your payment";
      }
      if (!senderNumber.trim()) {
        errors.senderNumber = "Enter the number you paid from";
      }
      setPaymentErrors(errors);
      if (Object.keys(errors).length > 0) {
        toast.error("Please complete your payment details");
        return;
      }
    }

    startPlacing(async () => {
      const result = await placeOrder({
        customer: formData,
        payment,
        couponCode: coupon?.code || "",
        transactionId,
        senderNumber,
      });

      if (result.success) {
        toast.success("Order placed successfully");
        router.push(`/checkout/success?order=${result.orderNumber}`);
      } else {
        toast.error(result.message);
      }
    });
  };

  if (cart.items.length === 0 && !cartPending) {
    return (
      <section className="py-6">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
          <CheckoutStepper currentStep={2} />

          <div className="mt-14 flex flex-col items-center justify-center gap-4 rounded-xl border border-gray-200 bg-white py-24 text-center">
            <ShoppingBag className="h-10 w-10 text-gray-300" />
            <div>
              <p className="text-lg font-medium text-gray-900">
                Your cart is empty
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Add something to your cart before checking out.
              </p>
            </div>
            <Link
              href="/shop"
              className="mt-2 rounded-full bg-black px-6 py-3 text-xs font-medium text-white transition hover:bg-gray-800"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">
        <CheckoutStepper currentStep={2} />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div>
            <AddressForm formData={formData} onChange={handleChange} />
            <PaymentMethod
              payment={payment}
              setPayment={setPayment}
              settings={settings}
              transactionId={transactionId}
              senderNumber={senderNumber}
              onTransactionFieldChange={handleTransactionFieldChange}
              errors={paymentErrors}
            />
          </div>

          <OrderSummary
            cartItems={cart.items}
            shipping={shipping}
            discount={coupon?.discount || 0}
            coupon={coupon}
            onApplyCoupon={setCoupon}
            onRemoveCoupon={() => setCoupon(null)}
            onPlaceOrder={handlePlaceOrder}
            isPlacing={isPlacing}
          />
        </div>
      </div>
    </section>
  );
}
