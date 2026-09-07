export default function StatCard({ label, value, sub, icon: Icon }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between">
        <p className="text-sm text-gray-500">{label}</p>

        {Icon && (
          <span className="rounded-lg bg-gray-100 p-2 text-gray-500">
            <Icon className="h-4 w-4" />
          </span>
        )}
      </div>

      <h2 className="mt-2 text-3xl font-bold text-gray-900">{value}</h2>

      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
