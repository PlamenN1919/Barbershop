'use client';

import { AnimatePresence } from 'framer-motion';
import { CalendarDays, Inbox } from 'lucide-react';
import { Appointment } from '@/lib/types';
import AppointmentCard from './AppointmentCard';

interface AppointmentListProps {
  appointments: Appointment[];
  onUpdateStatus: (id: string, status: 'completed' | 'cancelled') => void;
  onDelete?: (id: string) => void;
}

export default function AppointmentList({ appointments, onUpdateStatus, onDelete }: AppointmentListProps) {
  if (appointments.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <Inbox className="w-12 h-12 text-white/15 mx-auto mb-4" />
        <h3 className="text-white/40 font-heading font-bold uppercase mb-1">Няма намерени резервации</h3>
        <p className="text-white/20 text-sm">
          Опитайте да промените филтъра или проверете по-късно.
        </p>
      </div>
    );
  }

  const grouped = appointments.reduce(
    (acc, apt) => {
      const date = apt.appointmentDate;
      if (!acc[date]) acc[date] = [];
      acc[date].push(apt);
      return acc;
    },
    {} as Record<string, Appointment[]>
  );

  const sortedDates = Object.keys(grouped).sort();

  return (
    <div className="space-y-8">
      {sortedDates.map((date) => (
        <div key={date}>
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-5 h-5 text-lime" />
            <h3 className="text-white font-heading font-bold uppercase text-sm">{date}</h3>
            <span className="text-white/20 text-xs">({grouped[date].length} резервации)</span>
          </div>
          <div className="space-y-3">
            <AnimatePresence>
              {grouped[date]
                .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime))
                .map((apt) => (
                  <AppointmentCard key={apt.id} appointment={apt} onUpdateStatus={onUpdateStatus} onDelete={onDelete} />
                ))}
            </AnimatePresence>
          </div>
        </div>
      ))}
    </div>
  );
}
