import { NextRequest, NextResponse } from 'next/server';
import { staffMock } from '@/mock/staff';

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

    // Find user by username
    const profile = staffMock.findByUsername(username);

    if (!profile) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Verify password
    if (!staffMock.verifyPassword(profile.id, password)) {
      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Generate mock token (in production, use JWT or similar)
    const token = `mock_token_${profile.id}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      data: {
        token,
        user: {
          id: profile.id,
          username: profile.username,
          name: profile.name,
          role: profile.role,
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


