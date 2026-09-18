import React from 'react';

export default function DeliveryTracking({
  courierName = "BlueDart Express",
  trackingNumber = "BD-982347102-IN",
  estimatedDelivery = "Sept 22, 2026",
  status = "Out for Delivery"
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(trackingNumber);
    alert('Tracking ID copied to clipboard!');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 my-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Delivery & Logistics</h3>
          <p className="text-sm text-gray-500">Track your package arrival</p>
        </div>
        <span className="px-3 py-1 bg-green-50 text-green-700 font-medium text-xs rounded-full border border-green-200">
          {status}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <div>
          <span className="text-xs text-gray-500 uppercase font-semibold">Courier Service</span>
          <p className="text-sm font-medium text-gray-800 mt-1">{courierName}</p>
        </div>

        <div>
          <span className="text-xs text-gray-500 uppercase font-semibold">Tracking Number</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-mono font-medium text-gray-800">{trackingNumber}</span>
            <button 
              onClick={handleCopy}
              className="text-xs text-amber-600 hover:text-amber-700 underline"
            >
              Copy
            </button>
          </div>
        </div>

        <div>
          <span className="text-xs text-gray-500 uppercase font-semibold">Estimated Delivery</span>
          <p className="text-sm font-medium text-amber-700 mt-1">{estimatedDelivery}</p>
        </div>
      </div>
    </div>
  );
}