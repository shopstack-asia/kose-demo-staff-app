import { NextRequest, NextResponse } from 'next/server';
import { storeMock } from '@/mock/store';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    let stores;
    if (query && query.trim() !== '') {
      stores = storeMock.search(query);
    } else {
      stores = storeMock.getAll();
    }

    return NextResponse.json({
      success: true,
      data: stores,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}


