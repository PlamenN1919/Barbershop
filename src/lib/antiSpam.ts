import { Appointment, BookingFormData } from './types';
import { getAppointments } from './store';

/**
 * Конфигурация за анти-спам защита
 */
export const ANTI_SPAM_CONFIG = {
  // Максимум резервации за определен период
  maxBookingsPerPeriod: 3,
  periodHours: 24,
  
  // Минимално време между резервации от същия клиент
  minDaysBetweenBookings: 7,
  
  // Флагове за съмнително поведение
  flagIfMoreThan: 2, // Резервации в период
  flagPeriodHours: 2, // За колко време
};

export interface DuplicateCheckResult {
  isDuplicate: boolean;
  isSuspicious: boolean;
  existingBookings: Appointment[];
  warnings: string[];
  reason?: string;
}

/**
 * Нормализира телефонен номер за сравнение (премахва интервали, тирета, скоби)
 */
function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-()]/g, '').toLowerCase();
}

/**
 * Нормализира име за сравнение (премахва интервали, прави lowercase)
 */
function normalizeName(name: string): string {
  return name.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * Проверява дали два телефонни номера са еднакви
 */
function phonesMatch(phone1: string, phone2: string): boolean {
  const norm1 = normalizePhone(phone1);
  const norm2 = normalizePhone(phone2);
  return norm1 === norm2 || norm1.includes(norm2) || norm2.includes(norm1);
}

/**
 * Проверява дали две имена са еднакви
 */
function namesMatch(name1: string, name2: string): boolean {
  const norm1 = normalizeName(name1);
  const norm2 = normalizeName(name2);
  return norm1 === norm2;
}

/**
 * Проверява дали клиентът съществува (по име + телефон)
 */
function isMatchingCustomer(apt: Appointment, name: string, phone: string): boolean {
  return namesMatch(apt.customerName, name) && phonesMatch(apt.customerPhone, phone);
}

/**
 * Изчислява разликата в дни между две дати
 */
function daysDifference(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Изчислява разликата в часове между две дати/времена
 */
function hoursDifference(date1: string, time1: string, date2: string, time2: string): number {
  const dt1 = new Date(`${date1}T${time1}`);
  const dt2 = new Date(`${date2}T${time2}`);
  const diffTime = Math.abs(dt2.getTime() - dt1.getTime());
  return diffTime / (1000 * 60 * 60);
}

/**
 * Главна функция за проверка на дублирани/спам резервации
 */
export function checkForDuplicateBooking(
  formData: BookingFormData,
  excludeId?: string
): DuplicateCheckResult {
  const result: DuplicateCheckResult = {
    isDuplicate: false,
    isSuspicious: false,
    existingBookings: [],
    warnings: [],
  };

  const allAppointments = getAppointments();
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  // Филтрираме само upcoming резервации от същия клиент
  const customerBookings = allAppointments.filter(
    (apt) =>
      apt.status === 'upcoming' &&
      apt.id !== excludeId &&
      isMatchingCustomer(apt, formData.customerName, formData.customerPhone)
  );

  result.existingBookings = customerBookings;

  // 1. Проверка за точен дубликат (същата дата и час)
  const exactDuplicate = customerBookings.find(
    (apt) =>
      apt.appointmentDate === formData.date &&
      apt.appointmentTime === formData.time
  );

  if (exactDuplicate) {
    result.isDuplicate = true;
    result.reason = 'exact_duplicate';
    result.warnings.push(
      `Вече имате резервация за ${formData.date} в ${formData.time}ч.`
    );
    return result;
  }

  // 2. Проверка за резервация в близък период (X дни)
  const recentBookings = customerBookings.filter((apt) => {
    const daysDiff = daysDifference(apt.appointmentDate, formData.date);
    return daysDiff <= ANTI_SPAM_CONFIG.minDaysBetweenBookings;
  });

  if (recentBookings.length > 0) {
    result.isDuplicate = true;
    result.reason = 'recent_booking_exists';
    result.warnings.push(
      `Вече имате ${recentBookings.length} активна резервация в рамките на ${ANTI_SPAM_CONFIG.minDaysBetweenBookings} дни.`
    );
  }

  // 3. Rate limiting - проверка за много резервации за кратко време
  const recentCreated = allAppointments.filter((apt) => {
    if (!apt.createdAt || apt.id === excludeId) return false;
    if (!isMatchingCustomer(apt, formData.customerName, formData.customerPhone)) return false;

    const createdDate = new Date(apt.createdAt);
    const hoursAgo = (now.getTime() - createdDate.getTime()) / (1000 * 60 * 60);
    return hoursAgo <= ANTI_SPAM_CONFIG.periodHours && apt.status === 'upcoming';
  });

  if (recentCreated.length >= ANTI_SPAM_CONFIG.maxBookingsPerPeriod) {
    result.isDuplicate = true;
    result.isSuspicious = true;
    result.reason = 'rate_limit_exceeded';
    result.warnings.push(
      `Достигнахте лимита от ${ANTI_SPAM_CONFIG.maxBookingsPerPeriod} резервации за ${ANTI_SPAM_CONFIG.periodHours}ч. Моля, свържете се с нас директно.`
    );
    return result;
  }

  // 4. Флагване на съмнително поведение (за admin известия)
  if (recentCreated.length >= ANTI_SPAM_CONFIG.flagIfMoreThan) {
    result.isSuspicious = true;
  }

  // 5. Много резервации за различни дати (възможен спамър)
  if (customerBookings.length >= 5) {
    result.isSuspicious = true;
    result.warnings.push(
      `Имате ${customerBookings.length} активни резервации. Ако това е грешка, моля свържете се с нас.`
    );
  }

  return result;
}

/**
 * Форматира предупреждения за показване на потребителя
 */
export function formatWarnings(result: DuplicateCheckResult): string {
  if (result.warnings.length === 0) return '';
  return result.warnings.join('\n\n');
}

/**
 * Проверява дали резервацията трябва да бъде блокирана напълно
 */
export function shouldBlockBooking(result: DuplicateCheckResult): boolean {
  // Блокираме само при rate limit или много съмнително поведение
  return result.reason === 'rate_limit_exceeded';
}

/**
 * Проверява дали резервацията трябва да изисква потвърждение
 */
export function shouldRequireConfirmation(result: DuplicateCheckResult): boolean {
  return result.isDuplicate && result.reason !== 'rate_limit_exceeded';
}

/**
 * Генерира текст за admin известие
 */
export function generateAdminNotification(
  formData: BookingFormData,
  result: DuplicateCheckResult
): string | null {
  if (!result.isSuspicious && !result.isDuplicate) return null;

  const parts: string[] = [];

  if (result.reason === 'rate_limit_exceeded') {
    parts.push('🚨 СПАМ СИГНАЛ');
  } else if (result.isSuspicious) {
    parts.push('⚠️ СЪМНИТЕЛНА РЕЗЕРВАЦИЯ');
  } else if (result.isDuplicate) {
    parts.push('ℹ️ ДУБЛИРАНА РЕЗЕРВАЦИЯ');
  }

  parts.push(`Клиент: ${formData.customerName}`);
  parts.push(`Телефон: ${formData.customerPhone}`);
  parts.push(`Активни резервации: ${result.existingBookings.length}`);

  if (result.warnings.length > 0) {
    parts.push(`Причина: ${result.warnings[0]}`);
  }

  return parts.join('\n');
}
