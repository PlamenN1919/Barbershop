/**
 * Server-side Supabase database.
 * All data is stored in Supabase PostgreSQL.
 */
import { supabase } from './supabase';
import { Appointment, Barber, BlockedSlot } from './types';
import { SERVICES, BARBERS as INITIAL_BARBERS, WORKING_HOURS } from './constants';

// ============================================================
// Mappers: DB row (snake_case) → App type (camelCase)
// ============================================================

function mapBarber(row: Record<string, unknown>): Barber {
  return {
    id: row.id as string,
    name: row.name as string,
    photoUrl: (row.photo_url as string) ?? '',
    specialty: (row.specialty as string) ?? '',
    isActive: (row.is_active as boolean) ?? true,
    rating: parseFloat(String(row.rating)) || 5.0,
    reviewCount: (row.review_count as number) ?? 0,
  };
}

function mapAppointment(row: Record<string, unknown>): Appointment {
  return {
    id: row.id as string,
    serviceId: row.service_id as string,
    barberId: row.barber_id as string,
    customerName: row.customer_name as string,
    customerPhone: row.customer_phone as string,
    customerEmail: (row.customer_email as string) ?? '',
    appointmentDate: row.appointment_date as string,
    appointmentTime: row.appointment_time as string,
    status: row.status as 'upcoming' | 'completed' | 'cancelled',
    createdAt: row.created_at as string,
    isFlagged: (row.is_flagged as boolean) ?? false,
    flagReason: (row.flag_reason as string) ?? undefined,
  };
}

function mapBlockedSlot(row: Record<string, unknown>): BlockedSlot {
  return {
    id: row.id as string,
    barberId: row.barber_id as string,
    blockedDate: row.blocked_date as string,
    startTime: (row.start_time as string) ?? null,
    endTime: (row.end_time as string) ?? null,
    reason: (row.reason as string) ?? '',
  };
}

// ============================================================
// Services (readonly from constants)
// ============================================================

export function getServices() {
  return SERVICES;
}

// ============================================================
// Barbers
// ============================================================

export async function getBarbers(): Promise<Barber[]> {
  const { data, error } = await supabase.from('barbers').select('*');
  if (error || !data || data.length === 0) return INITIAL_BARBERS;
  return data.map(mapBarber);
}

export async function getActiveBarbers(): Promise<Barber[]> {
  const { data, error } = await supabase
    .from('barbers')
    .select('*')
    .eq('is_active', true);
  if (error || !data || data.length === 0) return INITIAL_BARBERS.filter((b) => b.isActive);
  return data.map(mapBarber);
}

export async function getBarberById(id: string): Promise<Barber | undefined> {
  const { data, error } = await supabase
    .from('barbers')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return undefined;
  return mapBarber(data);
}

export async function saveBarbers(barbers: Barber[]): Promise<void> {
  await supabase.from('barbers').delete().neq('id', '');
  const rows = barbers.map((b) => ({
    id: b.id,
    name: b.name,
    photo_url: b.photoUrl,
    specialty: b.specialty,
    is_active: b.isActive,
    rating: b.rating,
    review_count: b.reviewCount,
  }));
  await supabase.from('barbers').insert(rows);
}

