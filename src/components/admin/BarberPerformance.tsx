'use client';

import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp } from 'lucide-react';
import { Barber } from '@/lib/types';
import { formatCurrency } from '@/lib/analytics';

interface BarberPerformanceProps {
  barbers: Barber[];
  revenueByBarber: Record<string, number>;
  appointmentsByBarber: Record<string, number>;
}

export default function BarberPerformance({ barbers, revenueByBarber, appointmentsByBarber }: BarberPerformanceProps) {
  const barberStats = barbers
    .map(barber => ({
      ...barber,
      revenue: revenueByBarber[barber.id] || 0,
      appointments: appointmentsByBarber[barber.id] || 0,
      avgPerAppointment: appointmentsByBarber[barber.id] > 0 
        ? (revenueByBarber[barber.id] || 0) / appointmentsByBarber[barber.id]
        : 0
    }))
    .sort((a, b) => b.revenue - a.revenue);
  
  const maxRevenue = Math.max(...barberStats.map(b => b.revenue), 1);
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-white font-heading font-bold uppercase tracking-wide">Перформанс на бръснари</h3>
          <p className="text-white/40 text-xs">Приходи и резервации по бръснар</p>
        </div>
      </div>
      
      <div className="space-y-6">
        {barberStats.map((barber, index) => {
          const revenuePercentage = (barber.revenue / maxRevenue) * 100;
          
          return (
            <motion.div
              key={barber.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-lime/20 to-lime/5 flex items-center justify-center">
                    <span className="text-lime text-xs font-bold">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{barber.name}</p>
                    <p className="text-white/40 text-xs">{barber.specialty}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className="text-lime font-bold text-sm">{formatCurrency(barber.revenue)}</p>
                  <p className="text-white/40 text-xs">{barber.appointments} резервации</p>
                </div>
              </div>
              
              <div className="relative h-2 bg-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${revenuePercentage}%` }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.6, ease: 'easeOut' }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-blue-400/60 rounded-full"
                />
              </div>
              
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 text-white/40">
                  <DollarSign className="w-3 h-3" />
                  <span>Средно: {formatCurrency(barber.avgPerAppointment)}</span>
                </div>
                <div className="flex items-center gap-1 text-white/40">
                  <Users className="w-3 h-3" />
                  <span>{barber.appointments} клиента</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {barberStats.length === 0 && (
        <p className="text-white/30 text-center py-8">Няма данни за периода</p>
      )}
    </div>
  );
}
