import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Download, CreditCard, AlertCircle, Building2, User, Hash } from 'lucide-react';

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
    },
    paypalEmail: '',
    stripeAccountId: ''
  });

  const currentBalance = 0;
  const maxWithdrawal = 0;
  const pendingEarnings = 0;

  const transactions = [
    {
      id: '1',
      type: 'earning',
      amount: 0,
      description: 'Spotify streaming royalties',
      date: '2024-12-05',
      status: 'completed'
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: -25.0,
      description: 'Bank transfer withdrawal',
      date: '2024-12-03',
      status: 'completed'
    },
    {
      id: '3',
      type: 'royalty',
      amount: 8.75,
      description: 'YouTube Content ID earnings',
      date: '2024-12-02',
      status: 'pending'
    },
    {
      id: '4',
      type: 'earning',
      amount: 12.4,
      description: 'Apple Music streaming',
      date: '2024-12-01',
      status: 'completed'
    }
  ];

  const handleWithdrawal = (e) => {
    e.preventDefault();

    if (withdrawalRequest.amount > maxWithdrawal) {
      alert(`Maximum withdrawal amount is $${maxWithdrawal}`);
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

    // Process withdrawal request
    console.log('Processing withdrawal:', withdrawalRequest);
    setShowWithdrawModal(false);
    resetWithdrawalForm();
  };

  const resetWithdrawalForm = () => {
    setWithdrawalRequest({
      amount: 0,
      method: 'bank',
      bankDetails: {
        accountNumber: '',
        ifscCode: '',
        accountHolderName: ''
      },
      paypalEmail: '',
      stripeAccountId: ''
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
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold dark:text-white">Finance Report</h1>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          Request Withdrawal
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-4 mb-6">
        {['overview', 'transactions', 'withdraw'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg capitalize transition-all duration-200 ${
              activeTab === tab
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700/50'
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
            <div className="bg-transparent p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Current Balance</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    ${currentBalance.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-full">
                  <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="bg-transparent p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Pending Earnings</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    ${pendingEarnings.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 dark:bg-yellow-900/50 rounded-full">
                  <TrendingUp className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                </div>
              </div>
            </div>

            <div className="bg-transparent p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Max Withdrawal</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    ${maxWithdrawal.toFixed(2)}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-full">
                  <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Withdrawal Limit Notice */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-amber-800 dark:text-amber-200">Withdrawal Limit</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Maximum withdrawal amount is limited to ${maxWithdrawal} per transaction for security purposes.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'transactions' && (
        <div className="bg-transparent rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold dark:text-white">Recent Transactions</h2>
            <button className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left p-4 dark:text-gray-200">Type</th>
                  <th className="text-left p-4 dark:text-gray-200">Description</th>
                  <th className="text-left p-4 dark:text-gray-200">Amount</th>
                  <th className="text-left p-4 dark:text-gray-200">Date</th>
                  <th className="text-left p-4 dark:text-gray-200">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-700">
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        <span className="capitalize dark:text-gray-200">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="p-4 dark:text-gray-200">{transaction.description}</td>
                    <td className="p-4">
                      <span
                        className={`font-medium ${
                          transaction.amount > 0
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4 dark:text-gray-200">{transaction.date}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(transaction.status)}`}>
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
          <div className="bg-transparent rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold mb-4 dark:text-white">Request Withdrawal</h2>

            <form onSubmit={handleWithdrawal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                  placeholder={`Max: $${maxWithdrawal}`}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Maximum withdrawal: ${maxWithdrawal} | Available balance: ${currentBalance}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>

              {/* Bank Details Section */}
              {withdrawalRequest.method === 'bank' && (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Bank Account Details
                  </h3>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <User className="w-4 h-4 inline mr-1" />
                      Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.bankDetails.accountHolderName}
                      onChange={(e) => updateBankDetails('accountHolderName', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter full name as per bank records"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Hash className="w-4 h-4 inline mr-1" />
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.bankDetails.accountNumber}
                      onChange={(e) => updateBankDetails('accountNumber', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter bank account number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Building2 className="w-4 h-4 inline mr-1" />
                      IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.bankDetails.ifscCode}
                      onChange={(e) => updateBankDetails('ifscCode', e.target.value.toUpperCase())}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter IFSC code (e.g., SBIN0001234)"
                      pattern="[A-Z]{4}0[A-Z0-9]{6}"
                      maxLength={11}
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      11-character IFSC code (e.g., SBIN0001234)
                    </p>
                  </div>
                </div>
              )}

              {/* PayPal Details */}
              {withdrawalRequest.method === 'paypal' && (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">PayPal Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      PayPal Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={withdrawalRequest.paypalEmail || ''}
                      onChange={(e) =>
                        setWithdrawalRequest({ ...withdrawalRequest, paypalEmail: e.target.value })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter PayPal email address"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Stripe Details */}
              {withdrawalRequest.method === 'stripe' && (
                <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Stripe Details</h3>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stripe Account ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.stripeAccountId || ''}
                      onChange={(e) =>
                        setWithdrawalRequest({ ...withdrawalRequest, stripeAccountId: e.target.value })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter Stripe account ID"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetWithdrawalForm}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 hover:scale-105 active:scale-95"
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-transparent rounded-lg p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-white">Quick Withdrawal</h2>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-2xl"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleWithdrawal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                  placeholder={`Max: $${maxWithdrawal}`}
                  required
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Available: ${currentBalance} | Max: ${maxWithdrawal}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="bank">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="stripe">Stripe</option>
                </select>
              </div>

              {/* Bank Details in Modal */}
              {withdrawalRequest.method === 'bank' && (
                <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Bank Details
                  </h3>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Account Holder Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.bankDetails.accountHolderName}
                      onChange={(e) => updateBankDetails('accountHolderName', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Full name as per bank"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Account Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.bankDetails.accountNumber}
                      onChange={(e) => updateBankDetails('accountNumber', e.target.value)}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Bank account number"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      IFSC Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.bankDetails.ifscCode}
                      onChange={(e) => updateBankDetails('ifscCode', e.target.value.toUpperCase())}
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="IFSC code (e.g., SBIN0001234)"
                      pattern="[A-Z]{4}0[A-Z0-9]{6}"
                      maxLength={11}
                      required
                    />
                  </div>
                </div>
              )}

              {/* PayPal in Modal */}
              {withdrawalRequest.method === 'paypal' && (
                <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      PayPal Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={withdrawalRequest.paypalEmail || ''}
                      onChange={(e) =>
                        setWithdrawalRequest({ ...withdrawalRequest, paypalEmail: e.target.value })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="PayPal email address"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Stripe in Modal */}
              {withdrawalRequest.method === 'stripe' && (
                <div className="space-y-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                      Stripe Account ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={withdrawalRequest.stripeAccountId || ''}
                      onChange={(e) =>
                        setWithdrawalRequest({ ...withdrawalRequest, stripeAccountId: e.target.value })
                      }
                      className="w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1.5 text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Stripe account ID"
                      required
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
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
