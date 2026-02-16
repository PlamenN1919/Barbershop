import { NextResponse } from 'next/server';
import { getServices } from '@/lib/db';

export async function GET() {
  const services = getServices();
  return NextResponse.json(services);
}
