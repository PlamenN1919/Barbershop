'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import BookingForm from '@/components/booking/BookingForm';

export default function BookingSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section id="booking" ref={ref} className="section-padding py-24 sm:py-32 bg-surface/50">
      <div className="max-w-4xl mx-auto">
        {/* Заглавие */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="heading-xl text-5xl sm:text-6xl lg:text-7xl mb-4">
            ЗАПАЗИ ЧАС
          </h2>
          <div className="w-20 h-1 bg-lime rounded-full mb-4" />
          <p className="text-white/40 text-base max-w-lg">
            Изберете услуга, посочете бръснар, изберете час. Отнема по-малко от 30 секунди.
          </p>
        </motion.div>

        {/* Форма за резервация */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BookingForm />
        </motion.div>
      </div>
    </section>
  );
}
