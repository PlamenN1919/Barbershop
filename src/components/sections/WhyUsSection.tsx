'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const pillars = [
  {
    badge: 'Прецизност',
    title: 'Безкомпромисна точност във всеки щрих',
    description:
      'Всяка линия е премерена, всеки фейд — безупречен. Работим с хирургична точност за резултат, който не допуска компромиси.',
    dark: true,
    offset: '',
    image: '/images/precision-barber.jpg',
  },
  {
    badge: 'Стил',
    title: 'Визия, която ви отличава от тълпата',
    description:
      'Не следваме трендове сляпо — създаваме стил, който подчертава точно вашата индивидуалност и характер.',
    dark: true,
    offset: 'sm:mt-16 lg:mt-24',
    image: '/images/style-barber.jpg',
  },
  {
    badge: 'Опит',
    title: 'Майстори, доказани от хиляди клиенти',
    description:
      'С 4+ години опит и хиляди доволни мъже зад гърба, ние познаваме перфекцията отблизо.',
    dark: true,
    offset: 'lg:mt-10',
    image: '/images/experience-barber.jpg',
  },
  {
    badge: 'Резултат',
    title: 'Увереност, която се усеща от първия момент',
    description:
      'Излизате с повече от прическа — с усещане за сила, контрол и стил, което личи отдалеч.',
    dark: false,
    offset: 'sm:mt-16 lg:mt-36',
    image: null,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      delay: 0.3 + i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export default function WhyUsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      id="why-us"
      ref={ref}
      className="relative bg-background py-24 sm:py-32 lg:py-40 section-padding overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
          className="text-center text-sm font-medium text-lime tracking-widest uppercase mb-10"
        >
          Защо нас
        </motion.p>

        {/* Main Headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-center max-w-5xl mx-auto mb-6"
        >
          <h2 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] leading-[1.15] tracking-tight text-white">
            <span className="text-lime">&#10038;</span>
            {'  '}Не просто бръснарница — място за мъже с{' '}
            <MetallicPill />{' '}
            характер,{' '}
            <span className="text-white/40">където всяко подстригване носи</span>{' '}
            силата на{' '}
            <MetallicPill />{' '}
            абсолютна увереност
          </h2>
        </motion.div>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="text-center text-white/40 text-sm sm:text-base max-w-xl mx-auto mb-20 lg:mb-28 leading-relaxed"
        >
          Повече от прическа — стил на живот. Нашите майстори превръщат
          всяко посещение в преживяване, което се помни и кара хората да питат кой е вашият бръснар.
        </motion.p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-start">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.badge}
              custom={i}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              variants={cardVariants}
              className={`${pillar.offset} rounded-[1.75rem] overflow-hidden ${
                pillar.dark
                  ? 'bg-surface text-white'
                  : 'bg-surface-light text-white'
              }`}
            >
              {/* Image area for dark cards */}
              {pillar.dark && (
                <div className="relative h-44 sm:h-52 overflow-hidden">
                  {pillar.image ? (
                    <>
                      <img
                        src={pillar.image}
                        alt={pillar.badge}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent" />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-surface">
                        <div className="absolute inset-0 bg-gradient-to-br from-lime/20 via-lime-dark/10 to-transparent" />
                        <div className="absolute top-[40%] left-[-20%] w-[140%] h-[30%] bg-gradient-to-r from-transparent via-lime/15 to-transparent -rotate-[12deg] blur-xl" />
                        <div className="absolute top-[30%] left-[-10%] w-[120%] h-[15%] bg-gradient-to-r from-transparent via-lime/10 to-transparent -rotate-[8deg] blur-lg" />
                        <div className="absolute top-[55%] left-[10%] w-[100%] h-[10%] bg-gradient-to-r from-transparent via-lime-light/8 to-transparent -rotate-[15deg] blur-md" />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                    </>
                  )}
                </div>
              )}

              {/* Content */}
              <div className={`p-6 pb-8 ${!pillar.dark ? 'pt-8' : ''}`}>
                {/* Badge */}
                <div className="mb-8">
                  <span className="inline-block px-4 py-1.5 rounded-full text-[11px] font-medium tracking-wider uppercase border border-white/15 text-white/70">
                    {pillar.badge}
                  </span>
                </div>

                {/* Accent dot */}
                <div className="w-[6px] h-[6px] rounded-full bg-lime mb-5" />

                {/* Title */}
                <h3 className="font-heading font-bold text-xl sm:text-[1.35rem] leading-snug mb-3 text-white">
                  {pillar.title}
                </h3>

                {/* Description */}
                <p className="text-[13px] leading-relaxed text-white/40">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* 3D metallic lime pill — inline decorative element */
function MetallicPill() {
  return (
    <span
      className="inline-block align-middle mx-1 w-14 sm:w-16 h-7 sm:h-8 rounded-full relative overflow-hidden shadow-lg shadow-lime/20"
      style={{
        background:
          'linear-gradient(135deg, #D9FF4D 0%, #CCFF00 30%, #7A9900 60%, #5C7300 100%)',
      }}
    >
      <span
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.35) 0%, transparent 40%, rgba(0,0,0,0.2) 100%)',
        }}
      />
      <span
        className="absolute top-[3px] left-[10%] right-[10%] h-[6px] rounded-full blur-[1px]"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
        }}
      />
    </span>
  );
}
