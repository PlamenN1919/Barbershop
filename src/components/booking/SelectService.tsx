'use client';

import { motion } from 'framer-motion';
import { Scissors, Sparkles, Crown, Zap, Clock, ArrowRight, Eye, Flame, Sparkle } from 'lucide-react';
import { SERVICES, toLeva } from '@/lib/constants';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const iconMap: Record<string, React.ReactNode> = {
  Scissors: <Scissors className="w-5 h-5" />,
  Sparkles: <Sparkles className="w-5 h-5" />,
  Crown: <Crown className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Eye: <Eye className="w-5 h-5" />,
  Flame: <Flame className="w-5 h-5" />,
  Sparkle: <Sparkle className="w-5 h-5" />,
};

interface SelectServiceProps {
  selectedId: string;
  onSelect: (id: string) => void;
  onNext: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function SelectService({ selectedId, onSelect, onNext }: SelectServiceProps) {
  return (
    <div>
      <h3 className="font-heading font-bold text-xl uppercase mb-1">Изберете услуга</h3>
      <p className="text-white/40 text-sm mb-6">Изберете изживяването, което ви подхожда най-добре</p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8"
      >
        {SERVICES.map((service) => (
          <motion.div key={service.id} variants={itemVariants}>
            <Card
              selected={selectedId === service.id}
              onClick={() => onSelect(service.id)}
              className="relative overflow-hidden"
            >
              {service.id === 'combo' && (
                <Badge className="absolute top-4 right-4" variant="lime">
                  Най-изгодно
                </Badge>
              )}
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    selectedId === service.id
                      ? 'bg-lime/15 text-lime'
                      : 'bg-surface-lighter text-white/40'
                  } transition-colors`}
                >
                  {iconMap[service.icon]}
                </div>
                <div className="flex-1">
                  <h4 className="font-heading font-bold text-sm uppercase text-white mb-1">{service.name}</h4>
                  <p className="text-white/30 text-xs mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lime font-heading font-bold text-lg">{service.price} € <span className="text-white/30 text-sm font-normal">/ {toLeva(service.price)} лв.</span></span>
                    <div className="flex items-center gap-1 text-white/25 text-xs">
                      <Clock className="w-3 h-3" />
                      <span>{service.durationMinutes} мин</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!selectedId}>
          Продължи
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
