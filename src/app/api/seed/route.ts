import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/apiAuth';
import { generateTestAppointments } from '@/lib/generateTestData';

// POST /api/seed — seed test data (admin only)
export async function POST(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const testData = generateTestAppointments();
  db.saveAppointments(testData);

  return NextResponse.json({
    success: true,
    count: testData.length,
    message: `Генерирани ${testData.length} тестови резервации.`,
  });
}
