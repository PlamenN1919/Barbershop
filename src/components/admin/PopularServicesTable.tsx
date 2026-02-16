'use client';

import { motion } from 'framer-motion';
import { Star, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/analytics';

interface ServiceData {
  serviceId: string;
  serviceName: string;
  count: number;
  revenue: number;
}

interface PopularServicesTableProps {
  services: ServiceData[];
}

export default function PopularServicesTable({ services }: PopularServicesTableProps) {
  const maxCount = Math.max(...services.map(s => s.count), 1);
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center">
          <Star className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-white font-heading font-bold uppercase tracking-wide">Популярни услуги</h3>
          <p className="text-white/40 text-xs">Най-заявявани услуги в периода</p>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-3 px-2 text-white/50 text-xs uppercase tracking-wider font-heading">#</th>
              <th className="text-left py-3 px-2 text-white/50 text-xs uppercase tracking-wider font-heading">Услуга</th>
              <th className="text-right py-3 px-2 text-white/50 text-xs uppercase tracking-wider font-heading">Брой</th>
              <th className="text-right py-3 px-2 text-white/50 text-xs uppercase tracking-wider font-heading">Приход</th>
              <th className="text-right py-3 px-2 text-white/50 text-xs uppercase tracking-wider font-heading">Популярност</th>
            </tr>
          </thead>
          <tbody>
            {services.slice(0, 10).map((service, index) => {
              const popularity = (service.count / maxCount) * 100;
              
              return (
                <motion.tr
                  key={service.serviceId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-4 px-2">
                    <div className="w-6 h-6 rounded-full bg-lime/10 flex items-center justify-center">
                      <span className="text-lime text-xs font-bold">{index + 1}</span>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-white text-sm font-medium">{service.serviceName}</span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <span className="text-blue-400 text-sm font-bold">{service.count}</span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <span className="text-lime text-sm font-bold">{formatCurrency(service.revenue)}</span>
                  </td>
                  <td className="py-4 px-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-surface rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${popularity}%` }}
                          transition={{ delay: index * 0.05 + 0.2, duration: 0.5 }}
                          className="h-full bg-gradient-to-r from-amber-400 to-amber-400/60 rounded-full"
                        />
                      </div>
                      <span className="text-white/40 text-xs w-10">{popularity.toFixed(0)}%</span>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {services.length === 0 && (
        <p className="text-white/30 text-center py-8">Няма данни за периода</p>
      )}
    </div>
  );
}
