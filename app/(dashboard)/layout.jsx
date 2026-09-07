// app/(dashboard)/layout.jsx

import Link from "next/link";
import { ShoppingBag, LogOut } from "lucide-react";
import DashboardNav from "@/components/dashboard/DashboardNav";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 h-screen w-72 border-r border-gray-200 bg-white">
          <div className="flex h-16 items-center border-b border-gray-200 px-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold text-gray-900"
            >
              <ShoppingBag className="h-6 w-6" />
              Gurluxe
            </Link>
          </div>

          <DashboardNav />

          <div className="absolute bottom-0 left-0 w-full border-t border-gray-200 p-4">
            <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50">
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1">
          <div className="min-h-screen p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
