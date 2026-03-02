import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  adminGetClaimsApi,
  adminUpdateClaimStatusApi,
  adminDeleteClaimApi, // ✅ add this
} from "../../apis/AdminApis";

const statusOptions = ["pending", "approved", "rejected"];

export default function AdminClaims() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [workingId, setWorkingId] = useState(null); // ✅ to disable action buttons per row

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await adminGetClaimsApi({ search: query, status: statusFilter, limit: 50 });
      setItems(data?.claims || []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load claims");
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
      [c.claimUrl, c.releaseTitle, c.releasePublicId, c.isrc, c?.user?.email]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, query]);

  const updateStatus = async (id, status) => {
    try {
      setWorkingId(id);
      await adminUpdateClaimStatusApi(id, { status });
      setItems((prev) => prev.map((x) => (x._id === id ? { ...x, status } : x)));
      toast.success("Claim updated");
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to update");
    } finally {
      setWorkingId(null);
    }
  };

  const deleteClaim = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this claim?");
    if (!ok) return;

    try {
      setWorkingId(id);
      await adminDeleteClaimApi(id);
      setItems((prev) => prev.filter((x) => x._id !== id));
      toast.success("Claim deleted");
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to delete");
    } finally {
      setWorkingId(null);
    }
  };

  const ActionButtons = ({ claim }) => {
    const disabled = workingId === claim._id;
const getButtonStyle = (type) => {
  const current = claim.status || "pending";
  const isActive = current === type;

  const base =
    "px-3 py-1.5 rounded-md text-xs font-medium border transition-all duration-200";

  const styles = {
    pending: isActive
      ? "bg-yellow-500 text-white border-yellow-500"
      : "text-gray-300 border-gray-600 hover:bg-yellow-500 hover:text-white hover:border-yellow-500",

    approved: isActive
      ? "bg-green-600 text-white border-green-600"
      : "text-gray-300 border-gray-600 hover:bg-green-600 hover:text-white hover:border-green-600",

    rejected: isActive
      ? "bg-red-600 text-white border-red-600"
      : "text-gray-300 border-gray-600 hover:bg-red-600 hover:text-white hover:border-red-600",
  };

  return `${base} ${styles[type]}`;
};
   
   
 return (
 <div className="flex items-center gap-2 flex-wrap">

  <button
    type="button"
    className={getButtonStyle("pending")}
    onClick={() => updateStatus(claim._id, "pending")}
    disabled={disabled}
  >
    Pending
  </button>

  <button
    type="button"
    className={getButtonStyle("approved")}
    onClick={() => updateStatus(claim._id, "approved")}
    disabled={disabled}
  >
    Approve
  </button>

  <button
    type="button"
    className={getButtonStyle("rejected")}
    onClick={() => updateStatus(claim._id, "rejected")}
    disabled={disabled}
  >
    Reject
  </button>

  <button
    type="button"
    className="px-3 py-1.5 rounded-md text-xs font-medium border border-red-700 text-red-400 hover:bg-red-700 hover:text-white transition-all duration-200"
    onClick={() => deleteClaim(claim._id)}
    disabled={disabled}
  >
    Delete
  </button>

</div>
 )
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Admin · Claims</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Create claim entries saved in MongoDB.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="dash-input" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="dash-input">
            <option value="all">All status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>
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
              <th className="text-left p-2">User</th>
              <th className="text-left p-2">Category</th>
              <th className="text-left p-2">Release</th>
              <th className="text-left p-2">ISRC</th>
              <th className="text-left p-2">URL</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Action</th> {/* ✅ new */}
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
                  No claims found
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c._id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                  <td className="p-2">
                    <div className="font-medium">{c?.user?.fullName || "-"}</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      {c?.user?.email || "-"}
                    </div>
                  </td>

                  <td className="p-2 whitespace-nowrap">{c.claimCategory}</td>
                  <td className="p-2">{c.releaseTitle || c.releasePublicId || "-"}</td>
                  <td className="p-2 whitespace-nowrap">{c.isrc || "-"}</td>

                  <td className="p-2 max-w-[280px] truncate">
                    <a className="underline" href={c.claimUrl} target="_blank" rel="noreferrer">
                      {c.claimUrl}
                    </a>
                  </td>

                  <td className="p-2 whitespace-nowrap">
                    {(c.status || "pending").toUpperCase()}
                  </td>

                  <td className="p-2">
                    <ActionButtons claim={c} />
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