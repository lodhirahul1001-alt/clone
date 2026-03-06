import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { adminGetCallbacksApi, adminUpdateCallbackStatusApi } from "../../apis/AdminApis";
import { AxiosIntance } from "../../config/Axios.Intance";

const statusOptions = ["new", "contacted", "closed"];


export default function AdminCallbacks() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await adminGetCallbacksApi({ search: query, status: statusFilter, limit: 50 });
      setItems(data?.items || []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load callbacks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) =>
      [c.name, c.phone, c.email, c.enquiryFor].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [items, query]);


  const deleteCallback = async (id) => {
    if (!window.confirm("Delete this callback request?")) return;
    try {
      await AxiosIntance.delete(`/callbacks/admin/${id}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
      toast.success("Callback deleted");
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to delete");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await adminUpdateCallbackStatusApi(id, { status });
      setItems((prev) => prev.map((x) => (x._id === id ? { ...x, status } : x)));
      toast.success("Callback updated");
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to update");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Admin · Callback Requests</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Requests submitted from website (saved in MongoDB).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="dash-input" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="dash-input">
            <option value="all">All status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s} className="drop-down">
                {s}
              </option>
            ))}
          </select>
          <button className="dash-btn" type="button" onClick={fetchItems} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <div className="dash-card p-3 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: "var(--muted)" }}>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Phone</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Enquiry</th>
              <th className="text-left p-2">Preferred Time</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td className="p-2" colSpan={7}>
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td className="p-2" colSpan={7}>
                  No requests found
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c._id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                  <td className="p-2 whitespace-nowrap">{c.name}</td>
                  <td className="p-2 whitespace-nowrap">{c.phone}</td>
                  <td className="p-2">{c.email || "-"}</td>
                  <td className="p-2">{c.enquiryFor || "-"}</td>
                  <td className="p-2 whitespace-nowrap">{c.preferredTime || "-"}</td>
                  <td className="p-2 whitespace-nowrap">
                    <select className="dash-input" value={c.status || "new"} onChange={(e) => updateStatus(c._id, e.target.value)}>
                      {statusOptions.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-2 whitespace-nowrap"><button className="dash-btn" type="button" onClick={() => deleteCallback(c._id)}>Delete</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
