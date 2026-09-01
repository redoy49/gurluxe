"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { registerUser } from "./actions";
import { registerSchema } from "@/lib/validations/auth.schema";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data) => {
    startTransition(async () => {
      const res = await registerUser(data);

      if (res.success) {
        toast.success(res.message);
        reset();
      } else {
        toast.error(res.message);
      }
    });
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-pink-100 bg-white/95 p-6 shadow-[0_10px_60px_rgba(244,114,182,.15)] backdrop-blur-xl sm:p-8">
      {/* Heading */}
      <h1 className="bg-linear-to-r from-rose-400 to-pink-400 bg-clip-text text-center text-3xl font-bold text-transparent">
        Create Your Account
      </h1>

      <p className="mt-2 text-center text-sm text-gray-500">
        Already have an account?
        <Link
          href="/login"
          className="ml-1 bg-linear-to-r from-pink-500 to-rose-500 bg-clip-text font-medium text-transparent transition hover:opacity-80"
        >
          Log in
        </Link>
      </p>

      {/* Social Buttons */}
      <div className="mt-8 space-y-3">
        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 transition hover:border-pink-300 hover:shadow-md"
        >
          <GoogleIcon />
          <span>Create account with Google</span>
        </button>

        <button
          type="button"
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-900 transition hover:border-pink-300 hover:shadow-md"
        >
          <AppleIcon />
          <span>Create account with Apple</span>
        </button>
      </div>

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-pink-100" />
        <p className="text-sm text-gray-400">or continue with email</p>
        <div className="h-px flex-1 bg-pink-100" />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Full name"
            {...register("name")}
            className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
          />

          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email address"
            {...register("email")}
            className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
          />

          {errors.email && (
            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              {...register("password")}
              className="h-12 w-full rounded-xl border border-gray-200 px-4 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-pink-400 focus:ring-4 focus:ring-pink-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-pink-500"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          {errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="h-12 w-full rounded-xl bg-linear-to-r from-pink-400 via-pink-500 to-rose-500 px-4 text-sm font-semibold text-white transition hover:from-pink-500 hover:via-pink-600 hover:to-rose-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Creating..." : "Create Account"}
        </button>
      </form>

      {/* Footer */}
      <div className="mt-5 text-center">
        <p className="text-xs leading-relaxed text-gray-400">
          By creating an account, you agree to our{" "}
          <a
            href="#"
            className="font-medium text-pink-500 underline underline-offset-2 transition hover:text-pink-600"
          >
            Terms & Conditions
          </a>{" "}
          and{" "}
          <a
            href="#"
            className="font-medium text-pink-500 underline underline-offset-2 transition hover:text-pink-600"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className="h-5 w-5 shrink-0"
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
      />
      <path
        fill="#FF3D00"
        d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
      fill="currentColor"
      className="h-5 w-5 shrink-0 text-black"
      aria-hidden="true"
    >
      <path d="M44.527344 34.75C43.449219 37.144531 42.929688 38.214844 41.542969 40.328125C39.601563 43.28125 36.863281 46.96875 33.480469 46.992188C30.46875 47.019531 29.691406 45.027344 25.601563 45.0625C21.515625 45.082031 20.664063 47.03125 17.648438 47C14.261719 46.96875 11.671875 43.648438 9.730469 40.699219C4.300781 32.429688 3.726563 22.734375 7.082031 17.578125C9.457031 13.921875 13.210938 11.773438 16.738281 11.773438C20.332031 11.773438 22.589844 13.746094 25.558594 13.746094C28.441406 13.746094 30.195313 11.769531 34.351563 11.769531C37.492188 11.769531 40.8125 13.480469 43.1875 16.433594C35.421875 20.691406 36.683594 31.78125 44.527344 34.75ZM31.195313 8.46875C32.707031 6.527344 33.855469 3.789063 33.4375 1C30.972656 1.167969 28.089844 2.742188 26.40625 4.78125C24.878906 6.640625 23.613281 9.398438 24.105469 12.066406C26.796875 12.152344 29.582031 10.546875 31.195313 8.46875Z" />
    </svg>
  );
}
