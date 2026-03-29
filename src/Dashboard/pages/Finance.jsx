import React, { useEffect, useMemo, useState } from 'react';
import toast from "react-hot-toast";
import { DollarSign, TrendingUp, TrendingDown, Download, CreditCard, AlertCircle, Building2, User, Hash } from 'lucide-react';

import {
  createWithdrawalRequestApi,
  getFinanceSummaryApi,
  getFinanceTransactionsApi,
  getMyWithdrawalsApi,
} from "../../apis/UserApis";

export default function Finance() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalRequest, setWithdrawalRequest] = useState({
    amount: 0,
    method: 'bank',
    bankDetails: {
      accountNumber: '',
      ifscCode: '',
      accountHolderName: ''
    }
  });

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    balance: 0,
    maxWithdrawal: 0,
    pendingEarnings: 0,
  });
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  const currentBalance = Number(summary?.balance || 0);
  const maxWithdrawal = Number(summary?.maxWithdrawal || 0);
  const pendingEarnings = Number(summary?.pendingEarnings || 0);

  const mergedTransactions = useMemo(() => {
    const t = Array.isArray(transactions) ? transactions : [];
    const w = Array.isArray(withdrawals)
      ? withdrawals.map((x) => ({
          ...x,
          type: "withdrawal",
          description:
            x.description || x.method
              ? `${x.method || "Withdrawal"} withdrawal`
              : "Withdrawal",
          date: x.createdAt || x.date,
          // withdrawals should appear as negative amounts in the table
          amount: -Math.abs(Number(x.amount || 0)),
          status: x.status,
        }))
      : [];
    return [...t, ...w].sort((a, b) => {
      const da = new Date(a.date || a.createdAt || 0).getTime();
      const db = new Date(b.date || b.createdAt || 0).getTime();
      return db - da;
    });
  }, [transactions, withdrawals]);

  const fetchFinance = async () => {
    try {
      setLoading(true);
      const [s, tx, wd] = await Promise.all([
        getFinanceSummaryApi(),
        getFinanceTransactionsApi({ limit: 50 }),
        getMyWithdrawalsApi({ limit: 50 }),
      ]);
      setSummary({
        balance: s?.balance ?? s?.walletBalance ?? 0,
        maxWithdrawal: s?.maxWithdrawal ?? 0,
        pendingEarnings: s?.pendingEarnings ?? 0,
      });
      // Some backends return combined transactions; we keep earnings here and
      // render withdrawals from the dedicated withdrawals list to avoid duplicates.
      const txList = tx?.transactions || tx?.items || [];
      setTransactions(
        Array.isArray(txList)
          ? txList.filter((t) => String(t?.type || "earning") !== "withdrawal")
          : []
      );
      setWithdrawals(wd?.withdrawals || wd?.items || []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Finance data not available");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWithdrawal = async (e) => {
    e.preventDefault();

    if (withdrawalRequest.amount > maxWithdrawal) {
      alert(`Maximum withdrawal amount is ₹${maxWithdrawal}`);
      return;
    }

    if (withdrawalRequest.amount > currentBalance) {
      alert('Insufficient balance');
      return;
    }

    if (withdrawalRequest.method === 'bank') {
      const { accountNumber, ifscCode, accountHolderName } = withdrawalRequest.bankDetails;
      if (!accountNumber || !ifscCode || !accountHolderName) {
        alert('Please fill in all bank details');
        return;
      }
    }

    try {
      await createWithdrawalRequestApi(withdrawalRequest);
      toast.success("Withdrawal request submitted");
      setShowWithdrawModal(false);
      resetWithdrawalForm();
      fetchFinance();
    } catch (err) {
      toast.error(err?.response?.data?.msg || "Failed to submit withdrawal");
    }
  };

  const resetWithdrawalForm = () => {
    setWithdrawalRequest({
      amount: 0,
      method: 'bank',
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        accountHolderName: ''
      }
    });
  };

  const updateBankDetails = (field, value) => {
    setWithdrawalRequest((prev) => ({
      ...prev,
      bankDetails: {
        ...prev.bankDetails,
        [field]: value
      }
    }));
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'earning':
      case 'royalty':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <DollarSign className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'approved':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected':
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6 min-h-screen text-[color:var(--text)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-[color:var(--text)]">Finance Report</h1>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-emerald-500/20"
        >
          <CreditCard className="w-4 h-4" />
          Request Withdrawal
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-6 glass-soft p-1 rounded-xl border border-[color:var(--border)] max-w-max">
        {['overview', 'transactions', 'withdraw'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize transition-all duration-200 ${
              activeTab === tab
                ? 'bg-gradient-to-r from-[var(--accent-1)] to-[var(--accent-2)] text-white'
                : 'text-[color:var(--muted)] hover:bg-black/5 dark:hover:bg-white/8 hover:text-[color:var(--text)]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="dash-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[color:var(--muted)]">Current Balance</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ₹{currentBalance.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-500/20">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="dash-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[color:var(--muted)]">Pending Earnings</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    ₹{pendingEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-500/20">
                  <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="dash-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[color:var(--muted)]">Max Withdrawal</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ₹{maxWithdrawal.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-500/20">
                  <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Limit Notice */}
          <div className="rounded-lg border border-amber-200 bg-amber-50/95 p-4 dark:border-amber-700/10 dark:bg-amber-200/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-amber-700 dark:text-amber-400" />
              <div>
                <h3 className="font-medium text-amber-900 dark:text-amber-200">Withdrawal Limit</h3>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                  Maximum withdrawal amount is limited to ₹{maxWithdrawal} per transaction for security purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="dash-card rounded-lg overflow-hidden">
          <div className="p-4 border-b border-[color:var(--border)] flex justify-between items-center bg-black/[0.02] dark:bg-white/[0.02]">
            <h2 className="text-lg font-semibold text-[color:var(--text)]">Recent Transactions</h2>
            <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[color:var(--border)] text-[color:var(--muted)] bg-black/[0.03] dark:bg-white/[0.03]">
                  <th className="text-left p-4">Type</th>
                  <th className="text-left p-4">Description</th>
                  <th className="text-left p-4">Amount</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {(mergedTransactions || []).map((transaction) => (
                  <tr
                    key={transaction._id || transaction.id}
                    className="border-b border-[color:var(--border)] hover:bg-black/[0.025] dark:hover:bg-white/[0.03]"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        <span className="capitalize text-[color:var(--text)]">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="p-4 text-[color:var(--text)]">{transaction.description}</td>
                    <td className="p-4">
                      <span
                        className={`font-medium ${
                          transaction.amount > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}₹{Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 text-[color:var(--muted)]">
                      {transaction.date ? new Date(transaction.date).toLocaleString() : "-"}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs capitalize font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Withdraw Tab */}
      {activeTab === 'withdraw' && (
        <div className="max-w-2xl">
          <div className="dash-card p-6">
            <h2 className="text-lg font-semibold mb-4 text-[color:var(--text)]">Request Withdrawal</h2>

            <form onSubmit={handleWithdrawal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                  Amount (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={maxWithdrawal}
                  value={withdrawalRequest.amount || ''}
                  onChange={(e) =>
                    setWithdrawalRequest({
                      ...withdrawalRequest,
                      amount: parseFloat(e.target.value) || 0
                    })
                  }
                  className="input-ui w-full px-3 py-2"
                  placeholder={`Max: ₹${maxWithdrawal}`}
                  required
                />
                <p className="text-xs text-[color:var(--muted)] mt-1">
                  Maximum withdrawal: ₹{maxWithdrawal} | Available balance: ₹{currentBalance}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                  Withdrawal Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={withdrawalRequest.method}
                  onChange={(e) =>
                    setWithdrawalRequest({
                      ...withdrawalRequest,
                      method: e.target.value
                    })
                  }
                  className="input-ui w-full px-3 py-2"
                  required
                >
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              {/* Bank Details Section */}
              {withdrawalRequest.method === 'bank' && (
                <div className="space-y-4 p-4 rounded-lg border border-[color:var(--border)] bg-black/[0.025] dark:bg-white/[0.03]">
                  <h3 className="text-sm font-medium text-[color:var(--muted)] flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Bank Account Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                      <User className="w-4 h-4 inline mr-1" />
                      Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.bankDetails.accountHolderName}
                      onChange={(e) => updateBankDetails('accountHolderName', e.target.value)}
                      className="input-ui w-full px-3 py-2"
                      placeholder="Enter full name as per bank records"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                      <Hash className="w-4 h-4 inline mr-1" />
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.bankDetails.accountNumber}
                      onChange={(e) => updateBankDetails('accountNumber', e.target.value)}
                      className="input-ui w-full px-3 py-2"
                      placeholder="Enter bank account number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                      <Building2 className="w-4 h-4 inline mr-1" />
                      IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.bankDetails.ifscCode}
                      onChange={(e) => updateBankDetails('ifscCode', e.target.value.toUpperCase())}
                      className="input-ui w-full px-3 py-2"
                      placeholder="Enter IFSC code (e.g., SBIN0001234)"
                      pattern="[A-Z]{4}0[A-Z0-9]{6}"
                      maxLength={11}
                      required
                    />
                    <p className="text-xs text-[color:var(--muted)] mt-1">
                      11-character IFSC code (e.g., SBIN0001234)
                    </p>
                  </div>
                </div>
              )}

              {/* PayPal/Stripe removed — backend supports only bank transfers */}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetWithdrawalForm}
                  className="px-4 py-2 text-[color:var(--muted)] hover:text-[color:var(--text)]"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Withdrawal Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-[100] bg-black/100 backdrop-blur-l flex items-center justify-center p-4">
          <div className="dash-card text-[color:var(--text)] rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto border border-[color:var(--border)] shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-[color:var(--text)]">Quick Withdrawal</h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-[color:var(--muted)] hover:text-[color:var(--text)] text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleWithdrawal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                  Amount (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={maxWithdrawal}
                  value={withdrawalRequest.amount || ''}
                  onChange={(e) =>
                    setWithdrawalRequest({
                      ...withdrawalRequest,
                      amount: parseFloat(e.target.value) || 0
                    })
                  }
                  className="input-ui w-full px-3 py-2"
                  placeholder={`Max: ₹${maxWithdrawal}`}
                  required
                />
                <p className="text-xs text-[color:var(--muted)] mt-1">
                  Available: ₹{currentBalance} | Max: ₹{maxWithdrawal}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-[color:var(--muted)] mb-1">
                  Method <span className="text-red-500">*</span>
                </label>
                <select
                  value={withdrawalRequest.method}
                  onChange={(e) =>
                    setWithdrawalRequest({
                      ...withdrawalRequest,
                      method: e.target.value
                    })
                  }
                  className="input-ui w-full px-3 py-2"
                  required
                >
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              {/* Bank Details in Modal */}
              {withdrawalRequest.method === 'bank' && (
                <div className="space-y-3 p-3 rounded-xl border border-[color:var(--border)] bg-black/[0.025] dark:bg-white/[0.03]">
                  <h3 className="text-sm font-medium text-[color:var(--muted)] flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Bank Details
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1">
                      Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.bankDetails.accountHolderName}
                      onChange={(e) => updateBankDetails('accountHolderName', e.target.value)}
                      className="input-ui w-full px-2 py-1.5 text-sm"
                      placeholder="Full name as per bank"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.bankDetails.accountNumber}
                      onChange={(e) => updateBankDetails('accountNumber', e.target.value)}
                      className="input-ui w-full px-2 py-1.5 text-sm"
                      placeholder="Bank account number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[color:var(--muted)] mb-1">
                      IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.bankDetails.ifscCode}
                      onChange={(e) => updateBankDetails('ifscCode', e.target.value.toUpperCase())}
                      className="input-ui w-full px-2 py-1.5 text-sm"
                      placeholder="IFSC code (e.g., SBIN0001234)"
                      pattern="[A-Z]{4}0[A-Z0-9]{6}"
                      maxLength={11}
                      required
                    />
                  </div>
                </div>
              )}

              {/* PayPal/Stripe removed — backend supports only bank transfers */}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 text-[color:var(--muted)] hover:text-[color:var(--text)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg shadow-emerald-500/20"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
