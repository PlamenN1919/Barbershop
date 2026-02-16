'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';
import { Crosshair, Sparkles, Shield, Clock } from 'lucide-react';

const features = [
  {
    icon: Crosshair,
    title: 'Прецизни подстригвания',
    description: 'Всяко подстригване е съобразено с формата на лицето, типа коса и личния ви стил.',
  },
  {
    icon: Sparkles,
    title: 'Премиум продукти',
    description: 'Използваме само висококачествени продукти за грижа за косата за най-добри резултати.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section ref={ref} className="section-padding py-24 sm:py-32">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
          {/* Лява колона — текст */}
          <motion.div
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
          >
            <motion.h2 variants={fadeUp} className="heading-lg text-4xl sm:text-5xl mb-12">
              РАЗКРИЙТЕ
              <br />
              <span className="text-lime">НАЙ-ДОБРАТА СИ ВИЗИЯ</span>
            </motion.h2>

            <div className="space-y-10">
              {features.map((feature) => (
                <motion.div key={feature.title} variants={fadeUp} className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-lime/10 border border-lime/20 flex items-center justify-center shrink-0">
                    <feature.icon className="w-5 h-5 text-lime" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg uppercase mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div variants={fadeUp} className="mt-16">
              <h3 className="heading-lg text-3xl sm:text-4xl text-white/90">
                СТИЛЪТ
                <br />
                <span className="text-white/40">ИМА ЗНАЧЕНИЕ</span>
              </h3>
            </motion.div>
          </motion.div>

          {/* Дясна колона — изображение + статистики */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            {/* Карта с изображение */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-surface-light border border-white/[0.06]">
              <Image
                src="/images/about-barber.webp"
                alt="Бръснар с ножица — SNNAKE Barbershop"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />

              {/* Статистики отдолу */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex gap-4">
                  <div className="flex-1 glass-card p-4 bg-background/80 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="w-4 h-4 text-lime" />
                      <span className="text-xs text-white/50 uppercase tracking-wider">Опит</span>
                    </div>
                    <p className="font-heading font-bold text-xl">4+ Години</p>
                  </div>
                  <div className="flex-1 glass-card p-4 bg-background/80 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-lime" />
                      <span className="text-xs text-white/50 uppercase tracking-wider">Клиенти</span>
                    </div>
                    <p className="font-heading font-bold text-xl">200+</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
