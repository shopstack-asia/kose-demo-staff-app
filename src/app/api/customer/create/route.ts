import { NextRequest, NextResponse } from 'next/server';
import { customerMock } from '@/mock/customer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      first_name, 
      last_name, 
      phone, 
      email, 
      dob, 
      gender,
      terms_accepted,
      data_processing_consent,
      marketing_consent,
      phone_verified,
      email_verified,
    } = body;

    // Validate required fields
    if (!first_name || !last_name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if phone already exists
    const existingCustomer = customerMock.findByPhone(phone);
    if (existingCustomer) {
      return NextResponse.json(
        { success: false, error: 'Phone number already registered' },
        { status: 400 }
      );
    }

    // Create customer with all data (status: active since OTP is already verified)
    const customer = customerMock.create({
      first_name,
      last_name,
      phone,
      email,
      dob,
      gender,
      terms_accepted: terms_accepted !== undefined ? terms_accepted : false,
      data_processing_consent: data_processing_consent !== undefined ? data_processing_consent : false,
      marketing_consent: marketing_consent !== undefined ? marketing_consent : false,
      phone_verified: phone_verified !== undefined ? phone_verified : false,
      email_verified: email_verified !== undefined ? email_verified : false,
      status: 'active', // Customer is created as active after OTP verification
    });

    console.log('Customer created:', customer.id, customer.first_name, customer.last_name);

    return NextResponse.json({
      success: true,
      data: customer,
    });
  } catch (error) {
    console.error('Error creating customer:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Invalid request' },
      { status: 400 }
    );
  }
}


