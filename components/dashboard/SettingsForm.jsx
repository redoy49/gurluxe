"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateStoreSettings } from "@/app/(dashboard)/dashboard/settings/actions";

export default function SettingsForm({ settings }) {
  const [form, setForm] = useState({
    storeName: settings.storeName || "",
    supportEmail: settings.supportEmail || "",
    supportPhone: settings.supportPhone || "",
    address: settings.address || "",
    shippingInsideDhaka: settings.shippingInsideDhaka,
    shippingOutsideDhaka: settings.shippingOutsideDhaka,
    freeShippingThreshold: settings.freeShippingThreshold,
    codEnabled: settings.codEnabled,
  });
  const [isPending, startTransition] = useTransition();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    startTransition(async () => {
      const result = await updateStoreSettings(form);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Store profile */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Store Profile</h2>
        <p className="mt-1 text-sm text-gray-500">
          Shown on order confirmations and customer communication.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <Field
            label="Store Name"
            name="storeName"
            value={form.storeName}
            onChange={handleChange}
          />
          <Field
            label="Support Email"
            name="supportEmail"
            type="email"
            value={form.supportEmail}
            onChange={handleChange}
            placeholder="support@gurluxe.com"
          />
          <Field
            label="Support Phone"
            name="supportPhone"
            value={form.supportPhone}
            onChange={handleChange}
            placeholder="01XXXXXXXXX"
          />
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Store Address
          </label>
          <textarea
            name="address"
            rows={3}
            value={form.address}
            onChange={handleChange}
            className="w-full resize-none rounded-lg border border-gray-300 p-4 text-sm outline-none transition focus:border-black"
          />
        </div>
      </section>

      {/* Shipping */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Shipping</h2>
        <p className="mt-1 text-sm text-gray-500">
          Delivery fees applied at checkout by district.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Field
            label="Inside Dhaka (৳)"
            name="shippingInsideDhaka"
            type="number"
            min="0"
            value={form.shippingInsideDhaka}
            onChange={handleChange}
          />
          <Field
            label="Outside Dhaka (৳)"
            name="shippingOutsideDhaka"
            type="number"
            min="0"
            value={form.shippingOutsideDhaka}
            onChange={handleChange}
          />
          <Field
            label="Free Shipping Over (৳)"
            name="freeShippingThreshold"
            type="number"
            min="0"
            value={form.freeShippingThreshold}
            onChange={handleChange}
            hint="0 disables free shipping"
          />
        </div>
      </section>

      {/* Payments */}
      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="font-semibold text-gray-900">Payments</h2>
        <p className="mt-1 text-sm text-gray-500">
          Payment methods available at checkout.
        </p>

        <label className="mt-6 flex items-center gap-3">
          <input
            type="checkbox"
            name="codEnabled"
            checked={form.codEnabled}
            onChange={handleChange}
            className="h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm font-medium text-gray-700">
            Cash on Delivery enabled
          </span>
        </label>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending && <Loader2 size={16} className="animate-spin" />}
          Save Settings
        </button>
      </div>
    </form>
  );
}

function Field({ label, hint, ...props }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        {...props}
        className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-black"
      />
      {hint && <p className="mt-1.5 text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
