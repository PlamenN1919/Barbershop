'use client';

import { motion } from 'framer-motion';
import { Award, TrendingUp } from 'lucide-react';

interface TopCustomer {
  name: string;
  phone: string;
  visits: number;
}

interface TopCustomersTableProps {
  customers: TopCustomer[];
}

export default function TopCustomersTable({ customers }: TopCustomersTableProps) {
  const medals = ['🥇', '🥈', '🥉'];
  
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-lime/10 flex items-center justify-center">
          <Award className="w-5 h-5 text-lime" />
        </div>
        <div>
          <h3 className="text-white font-heading font-bold uppercase tracking-wide">Топ лоялни клиенти</h3>
          <p className="text-white/40 text-xs">Клиенти с най-много посещения</p>
        </div>
      </div>
      
      <div className="space-y-3">
        {customers.map((customer, index) => (
          <motion.div
            key={`${customer.name}-${customer.phone}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-4 rounded-xl bg-surface/50 hover:bg-surface transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lime/20 to-lime/5 flex items-center justify-center">
                {index < 3 ? (
                  <span className="text-xl">{medals[index]}</span>
                ) : (
                  <span className="text-lime text-sm font-bold">#{index + 1}</span>
                )}
              </div>
              <div>
                <p className="text-white font-medium text-sm">{customer.name}</p>
                <p className="text-white/40 text-xs">{customer.phone}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-lime font-bold text-lg">{customer.visits}</p>
                <p className="text-white/40 text-xs">посещения</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {customers.length === 0 && (
        <p className="text-white/30 text-center py-8">Няма данни за периода</p>
      )}
    </div>
  );
}
