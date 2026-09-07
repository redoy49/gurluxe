const STATUS_STYLES = {
  pending: "bg-gray-100 text-gray-700",
  processing: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function OrderStatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium capitalize ${
        STATUS_STYLES[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}
