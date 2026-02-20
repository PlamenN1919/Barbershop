import { Appointment, Barber, BookingFormData } from './types';
import { BARBERS as INITIAL_BARBERS } from './constants';

const STORAGE_KEY = 'barbershop_appointments';
const BARBERS_STORAGE_KEY = 'barbershop_barbers';

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    serviceId: 'haircut',
    barberId: 'barber-1',
    customerName: 'Николай Колев',
    customerPhone: '+359 88 123 4567',
    customerEmail: '',
    appointmentDate: '2026-02-09',
    appointmentTime: '10:00',
    status: 'upcoming',
    createdAt: '2026-02-07T10:00:00Z',
  },
  {
    id: '2',
    serviceId: 'combo',
    barberId: 'barber-2',
    customerName: 'Георги Маринов',
    customerPhone: '+359 89 987 6543',
    customerEmail: '',
    appointmentDate: '2026-02-09',
    appointmentTime: '11:00',
    status: 'upcoming',
    createdAt: '2026-02-07T11:00:00Z',
  },
  {
    id: '3',
    serviceId: 'beard-trim',
    barberId: 'barber-1',
    customerName: 'Иван Петров',
    customerPhone: '+359 87 555 1234',
    customerEmail: '',
    appointmentDate: '2026-02-10',
    appointmentTime: '14:30',
    status: 'upcoming',
    createdAt: '2026-02-07T09:00:00Z',
  },
  {
    id: '4',
    serviceId: 'razor-shave',
    barberId: 'barber-3',
    customerName: 'Димитър Стоянов',
    customerPhone: '+359 88 777 8899',
    customerEmail: '',
    appointmentDate: '2026-02-10',
    appointmentTime: '16:00',
    status: 'upcoming',
    createdAt: '2026-02-06T15:00:00Z',
  },
  {
    id: '5',
    serviceId: 'combo',
    barberId: 'barber-2',
    customerName: 'Стефан Тодоров',
    customerPhone: '+359 89 333 4455',
    customerEmail: '',
    appointmentDate: '2026-02-08',
    appointmentTime: '09:30',
    status: 'completed',
    createdAt: '2026-02-05T12:00:00Z',
  },
];

function ensureInitialized(): void {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
  }
}

/**
 * Зарежда всички резервации от localStorage.
 */
export function getAppointments(): Appointment[] {
  if (typeof window === 'undefined') return INITIAL_APPOINTMENTS;

  ensureInitialized();
  const stored = localStorage.getItem(STORAGE_KEY);

  try {
    const parsed = JSON.parse(stored || '[]') as Appointment[];
    return parsed;
  } catch {
    return INITIAL_APPOINTMENTS;
  }
}

/**
 * Записва масива с резервации в localStorage.
 */
