'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { BookingStep } from '@/lib/types';

interface StepIndicatorProps {
  currentStep: BookingStep;
  totalSteps: number;
}

const stepLabels = ['Услуга', 'Бръснар', 'Дата и час', 'Данни', 'Потвърди'];

export default function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="w-full mb-8">
      {/* Прогрес бар */}
      <div className="relative h-0.5 bg-surface-lighter rounded-full mb-6 overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-lime rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          transition={{ duration: 0.4, ease: 'easeInOut' }}
        />
      </div>

      {/* Индикатори за стъпки */}
      <div className="flex justify-between">
        {stepLabels.map((label, index) => {
          const stepNumber = (index + 1) as BookingStep;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={label} className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted
                    ? '#CCFF00'
                    : isCurrent
                    ? '#CCFF00'
                    : '#1E1E1E',
                }}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-heading font-bold
                  ${isCompleted || isCurrent ? 'text-background' : 'text-white/30'}
                `}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : stepNumber}
              </motion.div>
              <span
                className={`text-xs hidden sm:block font-medium uppercase tracking-wider ${
                  isCurrent ? 'text-lime' : 'text-white/30'
                }`}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
