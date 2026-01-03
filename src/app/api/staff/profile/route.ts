import { NextRequest, NextResponse } from 'next/server';
import { staffMock } from '@/mock/staff';

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

    // Extract user ID from token (mock: token format is mock_token_{id}_{timestamp})
    // Example: mock_token_staff_001_1234567890 -> userId = staff_001
    if (token.startsWith('mock_token_')) {
      const parts = token.split('_');
      // Token format: mock_token_staff_001_timestamp
      // So parts[0] = 'mock', parts[1] = 'token', parts[2] = 'staff', parts[3] = '001', ...
      const userId = parts.length >= 4 ? `${parts[2]}_${parts[3]}` : null;
      
      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'Invalid token format' },
          { status: 401 }
        );
      }

      const profile = staffMock.findById(userId);
      
      if (!profile) {
        return NextResponse.json(
          { success: false, error: 'Staff not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: profile,
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

export async function PATCH(request: NextRequest) {
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

    // Extract user ID from token
    // Example: mock_token_staff_001_timestamp -> userId = staff_001
    if (token.startsWith('mock_token_')) {
      const parts = token.split('_');
      const userId = parts.length >= 4 ? `${parts[2]}_${parts[3]}` : null;
      
      if (!userId) {
        return NextResponse.json(
          { success: false, error: 'Invalid token format' },
          { status: 401 }
        );
      }

      const body = await request.json();
      const { name, email, phone } = body;

      // Update profile (username and role cannot be changed)
      const updatedProfile = staffMock.update(userId, {
        name,
        email,
        phone,
      });

      if (!updatedProfile) {
        return NextResponse.json(
          { success: false, error: 'Staff not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: updatedProfile,
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

