import Link from "next/link";
import Image from "next/image";
import { LayoutDashboard } from "lucide-react";
import AccountTabs from "./AccountTabs";

export default function AccountShell({ user, children }) {
  const initial = user?.name?.[0]?.toUpperCase() || "?";

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-col gap-4 rounded-3xl border border-pink-100 bg-linear-to-r from-pink-50 via-white to-rose-50 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name || "Account"}
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 rounded-full object-cover ring-2 ring-white"
            />
          ) : (
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-r from-pink-400 to-rose-500 text-xl font-bold text-white shadow-md shadow-pink-200">
              {initial}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-lg font-bold text-gray-900">
              {user?.name}
            </p>
            <p className="truncate text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>

        {user?.role === "admin" && (
          <Link
            href="/dashboard"
            className="inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-pink-200 bg-white px-4 py-2 text-sm font-medium text-pink-600 transition hover:bg-pink-50 sm:self-auto"
          >
            <LayoutDashboard size={16} />
            Go to Dashboard
          </Link>
        )}
      </div>

      <AccountTabs isAdmin={user?.role === "admin"} />

      <div className="mt-8 pb-16">{children}</div>
    </div>
  );
}
