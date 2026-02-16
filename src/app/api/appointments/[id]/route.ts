import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/lib/db';
import { isAuthenticated, unauthorizedResponse } from '@/lib/apiAuth';

// PATCH /api/appointments/[id] — update appointment status (admin only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.json();
    const { status, newDate, newTime, newBarberId } = body;

    // Reschedule
    if (newDate && newTime) {
      const result = db.rescheduleAppointment(params.id, newDate, newTime, newBarberId);
      if (!result.success) {
        return NextResponse.json(
          { error: result.error || 'Грешка при пренасрочване.' },
          { status: 409 }
        );
      }
      return NextResponse.json(result.appointment);
    }

    // Status update
    if (status && (status === 'completed' || status === 'cancelled')) {
      const updated = db.updateAppointmentStatus(params.id, status);
      if (!updated) {
        return NextResponse.json(
          { error: 'Резервацията не е намерена.' },
          { status: 404 }
        );
      }
      return NextResponse.json(updated);
    }

    return NextResponse.json(
      { error: 'Невалидна заявка. Необходим е status или newDate/newTime.' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Невалидна заявка.' },
      { status: 400 }
    );
  }
}

// DELETE /api/appointments/[id] — delete appointment (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!isAuthenticated(request)) {
    return unauthorizedResponse();
  }

  const deleted = db.deleteAppointment(params.id);
  if (!deleted) {
    return NextResponse.json(
      { error: 'Резервацията не е намерена.' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
