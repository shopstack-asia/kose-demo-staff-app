import { NextRequest, NextResponse } from 'next/server';
import { customerMock } from '@/mock/customer';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    if (!query || query.trim() === '') {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const customers = customerMock.search(query);

    return NextResponse.json({
      success: true,
      data: customers,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}


