import React, { useState } from "react";
// import axios from "axios";

export default function Labels() {
  const [labels] = useState([]);

  // useEffect(() => {
  //   fetchLabels();
  // }, []);

  // const fetchLabels = async () => {
  //   try {
  //     const res = await axios.get("http://localhost:5000/api/labels");
  //     setLabels(res.data);
  //   } catch (err) {
  //     console.error("Error fetching labels:", err);
  //   }
  // };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl  ml-8 font-semibold">Manage Labels</h1>
        <div className="flex gap-4">
          <input
            type="search"
            placeholder="Search label..."
            className="pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {labels.length === 0 ? (
        <p className="text-gray-500  ml-8">No labels found. Add one to get started.</p>
      ) : (
        <div className="bg-transparent rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">URL</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Created</th>
                <th className="text-left p-4">Approved</th>
                <th className="text-left p-4">Expire</th>
                <th className="text-left p-4">Mode</th>
              </tr>
            </thead>
            <tbody>
              {labels.map((label) => (
                <tr key={label._id} className="border-b">
                  <td className="p-4">{label.name}</td>
                  <td className="p-4">{label.type}</td>
                  <td className="p-4">
                    <a
                      href={label.url}
                      className="text-blue-600 hover:underline truncate block max-w-xs"
                    >
                      {label.url}
                    </a>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded ${
                        label.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : label.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {label.status}
                    </span>
                  </td>
                  <td className="p-4">{label.created}</td>
                  <td className="p-4">{label.approved}</td>
                  <td className="p-4">{label.expire}</td>
                  <td className="p-4">{label.mode}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t flex justify-between items-center">
            <span>{labels.length} items</span>
            <div className="flex items-center gap-2">
              <select className="border rounded px-2 py-1">
                <option>25 / page</option>
                <option>50 / page</option>
                <option>100 / page</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
