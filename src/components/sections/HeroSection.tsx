'use client';

import { motion } from 'framer-motion';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { AnimatedGroup } from '@/components/ui/AnimatedGroup';

const transitionVariants = {
  item: {
    hidden: {
      opacity: 0,
      filter: 'blur(12px)',
      y: 12,
    },
    visible: {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      transition: {
        type: 'spring',
        bounce: 0.3,
        duration: 1.5,
      },
    },
  },
};

export default function HeroSection() {
  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Декоративни фонови радиални градиенти — lime-оттенъци */}
      <div
        aria-hidden
        className="z-[2] absolute inset-0 pointer-events-none isolate opacity-50 contain-strict hidden lg:block"
      >
        <div className="w-[35rem] h-[80rem] -translate-y-[350px] absolute left-0 top-0 -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(75,100%,50%,.08)_0,hsla(75,100%,50%,.02)_50%,hsla(75,100%,50%,0)_80%)]" />
        <div className="h-[80rem] absolute left-0 top-0 w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(75,100%,50%,.06)_0,hsla(75,100%,50%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="h-[80rem] -translate-y-[350px] absolute left-0 top-0 w-56 -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(75,100%,50%,.04)_0,hsla(75,100%,50%,.02)_80%,transparent_100%)]" />
      </div>

      <div className="relative pt-24 md:pt-36">
        {/* Фоново изображение */}
        <motion.img
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          src="/images/hero-barbershop.png"
          alt=""
          aria-hidden
          className="absolute inset-0 -z-20 w-full h-full object-cover pointer-events-none"
        />

        {/* Лек градиент само отдолу за плавен преход */}
        <div
          aria-hidden
          className="absolute bottom-0 left-0 right-0 h-64 -z-10 pointer-events-none bg-gradient-to-t from-background to-transparent"
        />

        <div className="mx-auto max-w-7xl section-padding">
          <div className="text-center sm:mx-auto lg:mr-auto lg:mt-0">
            {/* Основна анимирана група: бадж + заглавие + описание */}
            <AnimatedGroup variants={transitionVariants}>
              {/* Бадж / етикет */}
              <a
                href="https://www.google.com/maps/place/Snnake+Barbershop-Царево/@42.169122,27.8501496,17.06z/data=!4m6!3m5!1s0x40a12fa075da1f75:0x8c56a9fb53aea21f!8m2!3d42.1690446!4d27.8502733!16s%2Fg%2F11kpznplm6?hl=bg&entry=ttu&g_ep=EgoyMDI2MDIxMS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="group mx-auto flex w-fit items-center gap-4 rounded-full border border-white/[0.08] bg-surface p-1 pl-4 shadow-md shadow-black/20 transition-all duration-300 hover:border-lime/30"
              >
                <span className="text-white/50 text-sm">
                  SNNAKE Barbershop &mdash; Царево
                </span>
                <span className="block h-4 w-0.5 bg-white/10"></span>
                <div className="bg-lime w-6 h-6 overflow-hidden rounded-full duration-500 group-hover:scale-110">
                  <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
                    <span className="flex w-6 h-6">
                      <ArrowRight className="m-auto w-3 h-3 text-background" />
                    </span>
                    <span className="flex w-6 h-6">
                      <ArrowRight className="m-auto w-3 h-3 text-background" />
                    </span>
                  </div>
                </div>
              </a>

              {/* Главно заглавие */}
              <h1 className="mt-8 max-w-4xl mx-auto heading-xl text-[clamp(3rem,8vw,5.25rem)] lg:mt-16">
                <span className="text-lime">Прическа</span> за хора, които <span className="text-lime">влизат</span> и ги <span className="text-lime">забелязват.</span>
              </h1>

              {/* Подтекст */}
              <p className="mx-auto mt-8 max-w-2xl text-balance text-lg text-white/40 leading-relaxed">
                Повече от прическа — увереност, която се усеща от първия момент.
              </p>
            </AnimatedGroup>

            {/* CTA бутони */}
            <AnimatedGroup
              variants={{
                container: {
                  visible: {
                    transition: {
                      staggerChildren: 0.05,
                      delayChildren: 0.75,
                    },
                  },
                },
                ...transitionVariants,
              }}
              className="mt-12 flex flex-col items-center justify-center gap-2 md:flex-row"
            >
              <div className="rounded-[14px] border border-lime/20 p-0.5">
                <button
                  onClick={scrollToBooking}
                  className="inline-flex items-center justify-center gap-2 bg-lime text-background font-heading font-bold uppercase tracking-wide rounded-xl px-6 py-3 text-base hover:bg-lime-light transition-colors"
                >
                  <span className="whitespace-nowrap">Запази час</span>
                </button>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('why-us');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 text-white/60 font-heading font-medium uppercase tracking-wide rounded-xl px-6 py-3 text-base hover:text-white hover:bg-white/5 transition-colors"
              >
                <ArrowDown className="w-4 h-4" />
                <span className="whitespace-nowrap">Научи повече</span>
              </button>
            </AnimatedGroup>
          </div>
        </div>

      </div>
    </section>
  );
}
