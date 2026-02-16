'use client';

import { Barber } from '@/lib/types';
import { User } from 'lucide-react';
import { isValidPhotoUrl } from '@/lib/utils';

interface BarberFilterProps {
  barbers: Barber[];
  selectedBarberId: string;
  onSelect: (barberId: string) => void;
}

export default function BarberFilter({ barbers, selectedBarberId, onSelect }: BarberFilterProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <button
        onClick={() => onSelect('')}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-heading font-bold uppercase tracking-wide transition-all
          ${
            selectedBarberId === ''
              ? 'bg-lime text-background'
              : 'bg-surface-light text-white/50 hover:text-white border border-white/[0.06]'
          }
        `}
      >
        Всички бръснари
      </button>

      {barbers.filter((b) => b.isActive).map((barber) => (
        <button
          key={barber.id}
          onClick={() => onSelect(barber.id)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-heading font-bold uppercase tracking-wide transition-all
            ${
              selectedBarberId === barber.id
                ? 'bg-lime text-background'
                : 'bg-surface-light text-white/50 hover:text-white border border-white/[0.06]'
            }
          `}
        >
          {isValidPhotoUrl(barber.photoUrl) ? (
            <img
              src={barber.photoUrl}
              alt={barber.name}
              className="w-5 h-5 rounded-full object-cover"
            />
          ) : (
            <User className="w-4 h-4" />
          )}
          {barber.name}
        </button>
      ))}
    </div>
  );
}
