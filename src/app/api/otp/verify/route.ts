import { NextRequest, NextResponse } from 'next/server';
import { customerMock } from '@/mock/customer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, otp, phone, email } = body;

    // Mock: Accept any 6-digit OTP for testing
    // In production, verify against actual OTP service
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP format' },
        { status: 400 }
      );
    }

    if (!type || (type === 'phone' && !phone) || (type === 'email' && !email)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock: Always verify successfully
    // In production, verify OTP with service
    const verified = true;

    if (verified) {
      return NextResponse.json({
        success: true,
        data: {
          verified: true,
        },
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Invalid OTP code' },
        { status: 400 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}


