'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, User, Loader2 } from 'lucide-react';
import { apiGetBarbers } from '@/lib/api';
import { Barber } from '@/lib/types';
import { isValidPhotoUrl } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

interface SelectBarberProps {
  selectedId: string;
  onSelect: (id: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function SelectBarber({ selectedId, onSelect, onNext, onBack }: SelectBarberProps) {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    apiGetBarbers()
      .then((data) => setBarbers(data))
      .catch((err) => console.error('Грешка при зареждане на бръснари:', err))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-lime animate-spin" />
        <span className="ml-3 text-white/40 text-sm">Зареждане...</span>
      </div>
    );
  }

  return (
    <div>
      <h3 className="font-heading font-bold text-xl uppercase mb-1">Изберете бръснар</h3>
      <p className="text-white/40 text-sm mb-6">Всеки бръснар носи своята уникална експертиза</p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8"
      >
        {barbers.filter((b) => b.isActive).map((barber) => (
          <motion.div key={barber.id} variants={itemVariants}>
            <Card
              selected={selectedId === barber.id}
              onClick={() => onSelect(barber.id)}
              className="text-center"
            >
              <div
                className={`w-16 h-16 mx-auto rounded-full overflow-hidden mb-3 ${
                  selectedId === barber.id
                    ? 'ring-2 ring-lime'
                    : ''
                } ${!isValidPhotoUrl(barber.photoUrl) ? (selectedId === barber.id ? 'bg-lime/15' : 'bg-surface-lighter') + ' flex items-center justify-center' : ''} transition-all`}
              >
                {isValidPhotoUrl(barber.photoUrl) ? (
                  <img
                    src={barber.photoUrl}
                    alt={barber.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User
                    className={`w-8 h-8 ${
                      selectedId === barber.id ? 'text-lime' : 'text-white/25'
                    }`}
                  />
                )}
              </div>

              <h4 className="font-heading font-bold text-sm uppercase text-white mb-1">{barber.name}</h4>
              <Badge variant="lime" className="mb-3">
                {barber.specialty}
              </Badge>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="w-4 h-4" />
          Назад
        </Button>
        <Button onClick={onNext} disabled={!selectedId}>
          Продължи
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
