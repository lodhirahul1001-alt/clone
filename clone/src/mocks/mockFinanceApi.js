// Mock Finance API for payment creation
// This simulates a backend server for payment functionality

let mockBalance = 1500.00;
let mockMaxWithdrawal = 500.00;
let mockPendingEarnings = 250.00;
let mockTransactions = [
  {
    id: '1',
    type: 'earning',
    amount: 150.00,
    description: 'Spotify streaming royalties',
    date: '2024-01-15',
    status: 'completed'
  },
  {
    id: '2',
    type: 'withdrawal',
    amount: 100.00,
    description: 'Bank transfer withdrawal',
    date: '2024-01-10',
    status: 'completed'
  },
  {
    id: '3',
    type: 'royalty',
    amount: 250.00,
    description: 'YouTube Content ID earnings',
    date: '2024-01-20',
    status: 'pending'
  }
];
let mockWithdrawalRequests = [];

// Mock delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockFinanceSummary = async () => {
  await delay(500); // Simulate network delay
  return {
    success: true,
    data: {
      currentBalance: mockBalance,
      maxWithdrawal: mockMaxWithdrawal,
      pendingEarnings: mockPendingEarnings,
      totalEarnings: mockBalance + mockPendingEarnings
    }
  };
};

export const mockGetMyWithdrawals = async () => {
  await delay(500); // Simulate network delay
  return {
    success: true,
    data: mockWithdrawalRequests
  };
};

export const mockRequestWithdrawal = async (payload) => {
  await delay(1000); // Simulate processing delay

  // Validate withdrawal amount
  if (payload.amount > mockMaxWithdrawal) {
    throw new Error(`Maximum withdrawal amount is $${mockMaxWithdrawal}`);
  }

  if (payload.amount > mockBalance) {
    throw new Error('Insufficient balance');
  }

  // Validate required fields based on method
  if (payload.method === 'bank') {
    const { accountNumber, ifscCode, accountHolderName } = payload.bankDetails;
    if (!accountNumber || !ifscCode || !accountHolderName) {
      throw new Error('Please fill in all bank details');
    }
  } else if (payload.method === 'paypal') {
    if (!payload.paypalEmail) {
      throw new Error('Please provide PayPal email');
    }
  } else if (payload.method === 'stripe') {
    if (!payload.stripeAccountId) {
      throw new Error('Please provide Stripe account ID');
    }
  }

  // Create withdrawal request
  const withdrawalRequest = {
    id: `req_${Date.now()}`,
    amount: payload.amount,
    method: payload.method,
    status: 'pending',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    bankDetails: payload.method === 'bank' ? payload.bankDetails : undefined,
    paypalEmail: payload.method === 'paypal' ? payload.paypalEmail : undefined,
    stripeAccountId: payload.method === 'stripe' ? payload.stripeAccountId : undefined
  };

  // Add to requests list
  mockWithdrawalRequests.unshift(withdrawalRequest);

  // Deduct from balance
  mockBalance -= payload.amount;

  return {
    success: true,
    data: {
      message: 'Withdrawal request submitted successfully',
      request: withdrawalRequest,
      newBalance: mockBalance
    }
  };
};

// Mock function to simulate transaction updates
export const mockAddTransaction = (transaction) => {
  const newTransaction = {
    ...transaction,
    id: `txn_${Date.now()}`,
    date: new Date().toISOString().split('T')[0]
  };
  mockTransactions.unshift(newTransaction);
  return newTransaction;
};

// Reset mock data (for testing)
export const resetMockData = () => {
  mockBalance = 1500.00;
  mockMaxWithdrawal = 500.00;
  mockPendingEarnings = 250.00;
  mockTransactions = [
    {
      id: '1',
      type: 'earning',
      amount: 150.00,
      description: 'Spotify streaming royalties',
      date: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      type: 'withdrawal',
      amount: 100.00,
      description: 'Bank transfer withdrawal',
      date: '2024-01-10',
      status: 'completed'
    },
    {
      id: '3',
      type: 'royalty',
      amount: 250.00,
      description: 'YouTube Content ID earnings',
      date: '2024-01-20',
      status: 'pending'
    }
  ];
  mockWithdrawalRequests = [];
};

// Get current mock state
export const getMockState = () => ({
  balance: mockBalance,
  maxWithdrawal: mockMaxWithdrawal,
  pendingEarnings: mockPendingEarnings,
  transactions: mockTransactions,
  withdrawalRequests: mockWithdrawalRequests
});