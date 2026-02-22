import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/apiAuth';

// DELETE /api/barbers/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAuthenticated(request))) {
    return unauthorizedResponse();
  }

  const removed = await db.removeBarber(params.id);
  if (!removed) {
    return NextResponse.json(
      { error: 'Бръснарят не е намерен.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
