/**
 * Server-side JSON file database.
 * Данните се съхраняват в `data/` директорията.
 * Всяка колекция е отделен JSON файл.
 */
import fs from 'fs';
import path from 'path';
import { Appointment, Barber, BlockedSlot } from './types';
import { SERVICES, BARBERS as INITIAL_BARBERS } from './constants';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// ============================================================
// Generic read/write helpers
// ============================================================

function readJSON<T>(filename: string, defaultValue: T): T {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    if (!fs.existsSync(filePath)) {
      writeJSON(filename, defaultValue);
      return defaultValue;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function writeJSON<T>(filename: string, data: T): void {
  ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
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

export function getBarbers(): Barber[] {
  return readJSON<Barber[]>('barbers.json', INITIAL_BARBERS);
}

export function getActiveBarbers(): Barber[] {
  return getBarbers().filter((b) => b.isActive);
}

export function getBarberById(id: string): Barber | undefined {
  return getBarbers().find((b) => b.id === id);
}

export function saveBarbers(barbers: Barber[]): void {
  writeJSON('barbers.json', barbers);
}

export function addBarber(data: Omit<Barber, 'id' | 'rating' | 'reviewCount'>): Barber {
  const barber: Barber = {
    ...data,
    id: `barber-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    rating: 5.0,
    reviewCount: 0,
  };
  const current = getBarbers();
  current.push(barber);
  saveBarbers(current);
  return barber;
}

export function removeBarber(id: string): boolean {
  const current = getBarbers();
  const updated = current.filter((b) => b.id !== id);
  if (updated.length === current.length) return false;
  saveBarbers(updated);
  return true;
}

export function resetBarbers(): void {
  saveBarbers(INITIAL_BARBERS);
}

// ============================================================
// Appointments
// ============================================================

export function getAppointments(): Appointment[] {
  return readJSON<Appointment[]>('appointments.json', []);
}

export function saveAppointments(appointments: Appointment[]): void {
  writeJSON('appointments.json', appointments);
}

export function getAppointmentById(id: string): Appointment | undefined {
  return getAppointments().find((a) => a.id === id);
}

export function addAppointment(appointment: Omit<Appointment, 'id' | 'createdAt'>): Appointment {
  const newApt: Appointment = {
    ...appointment,
    id: `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  const current = getAppointments();
  current.push(newApt);
  saveAppointments(current);
  return newApt;
}

export function updateAppointmentStatus(
  id: string,
  status: 'completed' | 'cancelled'
): Appointment | null {
  const appointments = getAppointments();
  const idx = appointments.findIndex((a) => a.id === id);
  if (idx === -1) return null;
  appointments[idx] = { ...appointments[idx], status };
  saveAppointments(appointments);
  return appointments[idx];
}

export function deleteAppointment(id: string): boolean {
  const appointments = getAppointments();
  const updated = appointments.filter((a) => a.id !== id);
  if (updated.length === appointments.length) return false;
  saveAppointments(updated);
  return true;
}

export function rescheduleAppointment(
  id: string,
  newDate: string,
  newTime: string,
  newBarberId?: string
): { success: boolean; appointment?: Appointment; error?: string } {
  const appointments = getAppointments();
  const apt = appointments.find((a) => a.id === id);
  if (!apt) return { success: false, error: 'Резервацията не е намерена' };

  const targetBarberId = newBarberId || apt.barberId;

  // Check for conflicts
  const conflict = appointments.find(
    (a) =>
      a.barberId === targetBarberId &&
      a.appointmentDate === newDate &&
      a.appointmentTime === newTime &&
      a.status === 'upcoming' &&
      a.id !== id
  );
  if (conflict) return { success: false, error: 'Има конфликт с друга резервация' };

  const updated = appointments.map((a) =>
    a.id === id
      ? { ...a, appointmentDate: newDate, appointmentTime: newTime, barberId: targetBarberId }
      : a
  );
  saveAppointments(updated);
  return { success: true, appointment: updated.find((a) => a.id === id) };
}

/**
 * Check if there's a conflict for a specific barber at a date/time.
 */
export function checkConflict(
  barberId: string,
  date: string,
  time: string,
  excludeId?: string
): Appointment | null {
  const appointments = getAppointments();
  return (
    appointments.find(
      (apt) =>
        apt.barberId === barberId &&
        apt.appointmentDate === date &&
        apt.appointmentTime === time &&
        apt.status === 'upcoming' &&
        apt.id !== excludeId
    ) || null
  );
}

// ============================================================
// Blocked Slots
// ============================================================

export function getBlockedSlots(): BlockedSlot[] {
  return readJSON<BlockedSlot[]>('blocked-slots.json', []);
}

export function saveBlockedSlots(slots: BlockedSlot[]): void {
  writeJSON('blocked-slots.json', slots);
}

export function getBlockedSlotsForBarber(barberId: string, date?: string): BlockedSlot[] {
  const slots = getBlockedSlots();
  return slots.filter((s) => {
    if (s.barberId !== barberId) return false;
    if (date && s.blockedDate !== date) return false;
    return true;
  });
}

export function addBlockedSlot(data: Omit<BlockedSlot, 'id'>): BlockedSlot {
  const slot: BlockedSlot = {
    ...data,
    id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
  };
  const current = getBlockedSlots();
  current.push(slot);
  saveBlockedSlots(current);
  return slot;
}

export function removeBlockedSlot(id: string): boolean {
  const current = getBlockedSlots();
  const updated = current.filter((s) => s.id !== id);
  if (updated.length === current.length) return false;
  saveBlockedSlots(updated);
  return true;
}

// ============================================================
// Available Time Slots (computed)
// ============================================================

import { WORKING_HOURS } from './constants';

export function getAvailableSlots(barberId: string, date: string): { time: string; available: boolean }[] {
  const { start, end, slotDuration } = WORKING_HOURS;
  const slots: { time: string; available: boolean }[] = [];

  // Get booked times for this barber on this date
  const appointments = getAppointments();
  const bookedTimes = appointments
    .filter(
      (a) =>
        a.barberId === barberId &&
        a.appointmentDate === date &&
        a.status === 'upcoming'
    )
    .map((a) => a.appointmentTime);

  // Get blocked ranges
  const blockedSlots = getBlockedSlotsForBarber(barberId, date);
  const blockedRanges = blockedSlots.map((s) => ({
    startTime: s.startTime,
    endTime: s.endTime,
  }));

  // Generate all time slots
  for (let hour = start; hour < end; hour++) {
    for (let min = 0; min < 60; min += slotDuration) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

      const isBooked = bookedTimes.includes(time);
      const isBlocked = blockedRanges.some((range) => {
        if (!range.startTime || !range.endTime) return true; // whole day blocked
        return time >= range.startTime && time < range.endTime;
      });

      slots.push({
        time,
        available: !isBooked && !isBlocked,
      });
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

function daysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.ceil(Math.abs(d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

function hoursDifference(date1: string, time1: string, date2: string, time2: string): number {
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

export function checkForDuplicateBooking(
  customerName: string,
  customerPhone: string,
  date: string,
  time: string
): DuplicateCheckResult {
  const result: DuplicateCheckResult = {
    isDuplicate: false,
    isSuspicious: false,
    existingBookings: [],
    warnings: [],
  };

  const allAppointments = getAppointments();
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
  const sameDayBooking = customerBookings.find((apt) => apt.appointmentDate === date);
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
    const hours = hoursDifference(apt.appointmentDate, apt.appointmentTime, date, time);
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

interface Session {
  token: string;
  createdAt: string;
  expiresAt: string;
}

function getSessions(): Session[] {
  return readJSON<Session[]>('sessions.json', []);
}

function saveSessions(sessions: Session[]): void {
  writeJSON('sessions.json', sessions);
}

export function createSession(): string {
  const crypto = require('crypto');
  const token = crypto.randomUUID();
  const now = new Date();
  const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

  const sessions = getSessions();
  // Clean expired sessions
  const valid = sessions.filter((s) => new Date(s.expiresAt) > now);
  valid.push({
    token,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
  });
  saveSessions(valid);
  return token;
}

export function validateSession(token: string): boolean {
  if (!token) return false;
  const sessions = getSessions();
  const session = sessions.find((s) => s.token === token);
  if (!session) return false;
  return new Date(session.expiresAt) > new Date();
}

export function deleteSession(token: string): void {
  const sessions = getSessions();
  saveSessions(sessions.filter((s) => s.token !== token));
}
