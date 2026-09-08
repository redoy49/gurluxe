"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart } from "lucide-react";

const ALL_TABS = [
  { href: "/profile", label: "Profile", icon: User },
  { href: "/orders", label: "Orders", icon: Package },
  { href: "/wishlist", label: "Wishlist", icon: Heart },
];

// Admin accounts don't shop through the store, so the shopping-specific
// tabs (Orders, Wishlist) don't apply to them — only Profile does.
export default function AccountTabs({ isAdmin = false }) {
  const pathname = usePathname();
  const tabs = isAdmin
    ? ALL_TABS.filter((tab) => tab.href === "/profile")
    : ALL_TABS;

  return (
    <div className="mt-6 flex gap-1 overflow-x-auto border-b border-pink-100">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const active =
          pathname === tab.href || pathname.startsWith(`${tab.href}/`);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex shrink-0 items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition ${
              active
                ? "border-pink-500 text-pink-600"
                : "border-transparent text-gray-500 hover:text-gray-900"
            }`}
          >
            <Icon size={16} />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
