'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, User, Phone, Check, X, Scissors, Trash2, AlertTriangle, Info } from 'lucide-react';
import { Appointment } from '@/lib/types';
import { SERVICES, getServiceIdsFromAppointment } from '@/lib/constants';
import { getBarbers } from '@/lib/store';
import { formatDate, formatTime } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useState } from 'react';

interface AppointmentCardProps {
  appointment: Appointment;
  onUpdateStatus: (id: string, status: 'completed' | 'cancelled') => void;
  onDelete?: (id: string) => void;
}

const statusConfig = {
  upcoming: { variant: 'lime' as const, label: 'Предстоящ' },
  completed: { variant: 'green' as const, label: 'Завършен' },
  cancelled: { variant: 'red' as const, label: 'Отказан' },
};

export default function AppointmentCard({ appointment, onUpdateStatus, onDelete }: AppointmentCardProps) {
  const serviceIds = getServiceIdsFromAppointment(appointment.serviceId);
  const services = serviceIds.map(id => SERVICES.find(s => s.id === id)).filter(Boolean);
  const serviceName = services.map(s => s!.name).join(', ') || 'Неизвестна';
  const barber = getBarbers().find((b) => b.id === appointment.barberId);
  const status = statusConfig[appointment.status];
  const [showFlagDetails, setShowFlagDetails] = useState(false);

  const handleDelete = () => {
    if (window.confirm(`Сигурни ли сте, че искате да изтриете резервацията на ${appointment.customerName}?`)) {
      onDelete?.(appointment.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`glass-card p-5 ${appointment.isFlagged ? 'ring-2 ring-amber-500/30' : ''}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3 flex-wrap">
            <h4 className="text-white font-heading font-bold uppercase text-sm">{appointment.customerName}</h4>
            <Badge variant={status.variant}>{status.label}</Badge>
            {appointment.isFlagged && (
              <Badge variant="amber" className="flex items-center gap-1.5 cursor-pointer" onClick={() => setShowFlagDetails(!showFlagDetails)}>
                <AlertTriangle className="w-3 h-3" />
                Съмнителна
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-white/50">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-lime" />
              <span>{serviceName}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-lime" />
              <span>{barber?.name || 'Неизвестен'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-lime" />
              <span>{formatDate(appointment.appointmentDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-lime" />
              <span>{formatTime(appointment.appointmentTime)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-lime" />
              <span>{appointment.customerPhone}</span>
            </div>
          </div>

          {/* Flag Details */}
          {appointment.isFlagged && showFlagDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30"
            >
              <div className="flex items-start gap-2 mb-2">
                <Info className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-200 text-xs font-heading font-bold uppercase mb-1">
                    Причина за флагване:
                  </p>
                  <p className="text-amber-100/80 text-xs whitespace-pre-line">
                    {appointment.flagReason || 'Съмнителна активност'}
                  </p>
                </div>
              </div>
              <p className="text-amber-200/60 text-xs mt-2">
                💡 Препоръчваме да се свържете с клиента на {appointment.customerPhone} за потвърждение.
              </p>
            </motion.div>
          )}
        </div>

        <div className="flex gap-2 sm:flex-col">
          {appointment.status === 'upcoming' && (
            <>
              <Button size="sm" variant="secondary" onClick={() => onUpdateStatus(appointment.id, 'completed')}>
                <Check className="w-4 h-4" />
                <span className="sm:hidden lg:inline">Завърши</span>
              </Button>
              <Button size="sm" variant="danger" onClick={() => onUpdateStatus(appointment.id, 'cancelled')}>
                <X className="w-4 h-4" />
                <span className="sm:hidden lg:inline">Откажи</span>
              </Button>
            </>
          )}
          {onDelete && (
            <Button size="sm" variant="danger" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
              <span className="sm:hidden lg:inline">Изтрий</span>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
