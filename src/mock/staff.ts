/**
 * Mock Staff User Data
 */

export interface StaffProfile {
  id: string;
  username: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'staff' | 'admin';
  created_at: string;
  updated_at: string;
}

// Mock storage with passwords (in production, passwords should be hashed)
let mockStaffProfiles: StaffProfile[] = [
  {
    id: 'staff_001',
    username: 'staff',
    name: 'Staff User',
    email: 'staff@kose.com',
    phone: '0812345678',
    role: 'staff',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 'staff_002',
    username: 'admin',
    name: 'Admin User',
    email: 'admin@kose.com',
    phone: '0823456789',
    role: 'admin',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
];

// Separate password storage (in production, this would be hashed in database)
let mockStaffPasswords: Record<string, string> = {
  'staff_001': 'password',
  'staff_002': 'admin123',
};

export const staffMock = {
  findById(id: string): StaffProfile | null {
    return mockStaffProfiles.find((s) => s.id === id) || null;
  },

  findByUsername(username: string): StaffProfile | null {
    return mockStaffProfiles.find((s) => s.username === username) || null;
  },

  update(id: string, updates: Partial<StaffProfile>): StaffProfile | null {
    const index = mockStaffProfiles.findIndex((s) => s.id === id);
    if (index === -1) return null;

    mockStaffProfiles[index] = {
      ...mockStaffProfiles[index],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return mockStaffProfiles[index];
  },

  verifyPassword(id: string, password: string): boolean {
    return mockStaffPasswords[id] === password;
  },

  updatePassword(id: string, newPassword: string): boolean {
    if (!mockStaffProfiles.find((s) => s.id === id)) {
      return false;
    }
    mockStaffPasswords[id] = newPassword;
    return true;
  },

  // For testing: reset mock data
  reset(): void {
    mockStaffProfiles = [
      {
        id: 'staff_001',
        username: 'staff',
        name: 'Staff User',
        email: 'staff@kose.com',
        phone: '0812345678',
        role: 'staff',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
      {
        id: 'staff_002',
        username: 'admin',
        name: 'Admin User',
        email: 'admin@kose.com',
        phone: '0823456789',
        role: 'admin',
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      },
    ];
    mockStaffPasswords['staff_001'] = 'password';
    mockStaffPasswords['staff_002'] = 'admin123';
  },
};

