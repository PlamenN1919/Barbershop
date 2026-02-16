'use client';

import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';

interface BusyHour {
  hour: string;
  count: number;
}

interface BusyHoursChartProps {
  busiestHours: BusyHour[];
}

export default function BusyHoursChart({ busiestHours }: BusyHoursChartProps) {
  const maxCount = Math.max(...busiestHours.map(h => h.count), 1);
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-purple-400/10 flex items-center justify-center">
          <Clock className="w-5 h-5 text-purple-400" />
        </div>
        <div>
          <h3 className="text-white font-heading font-bold uppercase tracking-wide">Пикови часове</h3>
          <p className="text-white/40 text-xs">Най-натоварени часове в деня</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {busiestHours.map((hour, index) => {
          const percentage = (hour.count / maxCount) * 100;
          const intensity = percentage > 80 ? 'text-red-400' : percentage > 50 ? 'text-amber-400' : 'text-green-400';
          
          return (
            <div key={hour.hour} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Clock className={`w-4 h-4 ${intensity}`} />
                  <span className="text-white/80 font-medium">{hour.hour}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`${intensity} font-bold`}>{hour.count} резервации</span>
                  <span className="text-white/30 text-xs">({percentage.toFixed(0)}%)</span>
                </div>
              </div>
              
              <div className="relative h-3 bg-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: 'easeOut' }}
                  className={`absolute left-0 top-0 h-full rounded-full ${
                    percentage > 80 
                      ? 'bg-gradient-to-r from-red-400 to-red-400/60'
                      : percentage > 50
                      ? 'bg-gradient-to-r from-amber-400 to-amber-400/60'
                      : 'bg-gradient-to-r from-green-400 to-green-400/60'
                  }`}
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {busiestHours.length === 0 && (
        <p className="text-white/30 text-center py-8">Няма данни за периода</p>
      )}
      
      <div className="mt-6 pt-6 border-t border-white/[0.06]">
        <div className="flex items-center justify-center gap-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-white/50">Нормално</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="text-white/50">Натоварено</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400" />
            <span className="text-white/50">Пиково</span>
          </div>
        </div>
      </div>
    </div>
  );
}
