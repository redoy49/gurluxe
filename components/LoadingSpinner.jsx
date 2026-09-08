import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ label = "Loading...", className = "" }) {
  return (
    <div className={`flex min-h-[40vh] flex-col items-center justify-center gap-3 ${className}`}>
      <Loader2 className="h-6 w-6 animate-spin text-current" />
      <p className="text-sm text-current opacity-70">{label}</p>
    </div>
  );
}
