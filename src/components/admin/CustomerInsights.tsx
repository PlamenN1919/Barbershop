'use client';

import { motion } from 'framer-motion';
import { Users, UserPlus, UserCheck, Percent } from 'lucide-react';
import { CustomerMetrics } from '@/lib/types';

interface CustomerInsightsProps {
  metrics: CustomerMetrics;
}

export default function CustomerInsights({ metrics }: CustomerInsightsProps) {
  const insights = [
    {
      label: 'Общо клиенти',
      value: metrics.total,
      icon: Users,
      color: 'text-blue-400',
      bgColor: 'from-blue-400/20 to-blue-400/5'
    },
    {
      label: 'Нови клиенти',
      value: metrics.new,
      icon: UserPlus,
      color: 'text-green-400',
      bgColor: 'from-green-400/20 to-green-400/5'
    },
    {
      label: 'Повтарящи се',
      value: metrics.returning,
      icon: UserCheck,
      color: 'text-lime',
      bgColor: 'from-lime/20 to-lime/5'
    },
    {
      label: 'Задържане',
      value: `${metrics.retentionRate.toFixed(1)}%`,
      icon: Percent,
      color: 'text-purple-400',
      bgColor: 'from-purple-400/20 to-purple-400/5'
    }
  ];

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-blue-400/10 flex items-center justify-center">
          <Users className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h3 className="text-white font-heading font-bold uppercase tracking-wide">Клиентски инсайти</h3>
          <p className="text-white/40 text-xs">Обобщение на клиентската база</p>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          
          return (
            <motion.div
              key={insight.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-surface/50 hover:bg-surface transition-colors"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${insight.bgColor} flex items-center justify-center mb-3`}>
                <Icon className={`w-5 h-5 ${insight.color}`} />
              </div>
              <p className="text-2xl font-heading font-bold text-white mb-1">{insight.value}</p>
              <p className="text-white/40 text-xs uppercase tracking-wider font-heading">{insight.label}</p>
            </motion.div>
          );
        })}
      </div>
      
      {/* Визуализация на разпределението */}
      <div className="pt-6 border-t border-white/[0.06]">
        <p className="text-white/50 text-xs uppercase tracking-wider font-heading mb-3">Разпределение</p>
        <div className="flex gap-2 h-4 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${metrics.total > 0 ? (metrics.new / metrics.total) * 100 : 0}%` }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="bg-gradient-to-r from-green-400 to-green-400/80"
            title={`Нови: ${metrics.new}`}
          />
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${metrics.total > 0 ? (metrics.returning / metrics.total) * 100 : 0}%` }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-gradient-to-r from-lime to-lime/80"
            title={`Повтарящи се: ${metrics.returning}`}
          />
        </div>
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-400" />
            <span className="text-white/50">Нови ({metrics.new})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-lime" />
            <span className="text-white/50">Повтарящи се ({metrics.returning})</span>
          </div>
        </div>
      </div>
    </div>
  );
}
