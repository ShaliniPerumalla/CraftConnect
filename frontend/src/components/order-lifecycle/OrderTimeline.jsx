import React from 'react';

const STAGES = [
  { id: 'ACCEPTED', label: 'Quotation Accepted', step: 1 },
  { id: 'DESIGN', label: 'Design Phase', step: 2 },
  { id: 'PRODUCTION', label: 'In Production', step: 3 },
  { id: 'DELIVERY', label: 'Out for Delivery', step: 4 },
  { id: 'COMPLETED', label: 'Order Delivered', step: 5 }
];

export default function OrderTimeline({ currentStatus = 'DESIGN' }) {
  const currentStageIndex = STAGES.findIndex(stage => stage.id === currentStatus);
  const activeIndex = currentStageIndex !== -1 ? currentStageIndex : 1;

  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border border-gray-100 my-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Order Lifecycle Status</h3>
      
      <div className="relative flex items-center justify-between w-full">
        {/* Background Track Line */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 z-0" />
        
        {/* Active Progress Track Line */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-amber-600 transition-all duration-500 z-0" 
          style={{ width: `${(activeIndex / (STAGES.length - 1)) * 100}%` }}
        />

        {/* Timeline Stage Indicators */}
        {STAGES.map((stage, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center">
              <div 
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  isCompleted 
                    ? 'bg-amber-600 text-white ring-4 ring-amber-100' 
                    : isCurrent 
                    ? 'bg-amber-500 text-white ring-4 ring-amber-200 animate-pulse' 
                    : 'bg-gray-100 text-gray-400 border border-gray-300'
                }`}
              >
                {isCompleted ? '✓' : stage.step}
              </div>
              <span 
                className={`mt-2 text-xs font-medium text-center max-w-[90px] ${
                  isCurrent ? 'text-amber-700 font-bold' : isCompleted ? 'text-gray-800' : 'text-gray-400'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}