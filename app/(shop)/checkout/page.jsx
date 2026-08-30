"use client";

import { useState } from "react";

import CheckoutStepper from "@/components/checkout/CheckoutStepper";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentMethod from "@/components/checkout/PaymentMethod";
import OrderSummary from "@/components/checkout/OrderSummary";

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    district: "",
    address: "",
  });

  const [payment, setPayment] = useState("cod");


  const cartItems = [
    {
      id: 1,
      name: "Croissant Chic Crossbody Bag",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      price: 852,
      quantity: 1,
    },
    {
      id: 2,
      name: "Croissant Chic Crossbody Bag",
      image:
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800",
      price: 852,
      quantity: 1,
    },
  ];


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // Shipping calculation
  const shipping =
    formData.district === "Dhaka"
      ? 60
      : formData.district
        ? 120
        : 0;


  const handlePlaceOrder = () => {
    const orderData = {
      customer: formData,
      payment,
      items: cartItems,
      shipping,
    };


    console.log(orderData);

    // এখানে API call হবে
    // await fetch("/api/orders", {
    //   method:"POST",
    //   body: JSON.stringify(orderData)
    // })
  };


  return (
    <section className="py-6">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8">

        {/* Stepper */}
        <CheckoutStepper currentStep={2} />


        <div className="mt-14 grid gap-10 lg:grid-cols-[1fr_380px]">

          {/* Left */}
          <div>
            <AddressForm
              formData={formData}
              onChange={handleChange}
            />


            <PaymentMethod
              payment={payment}
              setPayment={setPayment}
            />
          </div>


          {/* Right */}
          <OrderSummary
            cartItems={cartItems}
            shipping={shipping}
            discount={0}
            onPlaceOrder={handlePlaceOrder}
          />

        </div>

      </div>
    </section>
  );
}