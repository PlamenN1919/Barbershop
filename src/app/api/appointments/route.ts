import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/apiAuth';

// GET /api/appointments — list all appointments (admin only)
export async function GET(request: NextRequest) {
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const appointments = db.getAppointments();
  return NextResponse.json(appointments);
}

// POST /api/appointments — create a new appointment (public)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { serviceId, barberId, date, time, customerName, customerPhone } = body;

    // Validate required fields
    if (!serviceId || !barberId || !date || !time || !customerName || !customerPhone) {
      return NextResponse.json(
        { error: 'Всички полета са задължителни.' },
        { status: 400 }
      );
    }

    // Validate phone format
    if (!/^[+]?[\d\s()\-]+$/.test(customerPhone) || customerPhone.replace(/[\s\-()]/g, '').length < 7) {
      return NextResponse.json(
        { error: 'Моля, въведете валиден телефонен номер.' },
        { status: 400 }
      );
    }

    // Validate name
    if (customerName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Името трябва да е поне 2 символа.' },
        { status: 400 }
      );
    }

    // Validate barber exists
    const barber = db.getBarberById(barberId);
    if (!barber || !barber.isActive) {
      return NextResponse.json(
        { error: 'Избраният бръснар не е наличен.' },
        { status: 400 }
      );
    }

    // Validate service exists
    const services = db.getServices();
    if (!services.find((s) => s.id === serviceId)) {
      return NextResponse.json(
        { error: 'Избраната услуга не съществува.' },
        { status: 400 }
      );
    }

    // Check for conflicts
    const conflict = db.checkConflict(barberId, date, time);
    if (conflict) {
      return NextResponse.json(
        { error: 'Този час вече е зает. Моля, изберете друг.' },
        { status: 409 }
      );
    }

    // Anti-spam check
    const spamCheck = db.checkForDuplicateBooking(customerName, customerPhone, date, time);

    // Block if rate limited
    if (spamCheck.existingBookings.length >= 5) {
      return NextResponse.json(
        {
          error: 'Достигнахте максималния брой резервации. Моля, свържете се с нас директно.',
          blocked: true,
        },
        { status: 429 }
      );
    }

    // Create the appointment
    const isFlagged = spamCheck.isSuspicious || spamCheck.isDuplicate;
    const flagReason = spamCheck.warnings.length > 0 ? spamCheck.warnings.join('; ') : undefined;

    const appointment = db.addAppointment({
      serviceId,
      barberId,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: body.customerEmail || '',
      appointmentDate: date,
      appointmentTime: time,
      status: 'upcoming',
      isFlagged,
      flagReason,
    });

    return NextResponse.json(
      {
        appointment,
        warnings: spamCheck.warnings,
        isDuplicate: spamCheck.isDuplicate,
        isSuspicious: spamCheck.isSuspicious,
      },
      { status: 201 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Невалидна заявка.' },
      { status: 400 }
    );
  }
}
