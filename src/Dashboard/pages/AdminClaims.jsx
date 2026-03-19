import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AxiosIntance } from "../../config/Axios.Intance";
import { adminGetClaimsApi, adminUpdateClaimStatusApi } from "../../apis/AdminApis";

const statusOptions = ["pending", "approved", "rejected"];
const toTitle = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

export default function AdminClaims() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

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

  useEffect(() => { fetchItems(); }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((c) =>
      [c.claimUrl, c.releaseTitle, c.releasePublicId, c.isrc, c?.user?.email]
        .filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [items, query]);

  const updateStatus = async (id, status) => {
    try {
      await adminUpdateClaimStatusApi(id, { status });
      setItems((prev) => prev.map((x) => (x._id === id ? { ...x, status } : x)));
      toast.success("Claim updated");
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to update");
    }
  };

  const deleteClaim = async (id) => {
    if (!window.confirm("Delete this claim?")) return;
    try {
      await AxiosIntance.delete(`/claims/admin/${id}`);
      setItems((prev) => prev.filter((x) => x._id !== id));
      toast.success("Claim deleted");
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to delete");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Admin · Claims</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Create claim entries saved in MongoDB.</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search..." className="dash-input" />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="dash-input">
            <option value="all">All Status</option>
            {statusOptions.map((s) => <option key={s} value={s}>{toTitle(s)}</option>)}
          </select>
          <button className="dash-btn" type="button" onClick={fetchItems} disabled={loading}>Refresh</button>
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
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td className="p-2" colSpan={7}>Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td className="p-2" colSpan={7}>No claims found</td></tr>
            ) : (
              filtered.map((c) => (
                <tr key={c._id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                  <td className="p-2"><div className="font-medium">{c?.user?.fullName || '-'}</div><div className="text-xs" style={{ color: "var(--muted)" }}>{c?.user?.email || ''}</div></td>
                  <td className="p-2 uppercase">{c.claimCategory}</td>
                  <td className="p-2">{c.releaseTitle || '-'}</td>
                  <td className="p-2">{c.isrc || '-'}</td>
                  <td className="p-2 max-w-[280px] truncate"><a className="underline" href={c.claimUrl} target="_blank" rel="noreferrer">{c.claimUrl}</a></td>
                  <td className="p-2"><select className="dash-input" value={c.status || 'pending'} onChange={(e)=>updateStatus(c._id, e.target.value)}>{statusOptions.map((s)=><option key={s} value={s}>{toTitle(s)}</option>)}</select></td>
                  <td className="p-2"><button className="dash-btn" type="button" onClick={()=>deleteClaim(c._id)}>Delete</button></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}