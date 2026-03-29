import React, { useEffect, useMemo, useState } from 'react';
import toast from "react-hot-toast";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  Download,
  CreditCard,
  AlertCircle,
  Building2,
  User,
  Hash,
  ReceiptIndianRupee,
} from 'lucide-react';

import {
  createWithdrawalRequestApi,
  getFinanceSummaryApi,
  getFinanceTransactionsApi,
  getMyWithdrawalsApi,
  getProfileApi,
} from "../../apis/UserApis";
import { buildFinanceSnapshot, formatInr } from "../../utils/finance";

const EMPTY_BANK_DETAILS = {
  accountNumber: '',
  ifscCode: '',
  accountHolderName: '',
  bankName: '',
  branchName: '',
};

const normalizeBankDetails = (bankDetails = {}) => ({
  accountNumber: typeof bankDetails?.accountNumber === 'string' ? bankDetails.accountNumber.trim() : '',
  ifscCode: typeof bankDetails?.ifscCode === 'string' ? bankDetails.ifscCode.trim().toUpperCase() : '',
  accountHolderName: typeof bankDetails?.accountHolderName === 'string' ? bankDetails.accountHolderName.trim() : '',
  bankName: typeof bankDetails?.bankName === 'string' ? bankDetails.bankName.trim() : '',
  branchName: typeof bankDetails?.branchName === 'string' ? bankDetails.branchName.trim() : '',
});

const hasUsableBankDetails = (bankDetails = {}) =>
  Boolean(bankDetails?.accountNumber && bankDetails?.ifscCode && bankDetails?.accountHolderName);

const createWithdrawalState = (bankDetails = EMPTY_BANK_DETAILS) => {
  const normalized = normalizeBankDetails(bankDetails);
  const useSavedAccount = hasUsableBankDetails(normalized);

  return {
    amount: 0,
    method: 'bank',
    bankSource: useSavedAccount ? 'saved' : 'manual',
    bankDetails: {
      accountNumber: useSavedAccount ? normalized.accountNumber : '',
      ifscCode: useSavedAccount ? normalized.ifscCode : '',
      accountHolderName: useSavedAccount ? normalized.accountHolderName : ''
    }
  };
};

const maskAccountNumber = (value = '') => {
  const digits = String(value).replace(/\s+/g, '');
  if (!digits) return '';
  if (digits.length <= 4) return digits;
  return `•••• ${digits.slice(-4)}`;
};

const maskAccountNumberAscii = (value = '') => {
  const digits = String(value).replace(/\s+/g, '');
  if (!digits) return '';
  if (digits.length <= 4) return digits;
  return `**** ${digits.slice(-4)}`;
};

