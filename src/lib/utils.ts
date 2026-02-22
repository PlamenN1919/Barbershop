// ============================================================
// Class name utility (for AnimatedGroup, TextEffect, etc.)
// ============================================================

export function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

import {
  format,
  addDays,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isBefore,
  startOfDay,
  addMonths,
  subMonths,
} from 'date-fns';
import { bg } from 'date-fns/locale';
import { TimeSlot } from './types';
import { WORKING_HOURS } from './constants';

/**
 * Generate time slots for a given date, excluding already booked ones.
 */
export function generateTimeSlots(
  bookedTimes: string[],
  blockedRanges: { startTime: string | null; endTime: string | null }[] = []
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const { start, end, slotDuration } = WORKING_HOURS;

  for (let hour = start; hour < end; hour++) {
    for (let min = 0; min < 60; min += slotDuration) {
      const time = `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;

      const isBooked = bookedTimes.includes(time);
      const isBlocked = blockedRanges.some((range) => {
        if (!range.startTime || !range.endTime) return true;
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

/**
 * Get the next N available dates.
 */
export function getAvailableDates(daysAhead: number): string[] {
  const dates: string[] = [];
  const current = new Date();

  for (let i = 0; i < daysAhead; i++) {
    const date = addDays(current, i);
    dates.push(format(date, 'yyyy-MM-dd'));
  }

  return dates;
}

/**
 * Format time in 24h format (e.g. "09:00" → "9:00 ч.").
 */
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':').map(Number);
  return `${hours}:${minutes.toString().padStart(2, '0')} ч.`;
}

/**
 * Format a date string for short display (e.g. "2024-03-15" → "пет, 15 мар").
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return format(date, 'EEE, d MMM', { locale: bg });
}

/**
 * Format date for full display (e.g. "петък, 15 март 2024 г.").
 */
export function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  return format(date, "EEEE, d MMMM yyyy 'г.'", { locale: bg });
}

/**
 * Check if a date string is today.
 */
export function isToday(dateStr: string): boolean {
  return dateStr === format(new Date(), 'yyyy-MM-dd');
}

/**
 * Get a random number of "remaining slots" for urgency display.
 */
export function getRemainingSlots(): number {
  return Math.floor(Math.random() * 4) + 2;
}

// ============================================================
// Calendar helpers
// ============================================================

export interface CalendarDay {
  date: Date;
  dateStr: string;    // "yyyy-MM-dd"
  isCurrentMonth: boolean;
  isToday: boolean;
  isPast: boolean;
  isAvailable: boolean; // within DAYS_AHEAD, not past
}

/**
 * Bulgarian short day names starting from Monday.
 */
export const BG_DAY_NAMES = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Нд'];

/**
 * Format month name in Bulgarian (e.g. "Февруари 2026").
 */
export function formatMonthYear(date: Date): string {
  return format(date, 'LLLL yyyy', { locale: bg });
}

/**
 * Generate calendar grid for a given month.
 * Returns 6 weeks × 7 days = 42 CalendarDay objects.
 */
export function getCalendarDays(monthDate: Date, availableDatesSet: Set<string>): CalendarDay[] {
  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  // Week starts on Monday (weekStartsOn: 1)
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const today = startOfDay(new Date());

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return days.map((date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isPast = isBefore(date, today);

    return {
      date,
      dateStr,
      isCurrentMonth: isSameMonth(date, monthDate),
      isToday: isSameDay(date, today),
      isPast,
      isAvailable: availableDatesSet.has(dateStr),
    };
  });
}

export { addMonths, subMonths };

// ============================================================
// Image helpers
// ============================================================

/**
 * Конвертира File обект до base64 data URL, като resize-ва до maxSize.
 * Връща Promise<string> с data URL.
 */
export function fileToBase64(file: File, maxSize = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let w = img.width;
        let h = img.height;

        // Запазваме aspect ratio, скалираме до maxSize
        if (w > h) {
          if (w > maxSize) { h = Math.round((h * maxSize) / w); w = maxSize; }
        } else {
          if (h > maxSize) { w = Math.round((w * maxSize) / h); h = maxSize; }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas not supported')); return; }
        ctx.drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => reject(new Error('Invalid image'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('File read error'));
    reader.readAsDataURL(file);
  });
}

/**
 * Проверява дали URL е валиден за показване (data URL или HTTP URL).
 */
export function isValidPhotoUrl(url: string): boolean {
  if (!url) return false;
  return url.startsWith('data:image/') || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('/');
}
