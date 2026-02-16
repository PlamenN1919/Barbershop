'use client';

import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { ArrowRight, ArrowLeft, User, Phone } from 'lucide-react';
import { BookingFormData } from '@/lib/types';
import Button from '@/components/ui/Button';

interface CustomerDetailsProps {
  register: UseFormRegister<BookingFormData>;
  errors: FieldErrors<BookingFormData>;
  onNext: () => void;
  onBack: () => void;
  isValid: boolean;
}

const inputClasses = (hasError: boolean) => `
  w-full pl-12 pr-4 py-3.5 rounded-xl bg-surface-light border
  text-white placeholder-white/20 font-body text-sm
  focus:outline-none focus:ring-2 focus:ring-lime/40 focus:border-lime/40
  transition-all
  ${hasError ? 'border-red-500/40' : 'border-white/[0.06]'}
`;

export default function CustomerDetails({
  register,
  errors,
  onNext,
  onBack,
  isValid,
}: CustomerDetailsProps) {
  return (
    <div>
      <h3 className="font-heading font-bold text-xl uppercase mb-1">Вашите данни</h3>
      <p className="text-white/40 text-sm mb-6">
        Ще ви изпратим потвърждение &mdash; без спам, обещаваме.
      </p>

      <div className="space-y-5 mb-8">
        {/* Име */}
        <div>
          <label className="text-xs text-white/40 font-heading font-bold uppercase tracking-wider mb-2 block">
            Име и фамилия
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input
              {...register('customerName')}
              type="text"
              placeholder="Иван Иванов"
              className={inputClasses(!!errors.customerName)}
            />
          </div>
          {errors.customerName && (
            <p className="text-red-400 text-xs mt-1.5">{errors.customerName.message}</p>
          )}
        </div>

        {/* Телефон */}
        <div>
          <label className="text-xs text-white/40 font-heading font-bold uppercase tracking-wider mb-2 block">
            Телефонен номер
          </label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input
              {...register('customerPhone')}
              type="tel"
              placeholder="+359 88 123 4567"
              className={inputClasses(!!errors.customerPhone)}
            />
          </div>
          {errors.customerPhone && (
            <p className="text-red-400 text-xs mt-1.5">{errors.customerPhone.message}</p>
          )}
        </div>

      </div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>
        <Button onClick={onNext} disabled={!isValid}>
          Прегледай резервацията
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
