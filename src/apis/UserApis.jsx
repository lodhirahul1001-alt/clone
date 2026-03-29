import { AxiosIntance } from "../config/Axios.Intance";
import { buildFinanceSnapshot, firstFiniteNumber } from "../utils/finance";

// GET /api/user
export const getAllUsersApi = async () => {
  const res = await AxiosIntance.get("/user");
  return res.data; // { msg, allUsers }
};

// GET /api/user/follow/:user_id
export const followUserApi = async (userId) => {
  const res = await AxiosIntance.get(`/user/follow/${userId}`);
  return res.data; // { message: "Followed" }
};

// GET /api/user/unfollow/:user_id
export const unfollowUserApi = async (userId) => {
  const res = await AxiosIntance.get(`/user/unfollow/${userId}`);
  return res.data; // { msg: "Unfollowed" }
};

// GET /api/user/block/:user_id
export const blockUserApi = async (userId) => {
  const res = await AxiosIntance.get(`/user/block/${userId}`);
  return res.data; // { msg: "usr blocked" }
};

// NEW: get logged-in user's profile
export const getProfileApi = async () => {
    const res = await AxiosIntance.get("/user/profile");
    return res.data; // { msg, user }
  };
  
  // NEW: update personal profile
  export const updatePersonalProfileApi = async (data) => {
    const res = await AxiosIntance.put("/user/profile", data);
    return res.data; // { msg, user }
  };
  
  // NEW: update bank details
  export const updateBankDetailsApi = async (data) => {
    const res = await AxiosIntance.put("/user/profile/bank", data);
    return res.data; // { msg, user }
  };
  
  // NEW: update PAN details
  export const updatePanDetailsApi = async (data) => {
    const res = await AxiosIntance.put("/user/profile/pan", data);
    return res.data; // { msg, user }
  };
  
  // NEW: change password
  export const changePasswordApi = async (data) => {
    const res = await AxiosIntance.put("/user/profile/password", data);
    return res.data; // { msg }
  };

// POST /api/user/profile-picture (multipart)
export const uploadProfilePictureApi = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const res = await AxiosIntance.post("/user/profile-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data; // { msg, dp }
};

//  FINANCE (USER) 
// These routes should be available on backend for showing wallet + transactions + withdrawals.

// GET /api/finance/summary
export const getFinanceSummaryApi = async () => {
  const res = await AxiosIntance.get("/finance/summary");
  const payload = res.data?.data || res.data || {};
  const normalized = buildFinanceSnapshot({ summary: payload });

  return {
    ...payload,
    totals: payload?.totals || {},
    balance: normalized.availableBalance,
    walletBalance: normalized.availableBalance,
    availableBalance: normalized.availableBalance,
    totalEarnings: normalized.totalEarnings,
    withdrawnAmount: normalized.withdrawnAmount,
    pendingWithdrawals: normalized.pendingWithdrawalAmount,
    requestableBalance: normalized.requestableBalance,
    pendingEarnings: firstFiniteNumber(payload?.pendingEarnings, payload?.totals?.pendingEarnings, 0) ?? 0,
    maxWithdrawal: normalized.maxWithdrawal,
  };
};

// GET /api/finance/transactions
export const getFinanceTransactionsApi = async (params = {}) => {
  const res = await AxiosIntance.get("/finance/transactions", { params });
  const payload = res.data?.data || res.data || {};
  const list =
    payload?.items ||
    payload?.transactions ||
    payload?.data ||
    res.data?.items ||
    res.data?.transactions ||
    [];
  return {
    ...payload,
    items: Array.isArray(list) ? list : [],
    transactions: Array.isArray(list) ? list : [],
  };
};

// GET /api/finance/withdrawals
export const getMyWithdrawalsApi = async (params = {}) => {
  const res = await AxiosIntance.get("/finance/withdrawals", { params });
  const payload = res.data?.data || res.data || {};
  const list =
    payload?.items ||
    payload?.withdrawals ||
    payload?.data ||
    res.data?.items ||
    res.data?.withdrawals ||
    [];
  return {
    ...payload,
    items: Array.isArray(list) ? list : [],
    withdrawals: Array.isArray(list) ? list : [],
  };
};

// POST /api/finance/withdrawals
export const createWithdrawalRequestApi = async (payload) => {
  // Backend currently supports only bank withdrawals.
  const cleaned = {
    amount: payload?.amount,
    method: "bank",
    bankDetails: payload?.bankDetails,
    currency: payload?.currency,
  };
  const res = await AxiosIntance.post("/finance/withdrawals", cleaned);
  return res.data;
};
