'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function CTASection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={ref} className="section-padding py-24 sm:py-32">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="glass-card p-10 sm:p-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8"
        >
          <div>
            <h2 className="font-heading font-bold text-xl sm:text-2xl uppercase text-lime mb-1">
              Заинтересувахте се?
            </h2>
            <p className="heading-lg text-3xl sm:text-4xl lg:text-5xl">
              ТОВА Е САМО
              <br />
              НАЧАЛОТО.
            </p>
          </div>

          <motion.button
            onClick={scrollToBooking}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-lime flex items-center justify-center shrink-0 hover:bg-lime-light transition-colors group"
          >
            <ArrowUpRight className="w-8 h-8 sm:w-10 sm:h-10 text-background group-hover:rotate-12 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
