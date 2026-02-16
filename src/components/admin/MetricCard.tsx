'use client';

import { motion } from 'framer-motion';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
  trend?: number;
  subtitle?: string;
  delay?: number;
}

export default function MetricCard({ 
  label, 
  value, 
  icon: Icon, 
  color = 'text-lime',
  trend,
  subtitle,
  delay = 0
}: MetricCardProps) {
  const hasTrend = trend !== undefined;
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-5 hover:bg-surface-light/50 transition-colors"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
          color === 'text-lime' ? 'from-lime/20 to-lime/5' :
          color === 'text-blue-400' ? 'from-blue-400/20 to-blue-400/5' :
          color === 'text-green-400' ? 'from-green-400/20 to-green-400/5' :
          color === 'text-amber-400' ? 'from-amber-400/20 to-amber-400/5' :
          'from-white/10 to-white/5'
        } flex items-center justify-center`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        
        {hasTrend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold ${
            isPositive ? 'bg-green-500/10 text-green-400' :
            isNegative ? 'bg-red-500/10 text-red-400' :
            'bg-white/5 text-white/30'
          }`}>
            {isPositive && <TrendingUp className="w-3 h-3" />}
            {isNegative && <TrendingDown className="w-3 h-3" />}
            {trend >= 0 ? '+' : ''}{trend.toFixed(1)}%
          </div>
        )}
      </div>
      
      <div>
        <p className="text-3xl font-heading font-bold text-white mb-1">{value}</p>
        <p className="text-white/40 text-xs uppercase tracking-wider font-heading mb-1">{label}</p>
        {subtitle && (
          <p className="text-white/30 text-xs">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
}
