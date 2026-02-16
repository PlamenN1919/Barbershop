import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/apiAuth';

// DELETE /api/blocked-slots/[id]
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const removed = db.removeBlockedSlot(params.id);
  if (!removed) {
    return NextResponse.json(
      { error: 'Блокираният слот не е намерен.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
