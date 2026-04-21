'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check, Calendar, Clock, User, Scissors, MapPin, CalendarPlus, Download, ExternalLink } from 'lucide-react';
import { BookingFormData } from '@/lib/types';
import { SERVICES, toLeva, getTotalPrice, getTotalDuration } from '@/lib/constants';
import { formatDateFull, formatTime } from '@/lib/utils';
import Button from '@/components/ui/Button';
import {
  createCalendarEvent,
  generateGoogleCalendarUrl,
  downloadIcsFile,
  generateOutlookUrl,
} from '@/lib/calendarUtils';

interface ConfirmationProps {
  formData: BookingFormData;
  barberName: string;
  onBack: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  isConfirmed: boolean;
}

export default function Confirmation({
  formData,
  barberName,
  onBack,
  onConfirm,
  isSubmitting,
  isConfirmed,
}: ConfirmationProps) {
  const selectedServices = SERVICES.filter((s) => formData.serviceIds.includes(s.id));
  const totalPrice = getTotalPrice(formData.serviceIds);
  const totalDuration = getTotalDuration(formData.serviceIds);

  // Създаваме календарно събитие от booking данните
  const calendarEvent = createCalendarEvent({
    serviceIds: formData.serviceIds,
    barberName,
    date: formData.date,
    time: formData.time,
    customerName: formData.customerName,
    reminderMinutes: 30,
  });

  const handleGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(calendarEvent), '_blank');
  };

  const handleAppleCalendar = () => {
    downloadIcsFile(calendarEvent);
  };

  const handleOutlook = () => {
    window.open(generateOutlookUrl(calendarEvent), '_blank');
  };

  if (isConfirmed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="w-20 h-20 mx-auto rounded-full bg-lime/15 flex items-center justify-center mb-6"
        >
          <Check className="w-10 h-10 text-lime" />
        </motion.div>

        <h3 className="font-heading font-bold text-2xl uppercase mb-2">Готово!</h3>
        <p className="text-white/40 mb-8">
          Вашият час е потвърден. Очакваме ви!
        </p>

        <div className="glass-card p-6 max-w-sm mx-auto text-left space-y-3">
          <div className="flex items-start gap-3 text-sm">
            <Scissors className="w-4 h-4 text-lime mt-0.5" />
            <div className="text-white/60">
              {selectedServices.map(s => s.name).join(', ')}
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-lime" />
            <span className="text-white/60">{barberName}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar className="w-4 h-4 text-lime" />
            <span className="text-white/60">{formatDateFull(formData.date)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-lime" />
            <span className="text-white/60">{formatTime(formData.time)}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin className="w-4 h-4 text-lime" />
            <span className="text-white/60">Център, ул. „Екзарх Йосиф" 11, 8260 Царево</span>
          </div>
        </div>

        {/* ============================================ */}
        {/* Добави в календара — бутони                  */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-8 max-w-sm mx-auto"
        >
          <div className="flex items-center gap-2 justify-center mb-4">
            <CalendarPlus className="w-4 h-4 text-lime" />
            <p className="text-white/50 text-sm font-heading uppercase tracking-wider">
              Добави в календара
            </p>
          </div>
          <p className="text-white/30 text-xs mb-4">
            Ще получите напомняне 30 мин. и 2 часа преди часа ви
          </p>

          <div className="grid grid-cols-1 gap-3">
            {/* Google Calendar */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.3 }}
              onClick={handleGoogleCalendar}
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl
                         bg-white/[0.04] border border-white/[0.06]
                         hover:bg-white/[0.08] hover:border-lime/20
                         transition-all duration-300 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-[#4285F4]/15 flex items-center justify-center
                              group-hover:bg-[#4285F4]/25 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                  Google Calendar
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-lime/60 transition-colors" />
            </motion.button>

            {/* Apple Calendar / .ics */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.3 }}
              onClick={handleAppleCalendar}
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl
                         bg-white/[0.04] border border-white/[0.06]
                         hover:bg-white/[0.08] hover:border-lime/20
                         transition-all duration-300 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-white/[0.08] flex items-center justify-center
                              group-hover:bg-white/15 transition-colors">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="white" opacity="0.7">
                  <path d="M13.34 10.17c-.02-2.14 1.74-3.17 1.82-3.22-1-1.46-2.54-1.66-3.08-1.68-1.31-.13-2.56.77-3.23.77-.67 0-1.7-.75-2.8-.73-1.44.02-2.77.84-3.51 2.13-1.5 2.6-.38 6.45 1.08 8.56.71 1.03 1.57 2.19 2.69 2.15 1.08-.04 1.49-.7 2.79-.7 1.31 0 1.67.7 2.81.68 1.16-.02 1.9-1.05 2.6-2.09.82-1.2 1.16-2.36 1.18-2.42-.03-.01-2.26-.87-2.28-3.45h-.07zM11.28 3.54c.59-.72 1-1.72.88-2.72-.85.03-1.88.57-2.49 1.28-.55.63-1.03 1.65-.9 2.62.95.07 1.92-.48 2.51-1.18z"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                  Apple Calendar
                </span>
                <span className="text-white/30 text-xs ml-1.5">(.ics файл)</span>
              </div>
              <Download className="w-3.5 h-3.5 text-white/20 group-hover:text-lime/60 transition-colors" />
            </motion.button>

            {/* Outlook */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.0, duration: 0.3 }}
              onClick={handleOutlook}
              className="group flex items-center gap-3 w-full px-4 py-3 rounded-xl
                         bg-white/[0.04] border border-white/[0.06]
                         hover:bg-white/[0.08] hover:border-lime/20
                         transition-all duration-300 cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-[#0078D4]/15 flex items-center justify-center
                              group-hover:bg-[#0078D4]/25 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M24 7.387v10.478c0 .23-.08.424-.238.576a.806.806 0 01-.588.234h-8.424v-8.07l1.674 1.2a.27.27 0 00.324 0l7.014-5.04a.459.459 0 01.162.21.553.553 0 01.076.252v.16zm0-1.627a.87.87 0 00-.09-.09.996.996 0 00-.198-.162c-.078-.048-.15-.072-.216-.072H14.75v-.012l-1.5 1.086-1.5-1.086V5.436H2.998c-.066 0-.138.024-.216.072a.996.996 0 00-.198.162.87.87 0 00-.09.09L7.5 9.324l1.5 1.086 1.5 1.086 1.5-1.086 1.5-1.086 5.006-3.564z" fill="#0078D4"/>
                  <path d="M8.424 18.675H.826a.806.806 0 01-.588-.234A.776.776 0 010 17.865V7.387a.553.553 0 01.076-.252.459.459 0 01.162-.21L7.5 12.324v6.351h.924z" fill="#0078D4" opacity="0.7"/>
                </svg>
              </div>
              <div className="flex-1 text-left">
                <span className="text-white/80 text-sm font-medium group-hover:text-white transition-colors">
                  Outlook
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-white/20 group-hover:text-lime/60 transition-colors" />
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div>
      <h3 className="font-heading font-bold text-xl uppercase mb-1">Преглед и потвърждение</h3>
      <p className="text-white/40 text-sm mb-6">Проверете данните на вашата резервация</p>

      <div className="glass-card p-6 mb-8 space-y-4">
        {/* Услуги */}
        <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Scissors className="w-5 h-5 text-lime" />
            <div>
              <p className="text-white text-sm font-heading font-bold uppercase">{selectedServices.length === 1 ? 'Услуга' : 'Услуги'}</p>
              <p className="text-white/30 text-xs">{totalDuration} мин</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-medium text-sm">{selectedServices.map(s => s.name).join(', ')}</p>
            <p className="text-lime font-heading font-bold">{totalPrice} € <span className="text-white/30 text-xs font-normal">/ {toLeva(totalPrice)} лв.</span></p>
          </div>
        </div>

        {/* Бръснар */}
        <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-lime" />
            <p className="text-white text-sm font-heading font-bold uppercase">Бръснар</p>
          </div>
          <p className="text-white font-medium text-sm">{barberName}</p>
        </div>

        {/* Дата и час */}        <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-lime" />
            <p className="text-white text-sm font-heading font-bold uppercase">Дата и час</p>
          </div>
          <div className="text-right">
            <p className="text-white font-medium text-sm">{formatDateFull(formData.date)}</p>
            <p className="text-white/40 text-sm">{formatTime(formData.time)}</p>
          </div>
        </div>

        {/* Клиент */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-lime" />
            <p className="text-white text-sm font-heading font-bold uppercase">Контакт</p>
          </div>
          <div className="text-right">
            <p className="text-white font-medium text-sm">{formData.customerName}</p>
            <p className="text-white/40 text-sm">{formData.customerPhone}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>
        <Button onClick={onConfirm} disabled={isSubmitting} className="min-w-[180px]">
          {isSubmitting ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
            />
          ) : (
            <>
              <Check className="w-5 h-5" />
              Потвърди резервация
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
