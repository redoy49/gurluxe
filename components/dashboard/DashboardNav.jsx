"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderTree,
  Package,
  ShoppingCart,
  Users,
  Settings,
} from "lucide-react";

const menu = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: FolderTree,
  },
  {
    name: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
  },
  {
    name: "Customers",
    href: "/dashboard/customers",
    icon: Users,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export default function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-1 p-4">
      {menu.map((item) => {
        const Icon = item.icon;
        const active =
          item.href === "/dashboard"
            ? pathname === "/dashboard"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
              active
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-100 hover:text-black"
            }`}
          >
            <Icon className="h-5 w-5" />
            {item.name}
          </Link>
        );
      })}
    </nav>
  );
}
