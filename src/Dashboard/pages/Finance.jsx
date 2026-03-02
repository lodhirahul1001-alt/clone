import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Hash,
  User,
  Building2,
  AlertCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  getFinanceSummaryApi,
  getMyWithdrawalsApi,
  requestWithdrawalApi,
} from "../../apis/FinanceApis";

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

const statusBadge = (status) => {
  const s = String(status || "").toLowerCase();
  if (s === "paid" || s === "completed") return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
  if (s === "approved") return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  if (s === "pending") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
  if (s === "rejected" || s === "failed") return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
  return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
};

// Uploads are served from backend under /uploads (outside /api). Build absolute URLs for links.
const backendOrigin = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api").replace(/\/?api\/?$/, "");
const assetUrl = (p) => (p && String(p).startsWith("/uploads") ? `${backendOrigin}${p}` : p);

export default function Finance() {
  const { user } = useSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [withdrawalRequest, setWithdrawalRequest] = useState({
    amount: "",
    method: "bank",
    bankDetails: {
      accountHolderName: user?.bankDetails?.accountHolderName || "",
      accountNumber: user?.bankDetails?.accountNumber || "",
      ifscCode: user?.bankDetails?.ifscCode || "",
      bankName: user?.bankDetails?.bankName || "",
      branchName: user?.bankDetails?.branchName || "",
    },
  });

  const load = async () => {
    try {
      setLoading(true);
      const [s, w] = await Promise.all([getFinanceSummaryApi(), getMyWithdrawalsApi()]);
      setSummary(s);
      setWithdrawals(w?.items || []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Failed to load finance data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totals = summary?.totals || {
    totalEarnings: 0,
    totalPaid: 0,
    pendingWithdrawals: 0,
    availableBalance: 0,
  };

  const monthly = summary?.monthly || [];
  const yearly = summary?.yearly || [];
  const transactions = summary?.recentTransactions || [];

  const maxWithdrawal = useMemo(() => totals.availableBalance || 0, [totals.availableBalance]);

  const updateBankDetails = (field, value) => {
    setWithdrawalRequest((prev) => ({
      ...prev,
      bankDetails: { ...prev.bankDetails, [field]: value },
    }));
  };

  const resetWithdrawalForm = () => {
    setWithdrawalRequest({
      amount: "",
      method: "bank",
      bankDetails: {
        accountHolderName: user?.bankDetails?.accountHolderName || "",
        accountNumber: user?.bankDetails?.accountNumber || "",
        ifscCode: user?.bankDetails?.ifscCode || "",
        bankName: user?.bankDetails?.bankName || "",
        branchName: user?.bankDetails?.branchName || "",
      },
    });
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();

    const amt = Number(withdrawalRequest.amount);
    if (!amt || Number.isNaN(amt) || amt <= 0) {
      return toast.error("Enter a valid amount");
    }
    if (amt > maxWithdrawal) {
      return toast.error(`Maximum withdrawal amount is ${formatINR(maxWithdrawal)}`);
    }

    const { accountHolderName, accountNumber, ifscCode } = withdrawalRequest.bankDetails || {};
    if (!accountHolderName || !accountNumber || !ifscCode) {
      return toast.error("Please fill Account holder, Account number and IFSC");
    }

    try {
      setSubmitting(true);
      await requestWithdrawalApi({
        amount: amt,
        method: "bank",
        bankDetails: withdrawalRequest.bankDetails,
      });
      toast.success("Withdrawal requested");
      setShowWithdrawModal(false);
      resetWithdrawalForm();
      await load();
    } catch (e2) {
      toast.error(e2?.response?.data?.msg || "Failed to request withdrawal");
    } finally {
      setSubmitting(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case "earning":
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case "withdrawal":
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 min-h-screen text-[color:var(--text)]">
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Finance</h1>
          <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
            Your earnings, balance, and withdrawal history.
          </p>
        </div>

        <button
          onClick={() => setShowWithdrawModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-[color:var(--text)] px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          Request Withdrawal
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6 glass-soft p-1 rounded-xl border border-[color:var(--border)] max-w-max">
        {[
          { key: "overview", label: "overview" },
          { key: "transactions", label: "transactions" },
          { key: "withdraw", label: "withdraw" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-lg capitalize transition-all duration-200 ${
              activeTab === tab.key
                ? "bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white"
                : "text-[color:var(--muted)] hover:bg-white/5"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="dash-card p-6 rounded-2xl">Loading...</div>
      ) : null}

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="dash-card p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>Available Balance</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatINR(totals.availableBalance)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="dash-card p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>Total Earnings</p>
                  <p className="text-2xl font-bold">{formatINR(totals.totalEarnings)}</p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                </div>
              </div>
            </div>

            <div className="dash-card p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>Total Paid</p>
                  <p className="text-2xl font-bold">{formatINR(totals.totalPaid)}</p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                  <TrendingDown className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                </div>
              </div>
            </div>

            <div className="dash-card p-6 rounded-2xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm" style={{ color: "var(--muted)" }}>Pending Withdrawals</p>
                  <p className="text-2xl font-bold">{formatINR(totals.pendingWithdrawals)}</p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-full">
                  <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
                </div>
              </div>
            </div>
          </div>

          <div className="dash-card p-4 sm:p-6 rounded-2xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-semibold">Monthly Earnings</h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Last 12 months (credited by admin).
                </p>
              </div>
            </div>

            <div className="mt-4" style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthly}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="amount" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="dash-card p-4 sm:p-6 rounded-2xl">
            <h2 className="text-lg font-semibold">Yearly Totals</h2>
            <p className="text-sm" style={{ color: "var(--muted)" }}>
              Earnings grouped by year.
            </p>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "var(--muted)" }}>
                    <th className="text-left p-2">Year</th>
                    <th className="text-left p-2">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {yearly.length === 0 ? (
                    <tr>
                      <td className="p-2" colSpan={2}>No earnings yet</td>
                    </tr>
                  ) : (
                    yearly
                      .slice()
                      .reverse()
                      .map((y) => (
                        <tr key={y.year} style={{ borderTop: "1px solid var(--dash-border)" }}>
                          <td className="p-2">{y.year}</td>
                          <td className="p-2 font-medium">{formatINR(y.amount)}</td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Transactions */}
      {activeTab === "transactions" && (
        <div className="dash-card p-4 sm:p-6 rounded-2xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-lg font-semibold">Recent Transactions</h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>
                Earnings credits + withdrawal requests.
              </p>
            </div>
            <button className="dash-btn" type="button" onClick={load}>
              Refresh
            </button>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: "var(--muted)" }}>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Description</th>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Proof</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length === 0 ? (
                  <tr>
                    <td className="p-2" colSpan={6}>No transactions</td>
                  </tr>
                ) : (
                  transactions.map((t) => (
                    <tr key={t.id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                      <td className="p-2 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {getTransactionIcon(t.type)}
                          <span className="capitalize">{t.type}</span>
                        </div>
                      </td>
                      <td className="p-2 whitespace-nowrap font-medium">{formatINR(t.amount)}</td>
                      <td className="p-2">{t.description || "-"}</td>
                      <td className="p-2 whitespace-nowrap">
                        {t.date ? new Date(t.date).toLocaleString() : "-"}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-lg text-xs ${statusBadge(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-2">
                        {t.type === "withdrawal" && t?.adminPayout?.screenshotUrl ? (
                          <a className="underline" href={assetUrl(t.adminPayout.screenshotUrl)} target="_blank" rel="noreferrer">
                            Screenshot
                          </a>
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
        </div>
      )}

      {/* Withdrawals */}
      {activeTab === "withdraw" && (
        <div className="space-y-6">
          <div className="dash-card p-4 sm:p-6 rounded-2xl">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h2 className="text-lg font-semibold">Withdrawal History</h2>
                <p className="text-sm" style={{ color: "var(--muted)" }}>
                  Track your withdrawal requests and payout proofs.
                </p>
              </div>
              <button className="dash-btn" type="button" onClick={load}>
                Refresh
              </button>
            </div>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: "var(--muted)" }}>
                    <th className="text-left p-2">Requested</th>
                    <th className="text-left p-2">Amount</th>
                    <th className="text-left p-2">Status</th>
                    <th className="text-left p-2">Paid Amount</th>
                    <th className="text-left p-2">Paid Date</th>
                    <th className="text-left p-2">Transaction ID</th>
                    <th className="text-left p-2">Account</th>
                    <th className="text-left p-2">Screenshot</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawals.length === 0 ? (
                    <tr>
                      <td className="p-2" colSpan={8}>No withdrawals</td>
                    </tr>
                  ) : (
                    withdrawals.map((w) => (
                      <tr key={w._id} style={{ borderTop: "1px solid var(--dash-border)" }}>
                        <td className="p-2 whitespace-nowrap">{new Date(w.createdAt).toLocaleString()}</td>
                        <td className="p-2 whitespace-nowrap font-medium">{formatINR(w.amount)}</td>
                        <td className="p-2 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-lg text-xs ${statusBadge(w.status)}`}>
                            {w.status}
                          </span>
                        </td>
                        <td className="p-2 whitespace-nowrap">{w?.adminPayout?.paidAmount ? formatINR(w.adminPayout.paidAmount) : "-"}</td>
                        <td className="p-2 whitespace-nowrap">{w?.adminPayout?.paidDate ? new Date(w.adminPayout.paidDate).toLocaleString() : "-"}</td>
                        <td className="p-2 whitespace-nowrap">
                          {w?.adminPayout?.transactionId || "-"}
                        </td>
                        <td className="p-2">
                          <div className="text-xs">{w?.adminPayout?.accountName || w?.bankDetails?.accountHolderName || "-"}</div>
                          <div className="text-xs" style={{ color: "var(--muted)" }}>
                            {w?.adminPayout?.accountNo || w?.bankDetails?.accountNumber || ""}
                          </div>
                        </td>
                        <td className="p-2">
                          {w?.adminPayout?.screenshotUrl ? (
                            <a className="underline" href={assetUrl(w.adminPayout.screenshotUrl)} target="_blank" rel="noreferrer">
                              View
                            </a>
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
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => setShowWithdrawModal(false)} />
          <div className="relative w-full max-w-lg glass p-6 rounded-3xl">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-semibold">Request Withdrawal</h3>
                <p className="text-sm mt-1" style={{ color: "var(--muted)" }}>
                  Available: <span className="font-medium">{formatINR(maxWithdrawal)}</span>
                </p>
              </div>
              <button
                type="button"
                className="h-9 w-9 rounded-full grid place-items-center bg-black/5 dark:bg-white/10"
                onClick={() => setShowWithdrawModal(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleWithdrawal} className="mt-5 space-y-4">
              <div>
                <label className="text-sm" style={{ color: "var(--muted)" }}>Amount</label>
                <input
                  type="number"
                  min={1}
                  step="0.01"
                  value={withdrawalRequest.amount}
                  onChange={(e) => setWithdrawalRequest((p) => ({ ...p, amount: e.target.value }))}
                  className="dash-input mt-2"
                  placeholder="Enter amount"
                />
                <div className="text-xs mt-2" style={{ color: "var(--muted)" }}>
                  Max withdraw: {formatINR(maxWithdrawal)}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm flex items-center gap-2" style={{ color: "var(--muted)" }}>
                    <User className="w-4 h-4" /> Account Holder
                  </label>
                  <input
                    className="dash-input mt-2"
                    value={withdrawalRequest.bankDetails.accountHolderName}
                    onChange={(e) => updateBankDetails("accountHolderName", e.target.value)}
                    placeholder="Account holder name"
                  />
                </div>
                <div>
                  <label className="text-sm flex items-center gap-2" style={{ color: "var(--muted)" }}>
                    <Hash className="w-4 h-4" /> Account Number
                  </label>
                  <input
                    className="dash-input mt-2"
                    value={withdrawalRequest.bankDetails.accountNumber}
                    onChange={(e) => updateBankDetails("accountNumber", e.target.value)}
                    placeholder="Account number"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm" style={{ color: "var(--muted)" }}>IFSC</label>
                  <input
                    className="dash-input mt-2"
                    value={withdrawalRequest.bankDetails.ifscCode}
                    onChange={(e) => updateBankDetails("ifscCode", e.target.value)}
                    placeholder="IFSC code"
                  />
                </div>
                <div>
                  <label className="text-sm flex items-center gap-2" style={{ color: "var(--muted)" }}>
                    <Building2 className="w-4 h-4" /> Bank Name
                  </label>
                  <input
                    className="dash-input mt-2"
                    value={withdrawalRequest.bankDetails.bankName}
                    onChange={(e) => updateBankDetails("bankName", e.target.value)}
                    placeholder="Bank name"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm" style={{ color: "var(--muted)" }}>Branch</label>
                <input
                  className="dash-input mt-2"
                  value={withdrawalRequest.bankDetails.branchName}
                  onChange={(e) => updateBankDetails("branchName", e.target.value)}
                  placeholder="Branch name"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  className="dash-btn-secondary"
                  onClick={() => {
                    setShowWithdrawModal(false);
                    resetWithdrawalForm();
                  }}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
