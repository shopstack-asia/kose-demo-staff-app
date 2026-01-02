import { NextRequest, NextResponse } from 'next/server';
import { orderMock } from '@/mock/order';
import dayjs from 'dayjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer_id, store_id, items, discount = 0 } = body;

    // Validate required fields
    if (!customer_id || !store_id || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce(
      (sum: number, item: { total_price: number }) => sum + item.total_price,
      0
    );
    const total = subtotal - discount;

    // Create order
    const order = orderMock.create({
      customer_id,
      store_id,
      order_date: dayjs().toISOString(),
      items,
      subtotal,
      discount,
      total,
      status: 'completed',
    });

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}


