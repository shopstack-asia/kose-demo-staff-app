import { NextRequest, NextResponse } from 'next/server';
import { productMock } from '@/mock/product';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    let products;
    if (query && query.trim() !== '') {
      products = productMock.search(query);
    } else {
      products = productMock.getAll();
    }

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}


