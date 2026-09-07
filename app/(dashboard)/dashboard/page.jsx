import {
  AlertTriangle,
  Package,
  ShoppingCart,
  Sparkles,
  Users,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getDashboardData } from "@/lib/queries/dashboard";
import StatCard from "@/components/dashboard/StatCard";
import ChartCard from "@/components/dashboard/ChartCard";
import CategoryBarChart from "@/components/dashboard/charts/CategoryBarChart";
import StockSoldChart from "@/components/dashboard/charts/StockSoldChart";
import CustomerGrowthChart from "@/components/dashboard/charts/CustomerGrowthChart";
import CartValueChart from "@/components/dashboard/charts/CartValueChart";

function currency(value) {
  return `৳ ${Math.round(value).toLocaleString("en-US")}`;
}

export default async function DashboardPage() {
  const {
    totals,
    categoryDistribution,
    stockVsSold,
    lowStockProducts,
    customerGrowth,
    cartValueByProduct,
    flagCounts,
    recentProducts,
  } = await getDashboardData();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-2 text-gray-500">
        Welcome back! Here&apos;s an overview of your store.
      </p>

      {/* KPI cards */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Products"
          value={totals.totalProducts}
          sub={`${totals.activeProducts} active`}
          icon={Package}
        />

        <StatCard
          label="Inventory Value"
          value={currency(totals.inventoryValue)}
          sub={`${totals.totalStockUnits.toLocaleString()} units in stock`}
          icon={Wallet}
        />

        <StatCard
          label="Customers"
          value={totals.totalCustomers}
          icon={Users}
        />

        <StatCard
          label="Cart Value (Pending)"
          value={currency(totals.cartValue)}
          sub={`${totals.cartItemCount} item${totals.cartItemCount === 1 ? "" : "s"} across ${totals.activeCarts} active cart${totals.activeCarts === 1 ? "" : "s"}`}
          icon={ShoppingCart}
        />
      </div>

      {/* Low stock alert */}
      {lowStockProducts.length > 0 && (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
          <div>
            <p className="text-sm font-medium text-orange-800">
              {lowStockProducts.length} product
              {lowStockProducts.length === 1 ? "" : "s"} running low on stock
            </p>
            <p className="mt-0.5 text-sm text-orange-700">
              {lowStockProducts
                .slice(0, 3)
                .map((p) => p.name)
                .join(", ")}
              {lowStockProducts.length > 3 &&
                ` and ${lowStockProducts.length - 3} more`}{" "}
              — consider restocking soon.
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Products by Category"
          subtitle="How your catalog is distributed"
        >
          <CategoryBarChart data={categoryDistribution} />
        </ChartCard>

        <ChartCard
          title="Stock vs. Sold"
          subtitle="Units remaining against units sold, per product"
        >
          <StockSoldChart data={stockVsSold} />
        </ChartCard>

        <ChartCard
          title="Customer Growth"
          subtitle="Cumulative signups over time"
        >
          <CustomerGrowthChart data={customerGrowth} />
        </ChartCard>

        <ChartCard
          title="Cart Value by Product"
          subtitle="What's sitting in active carts right now"
        >
          <CartValueChart data={cartValueByProduct} />
        </ChartCard>
      </div>

      {/* Merchandising flags */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-gray-400" />
          <h3 className="font-semibold text-gray-900">Merchandising Tags</h3>
        </div>

        <div className="grid grid-cols-3 divide-x divide-gray-100 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {flagCounts.featured}
            </p>
            <p className="mt-1 text-xs text-gray-500">Featured</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {flagCounts.newArrival}
            </p>
            <p className="mt-1 text-xs text-gray-500">New Arrival</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {flagCounts.bestSeller}
            </p>
            <p className="mt-1 text-xs text-gray-500">Best Seller</p>
          </div>
        </div>
      </div>

      {/* Tables */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {/* Low stock */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="font-semibold text-gray-900">Low Stock</h3>
            <p className="mt-0.5 text-xs text-gray-400">
              10 units or fewer remaining
            </p>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="px-6 py-10 text-center text-sm text-gray-400">
              Everything is well stocked.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {lowStockProducts.map((p) => (
                <li
                  key={p.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50"
                >
                  {p.image && (
                    <Image
                      src={p.image}
                      alt={p.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-400">{p.category}</p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
                      p.stock <= 3
                        ? "bg-red-100 text-red-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {p.stock} left
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent products */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h3 className="font-semibold text-gray-900">Recently Added</h3>
              <p className="mt-0.5 text-xs text-gray-400">Newest products</p>
            </div>

            <Link
              href="/dashboard/products"
              className="text-xs font-medium text-gray-500 hover:text-black"
            >
              View all
            </Link>
          </div>

          <ul className="divide-y divide-gray-100">
            {recentProducts.map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50"
              >
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-lg object-cover"
                  />
                )}

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900">
                    {p.name}
                  </p>
                  <p className="text-xs text-gray-400">{p.category}</p>
                </div>

                <p className="shrink-0 text-sm font-medium text-gray-900">
                  ৳ {p.price}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
