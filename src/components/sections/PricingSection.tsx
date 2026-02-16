'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Check, Clock, Star } from 'lucide-react';
import { SERVICES } from '@/lib/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function PricingSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="pricing" ref={ref} className="section-padding py-24 sm:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Заглавие */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="heading-xl text-5xl sm:text-6xl lg:text-7xl">ЦЕНОРАЗПИС</h2>
        </motion.div>

        {/* Ценови карти */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {SERVICES.map((service, index) => {
            const isPopular = service.id === 'combo';
            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                className={`
                  glass-card p-6 flex flex-col relative overflow-hidden
                  ${isPopular ? 'border-lime/30 bg-lime/[0.03]' : ''}
                  hover:border-white/10 transition-colors group
                `}
              >
                {isPopular && (
                  <div className="absolute top-4 right-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-lime/10 border border-lime/20 text-lime text-xs font-bold uppercase">
                      <Star className="w-3 h-3 fill-lime" />
                      Популярно
                    </span>
                  </div>
                )}

                <span className="text-white/20 font-heading font-bold text-sm uppercase tracking-wider mb-4">
                  {String(index + 1).padStart(2, '0')}
                </span>

                <h3 className="font-heading font-bold text-xl uppercase mb-2">
                  {service.name}
                </h3>

                <p className="text-white/40 text-sm mb-6 flex-grow">
                  {service.description}
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <Check className="w-4 h-4 text-lime" />
                    <span>Премиум продукти включени</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <Clock className="w-4 h-4 text-lime" />
                    <span>{service.durationMinutes} минути</span>
                  </div>
                </div>

                <div className="divider mb-6" />

                <div className="flex items-end justify-between">
                  <div>
                    <span className="font-heading font-bold text-3xl text-white">
                      {service.price} лв.
                    </span>
                  </div>
                  <button
                    onClick={scrollToBooking}
                    className={`
                      px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wide transition-all
                      ${
                        isPopular
                          ? 'bg-lime text-background hover:bg-lime-light'
                          : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/[0.08]'
                      }
                    `}
                  >
                    Запази
                  </button>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
