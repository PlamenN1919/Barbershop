'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, AlertCircle, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import {
  getAvailableDates,
  formatTime,
  formatMonthYear,
  getCalendarDays,
  BG_DAY_NAMES,
  addMonths,
  subMonths,
} from '@/lib/utils';
import { DAYS_AHEAD } from '@/lib/constants';
import { apiGetAvailableSlots, TimeSlotResponse } from '@/lib/api';
import { TimeSlot } from '@/lib/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

interface SelectDateTimeProps {
  selectedDate: string;
  selectedTime: string;
  barberId: string;
  onSelectDate: (date: string) => void;
  onSelectTime: (time: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function SelectDateTime({
  selectedDate,
  selectedTime,
  barberId,
  onSelectDate,
  onSelectTime,
  onNext,
  onBack,
}: SelectDateTimeProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);

  // Available dates as a Set for O(1) lookup
  const availableDatesSet = useMemo(() => {
    const dates = getAvailableDates(DAYS_AHEAD);
    return new Set(dates);
  }, []);

  // Calendar grid for the current month
  const calendarDays = useMemo(
    () => getCalendarDays(currentMonth, availableDatesSet),
    [currentMonth, availableDatesSet]
  );

  // Fetch real time slots from API when date or barber changes
  useEffect(() => {
    if (!selectedDate || !barberId) {
      setTimeSlots([]);
      return;
    }

    setIsLoadingSlots(true);
    apiGetAvailableSlots(barberId, selectedDate)
      .then((slots) => setTimeSlots(slots))
      .catch((err) => {
        console.error('Грешка при зареждане на часове:', err);
        setTimeSlots([]);
      })
      .finally(() => setIsLoadingSlots(false));
  }, [selectedDate, barberId]);

  const availableCount = timeSlots.filter((s) => s.available).length;

  // Month navigation limits
  const today = new Date();
  const maxMonth = addMonths(today, 1);
  const canGoPrev = currentMonth.getMonth() >= today.getMonth() && currentMonth.getFullYear() >= today.getFullYear();
  const canGoNext = currentMonth.getMonth() < maxMonth.getMonth() || currentMonth.getFullYear() < maxMonth.getFullYear();

  const handleSelectDate = (dateStr: string) => {
    onSelectDate(dateStr);
    onSelectTime('');
  };

  return (
    <div>
      <h3 className="font-heading font-bold text-xl uppercase mb-1">Изберете дата и час</h3>
      <p className="text-white/40 text-sm mb-6">Изберете удобен за вас ден и час</p>

      {/* Календар */}
      <div className="mb-6">
        <div className="glass-card p-4 sm:p-5">
          {/* Навигация по месец */}
          <div className="flex items-center justify-between mb-5">
            <button
              onClick={() => canGoPrev && setCurrentMonth(subMonths(currentMonth, 1))}
              disabled={!canGoPrev}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                canGoPrev
                  ? 'bg-surface-lighter text-white/60 hover:text-white hover:bg-surface-lighter/80'
                  : 'text-white/10 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <h4 className="font-heading font-bold text-base uppercase tracking-wider capitalize">
              {formatMonthYear(currentMonth)}
            </h4>

            <button
              onClick={() => canGoNext && setCurrentMonth(addMonths(currentMonth, 1))}
              disabled={!canGoNext}
              className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                canGoNext
                  ? 'bg-surface-lighter text-white/60 hover:text-white hover:bg-surface-lighter/80'
                  : 'text-white/10 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Дни на седмицата — хедър */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {BG_DAY_NAMES.map((day, i) => (
              <div
                key={day}
                className={`text-center text-[11px] font-heading font-bold uppercase tracking-wider py-1.5 ${
                  i === 6 ? 'text-red-400/50' : 'text-white/30'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Дни — grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day) => {
              const isSelected = selectedDate === day.dateStr;
              const isDisabled = !day.isAvailable || !day.isCurrentMonth;

              return (
                <button
                  key={day.dateStr}
                  disabled={isDisabled}
                  onClick={() => handleSelectDate(day.dateStr)}
                  className={`
                    relative aspect-square rounded-xl flex items-center justify-center text-sm font-heading font-bold transition-all
                    ${
                      isSelected
                        ? 'bg-lime text-background scale-105 shadow-lg shadow-lime/20'
                        : day.isToday && day.isAvailable
                        ? 'bg-lime/10 text-lime border border-lime/20 hover:bg-lime/20'
                        : day.isAvailable && day.isCurrentMonth
                        ? 'text-white/70 hover:bg-surface-lighter hover:text-white'
                        : day.isCurrentMonth
                        ? 'text-white/10 cursor-not-allowed'
                        : 'text-white/[0.04] cursor-not-allowed'
                    }
                  `}
                >
                  {day.date.getDate()}

                  {/* Точка за днешна дата */}
                  {day.isToday && !isSelected && (
                    <span className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-lime" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Свободни часове */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs text-white/40 font-heading font-bold uppercase tracking-wider">
                Свободни часове
              </label>
              {!isLoadingSlots && availableCount <= 5 && availableCount > 0 && (
                <Badge variant="red">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Само {availableCount} свободни
                </Badge>
              )}
            </div>

            {isLoadingSlots ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-lime animate-spin" />
                <span className="ml-3 text-white/40 text-sm">Зареждане на свободни часове...</span>
              </div>
            ) : (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-8">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  disabled={!slot.available}
                  onClick={() => onSelectTime(slot.time)}
                  className={`
                    py-2.5 px-2 rounded-lg text-sm font-heading font-bold transition-all
                    ${
                      selectedTime === slot.time
                        ? 'bg-lime text-background'
                        : slot.available
                        ? 'bg-surface-light text-white/60 hover:bg-surface-lighter hover:text-white border border-white/[0.06]'
                        : 'bg-surface/50 text-white/10 cursor-not-allowed line-through'
                    }
                  `}
                >
                  {formatTime(slot.time)}
                </button>
              ))}
            </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!selectedDate && (
        <div className="text-center py-8 text-white/20">
          <p className="text-sm">Моля, изберете дата от календара за да видите свободните часове</p>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>
        <Button onClick={onNext} disabled={!selectedDate || !selectedTime}>
          Продължи
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
