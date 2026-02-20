'use client';

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Clock, Scissors, User, Phone, ChevronRight, CalendarCheck } from 'lucide-react';
import { Appointment, Barber } from '@/lib/types';
import { SERVICES, getServiceIdsFromAppointment } from '@/lib/constants';
import { formatTime } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface TodayOverviewProps {
  appointments: Appointment[];
  barbers: Barber[];
}

export default function TodayOverview({ appointments, barbers }: TodayOverviewProps) {
  const todayStr = new Date().toISOString().split('T')[0];

  const todayAppointments = useMemo(() => {
    return appointments
      .filter((apt) => apt.appointmentDate === todayStr && apt.status === 'upcoming')
      .sort((a, b) => a.appointmentTime.localeCompare(b.appointmentTime));
  }, [appointments, todayStr]);

  // Намираме текущия час, за да маркираме "следващия" час
  const now = new Date();
  const currentTimeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

  const nextAptIndex = todayAppointments.findIndex(
    (apt) => apt.appointmentTime >= currentTimeStr
  );

  if (todayAppointments.length === 0) {
    return (
      <div className="glass-card p-5 mb-6">
        <div className="flex items-center gap-3 text-white/30">
          <Sun className="w-5 h-5 text-lime/50" />
          <span className="font-heading font-bold text-sm uppercase tracking-wider">
            Днешен график
          </span>
          <span className="text-xs text-white/20 ml-auto">Няма предстоящи часове за днес</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-5 mb-6">
      {/* Хедър */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Sun className="w-5 h-5 text-lime" />
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider text-white">
            Днешен график
          </h3>
          <Badge variant="lime">{todayAppointments.length} часа</Badge>
        </div>
        <div className="text-xs text-white/30 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5" />
          {now.toLocaleTimeString('bg-BG', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Компактен списък */}
      <div className="space-y-1.5">
        <AnimatePresence>
          {todayAppointments.map((apt, idx) => {
            const svcIds = getServiceIdsFromAppointment(apt.serviceId);
            const serviceNames = svcIds.map(id => SERVICES.find(s => s.id === id)?.name).filter(Boolean).join(', ') || '—';
            const barber = barbers.find((b) => b.id === apt.barberId);
            const isNext = idx === nextAptIndex;
            const isPast = apt.appointmentTime < currentTimeStr;

            return (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all
                  ${isNext
                    ? 'bg-lime/[0.12] ring-1 ring-lime/30'
                    : isPast
                      ? 'bg-white/[0.02] opacity-50'
                      : 'bg-white/[0.02] hover:bg-white/[0.04]'
                  }
                `}
              >
                {/* Час */}
                <div className={`
                  w-16 flex-shrink-0 text-center
                  ${isNext ? 'text-lime' : isPast ? 'text-white/25' : 'text-white/50'}
                `}>
                  <span className="text-sm font-heading font-bold tracking-wide">
                    {formatTime(apt.appointmentTime)}
                  </span>
                </div>

                {/* Разделител */}
                <div className={`w-px h-8 ${isNext ? 'bg-lime/30' : 'bg-white/[0.06]'}`} />

                {/* Инфо */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-heading font-bold uppercase truncate ${isNext ? 'text-white' : 'text-white/70'}`}>
                      {apt.customerName}
                    </span>
                    {isNext && (
                      <Badge variant="lime">Следващ</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-white/35 mt-0.5">
                    <span className="flex items-center gap-1">
                      <Scissors className="w-3 h-3" />
                      {serviceNames}
                    </span>
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {barber?.name || '—'}
                    </span>
                  </div>
                </div>

                {/* Телефон */}
                <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/25 flex-shrink-0">
                  <Phone className="w-3 h-3" />
                  {apt.customerPhone}
                </div>

                {isNext && (
                  <ChevronRight className="w-4 h-4 text-lime flex-shrink-0" />
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Обобщение */}
      {nextAptIndex >= 0 && (
        <div className="mt-3 pt-3 border-t border-white/[0.04] flex items-center gap-2 text-xs text-white/25">
          <CalendarCheck className="w-3.5 h-3.5 text-lime/50" />
          <span>
            {nextAptIndex} завършени · {todayAppointments.length - nextAptIndex} оставащи
          </span>
        </div>
      )}
    </div>
  );
}