export async function addBarber(
  data: Omit<Barber, 'id' | 'rating' | 'reviewCount'>
): Promise<Barber> {
  const barber: Barber = {
    ...data,
    id: `barber-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    rating: 5.0,
    reviewCount: 0,
  };
  await supabase.from('barbers').insert({
    id: barber.id,
    name: barber.name,
    photo_url: barber.photoUrl,
    specialty: barber.specialty,
    is_active: barber.isActive,
    rating: barber.rating,
    review_count: barber.reviewCount,
  });
  return barber;
}

export async function removeBarber(id: string): Promise<boolean> {
  const { error } = await supabase.from('barbers').delete().eq('id', id);
  return !error;
}

export async function resetBarbers(): Promise<void> {
  await saveBarbers(INITIAL_BARBERS);
}

// ============================================================
// Appointments
// ============================================================

export async function getAppointments(): Promise<Appointment[]> {
  const { data, error } = await supabase.from('appointments').select('*');
  if (error || !data) return [];
  return data.map(mapAppointment);
}

export async function saveAppointments(appointments: Appointment[]): Promise<void> {
  await supabase.from('appointments').delete().neq('id', '');
  if (appointments.length === 0) return;
  const rows = appointments.map((a) => ({
    id: a.id,
    service_id: a.serviceId,
    barber_id: a.barberId,
    customer_name: a.customerName,
    customer_phone: a.customerPhone,
    customer_email: a.customerEmail,
    appointment_date: a.appointmentDate,
    appointment_time: a.appointmentTime,
    status: a.status,
    created_at: a.createdAt,
    is_flagged: a.isFlagged || false,
    flag_reason: a.flagReason || null,
  }));
  await supabase.from('appointments').insert(rows);
}

export async function getAppointmentById(id: string): Promise<Appointment | undefined> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return undefined;
  return mapAppointment(data);
}

export async function addAppointment(
  appointment: Omit<Appointment, 'id' | 'createdAt'>
): Promise<Appointment> {
  const newApt: Appointment = {
    ...appointment,
    id: `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  await supabase.from('appointments').insert({
    id: newApt.id,
    service_id: newApt.serviceId,
    barber_id: newApt.barberId,
    customer_name: newApt.customerName,
    customer_phone: newApt.customerPhone,
    customer_email: newApt.customerEmail,
    appointment_date: newApt.appointmentDate,
    appointment_time: newApt.appointmentTime,
    status: newApt.status,
    created_at: newApt.createdAt,
    is_flagged: newApt.isFlagged || false,
    flag_reason: newApt.flagReason || null,
  });
  return newApt;
}

export async function updateAppointmentStatus(
  id: string,
  status: 'completed' | 'cancelled'
): Promise<Appointment | null> {
  const { data, error } = await supabase
    .from('appointments')
    .update({ status })
    .eq('id', id)
    .select('*')
    .single();
  if (error || !data) return null;
  return mapAppointment(data);
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const { error } = await supabase.from('appointments').delete().eq('id', id);
  return !error;
}

export async function rescheduleAppointment(
  id: string,
  newDate: string,
  newTime: string,
  newBarberId?: string
): Promise<{ success: boolean; appointment?: Appointment; error?: string }> {
  const apt = await getAppointmentById(id);
  if (!apt) return { success: false, error: 'Резервацията не е намерена' };

  const targetBarberId = newBarberId || apt.barberId;

  const conflict = await checkConflict(targetBarberId, newDate, newTime, id);
  if (conflict) return { success: false, error: 'Има конфликт с друга резервация' };

  const { data, error } = await supabase
    .from('appointments')
    .update({
      appointment_date: newDate,
      appointment_time: newTime,
      barber_id: targetBarberId,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) return { success: false, error: 'Грешка при обновяване' };
  return { success: true, appointment: mapAppointment(data) };
}

export async function checkConflict(
  barberId: string,
  date: string,
  time: string,
  excludeId?: string
): Promise<Appointment | null> {
  let query = supabase
    .from('appointments')
    .select('*')
    .eq('barber_id', barberId)
    .eq('appointment_date', date)
    .eq('appointment_time', time)
    .eq('status', 'upcoming');

  if (excludeId) {
    query = query.neq('id', excludeId);
  }

  const { data, error } = await query.limit(1);
  if (error || !data || data.length === 0) return null;
  return mapAppointment(data[0]);
}

// ============================================================
// Blocked Slots
// ============================================================

export async function getBlockedSlots(): Promise<BlockedSlot[]> {
  const { data, error } = await supabase.from('blocked_slots').select('*');
  if (error || !data) return [];
  return data.map(mapBlockedSlot);
}

export async function saveBlockedSlots(slots: BlockedSlot[]): Promise<void> {
  await supabase.from('blocked_slots').delete().neq('id', '');
  if (slots.length === 0) return;
  const rows = slots.map((s) => ({
    id: s.id,
    barber_id: s.barberId,
    blocked_date: s.blockedDate,
    start_time: s.startTime,
    end_time: s.endTime,
    reason: s.reason,
  }));
  await supabase.from('blocked_slots').insert(rows);
}

export async function getBlockedSlotsForBarber(
  barberId: string,
  date?: string
): Promise<BlockedSlot[]> {
  let query = supabase
    .from('blocked_slots')
    .select('*')
    .eq('barber_id', barberId);
  if (date) {
    query = query.eq('blocked_date', date);
  }
  const { data, error } = await query;
  if (error || !data) return [];
  return data.map(mapBlockedSlot);
}

export async function addBlockedSlot(
  data: Omit<BlockedSlot, 'id'>
): Promise<BlockedSlot> {
  const slot: BlockedSlot = {
    ...data,
    id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
  };
  await supabase.from('blocked_slots').insert({
    id: slot.id,
    barber_id: slot.barberId,
    blocked_date: slot.blockedDate,
    start_time: slot.startTime,
    end_time: slot.endTime,
    reason: slot.reason,
  });
  return slot;
}

export async function removeBlockedSlot(id: string): Promise<boolean> {
  const { error } = await supabase.from('blocked_slots').delete().eq('id', id);
  return !error;
}

// ============================================================
// Available Time Slots (computed)
// ============================================================

export async function getAvailableSlots(
  barberId: string,
  date: string
): Promise<{ time: string; available: boolean }[]> {
  const { start, end, slotDuration } = WORKING_HOURS;
  const slots: { time: string; available: boolean }[] = [];

  // Get booked times
  const { data: aptData } = await supabase
    .from('appointments')
    .select('appointment_time')
    .eq('barber_id', barberId)
    .eq('appointment_date', date)
    .eq('status', 'upcoming');
  const bookedTimes = (aptData || []).map(
    (a: Record<string, unknown>) => a.appointment_time as string
  );

  // Get blocked ranges
  const blockedSlots = await getBlockedSlotsForBarber(barberId, date);
  const blockedRanges = blockedSlots.map((s) => ({
    startTime: s.startTime,
    endTime: s.endTime,
  }));

  for (let hour = start; hour < end; hour++) {
    for (let min = 0; min < 60; min += slotDuration) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

      const isBooked = bookedTimes.includes(time);
      const isBlocked = blockedRanges.some((range) => {
        if (!range.startTime || !range.endTime) return true;
        return time >= range.startTime && time < range.endTime;
      });

      slots.push({ time, available: !isBooked && !isBlocked });
    }
  }

  return slots;
}

// ============================================================
// Anti-Spam (server-side)
// ============================================================

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  isSuspicious: boolean;
  existingBookings: Appointment[];
  warnings: string[];
  reason?: string;
}

