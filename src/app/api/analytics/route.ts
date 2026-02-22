import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/apiAuth';
import {
  getDateRangePeriod,
  generateAnalytics,
  getPreviousPeriod,
} from '@/lib/analytics';

// GET /api/analytics?range=month — get analytics data (admin only)
export async function GET(request: NextRequest) {
  if (!(await isAuthenticated(request))) {
    return unauthorizedResponse();
  }

  const { searchParams } = new URL(request.url);
  const range = (searchParams.get('range') || 'month') as 'today' | 'week' | 'month' | 'year';

  const appointments = await db.getAppointments();
  const barbers = await db.getBarbers();
  const period = getDateRangePeriod(range);
  const previousPeriod = getPreviousPeriod(period);

  const previousAppointments = appointments.filter(
    (apt) =>
      apt.appointmentDate >= previousPeriod.startDate &&
      apt.appointmentDate <= previousPeriod.endDate
  );

  const data = generateAnalytics(appointments, barbers, period, previousAppointments);

  return NextResponse.json({ data, period });
}
