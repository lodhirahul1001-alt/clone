import React from 'react';

export default function Legal() {
  const conflicts = [
    {
      assetId: 'ASSET001',
      type: 'Copyright',
      otherParty: 'Music Label X',
      upc: '123456789',
      isrc: 'ABCD1234567',
      status: 'Pending',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Ownership Conflict and Reference Overlap
        </h1>
        <div className="relative">
          <input
            type="search"
            placeholder="Search this list..."
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5">🔍</span>
        </div>
      </div>

      <div className="bg-transparent rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-4">Asset Id</th>
              <th className="text-left p-4">Type</th>
              <th className="text-left p-4">Other Party</th>
              <th className="text-left p-4">UPC</th>
              <th className="text-left p-4">ISRC</th>
              <th className="text-left p-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {conflicts.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              conflicts.map((conflict, index) => (
                <tr key={index} className="border-b">
                  <td className="p-4">{conflict.assetId}</td>
                  <td className="p-4">{conflict.type}</td>
                  <td className="p-4">{conflict.otherParty}</td>
                  <td className="p-4">{conflict.upc}</td>
                  <td className="p-4">{conflict.isrc}</td>
                  <td className="p-4">
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                      {conflict.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
