'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Scissors, User, Calendar, Check } from 'lucide-react';

const steps = [
  {
    icon: Scissors,
    title: 'Изберете услуга',
    description: 'Класическо подстригване, оформяне на брада или пълното изживяване.',
    gradient: 'from-violet-600/30 to-purple-900/30',
    border: 'border-violet-500/20',
  },
  {
    icon: User,
    title: 'Изберете бръснар',
    description: 'Всеки бръснар носи уникална експертиза и стил.',
    gradient: 'from-lime/10 to-emerald-900/20',
    border: 'border-lime/10',
  },
  {
    icon: Calendar,
    title: 'Изберете дата и час',
    description: 'Вижте наличността в реално време. Без двойни резервации.',
    gradient: 'from-surface-light to-surface',
    border: 'border-white/[0.06]',
  },
  {
    icon: Check,
    title: 'Готови сте!',
    description: 'Влезте уверени. Излезте безупречни.',
    gradient: 'from-surface-light to-surface',
    border: 'border-white/[0.06]',
  },
];

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

export default function JourneySection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="section-padding py-24 sm:py-32">
      <div className="max-w-7xl mx-auto">
        {/* Заглавие */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h2 className="heading-lg text-3xl sm:text-4xl lg:text-5xl">
            ВАШИЯТ ПЪТ КЪМ
            <br />
            <span className="text-white/40">ПЕРФЕКТНАТА ВИЗИЯ</span>
          </h2>
        </motion.div>

        {/* Карти */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              variants={itemVariants}
              className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br ${step.gradient} ${step.border} p-6 flex flex-col min-h-[220px] group hover:scale-[1.02] transition-transform`}
            >
              {/* Номер на стъпка */}
              <span className="font-heading text-[5rem] font-bold absolute -top-2 -right-1 text-white/[0.04] leading-none select-none">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/[0.08] flex items-center justify-center mb-auto">
                <step.icon className="w-5 h-5 text-lime" />
              </div>

              <div className="mt-8">
                <h3 className="font-heading font-bold uppercase text-base mb-1.5">
                  {step.title}
                </h3>
                <p className="text-white/40 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
