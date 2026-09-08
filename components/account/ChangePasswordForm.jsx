"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { changePassword } from "@/app/(shop)/profile/actions";
import { changePasswordSchema } from "@/lib/validations/auth.schema";

const FIELDS = [
  { name: "currentPassword", label: "Current Password" },
  { name: "newPassword", label: "New Password" },
  { name: "confirmPassword", label: "Confirm New Password" },
];

export default function ChangePasswordForm() {
  const [visible, setVisible] = useState({});
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  function toggleVisible(name) {
    setVisible((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function onSubmit(data) {
    startTransition(async () => {
      const result = await changePassword(data);

      if (result.success) {
        toast.success(result.message);
        reset();
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {FIELDS.map(({ name, label }) => (
        <div key={name}>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            {label}
          </label>
          <div className="relative">
            <input
              type={visible[name] ? "text" : "password"}
              {...register(name)}
              className="h-11 w-full rounded-lg border border-gray-300 px-4 pr-11 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
            />
            <button
              type="button"
              onClick={() => toggleVisible(name)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-pink-500"
            >
              {visible[name] ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
          {errors[name] && (
            <p className="mt-1.5 text-xs text-red-500">
              {errors[name].message}
            </p>
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-pink-500 to-rose-500 px-6 py-2.5 text-sm font-medium text-white transition hover:from-pink-600 hover:to-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        Update Password
      </button>
    </form>
  );
}
