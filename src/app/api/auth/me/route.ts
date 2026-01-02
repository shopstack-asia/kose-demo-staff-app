import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Get token from header
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    // Mock: In production, verify token and get user from database
    // For now, just return mock user if token exists
    if (token.startsWith('mock_token_')) {
      return NextResponse.json({
        success: true,
        data: {
          id: 'staff_001',
          username: 'staff',
          name: 'Staff User',
          role: 'staff',
        },
      });
    }

    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}


