// src/components/order-lifecycle/OrderTimeline.jsx

import React from "react";

const STAGES = [
  { id: "ACCEPTED", label: "Quotation Accepted", step: 1 },
  { id: "DESIGN", label: "Design Phase", step: 2 },
  { id: "PRODUCTION", label: "In Production", step: 3 },
  { id: "DELIVERY", label: "Out for Delivery", step: 4 },
  { id: "COMPLETED", label: "Order Delivered", step: 5 },
];

export default function OrderTimeline({ currentStatus = "DELIVERY", productImage }) {
  // Determine current step index (1-indexed)
  const currentStep = STAGES.find((s) => s.id === currentStatus)?.step || 4;

  // Fallback craft image if none is passed in props
  const defaultImage =
    productImage ||
    "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=300&auto=format&fit=crop";

  return (
    <div className="bg-white border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
      <h2 className="font-display text-xl sm:text-2xl mb-8">Order Lifecycle Status</h2>

      <div className="relative flex items-center justify-between max-w-4xl mx-auto px-4">
        {/* Background Connecting Line */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-gray-200 z-0" />

        {/* Active Connecting Progress Line */}
        <div
          className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-amber-500 z-0 transition-all duration-500"
          style={{
            width: `${((currentStep - 1) / (STAGES.length - 1)) * 100}%`,
          }}
        />

        {/* Stage Nodes */}
        {STAGES.map((stage) => {
          const isCompleted = stage.step < currentStep;
          const isCurrent = stage.step === currentStep;
          const isPassedOrCurrent = stage.step <= currentStep;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center">
              {/* Circle Node Container */}
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center transition-all overflow-hidden ${
                  isPassedOrCurrent
                    ? "ring-4 ring-amber-500/30 border-2 border-amber-500 bg-amber-500 shadow-md"
                    : "bg-gray-100 text-gray-400 border-2 border-gray-200"
                }`}
              >
                {isPassedOrCurrent ? (
                  /* Display Product Image instead of checkmark */
                  <img
                    src={defaultImage}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Display Stage Number for future/incomplete stages */
                  <span className="text-sm font-semibold text-gray-500">
                    {stage.step}
                  </span>
                )}
              </div>

              {/* Stage Label */}
              <p
                className={`text-xs sm:text-sm font-medium mt-3 text-center max-w-[90px] leading-snug ${
                  isCurrent
                    ? "text-amber-600 font-bold"
                    : isCompleted
                    ? "text-gray-900 font-semibold"
                    : "text-gray-400"
                }`}
              >
                {stage.label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}