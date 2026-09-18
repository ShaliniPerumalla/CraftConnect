import React, { useState } from 'react';

export default function DesignApproval({ 
  designMockupUrl = "https://via.placeholder.com/600x400?text=Design+Mockup+Preview", 
  version = 1, 
  onApprove, 
  onRequestRevision 
}) {
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [revisionNote, setRevisionNote] = useState('');

  const handleRevisionSubmit = (e) => {
    e.preventDefault();
    if (!revisionNote.trim()) return;
    if (onRequestRevision) {
      onRequestRevision(revisionNote);
    }
    setRevisionNote('');
    setShowRevisionModal(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 my-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Design Phase Approval</h3>
          <p className="text-sm text-gray-500">Version {version} uploaded by Creator</p>
        </div>
        <span className="px-3 py-1 bg-amber-50 text-amber-700 font-medium text-xs rounded-full border border-amber-200">
          Pending Customer Review
        </span>
      </div>

      {/* Mockup Preview Area */}
      <div className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50 mb-6 flex items-center justify-center min-h-[300px]">
        <img 
          src={designMockupUrl} 
          alt={`Design Mockup v${version}`} 
          className="max-h-[450px] object-contain w-full"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <button
          type="button"
          onClick={() => setShowRevisionModal(true)}
          className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors text-sm"
        >
          Request Revision
        </button>
        <button
          type="button"
          onClick={onApprove}
          className="px-5 py-2.5 rounded-lg bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors text-sm shadow-sm"
        >
          Approve Design & Start Production
        </button>
      </div>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Request Design Changes</h4>
            <p className="text-sm text-gray-600 mb-4">
              Describe the specific changes you'd like the creator to make to version {version}.
            </p>
            <form onSubmit={handleRevisionSubmit}>
              <textarea
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                placeholder="E.g., Please make the pattern darker and adjust the dimension slightly..."
                rows={4}
                required
                className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none mb-4"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowRevisionModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                >
                  Submit Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}