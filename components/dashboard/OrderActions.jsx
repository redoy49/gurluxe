"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, Truck, XCircle } from "lucide-react";
import {
  confirmOrder,
  startProcessing,
  markShipped,
  markDelivered,
  cancelOrder,
  verifyPayment,
  rejectPayment,
  refundPayment,
} from "@/app/(dashboard)/dashboard/orders/actions";

function PrimaryButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

function DangerButton({ onClick, disabled, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex items-center gap-2 rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {children}
    </button>
  );
}

export default function OrderActions({ orderId, status, paymentStatus, paymentMethod }) {
  const router = useRouter();
  const [isPending, startAction] = useTransition();
  const [shipFormOpen, setShipFormOpen] = useState(false);
  const [cancelFormOpen, setCancelFormOpen] = useState(false);
  const [courier, setCourier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [cancelReason, setCancelReason] = useState("");

  function run(action, ...args) {
    startAction(async () => {
      const result = await action(...args);

      if (result.success) {
        toast.success(result.message);
        setShipFormOpen(false);
        setCancelFormOpen(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    });
  }

  const canCancel = ["pending", "confirmed", "processing"].includes(status);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        {status === "pending" && (
          <PrimaryButton onClick={() => run(confirmOrder, orderId)} disabled={isPending}>
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Confirm Order
          </PrimaryButton>
        )}

        {status === "confirmed" && (
          <PrimaryButton onClick={() => run(startProcessing, orderId)} disabled={isPending}>
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Start Processing
          </PrimaryButton>
        )}

        {status === "processing" && !shipFormOpen && (
          <PrimaryButton onClick={() => setShipFormOpen(true)} disabled={isPending}>
            <Truck size={14} />
            Mark Shipped
          </PrimaryButton>
        )}

        {status === "shipped" && (
          <PrimaryButton onClick={() => run(markDelivered, orderId)} disabled={isPending}>
            {isPending && <Loader2 size={14} className="animate-spin" />}
            Mark Delivered
          </PrimaryButton>
        )}

        {canCancel && !cancelFormOpen && (
          <DangerButton onClick={() => setCancelFormOpen(true)} disabled={isPending}>
            <XCircle size={14} />
            Cancel Order
          </DangerButton>
        )}

        {status === "delivered" && paymentStatus === "paid" && (
          <DangerButton onClick={() => run(refundPayment, orderId)} disabled={isPending}>
            Issue Refund
          </DangerButton>
        )}

        {status === "cancelled" && paymentStatus === "paid" && (
          <DangerButton onClick={() => run(refundPayment, orderId)} disabled={isPending}>
            Issue Refund
          </DangerButton>
        )}
      </div>

      {shipFormOpen && (
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
          <p className="mb-3 text-sm font-medium text-gray-900">
            Shipping details (optional)
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <input
              value={courier}
              onChange={(e) => setCourier(e.target.value)}
              placeholder="Courier (e.g. Pathao, Sundarban)"
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-black"
            />
            <input
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Tracking / consignment number"
              className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm outline-none focus:border-black"
            />
          </div>
          <div className="mt-3 flex gap-2">
            <PrimaryButton
              onClick={() => run(markShipped, orderId, { courier, trackingNumber })}
              disabled={isPending}
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              Confirm Shipment
            </PrimaryButton>
            <button
              type="button"
              onClick={() => setShipFormOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {cancelFormOpen && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="mb-3 text-sm font-medium text-red-800">
            Cancel this order? Reserved stock will be returned to inventory.
          </p>
          <input
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Reason (optional)"
            className="h-10 w-full rounded-lg border border-red-200 bg-white px-3 text-sm outline-none focus:border-red-400"
          />
          <div className="mt-3 flex gap-2">
            <DangerButton onClick={() => run(cancelOrder, orderId, cancelReason)} disabled={isPending}>
              {isPending && <Loader2 size={14} className="animate-spin" />}
              Confirm Cancellation
            </DangerButton>
            <button
              type="button"
              onClick={() => setCancelFormOpen(false)}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              Never mind
            </button>
          </div>
        </div>
      )}

      {paymentMethod !== "cod" && paymentStatus === "pending_verification" && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="mb-3 text-sm font-medium text-amber-800">
            Verify the transaction id against your merchant account before
            accepting this payment.
          </p>
          <div className="flex gap-2">
            <PrimaryButton onClick={() => run(verifyPayment, orderId)} disabled={isPending}>
              Mark Payment Verified
            </PrimaryButton>
            <DangerButton onClick={() => run(rejectPayment, orderId)} disabled={isPending}>
              Mark Payment Failed
            </DangerButton>
          </div>
        </div>
      )}
    </div>
  );
}
