import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  adminApprovePaymentApi,
  adminApproveWithdrawalApi,
  adminGetPaymentsApi,
  adminGetWithdrawalsApi,
  adminRejectPaymentApi,
  adminRejectWithdrawalApi,
} from "../../apis/AdminApis";

const paymentStatusOptions = ["pending", "approved", "rejected"];

function money(v) {
  const n = Number(v || 0);
  return Number.isFinite(n) ? n.toFixed(2) : "0.00";
}

function fmtDate(v) {
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString();
  } catch {
    return "-";
  }
}

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState("payments"); // payments | withdrawals
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [savingId, setSavingId] = useState("");
  const lastFetchKeyRef = useRef("");

  const fetchList = async () => {
    const key = `${activeTab}|${query}|${statusFilter}`;
    lastFetchKeyRef.current = key;

    try {
      setLoading(true);
      const params = {
        search: query?.trim() || "",
        status: statusFilter === "all" ? undefined : statusFilter,
        limit: 50,
      };

      const data =
        activeTab === "withdrawals"
          ? await adminGetWithdrawalsApi(params)
          : await adminGetPaymentsApi(params);

      // backend can return {payments: []} or {withdrawals: []} or {items: []}
      const list =
        data?.items ||
        data?.payments ||
        data?.withdrawals ||
        data?.data ||
        [];

      // avoid race overwrite (fast filter changes)
      if (lastFetchKeyRef.current === key) setItems(Array.isArray(list) ? list : []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const blob = [
        it?._id,
        it?.status,
        it?.method,
        it?.referenceId,
        it?.transactionId,
        it?.utr,
        it?.note,
        it?.user?.email,
        it?.user?.fullName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [items, query]);

  const applyStatus = async (row, newStatus) => {
    if (!row?._id) return;
    if (row.status === newStatus) return;

    const id = row._id;

    try {
      setSavingId(id);

      if (activeTab === "withdrawals") {
        if (newStatus === "approved") await adminApproveWithdrawalApi(id);
        else if (newStatus === "rejected") await adminRejectWithdrawalApi(id);
        else throw new Error("Withdrawals can only be approved/rejected");
      } else {
        if (newStatus === "approved") await adminApprovePaymentApi(id);
        else if (newStatus === "rejected") await adminRejectPaymentApi(id);
        else throw new Error("Payments can only be approved/rejected");
      }

      toast.success("Status updated");
      setItems((prev) => prev.map((p) => (p._id === id ? { ...p, status: newStatus } : p)));
    } catch (e) {
      toast.error(e?.response?.data?.msg || e?.message || "Failed to update status");
    } finally {
      setSavingId("");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Admin · Payments</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Manage payment requests & withdrawals. Status update will be visible to users.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className={
              "dash-btn " +
              (activeTab === "payments" ? "dash-btn-primary" : "")
            }
            onClick={() => setActiveTab("payments")}
          >
            Payments
          </button>
          <button
            type="button"
            className={
              "dash-btn " +
              (activeTab === "withdrawals" ? "dash-btn-primary" : "")
            }
            onClick={() => setActiveTab("withdrawals")}
          >
            Withdrawals
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search email/utr/txn/id..."
            className="dash-input"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="dash-input"
          >
            <option className="drop-down" value="all">
              All status
            </option>
            {paymentStatusOptions.map((s) => (
              <option className="drop-down" key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button className="dash-btn" type="button" onClick={fetchList} disabled={loading}>
            Refresh
          </button>
        </div>
      </div>

      <div className="dash-card p-3 rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: "var(--muted)" }}>
              <th className="text-left p-2">User</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">Method</th>
              <th className="text-left p-2">Reference</th>
              <th className="text-left p-2">Created</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Action</th>
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
                  No {activeTab} found
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                  <td className="p-2 whitespace-nowrap">
                    <div className="font-medium">{p?.user?.fullName || "-"}</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>
                      {p?.user?.email || "-"}
                    </div>
                  </td>
                  <td className="p-2 whitespace-nowrap">₹ {money(p.amount)}</td>
                  <td className="p-2 whitespace-nowrap">{p.method || p.gateway || "-"}</td>
                  <td className="p-2 min-w-[220px]">
                    <div className="truncate" title={p.referenceId || p.transactionId || p.utr || ""}>
                      {p.referenceId || p.transactionId || p.utr || "-"}
                    </div>
                    {p.note ? (
                      <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                        {p.note}
                      </div>
                    ) : null}
                  </td>
                  <td className="p-2 whitespace-nowrap">{fmtDate(p.createdAt || p.date)}</td>
                  <td className="p-2 whitespace-nowrap">
                    <span className="px-2 py-1 rounded-lg dash-badge">
                      {p.status || "pending"}
                    </span>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <select
                        className="dash-input"
                        value={p.status || "pending"}
                        onChange={(e) => applyStatus(p, e.target.value)}
                        disabled={savingId === p._id}
                      >
                        <option className="drop-down" value="pending" disabled>
                          pending
                        </option>
                        <option className="drop-down" value="approved">
                          approved
                        </option>
                        <option className="drop-down" value="rejected">
                          rejected
                        </option>
                      </select>

                      <button
                        type="button"
                        onClick={() =>
                          applyStatus(
                            p,
                            p.status === "approved" ? "rejected" : "approved"
                          )
                        }
                        className="dash-btn"
                        disabled={savingId === p._id}
                        title="Quick toggle (approved/rejected)"
                      >
                        {savingId === p._id ? "Saving..." : "Update"}
                      </button>
                    </div>
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
