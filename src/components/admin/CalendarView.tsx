'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock, Scissors, User, Phone, Check, X, Plus, ChevronDown, CalendarClock, Trash2, AlertTriangle } from 'lucide-react';
import { Appointment, Barber, BookingFormData } from '@/lib/types';
import {
  getCalendarDays,
  formatMonthYear,
  BG_DAY_NAMES,
  addMonths,
  subMonths,
  formatTime,
  getAvailableDates,
} from '@/lib/utils';
import { checkConflict } from '@/lib/store';
import { checkForDuplicateBooking, shouldBlockBooking } from '@/lib/antiSpam';
import { WORKING_HOURS, DAYS_AHEAD, SERVICES, toLeva, getServiceIdsFromAppointment } from '@/lib/constants';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface CalendarViewProps {
  appointments: Appointment[];
  barbers: Barber[];
  onUpdateStatus: (id: string, status: 'completed' | 'cancelled') => void;
  onAddAppointment: (data: BookingFormData) => void;
  onReschedule: (id: string, newDate: string, newTime: string, newBarberId?: string) => boolean | Promise<boolean>;
  onDelete?: (id: string) => void;
}

// Начално състояние на формата
const EMPTY_FORM = {
  customerName: '',
  customerPhone: '',
  serviceId: '',
  barberId: '',
};

