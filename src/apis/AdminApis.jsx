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

// ===== Payments =====
export const adminGetPaymentsApi = async (params = {}) => {
  const res = await AxiosIntance.get("/payments/admin/all", { params });
  return res.data;
};

export const adminApprovePaymentApi = async (id, payload = {}) => {
  const res = await AxiosIntance.post(`/payments/admin/${id}/approve`, payload);
  return res.data;
};

export const adminRejectPaymentApi = async (id, payload = {}) => {
  const res = await AxiosIntance.post(`/payments/admin/${id}/reject`, payload);
  return res.data;
};

export const adminGetUserTransactionsApi = async (userId) => {
  const res = await AxiosIntance.get(`/payments/admin/user/${userId}/transactions`);
  return res.data;
};

export const adminUpdateUserWalletApi = async (userId, payload) => {
  const res = await AxiosIntance.patch(`/admin/users/${userId}/wallet`, payload);
  return res.data;
};

// ===== Claims =====
export const adminGetClaimsApi = async (params = {}) => {
  const res = await AxiosIntance.get("/claims/admin/all", { params });
  return res.data;
};

export const adminUpdateClaimStatusApi = async (id, payload) => {
  const res = await AxiosIntance.patch(`/claims/admin/${id}/status`, payload);
  return res.data;
};

// ===== Callbacks =====
export const adminGetCallbacksApi = async (params = {}) => {
  const res = await AxiosIntance.get("/callbacks/admin/all", { params });
  return res.data;
};

export const adminUpdateCallbackStatusApi = async (id, payload) => {
  const res = await AxiosIntance.patch(`/callbacks/admin/${id}/status`, payload);
  return res.data;
};

// ===== Admin Stats =====
export const adminGetStatsApi = async () => {
  const res = await AxiosIntance.get("/admin/stats");
  return res.data;
};

// ===== Notifications =====
export const adminSetNotificationApi = async (payload) => {
  const res = await AxiosIntance.post("/notification/admin/set", payload);
  return res.data;
};

export const adminGetNotificationsApi = async () => {
  const res = await AxiosIntance.get("/notification/admin/all");
  return res.data;
};
