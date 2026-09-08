const STATUS_STYLES = {
  unpaid: "bg-gray-100 text-gray-700",
  pending_verification: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
};

const STATUS_LABELS = {
  unpaid: "Unpaid",
  pending_verification: "Verification Pending",
  paid: "Paid",
  failed: "Failed",
  refunded: "Refunded",
};

export default function PaymentStatusBadge({ status }) {
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
        STATUS_STYLES[status] || "bg-gray-100 text-gray-700"
      }`}
    >
      {STATUS_LABELS[status] || status}
    </span>
  );
}
