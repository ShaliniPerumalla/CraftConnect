import React from 'react';

export default function ProductionTracker({ 
  updates = [
    { id: 1, date: '2026-09-15', stage: 'Material Sourcing', note: 'Raw materials procured and prepared.', image: 'https://via.placeholder.com/300x200?text=Materials' },
    { id: 2, date: '2026-09-17', stage: 'Manufacturing', note: 'Initial assembly in progress.', image: 'https://via.placeholder.com/300x200?text=In+Production' }
  ]
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 my-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Production Tracking</h3>
          <p className="text-sm text-gray-500">Live progress updates from the creator</p>
        </div>
        <span className="px-3 py-1 bg-blue-50 text-blue-700 font-medium text-xs rounded-full border border-blue-200">
          In Production
        </span>
      </div>

      {/* Progress Updates List */}
      <div className="space-y-6">
        {updates.map((update) => (
          <div key={update.id} className="flex gap-4 border-l-2 border-amber-500 pl-4 py-1">
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-800">{update.stage}</h4>
                <span className="text-xs text-gray-400">{update.date}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{update.note}</p>
              {update.image && (
                <img 
                  src={update.image} 
                  alt={update.stage} 
                  className="mt-3 rounded-lg w-48 h-32 object-cover border border-gray-200" 
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}