export default function CalendarView({ appointments, barbers, onUpdateStatus, onAddAppointment, onReschedule, onDelete }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(
    new Date().toISOString().split('T')[0]
  );

  // Форма за нова резервация
  const [bookingSlot, setBookingSlot] = useState<string | null>(null); // кой час е избран за booking
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  // Пренасрочване
  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [rescheduleBarberId, setRescheduleBarberId] = useState('');
  const [rescheduleError, setRescheduleError] = useState('');
  const rescheduleRef = useRef<HTMLDivElement>(null);

  // Множество от налични дати (за маркиране в календара)
  const availableDatesSet = useMemo(() => {
    return new Set(getAvailableDates(DAYS_AHEAD));
  }, []);

  // Дните от календарната решетка
  const calendarDays = useMemo(() => {
    return getCalendarDays(currentMonth, availableDatesSet);
  }, [currentMonth, availableDatesSet]);

  // Бройка резервации по дата
  const appointmentsByDate = useMemo(() => {
    const map: Record<string, Appointment[]> = {};
    appointments.forEach((apt) => {
      if (!map[apt.appointmentDate]) map[apt.appointmentDate] = [];
      map[apt.appointmentDate].push(apt);
    });
    // Сортираме по час
    Object.values(map).forEach((arr) =>
      arr.sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime))
    );
    return map;
  }, [appointments]);

  // Всички работни часове (9:00 - 19:30 на всеки 30 мин)
  const allTimeSlots = useMemo(() => {
    const slots: string[] = [];
    const { start, end, slotDuration } = WORKING_HOURS;
    for (let hour = start; hour < end; hour++) {
      for (let min = 0; min < 60; min += slotDuration) {
        slots.push(
          `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`
        );
      }
    }
    return slots;
  }, []);

  // Мап: час → резервация за избрания ден
  const appointmentsByTime = useMemo(() => {
    if (!selectedDate) return {} as Record<string, Appointment>;
    const dayApts = appointmentsByDate[selectedDate] || [];
    const map: Record<string, Appointment> = {};
    dayApts.forEach((apt) => {
      map[apt.appointmentTime] = apt;
    });
    return map;
  }, [selectedDate, appointmentsByDate]);

  // Пренасрочване helpers
  const closeReschedule = () => {
    setRescheduleId(null);
    setRescheduleDate('');
    setRescheduleTime('');
    setRescheduleBarberId('');
    setRescheduleError('');
  };

  const openReschedule = (apt: Appointment) => {
    setRescheduleId(apt.id);
    setRescheduleDate(apt.appointmentDate);
    setRescheduleTime(apt.appointmentTime);
    setRescheduleBarberId(apt.barberId);
    setRescheduleError('');
    // Затваряме booking формата ако е отворена
    setBookingSlot(null);
    setTimeout(() => rescheduleRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
  };

  const handleRescheduleSubmit = async () => {
    if (!rescheduleId || !rescheduleDate || !rescheduleTime) {
      setRescheduleError('Изберете нова дата и час');
      return;
    }
    const success = await onReschedule(rescheduleId, rescheduleDate, rescheduleTime, rescheduleBarberId || undefined);
    if (!success) {
      const barber = barbers.find((b) => b.id === rescheduleBarberId);
      setRescheduleError(`${barber?.name || 'Бръснарят'} вече има резервация в ${formatTime(rescheduleTime)} на ${rescheduleDate}`);
      return;
    }
    closeReschedule();
  };

  // Скролваме до формата когато се отвори
  useEffect(() => {
    if (bookingSlot && formRef.current) {
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
    }
  }, [bookingSlot]);

  // Затваряме формите при смяна на ден
  useEffect(() => {
    setBookingSlot(null);
    setForm(EMPTY_FORM);
    setFormError('');
    closeReschedule();
  }, [selectedDate]);

  const openBookingForm = (time: string) => {
    setBookingSlot(time);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const closeBookingForm = () => {
    setBookingSlot(null);
    setForm(EMPTY_FORM);
    setFormError('');
  };

  const handleFormSubmit = () => {
    if (!form.customerName.trim()) {
      setFormError('Въведете име на клиента');
      return;
    }
    if (!form.customerPhone.trim()) {
      setFormError('Въведете телефон');
      return;
    }
    if (!form.serviceId) {
      setFormError('Изберете услуга');
      return;
    }
    if (!form.barberId) {
      setFormError('Изберете бръснар');
      return;
    }
    if (!selectedDate || !bookingSlot) return;

    // Проверка за конфликт — дали бръснарят вече е зает
    const conflict = checkConflict(form.barberId, selectedDate, bookingSlot);
    if (conflict) {
      const conflictBarber = barbers.find((b) => b.id === form.barberId);
      setFormError(
        `${conflictBarber?.name || 'Бръснарят'} вече има резервация в ${formatTime(bookingSlot)} на тази дата (клиент: ${conflict.customerName})`
      );
      return;
    }

    // Проверка за дублирани/спам резервации
    const formData: BookingFormData = {
      serviceIds: [form.serviceId],
      barberId: form.barberId,
      date: selectedDate,
      time: bookingSlot,
      customerName: form.customerName.trim(),
      customerPhone: form.customerPhone.trim(),
    };

    const duplicateCheck = checkForDuplicateBooking(formData);

    // Ако е блокирана напълно (rate limit)
    if (shouldBlockBooking(duplicateCheck)) {
      setFormError(
        '⛔ ' + duplicateCheck.warnings.join('. ') + ' Препоръчваме проверка преди добавяне.'
      );
      return;
    }

    // Ако е съмнителна или дублирана, питаме за потвърждение
    if (duplicateCheck.isDuplicate || duplicateCheck.isSuspicious) {
      const warningMsg = [
        '⚠️ ВНИМАНИЕ: Открита съмнителна резервация!',
        '',
        ...duplicateCheck.warnings,
        '',
        `Активни резервации от ${formData.customerName}: ${duplicateCheck.existingBookings.length}`,
        '',
        'Сигурни ли сте, че искате да добавите тази резервация?',
      ].join('\n');

      if (!window.confirm(warningMsg)) {
        return;
      }
    }

    onAddAppointment(formData);
    closeBookingForm();
  };

  const goToPrevMonth = () => setCurrentMonth((m) => subMonths(m, 1));
  const goToNextMonth = () => setCurrentMonth((m) => addMonths(m, 1));
  const goToToday = () => {
    setCurrentMonth(new Date());
    setSelectedDate(new Date().toISOString().split('T')[0]);
  };

  const getAppointmentCount = (dateStr: string): number => {
    return appointmentsByDate[dateStr]?.length || 0;
  };

  const getStatusDots = (dateStr: string) => {
    const apts = appointmentsByDate[dateStr];
    if (!apts || apts.length === 0) return null;

    const hasUpcoming = apts.some((a) => a.status === 'upcoming');
    const hasCompleted = apts.some((a) => a.status === 'completed');
    const hasCancelled = apts.some((a) => a.status === 'cancelled');

    return (
      <div className="flex items-center justify-center gap-0.5 mt-0.5">
        {hasUpcoming && <span className="w-1.5 h-1.5 rounded-full bg-lime" />}
        {hasCompleted && <span className="w-1.5 h-1.5 rounded-full bg-green-400" />}
        {hasCancelled && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Календар */}
      <div className="glass-card p-5">
        {/* Хедър с навигация */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-xl hover:bg-surface-light transition-colors text-white/50 hover:text-white"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <h3 className="text-white font-heading font-bold uppercase text-base tracking-wider capitalize">
              {formatMonthYear(currentMonth)}
            </h3>
            <button
              onClick={goToToday}
              className="px-3 py-1 rounded-lg text-xs font-heading font-bold uppercase tracking-wide bg-surface-light text-white/50 hover:text-white hover:bg-surface-lighter transition-colors"
            >
              Днес
            </button>
          </div>

          <button
            onClick={goToNextMonth}
            className="p-2 rounded-xl hover:bg-surface-light transition-colors text-white/50 hover:text-white"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Дни от седмицата */}
        <div className="grid grid-cols-7 mb-2">
          {BG_DAY_NAMES.map((day, i) => (
            <div
              key={day}
              className={`text-center text-xs font-heading font-bold uppercase tracking-wider py-2 ${
                i === 6 ? 'text-red-400/60' : 'text-white/30'
              }`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Календарна решетка */}
        <div className="grid grid-cols-7 gap-px bg-white/[0.03] rounded-xl overflow-hidden">
          {calendarDays.map((day) => {
            const count = getAppointmentCount(day.dateStr);
            const isSelected = selectedDate === day.dateStr;
            const dayNum = day.date.getDate();

            return (
              <button
                key={day.dateStr}
                onClick={() => setSelectedDate(day.dateStr)}
                className={`
                  relative flex flex-col items-center justify-start py-2 sm:py-3 min-h-[52px] sm:min-h-[64px] 
                  transition-all duration-150 
                  ${!day.isCurrentMonth ? 'opacity-20' : ''}
                  ${day.isSunday && day.isCurrentMonth ? 'text-red-400/70' : ''}
                  ${day.isToday && !isSelected ? 'bg-lime/[0.06]' : ''}
                  ${isSelected ? 'bg-lime/20 ring-1 ring-lime/40' : 'bg-surface hover:bg-surface-light'}
                  ${day.isPast && !isSelected ? 'opacity-50' : ''}
                `}
              >
                <span
                  className={`
                    text-sm font-heading font-bold leading-none
                    ${day.isToday ? 'text-lime' : isSelected ? 'text-white' : 'text-white/70'}
                  `}
                >
                  {dayNum}
                </span>

                {count > 0 && day.isCurrentMonth && (
                  <>
                    {getStatusDots(day.dateStr)}
                    <span className="text-[10px] text-white/40 font-body mt-0.5">
                      {count}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* Легенда */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-white/30">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-lime" />
            <span>Предстоящи</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-400" />
            <span>Завършени</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-400" />
            <span>Отказани</span>
          </div>
        </div>
      </div>

      {/* Часове за избрания ден */}
      {selectedDate && (
        <motion.div
          key={selectedDate}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-heading font-bold uppercase text-sm tracking-wider">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('bg-BG', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
              })}
            </h3>
            <div className="flex items-center gap-3 text-xs text-white/30">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-lime/20 border border-lime/40" />
                <span>Запазен</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-surface border border-white/[0.06]" />
                <span>Свободен</span>
              </div>
            </div>
          </div>

          <div className="glass-card overflow-hidden divide-y divide-white/[0.04]">
            {allTimeSlots.map((time) => {
              const apt = appointmentsByTime[time];
              const isBooked = !!apt;

              const statusConfig: Record<string, { variant: 'lime' | 'green' | 'red'; label: string }> = {
                upcoming: { variant: 'lime', label: 'Предстоящ' },
                completed: { variant: 'green', label: 'Завършен' },
                cancelled: { variant: 'red', label: 'Отказан' },
              };

              const aptServiceIds = apt ? getServiceIdsFromAppointment(apt.serviceId) : [];
              const service = apt ? aptServiceIds.map(id => SERVICES.find(s => s.id === id)).filter(Boolean) : [];
              const serviceName = service.map(s => s!.name).join(', ') || null;
              const barber = apt ? barbers.find((b) => b.id === apt.barberId) : null;
              const status = apt ? statusConfig[apt.status] : null;

              return (
                <div
                  key={time}
                  className={`
                    flex items-stretch transition-colors
                    ${isBooked
                      ? apt.status === 'cancelled'
                        ? 'bg-red-500/[0.06]'
                        : apt.status === 'completed'
                          ? 'bg-green-500/[0.06]'
                          : 'bg-lime/[0.07]'
                      : 'bg-transparent hover:bg-white/[0.02]'
                    }
                  `}
                >
                  {/* Час */}
                  <div className={`
                    w-20 sm:w-24 flex-shrink-0 flex items-center justify-center border-r border-white/[0.06] py-3 sm:py-4
                    ${isBooked ? 'bg-white/[0.03]' : ''}
                  `}>
                    <span className={`
                      text-sm font-heading font-bold tracking-wide
                      ${isBooked
                        ? apt.status === 'cancelled'
                          ? 'text-red-400'
                          : apt.status === 'completed'
                            ? 'text-green-400'
                            : 'text-lime'
                        : 'text-white/25'
                      }
                    `}>
                      {formatTime(time)}
                    </span>
                  </div>

                  {/* Съдържание */}
                  <div className="flex-1 px-4 py-3 sm:py-4 min-w-0">
                    {isBooked ? (
                      <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="min-w-0">
                            {/* Име + статус */}
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                              <span className="text-white font-heading font-bold text-sm uppercase truncate">
                                {apt.customerName}
                              </span>
                              {status && <Badge variant={status.variant}>{status.label}</Badge>}
                            </div>
                            {/* Детайли */}
                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-white/40">
                              <span className="flex items-center gap-1.5">
                                <Scissors className="w-3.5 h-3.5 text-lime/70" />
                                {serviceName || 'Неизвестна'}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-lime/70" />
                                {barber?.name || 'Неизвестен'}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Phone className="w-3.5 h-3.5 text-lime/70" />
                                {apt.customerPhone}
                              </span>
                              {service.length > 0 && (
                                <span className="flex items-center gap-1.5">
                                  <Clock className="w-3.5 h-3.5 text-lime/70" />
                                  {service.reduce((sum, s) => sum + (s?.durationMinutes || 0), 0)} мин · {service.reduce((sum, s) => sum + (s?.price || 0), 0)} € ({toLeva(service.reduce((sum, s) => sum + (s?.price || 0), 0))} лв)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Бутони за действие */}
                          <div className="flex gap-2 flex-shrink-0">
                            {apt.status === 'upcoming' && (
                              <>
                                <Button size="sm" variant="ghost" onClick={() => openReschedule(apt)} title="Пренасрочи">
                                  <CalendarClock className="w-3.5 h-3.5" />
                                  <span className="hidden lg:inline">Пренасрочи</span>
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => onUpdateStatus(apt.id, 'completed')}>
                                  <Check className="w-3.5 h-3.5" />
                                  <span className="hidden lg:inline">Завърши</span>
                                </Button>
                                <Button size="sm" variant="danger" onClick={() => onUpdateStatus(apt.id, 'cancelled')}>
                                  <X className="w-3.5 h-3.5" />
                                  <span className="hidden lg:inline">Откажи</span>
                                </Button>
                              </>
                            )}
                            {onDelete && (
                              <Button 
                                size="sm" 
                                variant="danger" 
                                onClick={() => {
                                  if (window.confirm(`Сигурни ли сте, че искате да изтриете резервацията на ${apt.customerName}?`)) {
                                    onDelete(apt.id);
                                  }
                                }}
                                title="Изтрий"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span className="hidden lg:inline">Изтрий</span>
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Форма за пренасрочване */}
                        {rescheduleId === apt.id && (
                        <div ref={rescheduleRef}>
                          <AnimatePresence>
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-white/[0.06] space-y-3"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-2">
                                  <CalendarClock className="w-3.5 h-3.5 text-lime" />
                                  Пренасрочване на {apt.customerName}
                                </span>
                                <button
                                  onClick={closeReschedule}
                                  className="p-1 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                {/* Нова дата */}
                                <div>
                                  <label className="text-white/30 text-[10px] font-heading uppercase tracking-wider mb-1 block">
                                    Нова дата
                                  </label>
                                  <input
                                    type="date"
                                    value={rescheduleDate}
                                    onChange={(e) => setRescheduleDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-surface-light border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime/40 transition-colors"
                                  />
                                </div>
                                {/* Нов час */}
                                <div>
                                  <label className="text-white/30 text-[10px] font-heading uppercase tracking-wider mb-1 block">
                                    Нов час
                                  </label>
                                  <div className="relative">
                                    <select
                                      value={rescheduleTime}
                                      onChange={(e) => setRescheduleTime(e.target.value)}
                                      className="w-full bg-surface-light border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime/40 transition-colors appearance-none cursor-pointer"
                                    >
                                      {allTimeSlots.map((t) => (
                                        <option key={t} value={t} className="bg-surface text-white">
                                          {formatTime(t)}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-white/30 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>
                                </div>
                                {/* Нов бръснар */}
                                <div>
                                  <label className="text-white/30 text-[10px] font-heading uppercase tracking-wider mb-1 block">
                                    Бръснар
                                  </label>
                                  <div className="relative">
                                    <select
                                      value={rescheduleBarberId}
                                      onChange={(e) => setRescheduleBarberId(e.target.value)}
                                      className="w-full bg-surface-light border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime/40 transition-colors appearance-none cursor-pointer"
                                    >
                                      {barbers.filter((b) => b.isActive).map((b) => (
                                        <option key={b.id} value={b.id} className="bg-surface text-white">
                                          {b.name}
                                        </option>
                                      ))}
                                    </select>
                                    <ChevronDown className="w-4 h-4 text-white/30 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                  </div>
                                </div>
                              </div>

                              {rescheduleError && (
                                <p className="text-red-400 text-xs font-heading">{rescheduleError}</p>
                              )}

                              <div className="flex gap-2 pt-1">
                                <Button size="sm" variant="primary" onClick={handleRescheduleSubmit}>
                                  <Check className="w-3.5 h-3.5" />
                                  Потвърди
                                </Button>
                                <Button size="sm" variant="ghost" onClick={closeReschedule}>
                                  Отказ
                                </Button>
                              </div>
                            </motion.div>
                          </AnimatePresence>
                        </div>
                        )}
                      </>
                    ) : (
                      <div>
                        {bookingSlot === time ? (
                          /* Inline форма за запазване */
                          <div ref={formRef}>
                            <AnimatePresence>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-3"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-white font-heading font-bold text-xs uppercase tracking-wider">
                                    Нова резервация за {formatTime(time)}
                                  </span>
                                  <button
                                    onClick={closeBookingForm}
                                    className="p-1 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition-colors"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {/* Име */}
                                  <div>
                                    <label className="text-white/30 text-[10px] font-heading uppercase tracking-wider mb-1 block">
                                      Име на клиента
                                    </label>
                                    <input
                                      type="text"
                                      value={form.customerName}
                                      onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
                                      placeholder="Георги Иванов"
                                      className="w-full bg-surface-light border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-lime/40 transition-colors"
                                    />
                                  </div>
                                  {/* Телефон */}
                                  <div>
                                    <label className="text-white/30 text-[10px] font-heading uppercase tracking-wider mb-1 block">
                                      Телефон
                                    </label>
                                    <input
                                      type="tel"
                                      value={form.customerPhone}
                                      onChange={(e) => setForm((f) => ({ ...f, customerPhone: e.target.value }))}
                                      placeholder="+359 88 888 8888"
                                      className="w-full bg-surface-light border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-lime/40 transition-colors"
                                    />
                                  </div>
                                  {/* Услуга */}
                                  <div>
                                    <label className="text-white/30 text-[10px] font-heading uppercase tracking-wider mb-1 block">
                                      Услуга
                                    </label>
                                    <div className="relative">
                                      <select
                                        value={form.serviceId}
                                        onChange={(e) => setForm((f) => ({ ...f, serviceId: e.target.value }))}
                                        className="w-full bg-surface-light border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime/40 transition-colors appearance-none cursor-pointer"
                                      >
                                        <option value="" className="bg-surface text-white/40">Изберете...</option>
                                        {SERVICES.map((s) => (
                                          <option key={s.id} value={s.id} className="bg-surface text-white">
                                            {s.name} — {s.price} € ({toLeva(s.price)} лв)
                                          </option>
                                        ))}
                                      </select>
                                      <ChevronDown className="w-4 h-4 text-white/30 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                  </div>
                                  {/* Бръснар */}
                                  <div>
                                    <label className="text-white/30 text-[10px] font-heading uppercase tracking-wider mb-1 block">
                                      Бръснар
                                    </label>
                                    <div className="relative">
                                      <select
                                        value={form.barberId}
                                        onChange={(e) => setForm((f) => ({ ...f, barberId: e.target.value }))}
                                        className="w-full bg-surface-light border border-white/[0.08] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-lime/40 transition-colors appearance-none cursor-pointer"
                                      >
                                        <option value="" className="bg-surface text-white/40">Изберете...</option>
                                        {barbers.filter((b) => b.isActive).map((b) => (
                                          <option key={b.id} value={b.id} className="bg-surface text-white">
                                            {b.name}
                                          </option>
                                        ))}
                                      </select>
                                      <ChevronDown className="w-4 h-4 text-white/30 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    </div>
                                  </div>
                                </div>

                                {/* Грешка */}
                                {formError && (
                                  <p className="text-red-400 text-xs font-heading">{formError}</p>
                                )}

                                {/* Бутони */}
                                <div className="flex gap-2 pt-1">
                                  <Button size="sm" variant="primary" onClick={handleFormSubmit}>
                                    <Check className="w-3.5 h-3.5" />
                                    Запази
                                  </Button>
                                  <Button size="sm" variant="ghost" onClick={closeBookingForm}>
                                    Отказ
                                  </Button>
                                </div>
                              </motion.div>
                            </AnimatePresence>
                          </div>
                        ) : (
                          /* Бутон за отваряне на формата */
                          <button
                            onClick={() => openBookingForm(time)}
                            className="flex items-center gap-1.5 text-white/15 hover:text-lime/70 transition-colors group"
                          >
                            <Plus className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="text-xs font-heading uppercase tracking-wider">
                              Свободен
                            </span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