function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, '').toLowerCase();
}

function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

function phonesMatch(phone1: string, phone2: string): boolean {
  const norm1 = normalizePhone(phone1);
  const norm2 = normalizePhone(phone2);
  return norm1 === norm2 || norm1.includes(norm2) || norm2.includes(norm1);
}

function namesMatch(name1: string, name2: string): boolean {
  return normalizeName(name1) === normalizeName(name2);
}

function hoursDifference(
  date1: string,
  time1: string,
  date2: string,
  time2: string
): number {
  const dt1 = new Date(`${date1}T${time1}`);
  const dt2 = new Date(`${date2}T${time2}`);
  return Math.abs(dt2.getTime() - dt1.getTime()) / (1000 * 60 * 60);
}

const ANTI_SPAM_CONFIG = {
  maxBookingsPerPeriod: 3,
  periodHours: 24,
  minDaysBetweenBookings: 7,
  flagIfMoreThan: 2,
  flagPeriodHours: 2,
};

export async function checkForDuplicateBooking(
  customerName: string,
  customerPhone: string,
  date: string,
  time: string
): Promise<DuplicateCheckResult> {
  const result: DuplicateCheckResult = {
    isDuplicate: false,
    isSuspicious: false,
    existingBookings: [],
    warnings: [],
  };

  const allAppointments = await getAppointments();
  const customerBookings = allAppointments.filter(
    (apt) =>
      apt.status === 'upcoming' &&
      (phonesMatch(apt.customerPhone, customerPhone) ||
        namesMatch(apt.customerName, customerName))
  );

  result.existingBookings = customerBookings;

  if (customerBookings.length === 0) return result;

  // Check for exact duplicate
  const exactDuplicate = customerBookings.find(
    (apt) => apt.appointmentDate === date && apt.appointmentTime === time
  );
  if (exactDuplicate) {
    result.isDuplicate = true;
    result.reason = 'Вече имате резервация за тази дата и час.';
    result.warnings.push('Вече имате резервация за тази дата и час.');
    return result;
  }

  // Check for same-day booking
  const sameDayBooking = customerBookings.find(
    (apt) => apt.appointmentDate === date
  );
  if (sameDayBooking) {
    result.isDuplicate = true;
    result.reason = 'Вече имате резервация за този ден.';
    result.warnings.push('Вече имате резервация за този ден.');
    return result;
  }

  // Check too many bookings
  if (customerBookings.length >= ANTI_SPAM_CONFIG.maxBookingsPerPeriod) {
    result.isSuspicious = true;
    result.reason = `Имате ${customerBookings.length} предстоящи резервации.`;
    result.warnings.push(
      `Имате ${customerBookings.length} предстоящи резервации. Максималният брой е ${ANTI_SPAM_CONFIG.maxBookingsPerPeriod}.`
    );
  }

  // Check rapid booking
  const recentBookings = customerBookings.filter((apt) => {
    const hours = hoursDifference(
      apt.appointmentDate,
      apt.appointmentTime,
      date,
      time
    );
    return hours < ANTI_SPAM_CONFIG.flagPeriodHours;
  });
  if (recentBookings.length >= ANTI_SPAM_CONFIG.flagIfMoreThan) {
    result.isSuspicious = true;
    result.warnings.push('Множество резервации в кратък период от време.');
  }

  return result;
}

// ============================================================
// Sessions
// ============================================================

export async function createSession(): Promise<string> {
  const crypto = require('crypto');
  const token = crypto.randomUUID();
  const now = new Date();
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  // Clean expired sessions
  await supabase
    .from('sessions')
    .delete()
    .lt('expires_at', now.toISOString());

  await supabase.from('sessions').insert({
    token,
    created_at: now.toISOString(),
    expires_at: expires.toISOString(),
  });

  return token;
}

export async function validateSession(token: string): Promise<boolean> {
  if (!token) return false;
  const { data, error } = await supabase
    .from('sessions')
    .select('expires_at')
    .eq('token', token)
    .single();
  if (error || !data) return false;
  return new Date(data.expires_at as string) > new Date();
}

export async function deleteSession(token: string): Promise<void> {
  await supabase.from('sessions').delete().eq('token', token);
}
