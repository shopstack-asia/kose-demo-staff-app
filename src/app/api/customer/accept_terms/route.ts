import { NextRequest, NextResponse } from 'next/server';
import { customerMock } from '@/mock/customer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_id, data_processing_consent, marketing_consent } = body;

    if (!customer_id) {
      return NextResponse.json(
        { success: false, error: 'Customer ID is required' },
        { status: 400 }
      );
    }

    const customer = customerMock.update(customer_id, {
      terms_accepted: true,
      data_processing_consent: data_processing_consent !== undefined ? data_processing_consent : true,
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
      data: customer,
    });
  } catch (error) {
    console.error('Error accepting terms:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Invalid request' },
      { status: 400 }
    );
  }
}


