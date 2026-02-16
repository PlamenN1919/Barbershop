'use client';

import { Calendar } from 'lucide-react';
import { DateRangePeriod } from '@/lib/types';
import { formatDate } from '@/lib/analytics';

interface DateRangeSelectorProps {
  range: 'today' | 'week' | 'month' | 'year';
  onRangeChange: (range: 'today' | 'week' | 'month' | 'year') => void;
  period: DateRangePeriod;
}

export default function DateRangeSelector({ range, onRangeChange, period }: DateRangeSelectorProps) {
  const ranges = [
    { value: 'today', label: 'Днес' },
    { value: 'week', label: 'Седмица' },
    { value: 'month', label: 'Месец' },
    { value: 'year', label: 'Година' },
  ] as const;

  return (
    <div className="glass-card p-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-lime" />
          <div>
            <p className="text-white/50 text-xs uppercase tracking-wider font-heading mb-1">Период</p>
            <p className="text-white text-sm font-medium">
              {formatDate(period.startDate)} - {formatDate(period.endDate)}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          {ranges.map((r) => (
            <button
              key={r.value}
              onClick={() => onRangeChange(r.value)}
              className={`px-4 py-2 rounded-lg text-sm font-heading font-bold uppercase tracking-wide transition-all ${
                range === r.value
                  ? 'bg-lime text-background'
                  : 'bg-surface-light text-white/50 hover:text-white hover:bg-surface'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
