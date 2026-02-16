'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '@/lib/constants';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function GallerySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="gallery" ref={ref} className="section-padding py-24 sm:py-32 bg-surface/50">
      <div className="max-w-7xl mx-auto">
        {/* Заглавие */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="heading-xl text-5xl sm:text-6xl lg:text-7xl mb-4">
            ОТЗИВИ
          </h2>
          <div className="w-20 h-1 bg-lime rounded-full" />
        </motion.div>

        {/* Карти с отзиви */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={itemVariants}
              className="glass-card p-6 flex flex-col group hover:border-lime/20 transition-colors"
            >
              <Quote className="w-7 h-7 text-lime/30 mb-4" />

              <p className="text-white/60 text-sm leading-relaxed flex-grow mb-6">
                &bdquo;{testimonial.text}&ldquo;
              </p>

              <div className="mt-auto">
                {/* Звезди */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3.5 h-3.5 ${
                        i < testimonial.rating ? 'text-lime fill-lime' : 'text-white/10'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-white font-heading font-bold text-sm uppercase">
                    {testimonial.name}
                  </span>
                  <span className="text-white/20 text-xs">
                    Клиент от {testimonial.clientSince}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
