/**
 * Mock Point Transaction Data
 */

import dayjs from 'dayjs';

export interface PointTransaction {
  id: string;
  customer_id: string;
  type: 'earned' | 'used' | 'expired' | 'promotion';
  amount: number; // Positive for earned/promotion, negative for used/expired
  description: string;
  order_id?: string;
  transaction_date: string;
  expiry_date?: string;
  created_at: string;
}

// Mock storage
let mockPointTransactions: PointTransaction[] = [
  {
    id: 'pt_001',
    customer_id: 'cust_001',
    type: 'earned',
    amount: 120,
    description: 'Purchase - Order #000001',
    order_id: 'order_001',
    transaction_date: dayjs().subtract(5, 'days').toISOString(),
    expiry_date: dayjs().add(1, 'year').toISOString(),
    created_at: dayjs().subtract(5, 'days').toISOString(),
  },
  {
    id: 'pt_002',
    customer_id: 'cust_001',
    type: 'promotion',
    amount: 50,
    description: 'Welcome Bonus',
    transaction_date: dayjs().subtract(30, 'days').toISOString(),
    expiry_date: dayjs().add(11, 'months').toISOString(),
    created_at: dayjs().subtract(30, 'days').toISOString(),
  },
  {
    id: 'pt_003',
    customer_id: 'cust_001',
    type: 'used',
    amount: -30,
    description: 'Redeemed - Order #000001',
    order_id: 'order_001',
    transaction_date: dayjs().subtract(5, 'days').toISOString(),
    created_at: dayjs().subtract(5, 'days').toISOString(),
  },
];

export interface CustomerPointsSummary {
  customer_id: string;
  available_points: number;
  points_expiring_soon: number;
  points_expiring_date?: string;
  total_earned: number;
  total_used: number;
}

export const pointMock = {
  findByCustomerId(customerId: string): PointTransaction[] {
    return mockPointTransactions
      .filter((pt) => pt.customer_id === customerId)
      .sort((a, b) => dayjs(b.transaction_date).valueOf() - dayjs(a.transaction_date).valueOf());
  },

  getCustomerPointsSummary(customerId: string): CustomerPointsSummary {
    const transactions = this.findByCustomerId(customerId);
    const now = dayjs();
    const thirtyDaysFromNow = dayjs().add(30, 'days');

    let available_points = 0;
    let points_expiring_soon = 0;
    let points_expiring_date: string | undefined;
    let total_earned = 0;
    let total_used = 0;

    // Calculate available points and expiring points
    transactions.forEach((transaction) => {
      if (transaction.amount > 0) {
        // Earned points
        total_earned += transaction.amount;
        
        // Check if points are still valid (not expired)
        if (!transaction.expiry_date || dayjs(transaction.expiry_date).isAfter(now)) {
          available_points += transaction.amount;
          
          // Check if expiring soon
          if (transaction.expiry_date && dayjs(transaction.expiry_date).isBefore(thirtyDaysFromNow)) {
            points_expiring_soon += transaction.amount;
            if (!points_expiring_date || dayjs(transaction.expiry_date).isBefore(points_expiring_date)) {
              points_expiring_date = transaction.expiry_date;
            }
          }
        }
      } else {
        // Used or expired points
        total_used += Math.abs(transaction.amount);
        available_points += transaction.amount; // Subtract from available
      }
    });

    return {
      customer_id: customerId,
      available_points: Math.max(0, available_points),
      points_expiring_soon,
      points_expiring_date,
      total_earned,
      total_used,
    };
  },

  create(transaction: Omit<PointTransaction, 'id' | 'created_at'>): PointTransaction {
    const now = new Date().toISOString();
    const transactionId = 'pt_' + Date.now();
    const newTransaction: PointTransaction = {
      ...transaction,
      id: transactionId,
      created_at: now,
    };
    mockPointTransactions.push(newTransaction);
    return newTransaction;
  },

  // For testing: reset mock data
  reset(): void {
    mockPointTransactions = [];
  },
};

