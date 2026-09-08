import { Check, X } from "lucide-react";

const STEPS = [
  { status: "pending", label: "Order Placed" },
  { status: "confirmed", label: "Confirmed" },
  { status: "processing", label: "Processing" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

function formatDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("en-US", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Reused by both the admin order detail page and the customer's own order
// tracking page, so the two always describe the same order the same way.
export default function OrderTimeline({ status, statusHistory = [], tracking }) {
  const historyByStatus = new Map(
    statusHistory.map((entry) => [entry.status, entry.at]),
  );

  if (status === "cancelled") {
    const cancelledAt = historyByStatus.get("cancelled");

    return (
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-500 text-white">
          <X size={16} strokeWidth={2.5} />
        </span>
        <div>
          <p className="text-sm font-semibold text-red-800">
            Order Cancelled
          </p>
          {cancelledAt && (
            <p className="mt-0.5 text-xs text-red-600">
              {formatDate(cancelledAt)}
            </p>
          )}
        </div>
      </div>
    );
  }

  const currentIndex = STEPS.findIndex((step) => step.status === status);

  return (
    <div className="space-y-0">
      {STEPS.map((step, index) => {
        const done = index <= currentIndex;
        const isLast = index === STEPS.length - 1;
        const at = historyByStatus.get(step.status);

        return (
          <div key={step.status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                  done
                    ? "bg-black text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {done ? <Check size={14} strokeWidth={3} /> : index + 1}
              </span>
              {!isLast && (
                <span
                  className={`w-px flex-1 ${done && index < currentIndex ? "bg-black" : "bg-gray-200"}`}
                  style={{ minHeight: "2.25rem" }}
                />
              )}
            </div>

            <div className={isLast ? "pb-0" : "pb-6"}>
              <p
                className={`text-sm font-medium ${done ? "text-gray-900" : "text-gray-400"}`}
              >
                {step.label}
              </p>
              {at ? (
                <p className="mt-0.5 text-xs text-gray-500">{formatDate(at)}</p>
              ) : (
                done && (
                  <p className="mt-0.5 text-xs text-gray-400">In progress</p>
                )
              )}
              {step.status === "shipped" &&
                done &&
                (tracking?.courier || tracking?.trackingNumber) && (
                  <p className="mt-1 text-xs text-gray-600">
                    {tracking.courier ? `${tracking.courier} — ` : ""}
                    {tracking.trackingNumber
                      ? `Tracking: ${tracking.trackingNumber}`
                      : ""}
                  </p>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
