/**
 * Mock Order Data
 */

import dayjs from 'dayjs';

export interface OrderItem {
  product_id: string;
  product_code: string;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OfflineOrder {
  id: string;
  customer_id: string;
  store_id: string;
  order_date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Mock storage
let mockOrders: OfflineOrder[] = [
  {
    id: 'order_001',
    customer_id: 'cust_001',
    store_id: 'store_001',
    order_date: dayjs().subtract(5, 'days').toISOString(),
    items: [
      {
        product_id: 'prod_001',
        product_code: 'SEK-LOT-001',
        product_name: 'Sekkisei Lotion',
        quantity: 2,
        unit_price: 1200,
        total_price: 2400,
      },
    ],
    subtotal: 2400,
    discount: 0,
    total: 2400,
    status: 'completed',
    created_at: dayjs().subtract(5, 'days').toISOString(),
    updated_at: dayjs().subtract(5, 'days').toISOString(),
  },
];

export const orderMock = {
  findById(id: string): OfflineOrder | null {
    return mockOrders.find((o) => o.id === id) || null;
  },

  findByCustomerId(customerId: string): OfflineOrder[] {
    return mockOrders.filter((o) => o.customer_id === customerId);
  },

  create(order: Omit<OfflineOrder, 'id' | 'created_at' | 'updated_at'>): OfflineOrder {
    const now = new Date().toISOString();
    const orderId = 'order_' + Date.now();
    const newOrder: OfflineOrder = {
      ...order,
      id: orderId,
      created_at: now,
      updated_at: now,
    };
    mockOrders.push(newOrder);
    return newOrder;
  },

  update(id: string, updates: Partial<OfflineOrder>): OfflineOrder | null {
    const index = mockOrders.findIndex((o) => o.id === id);
    if (index === -1) return null;

    mockOrders[index] = {
      ...mockOrders[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return mockOrders[index];
  },

  // For testing: reset mock data
  reset(): void {
    mockOrders = [];
  },
};


