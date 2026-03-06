import { mockFinanceSummary, mockGetMyWithdrawals, mockRequestWithdrawal } from "../mocks/mockFinanceApi";

// ===== User Finance =====

export const getFinanceSummaryApi = async () => {
  return await mockFinanceSummary();
};

export const getMyWithdrawalsApi = async () => {
  return await mockGetMyWithdrawals();
};

export const requestWithdrawalApi = async (payload) => {
  return await mockRequestWithdrawal(payload);
};
