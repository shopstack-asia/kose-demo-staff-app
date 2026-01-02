import { NextRequest, NextResponse } from 'next/server';

// Mock staff users
const mockStaffUsers = [
  {
    id: 'staff_001',
    username: 'staff',
    password: 'password', // In production, this would be hashed
    name: 'Staff User',
    role: 'staff',
  },
  {
    id: 'staff_002',
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = mockStaffUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate mock token (in production, use JWT or similar)
    const token = `mock_token_${user.id}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}


