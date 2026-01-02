import { NextRequest, NextResponse } from 'next/server';
import { customerMock } from '@/mock/customer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_id, terms_accepted, data_processing_consent, marketing_consent } = body;

    if (!customer_id) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    // Update customer with all registration data at once
    const customer = customerMock.update(customer_id, {
      status: 'active',
      terms_accepted: terms_accepted !== undefined ? terms_accepted : true,
      data_processing_consent: data_processing_consent !== undefined ? data_processing_consent : false,
      marketing_consent: marketing_consent !== undefined ? marketing_consent : false,
    });

    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        customer,
        registered_at: new Date().toISOString(),
      },
      message: 'Registration completed successfully',
    });
  } catch (error) {
    console.error('Error registering customer:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Invalid request' },
      { status: 400 }
    );
  }
}


