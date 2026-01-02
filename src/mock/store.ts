/**
 * Mock Store Data
 */

export interface Store {
  id: string;
  code: string;
  name: string;
  address?: string;
  phone?: string;
  type: 'counter' | 'event' | 'popup';
  is_active: boolean;
}

export const storesMock: Store[] = [
  {
    id: 'store_001',
    code: 'CTR-001',
    name: 'Central World Counter',
    address: '999/9 Rama I Rd, Pathum Wan, Bangkok 10330',
    phone: '02-123-4567',
    type: 'counter',
    is_active: true,
  },
  {
    id: 'store_002',
    code: 'CTR-002',
    name: 'Siam Paragon Counter',
    address: '991 Rama I Rd, Pathum Wan, Bangkok 10330',
    phone: '02-234-5678',
    type: 'counter',
    is_active: true,
  },
  {
    id: 'store_003',
    code: 'EVT-001',
    name: 'KOSE Beauty Event - MBK',
    address: '444 Phayathai Rd, Pathum Wan, Bangkok 10330',
    phone: '02-345-6789',
    type: 'event',
    is_active: true,
  },
  {
    id: 'store_004',
    code: 'POP-001',
    name: 'KOSE Pop-up Store - EmQuartier',
    address: '693 Sukhumvit Rd, Khlong Tan Nuea, Bangkok 10110',
    phone: '02-456-7890',
    type: 'popup',
    is_active: true,
  },
];

export const storeMock = {
  findById(id: string): Store | null {
    return storesMock.find((s) => s.id === id) || null;
  },

  findByCode(code: string): Store | null {
    return storesMock.find((s) => s.code === code) || null;
  },

  getAll(): Store[] {
    return storesMock.filter((s) => s.is_active);
  },

  search(query: string): Store[] {
    const lowerQuery = query.toLowerCase();
    return storesMock.filter(
      (s) =>
        s.name.toLowerCase().includes(lowerQuery) ||
        s.code.toLowerCase().includes(lowerQuery) ||
        s.address?.toLowerCase().includes(lowerQuery)
    );
  },
};


