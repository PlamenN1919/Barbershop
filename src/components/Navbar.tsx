'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Scissors, Star, Banknote, CalendarCheck, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Начало', href: '#top', icon: Home },
  { name: 'Услуги', href: '#services', icon: Scissors },
  { name: 'Отзиви', href: '#gallery', icon: Star },
  { name: 'Цени', href: '#pricing', icon: Banknote },
  { name: 'Запази час', href: '#booking', icon: CalendarCheck },
];

export default function Navbar() {
  const [activeTab, setActiveTab] = useState('Начало');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll spy — следи коя секция е видима
  useEffect(() => {
    const sectionIds = ['services', 'gallery', 'pricing', 'booking'];
    const nameMap: Record<string, string> = {
      services: 'Услуги',
      gallery: 'Отзиви',
      pricing: 'Цени',
      booking: 'Запази час',
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            if (id && nameMap[id]) {
              setActiveTab(nameMap[id]);
            }
          }
        });
      },
      { rootMargin: '-40% 0px -40% 0px' }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    // Ако сме в горната част — активен е "Начало"
    const handleScroll = () => {
      if (window.scrollY < 300) {
        setActiveTab('Начало');
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollTo = useCallback((href: string, name: string) => {
    setActiveTab(name);
    if (href === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <motion.div
      initial={{ y: isMobile ? 100 : -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.3, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 pt-4 sm:pt-6 flex justify-center"
    >
      <div className="flex items-center gap-1 sm:gap-2 bg-background/60 border border-white/[0.08] backdrop-blur-xl py-1 px-1 rounded-full shadow-lg shadow-black/30">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.name;

          return (
            <button
              key={item.name}
              onClick={() => scrollTo(item.href, item.name)}
              className={cn(
                'relative cursor-pointer text-sm font-medium px-4 sm:px-5 py-2 rounded-full transition-colors duration-200',
                'text-white/50 hover:text-lime',
                isActive && 'text-lime'
              )}
            >
              <span className="hidden md:inline font-heading text-xs uppercase tracking-wider">
                {item.name}
              </span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="tubelight"
                  className="absolute inset-0 w-full bg-lime/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  {/* Tubelight ефект — светеща лента отгоре */}
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-lime rounded-t-full">
                    <div className="absolute w-12 h-6 bg-lime/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-lime/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-lime/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
