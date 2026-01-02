import { NextRequest, NextResponse } from 'next/server';
import { orderMock } from '@/mock/order';

export async function GET(
  request: NextRequest,
  { params }: { params: { customerId: string } }
) {
  try {
    const orders = orderMock.findByCustomerId(params.customerId);

    return NextResponse.json({
      success: true,
      data: orders,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}


