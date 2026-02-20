'use client';

import { motion } from 'framer-motion';
import { Scissors, Sparkles, Crown, Zap, Clock, ArrowRight, Eye, Flame, Sparkle, Check } from 'lucide-react';
import { SERVICES, toLeva, getTotalPrice, getTotalDuration } from '@/lib/constants';
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
  selectedIds: string[];
  onToggle: (id: string) => void;
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

export default function SelectService({ selectedIds, onToggle, onNext }: SelectServiceProps) {
  const totalPrice = getTotalPrice(selectedIds);
  const totalDuration = getTotalDuration(selectedIds);

  return (
    <div>
      <h3 className="font-heading font-bold text-xl uppercase mb-1">Изберете услуги</h3>
      <p className="text-white/40 text-sm mb-6">Може да изберете една или повече услуги</p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6"
      >
        {SERVICES.map((service) => {
          const isSelected = selectedIds.includes(service.id);
          return (
            <motion.div key={service.id} variants={itemVariants}>
              <Card
                selected={isSelected}
                onClick={() => onToggle(service.id)}
                className="relative overflow-hidden"
              >
                {/* Чекмарка */}
                {isSelected && (
                  <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-lime flex items-center justify-center">
                    <Check className="w-4 h-4 text-background" strokeWidth={3} />
                  </div>
                )}
                <div className="flex items-start gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      isSelected
                        ? 'bg-lime/15 text-lime'
                        : 'bg-surface-lighter text-white/40'
                    } transition-colors`}
                  >
                    {iconMap[service.icon]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap pr-6">
                      <h4 className="font-heading font-bold text-sm uppercase text-white">{service.name}</h4>
                      {service.id === 'combo' && (
                        <Badge variant="lime">
                          Най-изгодно
                        </Badge>
                      )}
                    </div>
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
          );
        })}
      </motion.div>

      {/* Обобщение при избрани услуги */}
      {selectedIds.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4 mb-6 flex items-center justify-between flex-wrap gap-2"
        >
          <div className="text-sm text-white/60">
            <span className="text-white font-bold">{selectedIds.length}</span> {selectedIds.length === 1 ? 'услуга' : 'услуги'} • <span className="text-lime font-heading font-bold">{totalPrice} €</span> <span className="text-white/30">/ {toLeva(totalPrice)} лв.</span> • <Clock className="w-3 h-3 inline mb-0.5" /> {totalDuration} мин
          </div>
        </motion.div>
      )}

      <div className="flex justify-end">
        <Button onClick={onNext} disabled={selectedIds.length === 0}>
          Продължи
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
