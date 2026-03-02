import { AxiosIntance } from "../config/Axios.Intance";

export const adminGetUsersApi = async (params = {}) => {
  const res = await AxiosIntance.get("/admin/users", { params });
  return res.data;
};

export const adminDeleteClaimApi = async (id) => {
  try {
    const res = await AxiosIntance.delete(`/claims/admin/${id}`);
    return res.data;
  } catch (err) {
    // Backward-compatible fallback if backend uses alternate admin route style
    if (err?.response?.status === 404) {
      const res = await AxiosIntance.delete(`/admin/claims/${id}`);
      return res.data;
    }
    throw err;
  }
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

export const adminUpdatePaymentStatusApi = async (id, payload) => {
  const res = await AxiosIntance.patch(`/payments/admin/${id}/status`, payload);
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

// ===== Admin Finance (Earnings / Withdrawals) =====
export const adminGetEarningsApi = async (params = {}) => {
  const res = await AxiosIntance.get("/finance/admin/earnings", { params });
  return res.data;
};

export const adminCreateEarningApi = async (payload) => {
  const res = await AxiosIntance.post("/finance/admin/earnings", payload);
  return res.data;
};

export const adminGetWithdrawalsApi = async (params = {}) => {
  const res = await AxiosIntance.get("/finance/admin/withdrawals", { params });
  return res.data;
};

export const adminUpdateWithdrawalStatusApi = async (id, payload) => {
  const res = await AxiosIntance.patch(`/finance/admin/withdrawals/${id}/status`, payload);
  return res.data;
};

export const adminPayWithdrawalApi = async (id, formData) => {
  const res = await AxiosIntance.patch(`/finance/admin/withdrawals/${id}/pay`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};
