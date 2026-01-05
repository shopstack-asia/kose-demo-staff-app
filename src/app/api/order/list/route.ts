import { NextRequest, NextResponse } from 'next/server';
import { orderMock, OfflineOrder } from '@/mock/order';
import dayjs from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    const storeId = searchParams.get('store_id');
    const customerId = searchParams.get('customer_id');
    const purchaseNo = searchParams.get('purchase_no');

    // Get all orders (in a real app, this would come from a database)
    let orders: OfflineOrder[] = orderMock.getAll();

    // Apply filters
    if (dateFrom) {
      const fromDate = dayjs(dateFrom).startOf('day');
      orders = orders.filter(order => dayjs(order.order_date).isSameOrAfter(fromDate));
    }

    if (dateTo) {
      const toDate = dayjs(dateTo).endOf('day');
      orders = orders.filter(order => dayjs(order.order_date).isSameOrBefore(toDate));
    }

    if (storeId) {
      orders = orders.filter(order => order.store_id === storeId);
    }

    if (customerId) {
      orders = orders.filter(order => order.customer_id === customerId);
    }

    if (purchaseNo) {
      orders = orders.filter(order => 
        order.id.toLowerCase().includes(purchaseNo.toLowerCase()) ||
        order.id.toLowerCase() === purchaseNo.toLowerCase()
      );
    }

    // Sort by order date descending (newest first)
    orders.sort((a, b) => dayjs(b.order_date).valueOf() - dayjs(a.order_date).valueOf());

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

