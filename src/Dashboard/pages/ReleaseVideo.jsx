import React, { useState } from 'react';
import { Copy, Eye } from 'lucide-react';

export default function ReleaseVideo() {
  const [activeTab, setActiveTab] = useState('Claim List');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          {['Claim List', 'Content ID', 'Artist Channel', 'Channel Whitelist'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg ${
                activeTab === tab
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-[color:var(--text)] px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          + Create
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-transparent rounded-lg p-6 w-full max-w-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Youtube Claim Request</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700">
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type <span className="text-red-500">*</span>
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2" required>
                  <option value="">Select an option</option>
                  <option value="claim">Claim</option>
                  <option value="release">Release</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter URL"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}

                  className="px-4 py-2 text-gray-700 hover:text-gray-900 dark:text-gray-200 dark:hover:text-[color:var(--text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-[color:var(--text)] px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-transparent rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">URL</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">CMS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={3} className="text-center py-8 text-gray-500">
                No data available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
