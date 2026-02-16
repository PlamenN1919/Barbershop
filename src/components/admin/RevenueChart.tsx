'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/analytics';

interface RevenueChartProps {
  byService: Record<string, number>;
  serviceNames: Record<string, string>;
}

export default function RevenueChart({ byService, serviceNames }: RevenueChartProps) {
  const sortedServices = Object.entries(byService)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 7);
  
  const maxRevenue = Math.max(...sortedServices.map(([, revenue]) => revenue), 1);
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-lime" />
        </div>
        <div>
          <h3 className="text-white font-heading font-bold uppercase tracking-wide">Приходи по услуга</h3>
          <p className="text-white/40 text-xs">Топ услуги по генериран приход</p>
        </div>
      </div>
      
      <div className="space-y-4">
        {sortedServices.map(([serviceId, revenue], index) => {
          const percentage = (revenue / maxRevenue) * 100;
          
          return (
            <div key={serviceId} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/80 font-medium">{serviceNames[serviceId] || serviceId}</span>
                <span className="text-lime font-bold">{formatCurrency(revenue)}</span>
              </div>
              
              <div className="relative h-3 bg-surface rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: index * 0.1, duration: 0.8, ease: 'easeOut' }}
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-lime to-lime/60 rounded-full"
                />
              </div>
            </div>
          );
        })}
      </div>
      
      {sortedServices.length === 0 && (
        <p className="text-white/30 text-center py-8">Няма данни за периода</p>
      )}
    </div>
  );
}
