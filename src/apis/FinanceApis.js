import { AxiosIntance } from "../config/Axios.Intance";

// ===== User Finance =====

export const getFinanceSummaryApi = async () => {
  const res = await AxiosIntance.get("/finance/summary");
  return res.data;
};

export const getMyWithdrawalsApi = async () => {
  const res = await AxiosIntance.get("/finance/withdrawals/my");
  return res.data;
};

export const requestWithdrawalApi = async (payload) => {
  const res = await AxiosIntance.post("/finance/withdrawals/request", payload);
  return res.data;
};
