'use client';

import { motion, useInView } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useRef } from 'react';

export default function AccentStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      onClick={scrollToBooking}
      className="section-padding cursor-pointer group"
    >
      <div className="max-w-7xl mx-auto">
        <div className="bg-lime rounded-2xl px-6 sm:px-10 py-5 sm:py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="w-3 h-3 rounded-full bg-background shrink-0" />
            <p className="font-heading font-bold text-background text-sm sm:text-base lg:text-lg uppercase tracking-wide truncate">
              Отвъд обикновеното &mdash; Вашият личен път към перфектната визия
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center shrink-0 group-hover:bg-background/20 transition-colors">
            <ArrowRight className="w-5 h-5 text-background" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
