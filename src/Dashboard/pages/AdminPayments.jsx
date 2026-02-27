import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  adminGetPaymentsApi,
  adminApprovePaymentApi,
  adminRejectPaymentApi,
  adminGetUserTransactionsApi,
  adminUpdateUserWalletApi,
} from "../../apis/AdminApis";

const statusOptions = ["pending", "approved", "rejected"];

const badgeClass = {
  pending: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  approved: "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
  rejected: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
};

export default function AdminPayments() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [preview, setPreview] = useState(null);
  const [selected, setSelected] = useState(null);
  const [txLoading, setTxLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [walletDraft, setWalletDraft] = useState({ balance: "", pendingEarnings: "", maxWithdrawal: "" });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await adminGetPaymentsApi({ search: query, status: statusFilter, limit: 50 });
      setItems(data?.items || []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load payments");
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
    return items.filter((p) =>
      [p.fullName, p.email, p.phone, p.transactionId].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [items, query]);

  const updateStatus = async (id, status) => {
    // legacy - keep UI simple: status is controlled by approve/reject now
    toast("Use Approve/Reject buttons", { icon: "ℹ️" });
  };

  const openPayment = async (p) => {
    setSelected(p);
    const w = p?.user?.wallet || { balance: 0, pendingEarnings: 0, maxWithdrawal: 0 };
    setWalletDraft({
      balance: String(w.balance ?? 0),
      pendingEarnings: String(w.pendingEarnings ?? 0),
      maxWithdrawal: String(w.maxWithdrawal ?? 0),
    });

    if (p?.user?._id) {
      try {
        setTxLoading(true);
        const res = await adminGetUserTransactionsApi(p.user._id);
        setTransactions(res?.items || []);
      } catch {
        setTransactions([]);
      } finally {
        setTxLoading(false);
      }
    } else {
      setTransactions([]);
    }
  };

  const approve = async (p) => {
    try {
      await adminApprovePaymentApi(p._id, { note: "Approved by admin" });
      toast.success("Payment approved & wallet credited");
      await fetchItems();
      if (selected?._id === p._id) openPayment({ ...p, status: "approved" });
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Approve failed");
    }
  };

  const reject = async (p) => {
    const reason = window.prompt("Reject reason (optional):") || "";
    try {
      await adminRejectPaymentApi(p._id, { reason });
      toast.success("Payment rejected");
      await fetchItems();
      if (selected?._id === p._id) openPayment({ ...p, status: "rejected" });
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Reject failed");
    }
  };

  const saveWallet = async () => {
    if (!selected?.user?._id) return toast.error("No linked user found");
    try {
      await adminUpdateUserWalletApi(selected.user._id, {
        balance: Number(walletDraft.balance) || 0,
        pendingEarnings: Number(walletDraft.pendingEarnings) || 0,
        maxWithdrawal: Number(walletDraft.maxWithdrawal) || 0,
        note: "Admin wallet update",
      });
      toast.success("Wallet updated");
      await fetchItems();
      openPayment(items.find((x) => x._id === selected._id) || selected);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Wallet update failed");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Admin · Payments</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Payment verification form entries (transaction + screenshot).
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
              <th className="text-left p-2">Transaction</th>
              <th className="text-left p-2">Amount</th>
              <th className="text-left p-2">UPI</th>
              <th className="text-left p-2">Screenshot</th>
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
                  No payments found
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p._id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                  <td className="p-2">
                    <div className="font-medium">{p.fullName}</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>{p.email}</div>
                    <div className="text-xs" style={{ color: "var(--muted)" }}>{p.phone}</div>
                    {p?.user?.wallet ? (
                      <div className="text-[11px] mt-1" style={{ color: "var(--muted)" }}>
                        Wallet: ₹{Number(p.user.wallet.balance || 0).toFixed(2)}
                      </div>
                    ) : null}
                  </td>
                  <td className="p-2 whitespace-nowrap">{p.transactionId}</td>
                  <td className="p-2 whitespace-nowrap">{p.amount || "-"}</td>
                  <td className="p-2 whitespace-nowrap">{p.upiId || "-"}</td>
                  <td className="p-2">
                    {p.screenshotUrl ? (
                      <button className="underline" type="button" onClick={() => setPreview(p.screenshotUrl)}>
                        Preview
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full border text-xs capitalize ${badgeClass[p.status] || badgeClass.pending}`}>
                      {p.status || "pending"}
                    </span>
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <div className="flex gap-2">
                      <button className="dash-btn" type="button" onClick={() => openPayment(p)}>
                        Manage
                      </button>
                      {p.status === "pending" ? (
                        <>
                          <button className="dash-btn" type="button" onClick={() => approve(p)}>
                            Approve
                          </button>
                          <button className="dash-btn" type="button" onClick={() => reject(p)}>
                            Reject
                          </button>
                        </>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Screenshot preview modal */}
      {preview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setPreview(null)}>
          <div className="dash-card p-3 rounded-2xl max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="font-semibold">Screenshot Preview</div>
              <button className="dash-btn" type="button" onClick={() => setPreview(null)}>Close</button>
            </div>
            <div className="mt-3 overflow-auto max-h-[70vh]">
              <img src={preview} alt="screenshot" className="w-full rounded-xl" />
            </div>
          </div>
        </div>
      ) : null}

      {/* Manage modal */}
      {selected ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={() => setSelected(null)}>
          <div className="dash-card p-4 rounded-2xl max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div>
                <div className="text-lg font-semibold">Manage Payment</div>
                <div className="text-xs" style={{ color: "var(--muted)" }}>{selected.email} · Txn: {selected.transactionId}</div>
              </div>
              <div className="flex gap-2">
                {selected.status === "pending" ? (
                  <>
                    <button className="dash-btn" type="button" onClick={() => approve(selected)}>Approve</button>
                    <button className="dash-btn" type="button" onClick={() => reject(selected)}>Reject</button>
                  </>
                ) : null}
                <button className="dash-btn" type="button" onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="dash-card p-3 rounded-2xl">
                <div className="font-semibold">Wallet</div>
                <div className="mt-3 grid grid-cols-1 gap-2">
                  <label className="text-xs" style={{ color: "var(--muted)" }}>Current Balance</label>
                  <input className="dash-input" value={walletDraft.balance} onChange={(e) => setWalletDraft((s) => ({ ...s, balance: e.target.value }))} />
                  <label className="text-xs" style={{ color: "var(--muted)" }}>Pending Earnings</label>
                  <input className="dash-input" value={walletDraft.pendingEarnings} onChange={(e) => setWalletDraft((s) => ({ ...s, pendingEarnings: e.target.value }))} />
                  <label className="text-xs" style={{ color: "var(--muted)" }}>Max Withdrawal</label>
                  <input className="dash-input" value={walletDraft.maxWithdrawal} onChange={(e) => setWalletDraft((s) => ({ ...s, maxWithdrawal: e.target.value }))} />
                  <button className="dash-btn mt-2" type="button" onClick={saveWallet}>
                    Save Wallet
                  </button>
                  {!selected?.user?._id ? (
                    <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                      This payment is not linked to a user automatically. Ensure the payment email matches the user email.
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="dash-card p-3 rounded-2xl">
                <div className="font-semibold">Transaction History</div>
                <div className="mt-3 max-h-64 overflow-auto">
                  {txLoading ? (
                    <div className="text-sm">Loading...</div>
                  ) : transactions.length === 0 ? (
                    <div className="text-sm" style={{ color: "var(--muted)" }}>No transactions</div>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ color: "var(--muted)" }}>
                          <th className="text-left p-2">Type</th>
                          <th className="text-left p-2">Amount</th>
                          <th className="text-left p-2">Balance After</th>
                          <th className="text-left p-2">When</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transactions.map((t) => (
                          <tr key={t._id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                            <td className="p-2 capitalize">{t.type}</td>
                            <td className="p-2">₹{Number(t.amount || 0).toFixed(2)}</td>
                            <td className="p-2">₹{Number(t.balanceAfter || 0).toFixed(2)}</td>
                            <td className="p-2 text-xs" style={{ color: "var(--muted)" }}>
                              {new Date(t.createdAt).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>

            {selected?.screenshotUrl ? (
              <div className="mt-4">
                <button className="dash-btn" type="button" onClick={() => setPreview(selected.screenshotUrl)}>
                  View Screenshot
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
