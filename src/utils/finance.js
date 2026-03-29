const EARNING_TYPES = new Set([
  "earning",
  "royalty",
  "credit",
  "manual_credit",
  "manual-credit",
  "admin_credit",
  "admin-credit",
]);

const WITHDRAWAL_TYPES = new Set([
  "withdraw",
  "withdrawal",
  "payout",
]);

const PAID_STATUSES = new Set(["paid", "completed", "success"]);
const OPEN_WITHDRAWAL_STATUSES = new Set(["pending", "approved", "processing"]);

export function toMoneyNumber(value) {
  const n = Number(value ?? 0);
  return Number.isFinite(n) ? n : 0;
}

function roundMoney(value) {
  return Math.round(toMoneyNumber(value) * 100) / 100;
}

export function firstFiniteNumber(...values) {
  for (const value of values) {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return null;
}

export function formatInr(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(toMoneyNumber(value));
}

function extractStatusValue(item = {}) {
  return String(
    item?.status ||
    item?.paymentStatus ||
    item?.withdrawalStatus ||
    item?.adminPayout?.status ||
    item?.adminPayout?.paymentStatus ||
    ""
  )
    .trim()
    .toLowerCase();
}

function hasPaidMarker(item = {}) {
  const payout = item?.adminPayout || item?.payout || {};

  return Boolean(
    item?.paidAt ||
    item?.paidDate ||
    item?.completedAt ||
    payout?.paidAt ||
    payout?.paidDate ||
    payout?.transactionId ||
    payout?.referenceId ||
    payout?.utr ||
    payout?.paidAmount
  );
}

export function normalizeFinanceStatus(statusOrItem, fallbackType = "") {
  const raw =
    statusOrItem && typeof statusOrItem === "object"
      ? extractStatusValue(statusOrItem)
      : String(statusOrItem || "").trim().toLowerCase();

  if (statusOrItem && typeof statusOrItem === "object" && hasPaidMarker(statusOrItem)) {
    return "paid";
  }

  if (PAID_STATUSES.has(raw)) return "paid";
  if (raw === "approved") return "approved";
  if (raw === "rejected" || raw === "failed" || raw === "cancelled" || raw === "canceled") {
    return "rejected";
  }
  if (raw === "pending" || raw === "processing") return "pending";

  return fallbackType === "earning" ? "paid" : "pending";
}

export function getFinanceEntryType(item = {}) {
  const rawType = String(item?.type || item?.transactionType || "").trim().toLowerCase();
  const amount = toMoneyNumber(item?.amount);

  if (WITHDRAWAL_TYPES.has(rawType)) return "withdrawal";
  if (EARNING_TYPES.has(rawType)) return "earning";
  return amount < 0 ? "withdrawal" : "earning";
}

export function normalizeFinanceTransaction(item = {}) {
  const type = getFinanceEntryType(item);
  const amount = roundMoney(Math.abs(toMoneyNumber(item?.amount)));

  return {
    ...item,
    id: item?._id || item?.id || item?.transactionId || `${type}-${item?.createdAt || item?.date || Math.random()}`,
    type,
    amount: type === "withdrawal" ? -amount : amount,
    status: normalizeFinanceStatus(item, type),
    description:
      item?.description ||
      item?.note ||
      item?.remark ||
      (type === "earning" ? "Earning credited by admin" : "Withdrawal request"),
    date:
      item?.paidAt ||
      item?.paidDate ||
      item?.adminPayout?.paidAt ||
      item?.adminPayout?.paidDate ||
      item?.date ||
      item?.createdAt ||
      item?.updatedAt ||
      null,
  };
}

export function normalizeWithdrawal(item = {}) {
  const amount = roundMoney(
    Math.abs(
      firstFiniteNumber(
        item?.adminPayout?.paidAmount,
        item?.paidAmount,
        item?.amount,
        0
      ) ?? 0
    )
  );

  return {
    ...item,
    id: item?._id || item?.id || item?.transactionId || `withdrawal-${item?.createdAt || item?.date || Math.random()}`,
    type: "withdrawal",
    amount: -amount,
    rawAmount: amount,
    status: normalizeFinanceStatus(item, "withdrawal"),
    description:
      item?.description ||
      item?.note ||
      item?.adminPayout?.remark ||
      item?.adminPayout?.note ||
      item?.remark ||
      `${item?.method || "Bank"} withdrawal`,
    date:
      item?.paidAt ||
      item?.paidDate ||
      item?.adminPayout?.paidAt ||
      item?.adminPayout?.paidDate ||
      item?.date ||
      item?.createdAt ||
      item?.updatedAt ||
      null,
  };
}

export function buildFinanceSnapshot({ summary = {}, transactions = [], withdrawals = [] } = {}) {
  const normalizedTransactions = (Array.isArray(transactions) ? transactions : [])
    .map((item) => normalizeFinanceTransaction(item))
    .filter((item) => item.type === "earning");

  const normalizedWithdrawals = (Array.isArray(withdrawals) ? withdrawals : [])
    .map((item) => normalizeWithdrawal(item));

  const totals = summary?.totals || {};

  const totalEarningsFromTransactions = roundMoney(
    normalizedTransactions.reduce((sum, item) => sum + Math.abs(toMoneyNumber(item.amount)), 0)
  );

  const withdrawnFromWithdrawals = roundMoney(
    normalizedWithdrawals
      .filter((item) => item.status === "paid")
      .reduce((sum, item) => sum + Math.abs(toMoneyNumber(item.rawAmount ?? item.amount)), 0)
  );

  const pendingWithdrawals = roundMoney(
    normalizedWithdrawals
      .filter((item) => OPEN_WITHDRAWAL_STATUSES.has(item.status))
      .reduce((sum, item) => sum + Math.abs(toMoneyNumber(item.rawAmount ?? item.amount)), 0)
  );

  const availableFromSummary = firstFiniteNumber(
    summary?.availableBalance,
    summary?.balance,
    summary?.walletBalance,
    summary?.currentBalance,
    totals?.availableBalance
  );

  const withdrawnFromSummary = firstFiniteNumber(
    summary?.withdrawnAmount,
    summary?.withdrawn,
    summary?.totalWithdrawn,
    totals?.withdrawnAmount,
    totals?.withdrawn,
    totals?.totalWithdrawn,
    totals?.paidWithdrawals
  );

  const totalEarningsFromSummary = firstFiniteNumber(
    summary?.totalEarnings,
    summary?.totalCredited,
    summary?.creditedAmount,
    totals?.totalEarnings,
    totals?.totalCredited,
    totals?.creditedAmount,
    totals?.earnings
  );

  const explicitWithdrawnAmount = firstFiniteNumber(
    summary?.withdrawnAmount,
    summary?.withdrawn,
    summary?.totalWithdrawn,
    totals?.withdrawnAmount,
    totals?.withdrawn,
    totals?.totalWithdrawn,
    totals?.paidWithdrawals
  );

  const hasEarningTransactions = normalizedTransactions.length > 0 && totalEarningsFromTransactions > 0;

  const totalEarnings = roundMoney(
    firstFiniteNumber(
      totalEarningsFromSummary,
      hasEarningTransactions ? totalEarningsFromTransactions : null,
      availableFromSummary !== null && withdrawnFromSummary !== null
        ? availableFromSummary + withdrawnFromSummary
        : null,
      availableFromSummary !== null
        ? availableFromSummary + withdrawnFromWithdrawals
        : null,
      totalEarningsFromTransactions,
      0
    )
  );

  const withdrawnAmount = roundMoney(
    Math.max(
      explicitWithdrawnAmount ?? 0,
      withdrawnFromWithdrawals,
      availableFromSummary !== null && (totalEarningsFromSummary !== null || hasEarningTransactions)
        ? Math.max(totalEarnings - availableFromSummary, 0)
        : 0
    )
  );

  const computedAvailableBalance = roundMoney(Math.max(totalEarnings - withdrawnAmount, 0));
  const shouldPreferComputedAvailable =
    totalEarningsFromSummary !== null ||
    explicitWithdrawnAmount !== null ||
    hasEarningTransactions ||
    withdrawnFromWithdrawals > 0;

  const availableBalance = roundMoney(
    firstFiniteNumber(
      shouldPreferComputedAvailable ? computedAvailableBalance : null,
      availableFromSummary,
      computedAvailableBalance,
      0
    )
  );

  const pendingWithdrawalAmount = roundMoney(
    firstFiniteNumber(
      summary?.pendingWithdrawals,
      summary?.pendingWithdrawalAmount,
      summary?.lockedAmount,
      totals?.pendingWithdrawals,
      totals?.pendingWithdrawalAmount,
      totals?.lockedAmount,
      pendingWithdrawals,
      0
    )
  );

  const requestableBalance = roundMoney(
    Math.max(
      firstFiniteNumber(
        summary?.requestableBalance,
        totals?.requestableBalance,
        availableBalance - pendingWithdrawalAmount,
        availableBalance
      ) ?? 0,
      0
    )
  );

  const configuredMaxWithdrawal = firstFiniteNumber(
    summary?.maxWithdrawal,
    totals?.maxWithdrawal
  );

  const maxWithdrawal = roundMoney(
    configuredMaxWithdrawal !== null && configuredMaxWithdrawal > 0
      ? configuredMaxWithdrawal
      : firstFiniteNumber(
          requestableBalance,
          availableBalance,
          0
        )
  );

  const mergedTransactions = [...normalizedTransactions, ...normalizedWithdrawals].sort((a, b) => {
    const left = new Date(a?.date || a?.createdAt || 0).getTime();
    const right = new Date(b?.date || b?.createdAt || 0).getTime();
    return right - left;
  });

  return {
    totals,
    totalEarnings,
    availableBalance,
    withdrawnAmount,
    pendingWithdrawalAmount,
    requestableBalance,
    maxWithdrawal,
    transactions: normalizedTransactions,
    withdrawals: normalizedWithdrawals,
    mergedTransactions,
    pendingWithdrawalCount: normalizedWithdrawals.filter((item) => OPEN_WITHDRAWAL_STATUSES.has(item.status)).length,
  };
}
