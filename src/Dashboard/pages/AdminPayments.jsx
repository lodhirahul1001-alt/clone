import React, { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  FileImage,
  Filter,
  RefreshCw,
  Search,
  Send,
  XCircle,
} from "lucide-react";

import {
  adminApproveWithdrawalApi,
  adminGetWithdrawalsApi,
  adminRejectWithdrawalApi,
  adminPayWithdrawalApi,
  adminGetUsersApi,
  adminUpdateUserWalletApi,
  adminGetUserTransactionsApi,
} from "../../apis/AdminApis";

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

function badge(status) {
  const s = String(status || "pending");
  if (s === "paid") return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200";
  if (s === "approved") return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200";
  if (s === "rejected") return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200";
  return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200";
}

function toTitle(s = "") {
  const v = String(s);
  return v ? v.charAt(0).toUpperCase() + v.slice(1) : "";
}

function safeBankLine(w) {
  const b = w?.bankDetails || {};
  const name = b?.accountHolderName || "";
  const acc = b?.accountNumber ? `••••${String(b.accountNumber).slice(-4)}` : "";
  const ifsc = b?.ifscCode || "";
  return [name, acc, ifsc].filter(Boolean).join(" · ") || "-";
}

export default function AdminPayments() {
  const [tab, setTab] = useState("withdrawals"); // withdrawals | earnings

  // withdrawals state
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("pending");
  const [savingId, setSavingId] = useState("");
  const lastFetchKeyRef = useRef("");

  // payout modal
  const [payOpen, setPayOpen] = useState(false);
  const [payRow, setPayRow] = useState(null);
  const [payForm, setPayForm] = useState({
    paidAmount: "",
    transactionId: "",
    remark: "",
    contactNo: "",
    screenshotFile: null,
  });

  // earnings (credit) state
  const [userSearch, setUserSearch] = useState("");
  const [usersLoading, setUsersLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [creditAmount, setCreditAmount] = useState("");
  const [creditDesc, setCreditDesc] = useState("");
  const [crediting, setCrediting] = useState(false);
  const [userTx, setUserTx] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  const fetchWithdrawals = async () => {
    const key = `${status}|${q}`;
    lastFetchKeyRef.current = key;

    try {
      setLoading(true);
      const data = await adminGetWithdrawalsApi({
        limit: 100,
        status: status === "all" ? undefined : status,
        search: q?.trim() || "",
      });
      const list = data?.items || data?.withdrawals || [];
      if (lastFetchKeyRef.current === key) setWithdrawals(Array.isArray(list) ? list : []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tab !== "withdrawals") return;
    fetchWithdrawals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const filteredWithdrawals = useMemo(() => {
    const list = Array.isArray(withdrawals) ? withdrawals : [];
    const qq = q.trim().toLowerCase();
    if (!qq) return list;
    return list.filter((w) => {
      const blob = [
        w?._id,
        w?.status,
        w?.user?.fullName,
        w?.user?.email,
        w?.amount,
        w?.bankDetails?.accountHolderName,
        w?.bankDetails?.accountNumber,
        w?.bankDetails?.ifscCode,
        w?.adminPayout?.transactionId,
        w?.adminPayout?.note,
        w?.adminPayout?.remark,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(qq);
    });
  }, [withdrawals, q]);

  const stats = useMemo(() => {
    const list = Array.isArray(withdrawals) ? withdrawals : [];
    const pending = list.filter((w) => w?.status === "pending").length;
    const approved = list.filter((w) => w?.status === "approved").length;
    const rejected = list.filter((w) => w?.status === "rejected").length;
    const paid = list.filter((w) => w?.status === "paid").length;
    const pendingAmt = list
      .filter((w) => w?.status === "pending" || w?.status === "approved")
      .reduce((a, b) => a + Number(b?.amount || 0), 0);
    return { pending, approved, rejected, paid, pendingAmt };
  }, [withdrawals]);

  const approve = async (row) => {
    if (!row?._id) return;
    try {
      setSavingId(row._id);
      await adminApproveWithdrawalApi(row._id);
      toast.success("Approved");
      fetchWithdrawals();
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to approve");
    } finally {
      setSavingId("");
    }
  };

  const reject = async (row) => {
    if (!row?._id) return;
    const note = window.prompt("Reject reason (optional)", "");
    try {
      setSavingId(row._id);
      await adminRejectWithdrawalApi(row._id, note ? { note } : {});
      toast.success("Rejected");
      fetchWithdrawals();
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to reject");
    } finally {
      setSavingId("");
    }
  };

  const openPay = (row) => {
    setPayRow(row);
    setPayForm({
      paidAmount: String(row?.amount ?? ""),
      transactionId: "",
      remark: "",
      contactNo: "",
      screenshotFile: null,
    });
    setPayOpen(true);
  };

  const submitPay = async (e) => {
    e.preventDefault();
    if (!payRow?._id) return;

    const paidAmount = Number(payForm.paidAmount);
    if (!paidAmount || Number.isNaN(paidAmount) || paidAmount <= 0) {
      toast.error("Enter valid paid amount");
      return;
    }
    if (!String(payForm.transactionId || "").trim()) {
      toast.error("Transaction No / ID is required");
      return;
    }

    try {
      setSavingId(payRow._id);
      await adminPayWithdrawalApi(payRow._id, {
        paidAmount,
        transactionId: String(payForm.transactionId).trim(),
        remark: payForm.remark,
        contactNo: payForm.contactNo,
        screenshotFile: payForm.screenshotFile,
      });
      toast.success("Marked as paid");
      setPayOpen(false);
      setPayRow(null);
      fetchWithdrawals();
    } catch (e2) {
      toast.error(e2?.response?.data?.msg || "Failed to mark paid");
    } finally {
      setSavingId("");
    }
  };

  // ===== Earnings (credit) =====

  const fetchUsers = async () => {
    try {
      setUsersLoading(true);
      const data = await adminGetUsersApi({
        search: userSearch?.trim() || "",
        limit: 200,
      });
      const list = data?.users || data?.items || data?.allUsers || [];
      setUsers(Array.isArray(list) ? list : []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load users");
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    if (tab !== "earnings") return;
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const fetchSelectedUserTx = async (uid) => {
    if (!uid) {
      setUserTx([]);
      return;
    }
    try {
      setTxLoading(true);
      const data = await adminGetUserTransactionsApi(uid);
      const items = data?.items || data?.transactions || [];
      const onlyEarnings = (Array.isArray(items) ? items : []).filter((t) => t?.type === "earning");
      setUserTx(onlyEarnings);
    } catch {
      setUserTx([]);
    } finally {
      setTxLoading(false);
    }
  };

  useEffect(() => {
    if (tab !== "earnings") return;
    fetchSelectedUserTx(selectedUserId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUserId, tab]);

  const credit = async (e) => {
    e.preventDefault();
    const amt = Number(creditAmount);
    if (!selectedUserId) {
      toast.error("Select a user");
      return;
    }
    if (!amt || Number.isNaN(amt) || amt < 0) {
      toast.error("Enter valid amount");
      return;
    }

    try {
      setCrediting(true);
      await adminUpdateUserWalletApi(selectedUserId, {
        amount: amt,
        description: creditDesc,
      });
      toast.success("Earning credited");
      setCreditAmount("");
      setCreditDesc("");
      fetchSelectedUserTx(selectedUserId);
    } catch (e2) {
      toast.error(e2?.response?.data?.msg || "Failed to credit");
    } finally {
      setCrediting(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-semibold">Admin · Payment Dashboard</h1>
          <p className="text-sm capitalize" style={{ color: "var(--muted)" }}>
            Manually credit earnings and process withdrawal requests (pending / reject / approve / paid).
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            className={"dash-btn " + (tab === "withdrawals" ? "dash-btn-primary" : "")}
            onClick={() => setTab("withdrawals")}
          >
            Withdrawals
          </button>
          <button
            type="button"
            className={"dash-btn " + (tab === "earnings" ? "dash-btn-primary" : "")}
            onClick={() => setTab("earnings")}
          >
            Credit Earnings
          </button>
        </div>
      </div>


      {tab === "withdrawals" ? (
        <>
          <div className="grid grid-cols-1 capitalize md:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="dash-card-soft p-5 rounded-2xl min-h-[92px]">
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                Pending
              </div>
              <div className="mt-2 text-2xl font-semibold flex items-center gap-3">
                <Clock className="h-5 w-5 shrink-0" /> {stats.pending}
              </div>
            </div>
            <div className="dash-card-soft p-5 rounded-2xl min-h-[92px]">
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                Approved
              </div>
              <div className="mt-2 text-2xl font-semibold flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 shrink-0" /> {stats.approved}
              </div>
            </div>
            <div className="dash-card-soft p-5 rounded-2xl min-h-[92px]">
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                Paid
              </div>
              <div className="mt-2 text-2xl font-semibold flex items-center gap-3">
                <Send className="h-5 w-5 shrink-0" /> {stats.paid}
              </div>
            </div>
            <div className="dash-card-soft p-5 rounded-2xl min-h-[92px]">
              <div className="text-xs" style={{ color: "var(--muted)" }}>
                Pending Amount
              </div>
              <div className="mt-2 text-2xl font-semibold flex items-center gap-3">
                <DollarSign className="h-5 w-5 shrink-0" /> {money(stats.pendingAmt)}
              </div>
            </div>
          </div>

          <div className="dash-card p-5 rounded-2xl">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3 flex-wrap w-full xl:w-auto">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted)" }} />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search user / txn / bank / amount..."
                    className="dash-input w-full min-h-[44px] pl-10 pr-4 leading-none"
                  />
                </div>

                <div className="relative min-w-[160px]">
                  <Filter className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--muted)" }} />
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="dash-input dash-select-themed w-full min-h-[44px] pl-10 pr-10 leading-none"
                  >
                    <option className="drop-down" value="all">All</option>
                    <option className="drop-down" value="pending">Pending</option>
                    <option className="drop-down" value="approved">Approved</option>
                    <option className="drop-down" value="rejected">Rejected</option>
                    <option className="drop-down" value="paid">Paid</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="dash-btn"
                  onClick={fetchWithdrawals}
                  disabled={loading}
                >
                  <RefreshCw className={"h-4 w-4 " + (loading ? "animate-spin" : "")} />
                  Refresh
                </button>
              </div>

              <div className="text-xs" style={{ color: "var(--muted)" }}>
                Showing {filteredWithdrawals.length} requests
              </div>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "var(--muted)" }}>
                    <th className="text-left p-2">User</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Bank</th>
                    <th className="text-left p-2">Requested</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td className="p-3" colSpan={6}>
                        Loading...
                      </td>
                    </tr>
                  ) : filteredWithdrawals.length === 0 ? (
                    <tr>
                      <td className="p-3" colSpan={6}>
                        No withdrawal requests
                      </td>
                    </tr>
                  ) : (
                    filteredWithdrawals.map((w) => (
                      <tr key={w._id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                        <td className="p-2 whitespace-nowrap">
                          <div className="font-medium">{w?.user?.fullName || "-"}</div>
                          <div className="text-xs" style={{ color: "var(--muted)" }}>
                            {w?.user?.email || "-"}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">$ {money(w.amount)}</td>
                        <td className="p-2 min-w-[240px]">
                          <div className="truncate" title={safeBankLine(w)}>
                            {safeBankLine(w)}
                          </div>
                          {w?.adminPayout?.transactionId ? (
                            <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                              Txn: {w.adminPayout.transactionId}
                            </div>
                          ) : null}
                        </td>
                        <td className="p-2 whitespace-nowrap">{fmtDate(w.createdAt)}</td>
                        <td className="p-2 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${badge(w.status)}`}>
                            {toTitle(w.status || "pending")}
                          </span>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="dash-btn"
                              disabled={savingId === w._id || w.status === "paid"}
                              onClick={() => approve(w)}
                              title="Approve"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="dash-btn"
                              disabled={savingId === w._id || w.status === "paid"}
                              onClick={() => reject(w)}
                              title="Reject"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              className="dash-btn dash-btn-primary"
                              disabled={savingId === w._id || w.status === "paid"}
                              onClick={() => openPay(w)}
                              title="Mark as Paid"
                            >
                              <Send className="h-4 w-4" />
                              Pay
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

          {/* Pay Modal */}
          {payOpen && (
            <div className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="dash-card rounded-2xl w-full max-w-xl p-5 border border-[color:var(--border)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-lg font-semibold">Release Payment</div>
                    <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                      {payRow?.user?.fullName || "User"} · $ {money(payRow?.amount)}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="dash-btn"
                    onClick={() => setPayOpen(false)}
                    disabled={savingId === payRow?._id}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={submitPay} className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs" style={{ color: "var(--muted)" }}>
                        Transaction Amount
                      </label>
                      <input
                        className="dash-input w-full"
                        type="number"
                        step="0.01"
                        value={payForm.paidAmount}
                        onChange={(e) => setPayForm((p) => ({ ...p, paidAmount: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: "var(--muted)" }}>
                        Transaction No / ID
                      </label>
                      <input
                        className="dash-input w-full"
                        value={payForm.transactionId}
                        onChange={(e) => setPayForm((p) => ({ ...p, transactionId: e.target.value }))}
                        placeholder="e.g. UTR / REF / TXN"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs" style={{ color: "var(--muted)" }}>
                      Remark (optional)
                    </label>
                    <textarea
                      className="dash-input w-full min-h-[90px]"
                      value={payForm.remark}
                      onChange={(e) => setPayForm((p) => ({ ...p, remark: e.target.value }))}
                      placeholder="Any note shown to user"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs" style={{ color: "var(--muted)" }}>
                        Screenshot (optional)
                      </label>
                      <label className="dash-btn w-full justify-center inline-flex items-center gap-2 cursor-pointer">
                        <FileImage className="h-4 w-4" />
                        {payForm.screenshotFile ? "Selected" : "Upload"}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            setPayForm((p) => ({ ...p, screenshotFile: e.target.files?.[0] || null }))
                          }
                        />
                      </label>
                    </div>
                    <div>
                      <label className="text-xs" style={{ color: "var(--muted)" }}>
                        Contact No (optional)
                      </label>
                      <input
                        className="dash-input w-full"
                        value={payForm.contactNo}
                        onChange={(e) => setPayForm((p) => ({ ...p, contactNo: e.target.value }))}
                        placeholder="WhatsApp / Phone"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2">
                    <button
                      type="button"
                      className="dash-btn"
                      onClick={() => setPayOpen(false)}
                      disabled={savingId === payRow?._id}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="dash-btn dash-btn-primary"
                      disabled={savingId === payRow?._id}
                    >
                      <CreditCard className="h-4 w-4" />
                      {savingId === payRow?._id ? "Saving..." : "Mark Paid"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div className="dash-card p-4 rounded-2xl">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div>
                <div className="text-lg font-semibold flex items-center gap-2">
                  <DollarSign className="h-5 w-5" /> Credit User Earnings
                </div>
                <div className="text-xs mt-1" style={{ color: "var(--muted)" }}>
                  Add earnings manually (e.g., based on track streams). User balance updates instantly.
                </div>
              </div>
              <button
                type="button"
                className="dash-btn"
                onClick={fetchUsers}
                disabled={usersLoading}
              >
                <RefreshCw className={"h-4 w-4 " + (usersLoading ? "animate-spin" : "")} />
                Refresh users
              </button>
            </div>

            <form onSubmit={credit} className="mt-4 grid grid-cols-1 lg:grid-cols-5 gap-3">
              <div className="lg:col-span-2">
                <label className="text-xs" style={{ color: "var(--muted)" }}>
                  User
                </label>
                <div className="flex gap-2">
                  <input
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search name/email"
                    className="dash-input w-full"
                  />
                  <button type="button" className="dash-btn" onClick={fetchUsers}>
                    <Search className="h-4 w-4" />
                  </button>
                </div>
                <select
                  className="dash-input w-full mt-2"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                >
                  <option className="drop-down" value="">
                    {usersLoading ? "Loading..." : "Select user"}
                  </option>
                  {(users || []).map((u) => (
                    <option className="drop-down" key={u._id} value={u._id}>
                      {u.fullName || u.email}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs" style={{ color: "var(--muted)" }}>
                  Amount (USD)
                </label>
                <input
                  className="dash-input w-full"
                  type="number"
                  step="0.01"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="lg:col-span-2">
                <label className="text-xs" style={{ color: "var(--muted)" }}>
                  Description (optional)
                </label>
                <input
                  className="dash-input w-full"
                  value={creditDesc}
                  onChange={(e) => setCreditDesc(e.target.value)}
                  placeholder="e.g. Streams payout (Feb 2026)"
                />
              </div>

              <div className="lg:col-span-5 flex justify-end">
                <button
                  type="submit"
                  className="dash-btn dash-btn-primary"
                  disabled={crediting}
                >
                  <Send className="h-4 w-4" />
                  {crediting ? "Saving..." : "Credit Earnings"}
                </button>
              </div>
            </form>
          </div>

          <div className="dash-card p-4 rounded-2xl">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="font-semibold">Recent earnings (selected user)</div>
              <button
                type="button"
                className="dash-btn"
                onClick={() => fetchSelectedUserTx(selectedUserId)}
                disabled={txLoading || !selectedUserId}
              >
                <RefreshCw className={"h-4 w-4 " + (txLoading ? "animate-spin" : "")} />
                Refresh
              </button>
            </div>

            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "var(--muted)" }}>
                    <th className="text-left p-2">Date</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Description</th>
                    <th className="text-left p-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {txLoading ? (
                    <tr>
                      <td className="p-3" colSpan={4}>
                        Loading...
                      </td>
                    </tr>
                  ) : !selectedUserId ? (
                    <tr>
                      <td className="p-3" colSpan={4}>
                        Select a user to view recent credits.
                      </td>
                    </tr>
                  ) : userTx.length === 0 ? (
                    <tr>
                      <td className="p-3" colSpan={4}>
                        No earnings found.
                      </td>
                    </tr>
                  ) : (
                    userTx.slice(0, 30).map((t) => (
                      <tr key={t.id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                        <td className="p-2 whitespace-nowrap">{fmtDate(t.date)}</td>
                        <td className="p-2 whitespace-nowrap">$ {money(t.amount)}</td>
                        <td className="p-2 min-w-[260px]">
                          <div className="truncate" title={t.description || ""}>
                            {t.description || "Earning credited"}
                          </div>
                        </td>
                        <td className="p-2 whitespace-nowrap">
                          <span className="px-2 py-1 rounded-lg text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
                            completed
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
