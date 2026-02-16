'use client';

import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';
import { TESTIMONIALS } from '@/lib/constants';
import Card from '@/components/ui/Card';

function CountUp({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating ? 'text-gold fill-gold' : 'text-white/20'
          }`}
        />
      ))}
    </div>
  );
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function SocialProof() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-surface/50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Star row */}
          <div className="flex justify-center gap-1 mb-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-6 h-6 text-gold fill-gold" />
            ))}
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">
            Trusted by{' '}
            <span className="gold-gradient-text">
              <CountUp target={2500} />+
            </span>{' '}
            Clients
          </h2>
          <p className="text-white/50 text-lg">
            See why Sofia&apos;s professionals choose us
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {TESTIMONIALS.map((testimonial) => (
            <motion.div key={testimonial.id} variants={itemVariants}>
              <Card hoverable={false} className="h-full flex flex-col">
                <Quote className="w-8 h-8 text-gold/30 mb-4" />
                <p className="text-white/70 text-sm leading-relaxed flex-grow mb-4">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
                <div className="mt-auto">
                  <StarRating rating={testimonial.rating} />
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-white font-medium text-sm">
                      {testimonial.name}
                    </span>
                    <span className="text-white/30 text-xs">
                      Client since {testimonial.clientSince}
                    </span>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
