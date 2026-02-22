import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/apiAuth';

// GET /api/blocked-slots — list all blocked slots (admin only)
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const barberId = searchParams.get('barberId');

  if (barberId) {
    const date = searchParams.get('date') || undefined;
    return NextResponse.json(await db.getBlockedSlotsForBarber(barberId, date));
  }

  return NextResponse.json(await db.getBlockedSlots());
}

// POST /api/blocked-slots — add a blocked slot (admin only)
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { barberId, blockedDate, startTime, endTime, reason } = body;

    if (!barberId || !blockedDate) {
      return NextResponse.json(
        { error: 'barberId и blockedDate са задължителни.' },
        { status: 400 }
      );
    }

    const slot = await db.addBlockedSlot({
      barberId,
      blockedDate,
      startTime: startTime || null,
      endTime: endTime || null,
      reason: reason || '',
    });

    return NextResponse.json(slot, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Невалидна заявка.' },
      { status: 400 }
    );
  }
}
