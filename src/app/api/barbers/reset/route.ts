import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/apiAuth';

// POST /api/barbers/reset — reset barbers to initial data (admin only)
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }

  db.resetBarbers();
  return NextResponse.json({ success: true, barbers: db.getBarbers() });
}
