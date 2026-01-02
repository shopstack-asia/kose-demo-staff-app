import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Mock: In production, invalidate token on server
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully',
  });
}


