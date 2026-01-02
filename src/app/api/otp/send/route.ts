import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, phone, email } = body;

    if (!type || (type === 'phone' && !phone) || (type === 'email' && !email)) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate ref code (6 digits)
    const refCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Mock: Always return success
    // In production, this would send actual OTP via SMS/Email
    return NextResponse.json({
      success: true,
      data: {
        otp_sent: true,
        ref_code: refCode,
        // Mock OTP for testing (in production, never return OTP)
        mock_otp: '123456',
      },
      message: type === 'phone' 
        ? `OTP sent to ${phone?.slice(-4) || 'phone'}`
        : `OTP sent to ${email || 'email'}`,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}


