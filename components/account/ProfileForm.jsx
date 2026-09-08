"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { updateProfile } from "@/app/(shop)/profile/actions";
import { updateProfileSchema } from "@/lib/validations/auth.schema";

export default function ProfileForm({ profile }) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: profile.name || "",
      phone: profile.phone || "",
    },
  });

  function onSubmit(data) {
    startTransition(async () => {
      const result = await updateProfile(data);

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          {...register("name")}
          className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
        />
        {errors.name && (
          <p className="mt-1.5 text-xs text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          value={profile.email}
          disabled
          className="h-11 w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm text-gray-500"
        />
        <p className="mt-1.5 text-xs text-gray-400">
          Used to match your orders — contact support to change it.
        </p>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          {...register("phone")}
          placeholder="01XXXXXXXXX"
          className="h-11 w-full rounded-lg border border-gray-300 px-4 text-sm outline-none transition focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
        />
        {errors.phone && (
          <p className="mt-1.5 text-xs text-red-500">
            {errors.phone.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-pink-500 to-rose-500 px-6 py-2.5 text-sm font-medium text-white transition hover:from-pink-600 hover:to-rose-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending && <Loader2 size={16} className="animate-spin" />}
        Save Changes
      </button>
    </form>
  );
}