export default function Finance() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalRequest, setWithdrawalRequest] = useState(() => createWithdrawalState());
  const [savedBankDetails, setSavedBankDetails] = useState(EMPTY_BANK_DETAILS);

  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);

  const financeSnapshot = useMemo(
    () => buildFinanceSnapshot({ summary, transactions, withdrawals }),
    [summary, transactions, withdrawals]
  );

  const totalEarnings = Number(financeSnapshot?.totalEarnings || 0);
  const availableBalance = Number(financeSnapshot?.availableBalance || 0);
  const withdrawnAmount = Number(financeSnapshot?.withdrawnAmount || 0);
  const pendingWithdrawalAmount = Number(financeSnapshot?.pendingWithdrawalAmount || 0);
  const requestableBalance = Number(financeSnapshot?.requestableBalance || 0);
  const maxWithdrawal = Number(financeSnapshot?.maxWithdrawal || 0);
  const withdrawalLimit = Math.max(0, Math.min(requestableBalance, maxWithdrawal || requestableBalance));
  const mergedTransactions = financeSnapshot?.mergedTransactions || [];
  const savedBankAvailable = hasUsableBankDetails(savedBankDetails);

  const fetchSavedBankDetails = async () => {
    try {
      const res = await getProfileApi();
      const normalizedBankDetails = normalizeBankDetails(res?.user?.bankDetails || {});
      const hasSavedAccount = hasUsableBankDetails(normalizedBankDetails);
      setSavedBankDetails(normalizedBankDetails);

      setWithdrawalRequest((prev) => {
        const hasManualDraft =
          prev.bankSource === 'manual' &&
          Boolean(prev.bankDetails?.accountHolderName || prev.bankDetails?.accountNumber || prev.bankDetails?.ifscCode);

        if (hasManualDraft) {
          return prev;
        }

        return {
          ...prev,
          bankSource: hasSavedAccount ? 'saved' : 'manual',
          bankDetails: hasSavedAccount
            ? {
                accountNumber: normalizedBankDetails.accountNumber,
                ifscCode: normalizedBankDetails.ifscCode,
                accountHolderName: normalizedBankDetails.accountHolderName,
              }
            : {
                accountNumber: '',
                ifscCode: '',
                accountHolderName: '',
              }
        };
      });
    } catch (_error) {
      // Bank details are optional, so finance screen should keep working even if profile fetch fails.
    }
  };

  const fetchFinance = async () => {
    try {
      setLoading(true);
      const [s, tx, wd] = await Promise.all([
        getFinanceSummaryApi(),
        getFinanceTransactionsApi({ limit: 200 }),
        getMyWithdrawalsApi({ limit: 200 }),
      ]);
      setSummary(s || {});
      const txList = tx?.transactions || tx?.items || [];
      setTransactions(Array.isArray(txList) ? txList : []);
      setWithdrawals(wd?.withdrawals || wd?.items || []);
    } catch (e) {
      toast.error(e?.response?.data?.msg || "Finance data not available");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
    fetchSavedBankDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const refreshFinance = () => {
      fetchFinance();
    };

    const intervalId = window.setInterval(refreshFinance, 20000);
    const handleFocus = () => refreshFinance();
    const handleVisibility = () => {
      if (document.visibilityState === "visible") refreshFinance();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleWithdrawal = async (e) => {
    e.preventDefault();

    if (!withdrawalRequest.amount || withdrawalRequest.amount <= 0) {
      alert('Enter a valid withdrawal amount');
      return;
    }

    if (withdrawalRequest.amount > availableBalance) {
      alert(`Available balance is ${formatInr(availableBalance)}`);
      return;
    }

    if (withdrawalRequest.amount > withdrawalLimit) {
      alert(`You can request up to ${formatInr(withdrawalLimit)} right now`);
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
    setWithdrawalRequest(createWithdrawalState(savedBankDetails));
  };

  const updateBankDetails = (field, value) => {
    setWithdrawalRequest((prev) => ({
      ...prev,
      bankSource: 'manual',
      bankDetails: {
        ...prev.bankDetails,
        [field]: value
      }
    }));
  };

  const applySavedBankDetails = () => {
    if (!savedBankAvailable) return;

    setWithdrawalRequest((prev) => ({
      ...prev,
      bankSource: 'saved',
      bankDetails: {
        accountNumber: savedBankDetails.accountNumber,
        ifscCode: savedBankDetails.ifscCode,
        accountHolderName: savedBankDetails.accountHolderName,
      }
    }));
  };

  const useManualBankDetails = () => {
    setWithdrawalRequest((prev) => ({
      ...prev,
      bankSource: 'manual',
      bankDetails: {
        accountNumber: prev.bankDetails.accountNumber || savedBankDetails.accountNumber || '',
        ifscCode: prev.bankDetails.ifscCode || savedBankDetails.ifscCode || '',
        accountHolderName: prev.bankDetails.accountHolderName || savedBankDetails.accountHolderName || '',
      }
    }));
  };

  const renderBankDetailsSection = ({ compact = false } = {}) => {
    const sectionClass = compact
      ? 'space-y-3 p-3 rounded-xl border border-[color:var(--border)] bg-black/[0.025] dark:bg-white/[0.03]'
      : 'space-y-4 p-4 rounded-lg border border-[color:var(--border)] bg-black/[0.025] dark:bg-white/[0.03]';
    const labelClass = compact
      ? 'block text-xs font-medium text-[color:var(--muted)] mb-1'
      : 'block text-sm font-medium text-[color:var(--muted)] mb-1';
    const inputClass = compact
      ? 'input-ui w-full px-2 py-1.5 text-sm'
      : 'input-ui w-full px-3 py-2';
    const toggleButtonClass = (active) =>
      `${compact ? 'px-3 py-1.5 text-xs' : 'px-3 py-2 text-sm'} rounded-lg border transition-colors ${
        active
          ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-500/15'
          : 'border-[color:var(--border)] text-[color:var(--muted)] hover:text-[color:var(--text)] hover:bg-black/5 dark:hover:bg-white/5'
      }`;

    return (
      <div className={sectionClass}>
        <h3 className="text-sm font-medium text-[color:var(--muted)] flex items-center gap-2">
          <Building2 className="w-4 h-4" />
          Bank Details
        </h3>

        {savedBankAvailable ? (
          <>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">
                    Default Account
                  </p>
                  <p className="mt-1 text-sm font-semibold text-[color:var(--text)]">
                    {savedBankDetails.accountHolderName}
                  </p>
                  <p className="mt-1 text-xs text-[color:var(--muted)] break-words">
                    {savedBankDetails.bankName ? `${savedBankDetails.bankName} • ` : ''}
                    {maskAccountNumberAscii(savedBankDetails.accountNumber)} • {savedBankDetails.ifscCode}
                  </p>
                  {savedBankDetails.branchName ? (
                    <p className="mt-1 text-xs text-[color:var(--muted)] break-words">
                      {savedBankDetails.branchName}
                    </p>
                  ) : null}
                </div>

                <button
                  type="button"
                  onClick={applySavedBankDetails}
                  className={toggleButtonClass(withdrawalRequest.bankSource === 'saved')}
                >
                  {withdrawalRequest.bankSource === 'saved' ? 'Selected' : 'Use Default'}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={applySavedBankDetails}
                className={toggleButtonClass(withdrawalRequest.bankSource === 'saved')}
              >
                Default Account
              </button>
              <button
                type="button"
                onClick={useManualBankDetails}
                className={toggleButtonClass(withdrawalRequest.bankSource === 'manual')}
              >
                Enter Manually
              </button>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-[color:var(--border)] px-3 py-2 text-xs text-[color:var(--muted)]">
            No default bank account was found in your profile. Enter bank details manually below.
          </div>
        )}

        {(withdrawalRequest.bankSource === 'manual' || !savedBankAvailable) ? (
          <>
            <div>
              <label className={labelClass}>
                {compact ? 'Account Holder Name' : <><User className="w-4 h-4 inline mr-1" />Account Holder Name</>} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={withdrawalRequest.bankDetails.accountHolderName}
                onChange={(e) => updateBankDetails('accountHolderName', e.target.value)}
                className={inputClass}
                placeholder={compact ? 'Full name as per bank' : 'Enter full name as per bank records'}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                {compact ? 'Account Number' : <><Hash className="w-4 h-4 inline mr-1" />Account Number</>} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={withdrawalRequest.bankDetails.accountNumber}
                onChange={(e) => updateBankDetails('accountNumber', e.target.value)}
                className={inputClass}
                placeholder={compact ? 'Bank account number' : 'Enter bank account number'}
                required
              />
            </div>

            <div>
              <label className={labelClass}>
                {compact ? 'IFSC Code' : <><Building2 className="w-4 h-4 inline mr-1" />IFSC Code</>} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={withdrawalRequest.bankDetails.ifscCode}
                onChange={(e) => updateBankDetails('ifscCode', e.target.value.toUpperCase())}
                className={inputClass}
                placeholder={compact ? 'IFSC code (e.g., SBIN0001234)' : 'Enter IFSC code (e.g., SBIN0001234)'}
                pattern="[A-Z]{4}0[A-Z0-9]{6}"
                maxLength={11}
                required
              />
              <p className="text-xs text-[color:var(--muted)] mt-1">
                11-character IFSC code (e.g., SBIN0001234)
              </p>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-[color:var(--border)] bg-black/[0.03] dark:bg-white/[0.02] px-3 py-2 text-xs text-[color:var(--muted)]">
            Withdrawal will be sent to your saved default bank account. Switch to manual entry if you want to use another account.
          </div>
        )}
      </div>
    );
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'earning':
      case 'royalty':
      case 'credit':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'withdrawal':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <IndianRupee className="w-4 h-4 text-gray-500" />;
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
                  <p className="text-sm text-[color:var(--muted)]">Available Balance</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {formatInr(availableBalance)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/40 border border-green-200 dark:border-green-500/20">
                  <IndianRupee className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="dash-card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[color:var(--muted)]">Total Earnings</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {formatInr(totalEarnings)}
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
                  <p className="text-sm text-[color:var(--muted)]">Withdrawn Amount</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {formatInr(withdrawnAmount)}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-500/20">
                  <ReceiptIndianRupee className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Limit Notice */}
          <div className="rounded-lg border border-amber-200 bg-amber-50/95 p-4 dark:border-amber-700/10 dark:bg-amber-200/20">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 text-amber-700 dark:text-amber-400" />
              <div>
                <h3 className="font-medium text-amber-900 dark:text-amber-200">Withdrawal Flow</h3>
                <p className="mt-1 text-sm text-amber-800 dark:text-amber-300">
                  Available balance stays unchanged until a withdrawal is marked as paid. Only paid withdrawals move value from available balance to withdrawn amount.
                </p>
                <p className="mt-2 text-sm text-amber-800 dark:text-amber-300">
                  Open requests: {formatInr(pendingWithdrawalAmount)}. You can request up to {formatInr(withdrawalLimit)} right now.
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
                {mergedTransactions.length === 0 ? (
                  <tr>
                    <td className="p-4 text-[color:var(--muted)]" colSpan={5}>
                      No earnings or withdrawal transactions found.
                    </td>
                  </tr>
                ) : (
                  mergedTransactions.map((transaction) => (
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
                          {transaction.amount > 0 ? '+' : '-'}{formatInr(Math.abs(transaction.amount))}
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
                  ))
                )}
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
                  Amount (INR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={withdrawalLimit || undefined}
                  value={withdrawalRequest.amount || ''}
                  onChange={(e) =>
                    setWithdrawalRequest({
                      ...withdrawalRequest,
                      amount: parseFloat(e.target.value) || 0
                    })
                  }
                  className="input-ui w-full px-3 py-2"
                  placeholder={`Max: ${formatInr(withdrawalLimit)}`}
                  required
                />
                <p className="text-xs text-[color:var(--muted)] mt-1">
                  Total earnings: {formatInr(totalEarnings)} | Available balance: {formatInr(availableBalance)}
                </p>
                <p className="text-xs text-[color:var(--muted)] mt-1">
                  Withdrawn: {formatInr(withdrawnAmount)} | Pending requests: {formatInr(pendingWithdrawalAmount)}
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
                renderBankDetailsSection()
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
                  disabled={withdrawalLimit <= 0}
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
                  Amount (INR) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.01"
                  max={withdrawalLimit || undefined}
                  value={withdrawalRequest.amount || ''}
                  onChange={(e) =>
                    setWithdrawalRequest({
                      ...withdrawalRequest,
                      amount: parseFloat(e.target.value) || 0
                    })
                  }
                  className="input-ui w-full px-3 py-2"
                  placeholder={`Max: ${formatInr(withdrawalLimit)}`}
                  required
                />
                <p className="text-xs text-[color:var(--muted)] mt-1">
                  Available: {formatInr(availableBalance)} | Pending: {formatInr(pendingWithdrawalAmount)}
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
                renderBankDetailsSection({ compact: true })
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
                  disabled={withdrawalLimit <= 0}
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
