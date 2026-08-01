import { Check } from "lucide-react";

export default function CartStepper() {
  const steps = [
    {
      number: 1,
      title: "Cart",
      active: true,
      completed: true,
    },
    {
      number: 2,
      title: "Checkout",
      active: false,
      completed: false,
    },
    {
      number: 3,
      title: "Payment",
      active: false,
      completed: false,
    },
  ];

  return (
    <div className="mx-auto mb-10 flex max-w-xl items-center justify-center">
      {steps.map((step, index) => (
        <div key={step.number} className="flex flex-1 items-center">
          <div className="flex flex-col items-center">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium ${
                step.completed || step.active
                  ? "border-black bg-black text-white"
                  : "border-gray-300 bg-white text-gray-400"
              }`}
            >
              {step.completed ? (
                <Check size={14} strokeWidth={3} />
              ) : (
                step.number
              )}
            </div>

            <span
              className={`mt-2 text-xs font-medium ${
                step.active || step.completed
                  ? "text-gray-900"
                  : "text-gray-400"
              }`}
            >
              {step.title}
            </span>
          </div>

          {index !== steps.length - 1 && (
            <div
              className={`mb-5 h-px flex-1 ${
                step.completed ? "bg-black" : "bg-gray-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
