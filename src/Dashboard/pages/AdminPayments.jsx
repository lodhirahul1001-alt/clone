import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  adminCreateEarningApi,
  adminGetEarningsApi,
  adminGetPaymentsApi,
  adminGetUsersApi,
  adminGetWithdrawalsApi,
  adminPayWithdrawalApi,
  adminUpdatePaymentStatusApi,
  adminUpdateWithdrawalStatusApi,
} from "../../apis/AdminApis";

const verificationStatusOptions = ["pending", "verified", "rejected"];
const withdrawalStatusOptions = ["pending", "approved", "rejected", "paid"];

const formatINR = (n) => {
  const num = Number(n || 0);
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(num);
  } catch {
    return `INR ${num.toFixed(2)}`;
  }
};

// Uploads are served from backend under /uploads (outside /api). Build absolute URLs for links.
const backendOrigin = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api").replace(/\/?api\/?$/, "");
const assetUrl = (p) => (p && String(p).startsWith("/uploads") ? `${backendOrigin}${p}` : p);

export default function AdminPayments() {
  const [tab, setTab] = useState("verifications");

  // =====================
  // 1) Payment Verifications
  // =====================
  const [vLoading, setVLoading] = useState(false);
  const [verifications, setVerifications] = useState([]);
  const [vQuery, setVQuery] = useState("");
  const [vStatusFilter, setVStatusFilter] = useState("all");

  const fetchVerifications = async () => {
    try {
      setVLoading(true);
      const data = await adminGetPaymentsApi({ search: vQuery, status: vStatusFilter, limit: 50 });
      setVerifications(data?.items || []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load payments");
    } finally {
      setVLoading(false);
    }
  };

  const updateVerificationStatus = async (id, status) => {
    try {
      await adminUpdatePaymentStatusApi(id, { status });
      setVerifications((prev) => prev.map((x) => (x._id === id ? { ...x, status } : x)));
      toast.success("Payment updated");
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to update");
    }
  };

  // =====================
  // 2) Earnings (Admin sets user earning)
  // =====================
  const [eLoading, setELoading] = useState(false);
  const [earnings, setEarnings] = useState([]);
  const [eQuery, setEQuery] = useState("");

  const [userSearch, setUserSearch] = useState("");
  const [userOptions, setUserOptions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [earningForm, setEarningForm] = useState({ amount: "", description: "", earningDate: "" });

  const fetchUsers = async () => {
    try {
      const res = await adminGetUsersApi({ search: userSearch, limit: 20, page: 1 });
      setUserOptions(res?.users || []);
    } catch {
      setUserOptions([]);
    }
  };

  const fetchEarnings = async () => {
    try {
      setELoading(true);
      const data = await adminGetEarningsApi({ search: eQuery, limit: 50 });
      setEarnings(data?.items || []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load earnings");
    } finally {
      setELoading(false);
    }
  };

  const addEarning = async () => {
    const amt = Number(earningForm.amount);
    if (!selectedUser?._id) return toast.error("Select a user");
    if (!amt || Number.isNaN(amt) || amt < 0) return toast.error("Enter valid amount");

    try {
      await adminCreateEarningApi({
        userId: selectedUser._id,
        amount: amt,
        description: earningForm.description,
        earningDate: earningForm.earningDate || undefined,
      });
      toast.success("Earning added");
      setEarningForm({ amount: "", description: "", earningDate: "" });
      await fetchEarnings();
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to add earning");
    }
  };

  // =====================
  // 3) Withdrawals (Admin processes)
  // =====================
  const [wLoading, setWLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [wQuery, setWQuery] = useState("");
  const [wStatusFilter, setWStatusFilter] = useState("all");

  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payingItem, setPayingItem] = useState(null);
  const [payForm, setPayForm] = useState({
    transactionId: "",
    paidAmount: "",
    paidDate: "",
    accountName: "",
    accountNo: "",
    screenshot: null,
  });
  const [paySubmitting, setPaySubmitting] = useState(false);

  const fetchWithdrawals = async () => {
    try {
      setWLoading(true);
      const data = await adminGetWithdrawalsApi({ search: wQuery, status: wStatusFilter, limit: 50 });
      setWithdrawals(data?.items || []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load withdrawals");
    } finally {
      setWLoading(false);
    }
  };

  const updateWithdrawalStatus = async (id, status) => {
    try {
      await adminUpdateWithdrawalStatusApi(id, { status });
      setWithdrawals((prev) => prev.map((x) => (x._id === id ? { ...x, status } : x)));
      toast.success("Withdrawal updated");
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to update");
    }
  };

  const openPayModal = (item) => {
    setPayingItem(item);
    setPayForm({
      transactionId: "",
      paidAmount: String(item?.amount || ""),
      paidDate: new Date().toISOString().slice(0, 16),
      accountName: item?.bankDetails?.accountHolderName || "",
      accountNo: item?.bankDetails?.accountNumber || "",
      screenshot: null,
    });
    setPayModalOpen(true);
  };

  const submitPay = async (e) => {
    e.preventDefault();
    if (!payingItem?._id) return;
    if (!payForm.transactionId.trim()) return toast.error("Enter transaction id");
    if (!payForm.paidAmount) return toast.error("Enter paid amount");

    const fd = new FormData();
    fd.append("transactionId", payForm.transactionId);
    fd.append("paidAmount", payForm.paidAmount);
    if (payForm.paidDate) fd.append("paidDate", payForm.paidDate);
    if (payForm.accountName) fd.append("accountName", payForm.accountName);
    if (payForm.accountNo) fd.append("accountNo", payForm.accountNo);
    if (payForm.screenshot) fd.append("screenshot", payForm.screenshot);

    try {
      setPaySubmitting(true);
      const res = await adminPayWithdrawalApi(payingItem._id, fd);
      toast.success("Marked as paid");
      setWithdrawals((prev) => prev.map((x) => (x._id === payingItem._id ? res?.item || x : x)));
      setPayModalOpen(false);
      setPayingItem(null);
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to pay");
    } finally {
      setPaySubmitting(false);
    }
  };

  // initial load
  useEffect(() => {
    fetchVerifications();
    fetchEarnings();
    fetchWithdrawals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filteredVerifications = useMemo(() => {
    const q = vQuery.trim().toLowerCase();
    if (!q) return verifications;
    return verifications.filter((p) =>
      [p.fullName, p.email, p.phone, p.transactionId].filter(Boolean).join(" ").toLowerCase().includes(q)
    );
  }, [verifications, vQuery]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Admin · Payments</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            Verify plan payments, set user earnings, and process withdrawals.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className={`dash-btn ${tab === "verifications" ? "dash-btn-primary" : ""}`}
            onClick={() => setTab("verifications")}
          >
            Verifications
          </button>
          <button
            type="button"
            className={`dash-btn ${tab === "earnings" ? "dash-btn-primary" : ""}`}
            onClick={() => setTab("earnings")}
          >
            Earnings
          </button>
          <button
            type="button"
            className={`dash-btn ${tab === "withdrawals" ? "dash-btn-primary" : ""}`}
            onClick={() => setTab("withdrawals")}
          >
            Withdrawals
          </button>
        </div>
      </div>

      {/* =====================
          TAB: VERIFICATIONS
          ===================== */}
      {tab === "verifications" && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <input value={vQuery} onChange={(e) => setVQuery(e.target.value)} placeholder="Search..." className="dash-input" />
            <select value={vStatusFilter} onChange={(e) => setVStatusFilter(e.target.value)} className="dash-input">
              <option value="all">All status</option>
              {verificationStatusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button className="dash-btn" type="button" onClick={fetchVerifications} disabled={vLoading}>
              Refresh
            </button>
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
                </tr>
              </thead>
              <tbody>
                {vLoading ? (
                  <tr>
                    <td className="p-2" colSpan={6}>
                      Loading...
                    </td>
                  </tr>
                ) : filteredVerifications.length === 0 ? (
                  <tr>
                    <td className="p-2" colSpan={6}>
                      No payments found
                    </td>
                  </tr>
                ) : (
                  filteredVerifications.map((p) => (
                    <tr key={p._id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                      <td className="p-2">
                        <div className="font-medium">{p.fullName}</div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>{p.email}</div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>{p.phone}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap">{p.transactionId}</td>
                      <td className="p-2 whitespace-nowrap">{p.amount || "-"}</td>
                      <td className="p-2 whitespace-nowrap">{p.upiId || "-"}</td>
                      <td className="p-2">
                        {p.screenshotUrl ? (
                          <a className="underline" href={assetUrl(p.screenshotUrl)} target="_blank" rel="noreferrer">
                            View
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <select
                          className="dash-input"
                          value={p.status || "pending"}
                          onChange={(e) => updateVerificationStatus(p._id, e.target.value)}
                        >
                          {verificationStatusOptions.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* =====================
          TAB: EARNINGS
          ===================== */}
      {tab === "earnings" && (
        <div className="space-y-4">
          <div className="dash-card p-4 sm:p-6 rounded-2xl">
            <h2 className="text-lg font-semibold">Set Earnings for User</h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Admin can credit earnings to a user. User will see totals (monthly/yearly) and can request withdrawal.
            </p>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm" style={{ color: "var(--muted)" }}>Find User (email/name)</label>
                <div className="flex gap-2 mt-2">
                  <input
                    className="dash-input flex-1"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search user..."
                  />
                  <button className="dash-btn" type="button" onClick={fetchUsers}>
                    Search
                  </button>
                </div>

                <div className="mt-2">
                  <select
                    className="dash-input w-full"
                    value={selectedUser?._id || ""}
                    onChange={(e) => {
                      const u = userOptions.find((x) => x._id === e.target.value);
                      setSelectedUser(u || null);
                    }}
                  >
                    <option value="">Select user</option>
                    {userOptions.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.fullName} · {u.email}
                      </option>
                    ))}
                  </select>
                  {selectedUser ? (
                    <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                      Selected: <span className="font-medium">{selectedUser.fullName}</span> ({selectedUser.email})
                    </div>
                  ) : null}
                </div>
              </div>

              <div>
                <label className="text-sm" style={{ color: "var(--muted)" }}>Amount (INR)</label>
                <input
                  className="dash-input mt-2"
                  type="number"
                  min={0}
                  step="0.01"
                  value={earningForm.amount}
                  onChange={(e) => setEarningForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="0"
                />

                <label className="text-sm mt-4 block" style={{ color: "var(--muted)" }}>Description</label>
                <input
                  className="dash-input mt-2"
                  value={earningForm.description}
                  onChange={(e) => setEarningForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Spotify royalties, YouTube CMS..."
                />

                <label className="text-sm mt-4 block" style={{ color: "var(--muted)" }}>Earning Date (optional)</label>
                <input
                  className="dash-input mt-2"
                  type="datetime-local"
                  value={earningForm.earningDate}
                  onChange={(e) => setEarningForm((p) => ({ ...p, earningDate: e.target.value }))}
                />

                <button className="btn-primary mt-4" type="button" onClick={addEarning}>
                  Add Earning
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <input value={eQuery} onChange={(e) => setEQuery(e.target.value)} placeholder="Search earnings..." className="dash-input" />
            <button className="dash-btn" type="button" onClick={fetchEarnings} disabled={eLoading}>
              Refresh
            </button>
          </div>

          <div className="dash-card p-3 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "var(--muted)" }}>
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {eLoading ? (
                  <tr>
                    <td className="p-2" colSpan={4}>Loading...</td>
                  </tr>
                ) : (earnings || []).length === 0 ? (
                  <tr>
                    <td className="p-2" colSpan={4}>No earnings</td>
                  </tr>
                ) : (
                  (earnings || []).map((it) => (
                    <tr key={it._id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                      <td className="p-2">
                        <div className="font-medium">{it?.user?.fullName || "-"}</div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>{it?.user?.email || "-"}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap font-medium">{formatINR(it.amount)}</td>
                      <td className="p-2">{it.description || "-"}</td>
                      <td className="p-2 whitespace-nowrap">{it.earningDate ? new Date(it.earningDate).toLocaleString() : "-"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* =====================
          TAB: WITHDRAWALS
          ===================== */}
      {tab === "withdrawals" && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <input value={wQuery} onChange={(e) => setWQuery(e.target.value)} placeholder="Search user..." className="dash-input" />
            <select value={wStatusFilter} onChange={(e) => setWStatusFilter(e.target.value)} className="dash-input">
              <option value="all">All status</option>
              {withdrawalStatusOptions.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <button className="dash-btn" type="button" onClick={fetchWithdrawals} disabled={wLoading}>
              Refresh
            </button>
          </div>

          <div className="dash-card p-3 rounded-2xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "var(--muted)" }}>
                  <th className="text-left p-2">User</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Bank Details</th>
                  <th className="text-left p-2">Requested</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {wLoading ? (
                  <tr>
                    <td className="p-2" colSpan={6}>Loading...</td>
                  </tr>
                ) : withdrawals.length === 0 ? (
                  <tr>
                    <td className="p-2" colSpan={6}>No withdrawals</td>
                  </tr>
                ) : (
                  withdrawals.map((w) => (
                    <tr key={w._id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                      <td className="p-2">
                        <div className="font-medium">{w?.user?.fullName || "-"}</div>
                        <div className="text-xs" style={{ color: "var(--muted)" }}>{w?.user?.email || "-"}</div>
                      </td>
                      <td className="p-2 whitespace-nowrap font-medium">{formatINR(w.amount)}</td>
                      <td className="p-2">
                        <div className="text-xs">Name: {w?.bankDetails?.accountHolderName || "-"}</div>
                        <div className="text-xs">A/C: {w?.bankDetails?.accountNumber || "-"}</div>
                        <div className="text-xs">IFSC: {w?.bankDetails?.ifscCode || "-"}</div>
                        {w?.status === "paid" ? (
                          <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                            Txn: {w?.adminPayout?.transactionId || "-"} · {w?.adminPayout?.screenshotUrl ? (
                              <a className="underline" href={assetUrl(w.adminPayout.screenshotUrl)} target="_blank" rel="noreferrer">Screenshot</a>
                            ) : "No screenshot"}
                          </div>
                        ) : null}
                      </td>
                      <td className="p-2 whitespace-nowrap">{new Date(w.createdAt).toLocaleString()}</td>
                      <td className="p-2 whitespace-nowrap">
                        <select className="dash-input" value={w.status || "pending"} onChange={(e) => updateWithdrawalStatus(w._id, e.target.value)}>
                          {withdrawalStatusOptions.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {w.status !== "paid" ? (
                          <button className="btn-primary" type="button" onClick={() => openPayModal(w)}>
                            Pay
                          </button>
                        ) : (
                          "-"
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Pay Modal */}
      {payModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setPayModalOpen(false)} />
          <div className="relative w-full max-w-lg glass p-6 rounded-3xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">Mark Withdrawal as Paid</h3>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  User: <span className="font-medium">{payingItem?.user?.fullName || "-"}</span> · Amount: {formatINR(payingItem?.amount)}
                </p>
              </div>
              <button
                type="button"
                className="h-9 w-9 rounded-full grid place-items-center bg-black/5 dark:bg-white/10"
                onClick={() => setPayModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form className="mt-5 space-y-4" onSubmit={submitPay}>
              <div>
                <label className="text-sm" style={{ color: "var(--muted)" }}>Transaction ID</label>
                <input
                  className="dash-input mt-2"
                  value={payForm.transactionId}
                  onChange={(e) => setPayForm((p) => ({ ...p, transactionId: e.target.value }))}
                  placeholder="UTR / Txn ID"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm" style={{ color: "var(--muted)" }}>Payment Amount</label>
                  <input
                    className="dash-input mt-2"
                    type="number"
                    step="0.01"
                    value={payForm.paidAmount}
                    onChange={(e) => setPayForm((p) => ({ ...p, paidAmount: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm" style={{ color: "var(--muted)" }}>Payment Date</label>
                  <input
                    className="dash-input mt-2"
                    type="datetime-local"
                    value={payForm.paidDate}
                    onChange={(e) => setPayForm((p) => ({ ...p, paidDate: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm" style={{ color: "var(--muted)" }}>Account Name</label>
                  <input
                    className="dash-input mt-2"
                    value={payForm.accountName}
                    onChange={(e) => setPayForm((p) => ({ ...p, accountName: e.target.value }))}
                    placeholder="Account holder"
                  />
                </div>
                <div>
                  <label className="text-sm" style={{ color: "var(--muted)" }}>Account No</label>
                  <input
                    className="dash-input mt-2"
                    value={payForm.accountNo}
                    onChange={(e) => setPayForm((p) => ({ ...p, accountNo: e.target.value }))}
                    placeholder="Account number"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm" style={{ color: "var(--muted)" }}>Screenshot (optional)</label>
                <input
                  className="dash-input mt-2"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPayForm((p) => ({ ...p, screenshot: e.target.files?.[0] || null }))}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" className="dash-btn-secondary" onClick={() => setPayModalOpen(false)} disabled={paySubmitting}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={paySubmitting}>
                  {paySubmitting ? "Saving..." : "Confirm Paid"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