export function saveAppointments(appointments: Appointment[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}

/**
 * Добавя нова резервация от booking формата.
 */
export function addAppointment(
  formData: BookingFormData,
  isFlagged?: boolean,
  flagReason?: string
): Appointment {
  const appointment: Appointment = {
    id: `apt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    serviceId: formData.serviceIds.join(','),
    barberId: formData.barberId,
    customerName: formData.customerName,
    customerPhone: formData.customerPhone,
    customerEmail: '',
    appointmentDate: formData.date,
    appointmentTime: formData.time,
    status: 'upcoming',
    createdAt: new Date().toISOString(),
    isFlagged: isFlagged || false,
    flagReason: flagReason || undefined,
  };

  const current = getAppointments();
  current.push(appointment);
  saveAppointments(current);

  // Диспачваме custom event за същия таб (storage event работи само между табове)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('appointments-updated'));
  }

  console.log('[Barbershop] Резервация добавена:', appointment);
  console.log('[Barbershop] Общо резервации:', current.length);

  return appointment;
}

/**
 * Проверява дали има конфликт (бръснарят вече има час в даден момент).
 * Връща конфликтната резервация или null.
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

/**
 * Обновява статус на резервация.
 */
export function updateAppointmentStatus(
  id: string,
  status: 'completed' | 'cancelled'
): void {
  const appointments = getAppointments();
  const updated = appointments.map((apt) =>
    apt.id === id ? { ...apt, status } : apt
  );
  saveAppointments(updated);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('appointments-updated'));
  }
}

/**
 * Изтрива резервация по ID.
 */
export function deleteAppointment(id: string): void {
  const appointments = getAppointments();
  const updated = appointments.filter((apt) => apt.id !== id);
  saveAppointments(updated);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('appointments-updated'));
  }
}

/**
 * Пренасрочва резервация — нова дата/час (и опционално друг бръснар).
 * Връща true при успех, false ако има конфликт.
 */
export function rescheduleAppointment(
  id: string,
  newDate: string,
  newTime: string,
  newBarberId?: string
): boolean {
  const appointments = getAppointments();
  const apt = appointments.find((a) => a.id === id);
  if (!apt) return false;

  const targetBarberId = newBarberId || apt.barberId;

  // Проверяваме за конфликт
  const conflict = checkConflict(targetBarberId, newDate, newTime, id);
  if (conflict) return false;

  const updated = appointments.map((a) =>
    a.id === id
      ? { ...a, appointmentDate: newDate, appointmentTime: newTime, barberId: targetBarberId }
      : a
  );
  saveAppointments(updated);

  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('appointments-updated'));
  }

  return true;
}

/**
 * Слуша за промени в резервациите (работи и в рамките на един таб, и между табове).
 * Връща функция за unsubscribe.
 */
export function onAppointmentsChange(callback: (appointments: Appointment[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  // Слушаме storage event (работи между различни табове)
  const handleStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) {
      callback(getAppointments());
    }
  };

  // Слушаме custom event (работи в рамките на същия таб)
  const handleCustom = () => {
    callback(getAppointments());
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener('appointments-updated', handleCustom);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('appointments-updated', handleCustom);
  };
}

// ============================================================
// Бръснари (Barbers) — CRUD с localStorage
// ============================================================

function ensureBarbersInitialized(): void {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(BARBERS_STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(BARBERS_STORAGE_KEY, JSON.stringify(INITIAL_BARBERS));
  }
}

/**
 * Зарежда всички бръснари от localStorage.
 */
export function getBarbers(): Barber[] {
  if (typeof window === 'undefined') return INITIAL_BARBERS;

  ensureBarbersInitialized();
  const stored = localStorage.getItem(BARBERS_STORAGE_KEY);

  try {
    return JSON.parse(stored || '[]') as Barber[];
  } catch {
    return INITIAL_BARBERS;
  }
}

/**
 * Записва масива с бръснари в localStorage.
 */
export function saveBarbers(barbers: Barber[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BARBERS_STORAGE_KEY, JSON.stringify(barbers));
  window.dispatchEvent(new CustomEvent('barbers-updated'));
}

/**
 * Добавя нов бръснар.
 */
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

/**
 * Премахва бръснар по ID.
 */
export function removeBarber(id: string): void {
  const current = getBarbers();
  const updated = current.filter((b) => b.id !== id);
  saveBarbers(updated);
}

/**
 * Слуша за промени в бръснарите.
 */
export function onBarbersChange(callback: (barbers: Barber[]) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const handleStorage = (e: StorageEvent) => {
    if (e.key === BARBERS_STORAGE_KEY) {
      callback(getBarbers());
    }
  };

  const handleCustom = () => {
    callback(getBarbers());
  };

  window.addEventListener('storage', handleStorage);
  window.addEventListener('barbers-updated', handleCustom);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('barbers-updated', handleCustom);
  };
}

/**
 * Презарежда бръснарите от началните данни (constants).
 * Полезно за ресет на данните.
 */
export function resetBarbers(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(BARBERS_STORAGE_KEY, JSON.stringify(INITIAL_BARBERS));
  window.dispatchEvent(new CustomEvent('barbers-updated'));
}
