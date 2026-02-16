'use client';

import { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Clock } from 'lucide-react';
import { SERVICES } from '@/lib/constants';

export default function ServicesAccordion() {
  const [openId, setOpenId] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="services" ref={ref} className="section-padding py-24 sm:py-32">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          {SERVICES.map((service, index) => (
            <div key={service.id}>
              <div className="divider" />
              <button
                onClick={() => toggle(service.id)}
                className="w-full py-8 flex items-center justify-between gap-6 group text-left"
              >
                <div className="flex items-center gap-6 sm:gap-10">
                  <span className="font-heading font-bold text-lg sm:text-xl text-white/30 group-hover:text-lime transition-colors">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-heading font-bold text-2xl sm:text-3xl lg:text-4xl uppercase group-hover:text-lime transition-colors">
                    {service.name}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full border border-white/[0.1] flex items-center justify-center shrink-0 group-hover:border-lime/30 group-hover:bg-lime/5 transition-all">
                  {openId === service.id ? (
                    <Minus className="w-4 h-4 text-lime" />
                  ) : (
                    <Plus className="w-4 h-4 text-white/40 group-hover:text-lime transition-colors" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openId === service.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 pl-16 sm:pl-24 pr-4">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
                        <div className="sm:col-span-2">
                          <p className="text-white/50 leading-relaxed">
                            {service.description}
                          </p>
                        </div>
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2 text-sm text-white/40">
                            <Clock className="w-4 h-4 text-lime" />
                            <span>{service.durationMinutes} минути</span>
                          </div>
                          <div className="font-heading font-bold text-2xl text-lime">
                            {service.price} лв.
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <div className="divider" />
        </motion.div>
      </div>
    </section>
  );
}
