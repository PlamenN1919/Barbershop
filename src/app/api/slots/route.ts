import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';

// GET /api/slots?barberId=X&date=YYYY-MM-DD — get available slots (public)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const barberId = searchParams.get('barberId');
  const date = searchParams.get('date');

  if (!barberId || !date) {
    return NextResponse.json(
      { error: 'barberId и date са задължителни параметри.' },
      { status: 400 }
    );
  }

  // Validate barberId
  const barber = await db.getBarberById(barberId);
  if (!barber) {
    return NextResponse.json(
      { error: 'Бръснарят не е намерен.' },
      { status: 404 }
    );
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json(
      { error: 'Невалиден формат на дата. Използвайте YYYY-MM-DD.' },
      { status: 400 }
    );
  }

  const slots = await db.getAvailableSlots(barberId, date);
  return NextResponse.json(slots);
}
