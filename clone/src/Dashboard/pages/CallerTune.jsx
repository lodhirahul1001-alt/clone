import React, { useState } from 'react';
import { Copy, Eye } from 'lucide-react';

export default function CallerTune() {
  const [activeTab, setActiveTab] = useState('Pending');

  const callerTunes = [
    {
      cover: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=50&h=50&fit=crop",
      title: "Lathi Goli Chalte Re",
      upc: "751451660748",
      artists: "Prem Raja",
      label: "PY Manjar",
      releaseApprovedAt: "Thu, 05 Dec 24 03:45 PM"
    },
    {
      cover: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=50&h=50&fit=crop",
      title: "Hukum Rakh",
      upc: "751451646131",
      artists: "Sharn",
      label: "P4 Records",
      releaseApprovedAt: "Mon, 02 Dec 24 05:30 PM"
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          {['Pending', 'Awaiting Approval', 'Approved', 'Rejected'].map((tab) => (
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

        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="search"
              placeholder="Search this list..."
              className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5">🔍</span>
          </div>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Copy size={20} />
          </button>
        </div>
      </div>

      <div className="bg-transparent rounded-lg shadow">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4">Cover</th>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4">UPC</th>
              <th className="text-left p-4">Artists</th>
              <th className="text-left p-4">Label</th>
              <th className="text-left p-4">Release Approved At</th>
              <th className="text-left p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {callerTunes.map((tune, index) => (
              <tr key={index} className="border-b">
                <td className="p-4">
                  <img src={tune.cover} alt={tune.title} className="w-12 h-12 rounded object-cover" />
                </td>
                <td className="p-4">{tune.title}</td>
                <td className="p-4">{tune.upc}</td>
                <td className="p-4">{tune.artists}</td>
                <td className="p-4">{tune.label}</td>
                <td className="p-4">{tune.releaseApprovedAt}</td>
                <td className="p-4">
                  <button className="p-2 text-gray-400 hover:text-gray-600">
                    <Eye size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
