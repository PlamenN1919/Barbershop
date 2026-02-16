'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Check, Calendar, Clock, User, Scissors, MapPin } from 'lucide-react';
import { BookingFormData } from '@/lib/types';
import { SERVICES } from '@/lib/constants';
import { getBarbers } from '@/lib/store';
import { formatDateFull, formatTime } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface ConfirmationProps {
  formData: BookingFormData;
  onBack: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
  isConfirmed: boolean;
}

export default function Confirmation({
  formData,
  onBack,
  onConfirm,
  isSubmitting,
  isConfirmed,
}: ConfirmationProps) {
  const service = SERVICES.find((s) => s.id === formData.serviceId);
  const barber = getBarbers().find((b) => b.id === formData.barberId);

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
          <div className="flex items-center gap-3 text-sm">
            <Scissors className="w-4 h-4 text-lime" />
            <span className="text-white/60">{service?.name}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <User className="w-4 h-4 text-lime" />
            <span className="text-white/60">{barber?.name}</span>
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
      </motion.div>
    );
  }

  return (
    <div>
      <h3 className="font-heading font-bold text-xl uppercase mb-1">Преглед и потвърждение</h3>
      <p className="text-white/40 text-sm mb-6">Проверете данните на вашата резервация</p>

      <div className="glass-card p-6 mb-8 space-y-4">
        {/* Услуга */}
        <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <Scissors className="w-5 h-5 text-lime" />
            <div>
              <p className="text-white text-sm font-heading font-bold uppercase">Услуга</p>
              <p className="text-white/30 text-xs">{service?.durationMinutes} мин</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white font-medium text-sm">{service?.name}</p>
            <p className="text-lime font-heading font-bold">{service?.price} лв.</p>
          </div>
        </div>

        {/* Бръснар */}
        <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-lime" />
            <p className="text-white text-sm font-heading font-bold uppercase">Бръснар</p>
          </div>
          <p className="text-white font-medium text-sm">{barber?.name}</p>
        </div>

        {/* Дата и час */}
        <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
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
