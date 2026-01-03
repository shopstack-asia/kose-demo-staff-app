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
        product_code: 'SEK-CWL-200',
        product_name: 'Sekkisei Clear Wellness Lotion',
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
  {
    id: 'order_002',
    customer_id: 'cust_001',
    store_id: 'store_001',
    order_date: dayjs().subtract(12, 'days').toISOString(),
    items: [
      {
        product_id: 'prod_002',
        product_code: 'SEK-CWE-200',
        product_name: 'Sekkisei Clear Wellness Emulsion',
        quantity: 1,
        unit_price: 1300,
        total_price: 1300,
      },
      {
        product_id: 'prod_003',
        product_code: 'SEK-CWW-200',
        product_name: 'Sekkisei Clear Wellness Wash',
        quantity: 1,
        unit_price: 850,
        total_price: 850,
      },
    ],
    subtotal: 2150,
    discount: 100,
    total: 2050,
    status: 'completed',
    created_at: dayjs().subtract(12, 'days').toISOString(),
    updated_at: dayjs().subtract(12, 'days').toISOString(),
  },
  {
    id: 'order_003',
    customer_id: 'cust_001',
    store_id: 'store_001',
    order_date: dayjs().subtract(20, 'days').toISOString(),
    items: [
      {
        product_id: 'prod_004',
        product_code: 'DEC-AQMC-30',
        product_name: 'Decorte AQ Meliority Cream',
        quantity: 1,
        unit_price: 2500,
        total_price: 2500,
      },
      {
        product_id: 'prod_005',
        product_code: 'DEC-AQMS-40',
        product_name: 'Decorte AQ Meliority Serum',
        quantity: 1,
        unit_price: 2800,
        total_price: 2800,
      },
    ],
    subtotal: 5300,
    discount: 300,
    total: 5000,
    status: 'completed',
    created_at: dayjs().subtract(20, 'days').toISOString(),
    updated_at: dayjs().subtract(20, 'days').toISOString(),
  },
  {
    id: 'order_004',
    customer_id: 'cust_001',
    store_id: 'store_001',
    order_date: dayjs().subtract(1, 'day').toISOString(),
    items: [
      {
        product_id: 'prod_006',
        product_code: 'INF-PML-200',
        product_name: 'Infinity Pure Moisture Lotion',
        quantity: 1,
        unit_price: 1500,
        total_price: 1500,
      },
      {
        product_id: 'prod_009',
        product_code: 'OBK-CTM-30',
        product_name: 'One by Kose Clear Turn Mask',
        quantity: 3,
        unit_price: 450,
        total_price: 1350,
      },
    ],
    subtotal: 2850,
    discount: 0,
    total: 2850,
    status: 'pending',
    created_at: dayjs().subtract(1, 'day').toISOString(),
    updated_at: dayjs().subtract(1, 'day').toISOString(),
  },
  {
    id: 'order_005',
    customer_id: 'cust_001',
    store_id: 'store_001',
    order_date: dayjs().subtract(30, 'days').toISOString(),
    items: [
      {
        product_id: 'prod_007',
        product_code: 'INF-PME-200',
        product_name: 'Infinity Pure Moisture Emulsion',
        quantity: 2,
        unit_price: 1600,
        total_price: 3200,
      },
    ],
    subtotal: 3200,
    discount: 0,
    total: 3200,
    status: 'completed',
    created_at: dayjs().subtract(30, 'days').toISOString(),
    updated_at: dayjs().subtract(30, 'days').toISOString(),
  },
  {
    id: 'order_006',
    customer_id: 'cust_002',
    store_id: 'store_001',
    order_date: dayjs().subtract(8, 'days').toISOString(),
    items: [
      {
        product_id: 'prod_008',
        product_code: 'ESP-PRC-30',
        product_name: 'Esprique Precious Rich Cream',
        quantity: 1,
        unit_price: 1800,
        total_price: 1800,
      },
      {
        product_id: 'prod_010',
        product_code: 'SEK-WPW-100',
        product_name: 'Sekkisei White Powder Wash',
        quantity: 2,
        unit_price: 950,
        total_price: 1900,
      },
    ],
    subtotal: 3700,
    discount: 200,
    total: 3500,
    status: 'completed',
    created_at: dayjs().subtract(8, 'days').toISOString(),
    updated_at: dayjs().subtract(8, 'days').toISOString(),
  },
  {
    id: 'order_007',
    customer_id: 'cust_002',
    store_id: 'store_001',
    order_date: dayjs().subtract(15, 'days').toISOString(),
    items: [
      {
        product_id: 'prod_001',
        product_code: 'SEK-CWL-200',
        product_name: 'Sekkisei Clear Wellness Lotion',
        quantity: 1,
        unit_price: 1200,
        total_price: 1200,
      },
      {
        product_id: 'prod_002',
        product_code: 'SEK-CWE-200',
        product_name: 'Sekkisei Clear Wellness Emulsion',
        quantity: 1,
        unit_price: 1300,
        total_price: 1300,
      },
      {
        product_id: 'prod_003',
        product_code: 'SEK-CWW-200',
        product_name: 'Sekkisei Clear Wellness Wash',
        quantity: 1,
        unit_price: 850,
        total_price: 850,
      },
    ],
    subtotal: 3350,
    discount: 150,
    total: 3200,
    status: 'completed',
    created_at: dayjs().subtract(15, 'days').toISOString(),
    updated_at: dayjs().subtract(15, 'days').toISOString(),
  },
  {
    id: 'order_008',
    customer_id: 'cust_002',
    store_id: 'store_001',
    order_date: dayjs().subtract(3, 'days').toISOString(),
    items: [
      {
        product_id: 'prod_004',
        product_code: 'DEC-AQMC-30',
        product_name: 'Decorte AQ Meliority Cream',
        quantity: 1,
        unit_price: 2500,
        total_price: 2500,
      },
    ],
    subtotal: 2500,
    discount: 0,
    total: 2500,
    status: 'cancelled',
    created_at: dayjs().subtract(3, 'days').toISOString(),
    updated_at: dayjs().subtract(2, 'days').toISOString(),
  },
  {
    id: 'order_009',
    customer_id: 'cust_001',
    store_id: 'store_001',
    order_date: dayjs().subtract(45, 'days').toISOString(),
    items: [
      {
        product_id: 'prod_009',
        product_code: 'OBK-CTM-30',
        product_name: 'One by Kose Clear Turn Mask',
        quantity: 5,
        unit_price: 450,
        total_price: 2250,
      },
    ],
    subtotal: 2250,
    discount: 0,
    total: 2250,
    status: 'completed',
    created_at: dayjs().subtract(45, 'days').toISOString(),
    updated_at: dayjs().subtract(45, 'days').toISOString(),
  },
  {
    id: 'order_010',
    customer_id: 'cust_001',
    store_id: 'store_001',
    order_date: dayjs().subtract(2, 'hours').toISOString(),
    items: [
      {
        product_id: 'prod_006',
        product_code: 'INF-PML-200',
        product_name: 'Infinity Pure Moisture Lotion',
        quantity: 1,
        unit_price: 1500,
        total_price: 1500,
      },
      {
        product_id: 'prod_007',
        product_code: 'INF-PME-200',
        product_name: 'Infinity Pure Moisture Emulsion',
        quantity: 1,
        unit_price: 1600,
        total_price: 1600,
      },
    ],
    subtotal: 3100,
    discount: 100,
    total: 3000,
    status: 'pending',
    created_at: dayjs().subtract(2, 'hours').toISOString(),
    updated_at: dayjs().subtract(2, 'hours').toISOString(),
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


