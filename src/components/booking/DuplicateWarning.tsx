'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, Calendar, Clock, CheckCircle, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { DuplicateCheckResult } from '@/lib/antiSpam';
import { Appointment } from '@/lib/types';
import { SERVICES, BARBERS } from '@/lib/constants';
import { formatDateFull, formatTime } from '@/lib/utils';

interface DuplicateWarningProps {
  result: DuplicateCheckResult;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function DuplicateWarning({
  result,
  onConfirm,
  onCancel,
  isLoading = false,
}: DuplicateWarningProps) {
  const barbers = BARBERS;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="glass-card p-6 sm:p-8 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl uppercase">
                {result.isSuspicious ? 'Внимание!' : 'Потвърждение'}
              </h3>
              <p className="text-white/40 text-sm">Моля, прегледайте информацията</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-white/40 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Warnings */}
        <div className="mb-6 space-y-3">
          {result.warnings.map((warning, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20"
            >
              <p className="text-amber-200/90 text-sm">{warning}</p>
            </div>
          ))}
        </div>

        {/* Existing Bookings */}
        {result.existingBookings.length > 0 && (
          <div className="mb-6">
            <h4 className="font-heading font-bold text-sm uppercase mb-3 text-white/60">
              Вашите активни резервации:
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {result.existingBookings.map((apt) => {
                const service = SERVICES.find((s) => s.id === apt.serviceId);
                const barber = barbers.find((b) => b.id === apt.barberId);
                return (
                  <div
                    key={apt.id}
                    className="p-3 rounded-lg bg-surface-light border border-white/[0.06]"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white text-sm font-medium">
                        {service?.name || 'Услуга'}
                      </span>
                      <span className="text-lime text-xs font-heading font-bold">
                        {service?.price} лв.
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-white/40">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDateFull(apt.appointmentDate)}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {formatTime(apt.appointmentTime)}
                      </div>
                    </div>
                    {barber && (
                      <p className="text-xs text-white/30 mt-1">
                        Бръснар: {barber.name}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Message */}
        <div className="mb-6 p-4 rounded-lg bg-lime/5 border border-lime/20">
          <p className="text-lime-200/90 text-sm">
            <strong>Важно:</strong> Ако желаете да направите допълнителна резервация,
            моля потвърдете. Ако това е грешка, можете да се свържете с нас на{' '}
            <a href="tel:+359888123456" className="underline">
              +359 88 812 3456
            </a>
            .
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="ghost" onClick={onCancel} className="flex-1">
            Отказ
          </Button>
          <Button onClick={onConfirm} disabled={isLoading} className="flex-1">
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
              />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                Потвърди резервация
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
