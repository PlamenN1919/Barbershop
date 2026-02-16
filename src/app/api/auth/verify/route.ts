import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/apiAuth';

export async function GET(request: NextRequest) {
  const authenticated = isAuthenticated(request);
  return NextResponse.json({ authenticated });
}
