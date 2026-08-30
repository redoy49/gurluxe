import { Check } from "lucide-react";

export default function CheckoutStepper({ currentStep = 2 }) {
  const steps = [
    {
      id: 1,
      title: "Cart",
    },
    {
      id: 2,
      title: "Checkout",
    },
    {
      id: 3,
      title: "Payment",
    },
  ];

  return (
    <div className="mx-auto mb-10 flex max-w-xl items-center justify-center">
      {steps.map((step, index) => {
        const completed = currentStep > step.id;
        const active = currentStep === step.id;

        return (
          <div key={step.id} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-xs font-medium transition ${
                  completed || active
                    ? "border-black bg-black text-white"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {completed ? (
                  <Check size={14} strokeWidth={3} />
                ) : (
                  step.id
                )}
              </div>

              <span
                className={`mt-2 text-xs font-medium ${
                  completed || active
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
                  completed ? "bg-black" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}