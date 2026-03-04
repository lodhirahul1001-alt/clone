import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import {
  adminGetPaymentsApi,
  adminCreateManualPaymentApi,
  adminApprovePaymentApi,
  adminRejectPaymentApi,
  adminGetUserTransactionsApi,
  adminUpdateUserWalletApi,
  adminGetUsersApi,
  adminGetWithdrawalsApi,
  adminApproveWithdrawalApi,
  adminRejectWithdrawalApi,
} from "../../apis/AdminApis";

const statusOptions = ["pending", "approved", "rejected"];

const badgeClass = {
  pending:
    "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
  approved:
    "bg-green-500/15 text-green-600 dark:text-green-400 border-green-500/30",
  rejected:
    "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
};

export default function AdminPayments() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [preview, setPreview] = useState(null);
  const [selected, setSelected] = useState(null);

  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(false);

  const [actionLoadingId, setActionLoadingId] = useState(null);

  const [walletDraft, setWalletDraft] = useState({
    balance: "",
    pendingEarnings: "",
    maxWithdrawal: "",
  });

  const [users, setUsers] = useState([]);
  const [userQuery, setUserQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalLoading, setWithdrawalLoading] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    amount: "",
    transactionId: "",
    upiId: "",
    email: "",
    name: "",
    screenshotUrl: "",
  });

  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await adminGetPaymentsApi({
        search: query,
        status: statusFilter,
        limit: 50,
      });
      setItems(data?.items || []);
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const data = await adminGetUsersApi({ search: userQuery });
      setUsers(data?.users || []);
    } catch {}
  };

  const fetchWithdrawals = async () => {
    try {
      setWithdrawalLoading(true);
      const data = await adminGetWithdrawalsApi({ status: "pending" });
      setWithdrawals(data?.withdrawals || []);
    } catch {
      toast.error("Failed to load withdrawals");
    } finally {
      setWithdrawalLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [userQuery]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    if (!q) return items;
    return items.filter((p) =>
      [p.fullName, p.email, p.phone, p.transactionId]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [items, query]);

  const openPayment = async (p) => {
    setSelected(p);

    const w = p?.user?.wallet || {
      balance: 0,
      pendingEarnings: 0,
      maxWithdrawal: 0,
    };

    setWalletDraft({
      balance: String(w.balance),
      pendingEarnings: String(w.pendingEarnings),
      maxWithdrawal: String(w.maxWithdrawal),
    });

    if (!p?.user?._id) return;

    try {
      setTxLoading(true);
      const res = await adminGetUserTransactionsApi(p.user._id);
      setTransactions(res?.items || []);
    } catch {
      setTransactions([]);
    } finally {
      setTxLoading(false);
    }
  };

  const approve = async (p) => {
    try {
      setActionLoadingId(p._id);
      await adminApprovePaymentApi(p._id);
      toast.success("Payment approved & wallet credited");
      await fetchItems();
      setSelected(null);
    } catch {
      toast.error("Approve failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  
  const reject = async (p) => {
    const reason = window.prompt("Reject reason") || "";
    try {
      setActionLoadingId(p._id);
      await adminRejectPaymentApi(p._id, { reason });
      toast.success("Payment rejected");
      await fetchItems();
      setSelected(null);
    } catch {
      toast.error("Reject failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const saveWallet = async () => {
    if (!selected?.user?._id) return toast.error("User missing");

    try {
      await adminUpdateUserWalletApi(selected.user._id, {
        balance: Number(walletDraft.balance),
        pendingEarnings: Number(walletDraft.pendingEarnings),
        maxWithdrawal: Number(walletDraft.maxWithdrawal),
      });

      toast.success("Wallet updated");
      await fetchItems();
      setSelected(null);
    } catch {
      toast.error("Wallet update failed");
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);

    setPaymentForm((s) => ({
      ...s,
      email: user.email,
      name: user.fullName,
    }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();

    const { amount, transactionId, email } = paymentForm;

    if (!amount || !transactionId || !email)
      return toast.error("Amount, Transaction ID, Email required");

    try {
      await adminCreateManualPaymentApi(paymentForm);

      toast.success("Manual payment created");

      setPaymentForm({
        amount: "",
        transactionId: "",
        upiId: "",
        email: "",
        name: "",
        screenshotUrl: "",
      });

      setSelectedUser(null);
      fetchItems();
    } catch {
      toast.error("Payment creation failed");
    }
  };

  const handleWithdrawalApprove = async (w) => {
    const txn = window.prompt("Enter payout transaction ID") || "";

    try {
      await adminApproveWithdrawalApi(w._id, { transactionId: txn });
      toast.success("Withdrawal approved");
      fetchWithdrawals();
    } catch {
      toast.error("Approve failed");
    }
  };

  const handleWithdrawalReject = async (w) => {
    const reason = window.prompt("Reject reason") || "";

    try {
      await adminRejectWithdrawalApi(w._id, { reason });
      toast.success("Withdrawal rejected");
      fetchWithdrawals();
    } catch {
      toast.error("Reject failed");
    }
  };

  return (
    <div className="space-y-6">
      <div className="dash-card p-4 rounded-2xl">
        <h2 className="text-lg font-semibold mb-3">Manual Payment</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <input
              placeholder="Search user..."
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              className="dash-input w-full"
            />

            <div className="max-h-40 overflow-auto mt-2">
              {users.map((u) => (
                <div
                  key={u._id}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => handleUserSelect(u)}
                >
                  <div className="font-medium">{u.fullName}</div>
                  <div className="text-xs">{u.email}</div>
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handlePaymentSubmit} className="space-y-2">
            <input
              placeholder="Amount"
              type="number"
              value={paymentForm.amount}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, amount: e.target.value })
              }
              className="dash-input"
            />

            <input
              placeholder="Transaction ID"
              value={paymentForm.transactionId}
              onChange={(e) =>
                setPaymentForm({
                  ...paymentForm,
                  transactionId: e.target.value,
                })
              }
              className="dash-input"
            />

            <input
              placeholder="User Email"
              value={paymentForm.email}
              onChange={(e) =>
                setPaymentForm({ ...paymentForm, email: e.target.value })
              }
              className="dash-input"
            />

            <button className="dash-btn">Create Payment</button>
          </form>
        </div>
      </div>

      <div className="dash-card p-4 rounded-2xl">
        <h2 className="text-lg font-semibold mb-3">Payments</h2>

        <div className="flex gap-2 mb-3">
          <input
            className="dash-input"
            placeholder="Search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <button className="dash-btn" onClick={fetchItems}>
            Refresh
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr>
              <th>User</th>
              <th>Txn</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((p) => (
              <tr key={p._id}>
                <td>{p.fullName}</td>
                <td>{p.transactionId}</td>
                <td>₹{p.amount}</td>

                <td>
                  <span
                    className={`px-2 py-1 rounded border ${
                      badgeClass[p.status]
                    }`}
                  >
                    {p.status}
                  </span>
                </td>

                <td className="flex gap-2">
                  <button
                    className="dash-btn"
                    onClick={() => openPayment(p)}
                  >
                    Manage
                  </button>

                  {p.status === "pending" && (
                    <>
                      <button
                        disabled={actionLoadingId === p._id}
                        className="dash-btn"
                        onClick={() => approve(p)}
                      >
                        Approve
                      </button>

                      <button
                        disabled={actionLoadingId === p._id}
                        className="dash-btn"
                        onClick={() => reject(p)}
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}