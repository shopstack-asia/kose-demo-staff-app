/**
 * Mock Customer Data
 */

import dayjs from 'dayjs';

export interface CustomerProfile {
  id: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  email?: string;
  dob?: string;
  gender?: 'male' | 'female' | 'other';
  image_url?: string;
  terms_accepted: boolean;
  data_processing_consent?: boolean;
  marketing_consent?: boolean;
  phone_verified: boolean;
  email_verified: boolean;
  member_no?: string;
  tier?: 'silver' | 'gold' | 'platinum';
  tier_expiry?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  updated_at: string;
}

// Mock storage (simulating database)
let mockCustomers: CustomerProfile[] = [
  {
    id: 'cust_001',
    first_name: 'สมชาย',
    last_name: 'ใจดี',
    phone: '0812345678',
    email: 'somchai@example.com',
    dob: '1990-01-15',
    gender: 'male',
    terms_accepted: true,
    phone_verified: true,
    email_verified: true,
    member_no: 'KOS-000001',
    tier: 'gold',
    tier_expiry: dayjs().add(1, 'year').toISOString(),
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cust_002',
    first_name: 'สมหญิง',
    last_name: 'รักสวย',
    phone: '0823456789',
    email: 'somying@example.com',
    dob: '1995-05-20',
    gender: 'female',
    terms_accepted: true,
    phone_verified: true,
    email_verified: true,
    member_no: 'KOS-000002',
    tier: 'platinum',
    tier_expiry: dayjs().add(1, 'year').toISOString(),
    status: 'active',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

export const customerMock = {
  findById(id: string): CustomerProfile | null {
    return mockCustomers.find((c) => c.id === id) || null;
  },

  findByPhone(phone: string): CustomerProfile | null {
    return mockCustomers.find((c) => c.phone === phone) || null;
  },

  search(query: string): CustomerProfile[] {
    const lowerQuery = query.toLowerCase();
    return mockCustomers.filter(
      (c) =>
        c.first_name?.toLowerCase().includes(lowerQuery) ||
        c.last_name?.toLowerCase().includes(lowerQuery) ||
        c.phone?.includes(query) ||
        c.email?.toLowerCase().includes(lowerQuery) ||
        c.member_no?.toLowerCase().includes(lowerQuery)
    );
  },

  create(profile: Partial<CustomerProfile>): CustomerProfile {
    const now = new Date().toISOString();
    const customerId = 'cust_' + Date.now();
    const customer: CustomerProfile = {
      id: customerId,
      first_name: profile.first_name,
      last_name: profile.last_name,
      phone: profile.phone,
      email: profile.email,
      dob: profile.dob,
      gender: profile.gender,
      image_url: profile.image_url,
      terms_accepted: profile.terms_accepted || false,
      phone_verified: profile.phone_verified || false,
      email_verified: profile.email_verified || false,
      member_no: profile.member_no || `KOS-${customerId.slice(-6).toUpperCase()}`,
      tier: profile.tier || 'silver',
      tier_expiry: profile.tier_expiry || dayjs().add(1, 'year').toISOString(),
      status: profile.status || 'pending',
      created_at: now,
      updated_at: now,
    };
    mockCustomers.push(customer);
    return customer;
  },

  update(id: string, updates: Partial<CustomerProfile>): CustomerProfile | null {
    const index = mockCustomers.findIndex((c) => c.id === id);
    if (index === -1) return null;

    mockCustomers[index] = {
      ...mockCustomers[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return mockCustomers[index];
  },

  verifyPhone(id: string): boolean {
    const customer = this.update(id, { phone_verified: true });
    return customer !== null;
  },

  verifyEmail(id: string): boolean {
    const customer = this.update(id, { email_verified: true });
    return customer !== null;
  },

  activate(id: string): boolean {
    const customer = this.update(id, { status: 'active' });
    return customer !== null;
  },

  // For testing: reset mock data
  reset(): void {
    mockCustomers = [];
  },
};


