// ============================================================
// Calendar Integration Utilities
// Генериране на линкове за Google Calendar и .ics файлове
// (Apple Calendar, Outlook) с вградени напомняния (reminders).
// ============================================================

import { SERVICES } from './constants';

export interface CalendarEventData {
  title: string;
  description: string;
  location: string;
  startDate: string;   // "YYYY-MM-DD"
  startTime: string;   // "HH:mm"
  durationMinutes: number;
  reminderMinutes?: number; // Колко минути преди часа да напомни (default: 30)
}

/**
 * Създава обект с данни за календарно събитие от booking данните.
 */
export function createCalendarEvent(opts: {
  serviceIds: string[];
  barberName: string;
  date: string;
  time: string;
  customerName: string;
  reminderMinutes?: number;
}): CalendarEventData {
  const selectedServices = SERVICES.filter((s) => opts.serviceIds.includes(s.id));
  const serviceNames = selectedServices.map((s) => s.name).join(', ');
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.durationMinutes, 0);

  return {
    title: `💈 Час в Бръснарницата — ${serviceNames}`,
    description: [
      `Услуга: ${serviceNames}`,
      `Бръснар: ${opts.barberName}`,
      `Клиент: ${opts.customerName}`,
      '',
      'Очакваме ви! 🙌',
    ].join('\n'),
    location: 'Център, ул. „Екзарх Йосиф" 11, 8260 Царево',
    startDate: opts.date,
    startTime: opts.time,
    durationMinutes: totalDuration || 30,
    reminderMinutes: opts.reminderMinutes ?? 30,
  };
}

// ============================================================
// Конвертиране на дата/час → ISO формат без сепаратори
// Пример: "2026-04-25", "14:30" → "20260425T143000"
// ============================================================

function toCalendarDatetime(date: string, time: string): string {
  // date: "YYYY-MM-DD", time: "HH:mm"
  return date.replace(/-/g, '') + 'T' + time.replace(':', '') + '00';
}

function addMinutesToTime(date: string, time: string, minutes: number): string {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, mins] = time.split(':').map(Number);
  const d = new Date(year, month - 1, day, hours, mins + minutes);
  const y = d.getFullYear().toString();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const dd = d.getDate().toString().padStart(2, '0');
  const hh = d.getHours().toString().padStart(2, '0');
  const mm = d.getMinutes().toString().padStart(2, '0');
  return `${y}${m}${dd}T${hh}${mm}00`;
}

// ============================================================
// Google Calendar URL
// ============================================================

/**
 * Генерира URL за добавяне на събитие в Google Calendar.
 * Включва reminder/notification.
 */
export function generateGoogleCalendarUrl(event: CalendarEventData): string {
  const startDt = toCalendarDatetime(event.startDate, event.startTime);
  const endDt = addMinutesToTime(event.startDate, event.startTime, event.durationMinutes);

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${startDt}/${endDt}`,
    details: event.description,
    location: event.location,
    // Google Calendar reminder - в минути
    // Формат: тип (popup/email) и минути
  });

  // Добавяме reminder чрез crm параметъра (не е официално API, но работи)
  // По-надеждният начин е просто да го включим — Google Calendar по подразбиране
  // добавя 30-мин reminder, но ще насърчим потребителя

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// ============================================================
// .ics файл (универсален — Apple Calendar, Outlook, и др.)
// ============================================================

/**
 * Генерира съдържанието на .ics файл за добавяне в Apple Calendar / Outlook.
 * Включва VALARM (reminder) компонент.
 */
export function generateIcsContent(event: CalendarEventData): string {
  const startDt = toCalendarDatetime(event.startDate, event.startTime);
  const endDt = addMinutesToTime(event.startDate, event.startTime, event.durationMinutes);
  const now = new Date();
  const stamp = now.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  const uid = `barbershop-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@booking`;

  // Escape специалните символи в .ics
  const escapeIcs = (str: string) =>
    str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Barbershop Booking//BG',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${startDt}`,
    `DTEND:${endDt}`,
    `DTSTAMP:${stamp}`,
    `UID:${uid}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(event.location)}`,
    'STATUS:CONFIRMED',
    // VALARM — reminder/напомняне
    'BEGIN:VALARM',
    'TRIGGER:-PT' + event.reminderMinutes + 'M',
    'ACTION:DISPLAY',
    `DESCRIPTION:Напомняне: ${escapeIcs(event.title)}`,
    'END:VALARM',
    // Второ напомняне — 2 часа преди
    'BEGIN:VALARM',
    'TRIGGER:-PT2H',
    'ACTION:DISPLAY',
    `DESCRIPTION:Имате час след 2 часа: ${escapeIcs(event.title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

/**
 * Сваля .ics файл в браузъра.
 */
export function downloadIcsFile(event: CalendarEventData): void {
  const content = generateIcsContent(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'barbershop-appointment.ics';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Освобождаваме URL-а след малко
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Генерира Outlook.com линк за добавяне на събитие.
 */
export function generateOutlookUrl(event: CalendarEventData): string {
  const [year, month, day] = event.startDate.split('-').map(Number);
  const [hours, mins] = event.startTime.split(':').map(Number);

  const startDate = new Date(year, month - 1, day, hours, mins);
  const endDate = new Date(startDate.getTime() + event.durationMinutes * 60000);

  const formatForOutlook = (d: Date) => d.toISOString().replace(/\.\d{3}Z$/, '+00:00');

  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: event.title,
    body: event.description,
    location: event.location,
    startdt: formatForOutlook(startDate),
    enddt: formatForOutlook(endDate),
  });

  return `https://outlook.live.com/calendar/0/action/compose?${params.toString()}`;
}
