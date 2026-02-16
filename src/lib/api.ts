/**
 * Client-side API wrapper за всички backend заявки.
 * Замества директните localStorage операции с реални HTTP заявки.
 */
import { Appointment, Barber, BlockedSlot, BookingFormData, Service, AnalyticsData, DateRangePeriod } from './types';

const BASE_URL = '/api';

// ============================================================
// Helper
// ============================================================

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new APIError(data.error || 'Нещо се обърка.', response.status, data);
  }

  return data as T;
}

export class APIError extends Error {
  status: number;
  data: Record<string, unknown>;

  constructor(message: string, status: number, data: Record<string, unknown> = {}) {
    super(message);
    this.name = 'APIError';
    this.status = status;
    this.data = data;
  }
}

// ============================================================
// Auth
// ============================================================

export async function apiLogin(email: string, password: string): Promise<void> {
  await fetchJSON(`${BASE_URL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function apiLogout(): Promise<void> {
  await fetchJSON(`${BASE_URL}/auth/logout`, {
    method: 'POST',
  });
}

export async function apiVerifyAuth(): Promise<boolean> {
  try {
    const data = await fetchJSON<{ authenticated: boolean }>(`${BASE_URL}/auth/verify`);
    return data.authenticated;
  } catch {
    return false;
  }
}

// ============================================================
// Services
// ============================================================

export async function apiGetServices(): Promise<Service[]> {
  return fetchJSON<Service[]>(`${BASE_URL}/services`);
}

// ============================================================
// Barbers
// ============================================================

export async function apiGetBarbers(): Promise<Barber[]> {
  return fetchJSON<Barber[]>(`${BASE_URL}/barbers`);
}

export async function apiAddBarber(
  data: Omit<Barber, 'id' | 'rating' | 'reviewCount'>
): Promise<Barber> {
  return fetchJSON<Barber>(`${BASE_URL}/barbers`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiRemoveBarber(id: string): Promise<void> {
  await fetchJSON(`${BASE_URL}/barbers/${id}`, {
    method: 'DELETE',
  });
}

export async function apiResetBarbers(): Promise<Barber[]> {
  const data = await fetchJSON<{ barbers: Barber[] }>(`${BASE_URL}/barbers/reset`, {
    method: 'POST',
  });
  return data.barbers;
}

// ============================================================
// Appointments
// ============================================================

export async function apiGetAppointments(): Promise<Appointment[]> {
  return fetchJSON<Appointment[]>(`${BASE_URL}/appointments`);
}

export interface CreateAppointmentResult {
  appointment: Appointment;
  warnings: string[];
  isDuplicate: boolean;
  isSuspicious: boolean;
}

export async function apiCreateAppointment(
  formData: BookingFormData
): Promise<CreateAppointmentResult> {
  return fetchJSON<CreateAppointmentResult>(`${BASE_URL}/appointments`, {
    method: 'POST',
    body: JSON.stringify({
      serviceId: formData.serviceId,
      barberId: formData.barberId,
      date: formData.date,
      time: formData.time,
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
    }),
  });
}

export async function apiUpdateAppointmentStatus(
  id: string,
  status: 'completed' | 'cancelled'
): Promise<Appointment> {
  return fetchJSON<Appointment>(`${BASE_URL}/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function apiRescheduleAppointment(
  id: string,
  newDate: string,
  newTime: string,
  newBarberId?: string
): Promise<Appointment> {
  return fetchJSON<Appointment>(`${BASE_URL}/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ newDate, newTime, newBarberId }),
  });
}

export async function apiDeleteAppointment(id: string): Promise<void> {
  await fetchJSON(`${BASE_URL}/appointments/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================
// Time Slots
// ============================================================

export interface TimeSlotResponse {
  time: string;
  available: boolean;
}

export async function apiGetAvailableSlots(
  barberId: string,
  date: string
): Promise<TimeSlotResponse[]> {
  return fetchJSON<TimeSlotResponse[]>(
    `${BASE_URL}/slots?barberId=${encodeURIComponent(barberId)}&date=${encodeURIComponent(date)}`
  );
}

// ============================================================
// Blocked Slots
// ============================================================

export async function apiGetBlockedSlots(barberId?: string, date?: string): Promise<BlockedSlot[]> {
  let url = `${BASE_URL}/blocked-slots`;
  const params = new URLSearchParams();
  if (barberId) params.append('barberId', barberId);
  if (date) params.append('date', date);
  if (params.toString()) url += `?${params.toString()}`;

  return fetchJSON<BlockedSlot[]>(url);
}

export async function apiAddBlockedSlot(
  data: Omit<BlockedSlot, 'id'>
): Promise<BlockedSlot> {
  return fetchJSON<BlockedSlot>(`${BASE_URL}/blocked-slots`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function apiRemoveBlockedSlot(id: string): Promise<void> {
  await fetchJSON(`${BASE_URL}/blocked-slots/${id}`, {
    method: 'DELETE',
  });
}

// ============================================================
// Analytics
// ============================================================

export interface AnalyticsResponse {
  data: AnalyticsData;
  period: DateRangePeriod;
}

export async function apiGetAnalytics(
  range: 'today' | 'week' | 'month' | 'year' = 'month'
): Promise<AnalyticsResponse> {
  return fetchJSON<AnalyticsResponse>(`${BASE_URL}/analytics?range=${range}`);
}

// ============================================================
// Seed / Test Data
// ============================================================

export async function apiSeedTestData(): Promise<{ count: number }> {
  return fetchJSON<{ count: number }>(`${BASE_URL}/seed`, {
    method: 'POST',
  });
}
