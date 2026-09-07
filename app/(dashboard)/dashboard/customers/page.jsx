import { Users } from "lucide-react";
import { getCustomers } from "@/lib/queries/customers";
import StatCard from "@/components/dashboard/StatCard";

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function CustomersPage() {
  const { customers, totalCustomers, guestOrderCount } = await getCustomers();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
        <p className="mt-1 text-sm text-gray-500">
          People with an account on your store.
        </p>
      </div>

      <div className="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Registered Customers"
          value={totalCustomers}
          icon={Users}
        />
        <StatCard
          label="Guest Orders"
          value={guestOrderCount}
          sub="Checked out without an account"
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Joined
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Total Spent
                </th>
              </tr>
            </thead>

            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-gray-100 last:border-none hover:bg-gray-50"
                >
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                        {c.name?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{c.name}</p>
                        <p className="text-sm text-gray-500">{c.email}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-700">
                    {formatDate(c.joinedAt)}
                  </td>

                  <td className="px-6 py-5 text-sm text-gray-700">
                    {c.orderCount}
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-gray-900">
                    ৳ {c.totalSpent.toLocaleString()}
                  </td>
                </tr>
              ))}

              {customers.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-16 text-center text-gray-500"
                  >
                    No registered customers yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
