import { AxiosIntance } from "../config/Axios.Intance";

export const adminGetUsersApi = async (params = {}) => {
  const res = await AxiosIntance.get("/admin/users", { params });
  return res.data;
};

export const adminUpdateUserRoleApi = async (userId, role) => {
  const res = await AxiosIntance.patch(`/admin/users/${userId}/role`, { role });
  return res.data;
};

export const adminDeleteUserApi = async (userId) => {
  const res = await AxiosIntance.delete(`/admin/users/${userId}`);
  return res.data;
};

export const adminGetTracksApi = async (params = {}) => {
  const res = await AxiosIntance.get("/admin/tracks", { params });
  return res.data;
};

export const adminUpdateTrackStatusApi = async (trackId, payload) => {
  const res = await AxiosIntance.patch(`/admin/tracks/${trackId}/status`, payload);
  return res.data;
};

export const adminUpdateTrackMetaApi = async (trackId, payload) => {
  const res = await AxiosIntance.patch(`/admin/tracks/${trackId}`, payload);
  return res.data;
};

// ===================== PAYMENTS / WALLET / WITHDRAWALS =====================
// The dashboard uses these exports in AdminPayments.

// GET /api/admin/payments?search=&status=&limit=&page=
export const adminGetPaymentsApi = async (params = {}) => {
  const res = await AxiosIntance.get("/admin/payments", { params });
  return res.data;
};

// POST /api/admin/payments/manual
// payload: { userId, amount, method, note, referenceId, meta }
export const adminCreateManualPaymentApi = async (payload) => {
  const res = await AxiosIntance.post("/admin/payments/manual", payload);
  return res.data;
};

// PATCH /api/admin/payments/:paymentId/approve
export const adminApprovePaymentApi = async (paymentId, payload = {}) => {
  const res = await AxiosIntance.patch(`/admin/payments/${paymentId}/approve`, payload);
  return res.data;
};

// PATCH /api/admin/payments/:paymentId/reject
export const adminRejectPaymentApi = async (paymentId, payload = {}) => {
  const res = await AxiosIntance.patch(`/admin/payments/${paymentId}/reject`, payload);
  return res.data;
};

// GET /api/admin/users/:userId/transactions
export const adminGetUserTransactionsApi = async (userId, params = {}) => {
  const res = await AxiosIntance.get(`/admin/users/${userId}/transactions`, { params });
  return res.data;
};

// PATCH /api/admin/users/:userId/wallet
// payload: { balance, delta, reason }
export const adminUpdateUserWalletApi = async (userId, payload) => {
  const res = await AxiosIntance.patch(`/admin/users/${userId}/wallet`, payload);
  return res.data;
};

// GET /api/admin/withdrawals?search=&status=&limit=&page=
export const adminGetWithdrawalsApi = async (params = {}) => {
  const res = await AxiosIntance.get("/admin/withdrawals", { params });
  return res.data;
};

// PATCH /api/admin/withdrawals/:withdrawalId/approve
export const adminApproveWithdrawalApi = async (withdrawalId, payload = {}) => {
  const res = await AxiosIntance.patch(`/admin/withdrawals/${withdrawalId}/approve`, payload);
  return res.data;
};

// PATCH /api/admin/withdrawals/:withdrawalId/reject
export const adminRejectWithdrawalApi = async (withdrawalId, payload = {}) => {
  const res = await AxiosIntance.patch(`/admin/withdrawals/${withdrawalId}/reject`, payload);
  return res.data;
};
