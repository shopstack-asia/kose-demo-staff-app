import { NextRequest, NextResponse } from 'next/server';
import { staffMock } from '@/mock/staff';

export async function POST(request: NextRequest) {
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
      const { currentPassword, newPassword } = body;

      if (!currentPassword || !newPassword) {
        return NextResponse.json(
          { success: false, error: 'Current password and new password are required' },
          { status: 400 }
        );
      }

      // Verify current password
      if (!staffMock.verifyPassword(userId, currentPassword)) {
        return NextResponse.json(
          { success: false, error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      // Validate new password
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'New password must be at least 6 characters' },
          { status: 400 }
        );
      }

      // Update password
      const success = staffMock.updatePassword(userId, newPassword);

      if (!success) {
        return NextResponse.json(
          { success: false, error: 'Failed to update password' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully',
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

