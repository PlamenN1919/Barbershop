import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/apiAuth';

// GET /api/barbers — list all barbers (public: only active, admin: all)
export async function GET(request: NextRequest) {
  const isAdmin = await isAuthenticated(request);
  
  if (isAdmin) {
    return NextResponse.json(await db.getBarbers());
  }
  
  return NextResponse.json(await db.getActiveBarbers());
}

// POST /api/barbers — add a new barber (admin only)
export async function POST(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { name, photoUrl, specialty, isActive } = body;

    if (!name || !specialty) {
      return NextResponse.json(
        { error: 'Името и специалността са задължителни.' },
        { status: 400 }
      );
    }

    const barber = await db.addBarber({
      name,
      photoUrl: photoUrl || '',
      specialty,
      isActive: isActive !== undefined ? isActive : true,
    });

    return NextResponse.json(barber, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: 'Невалидна заявка.' },
      { status: 400 }
    );
  }
}
