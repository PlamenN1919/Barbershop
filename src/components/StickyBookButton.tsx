'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StickyBookButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToBooking = () => {
    const el = document.getElementById('booking');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToBooking}
          className="
            fixed bottom-6 right-6 z-50
            bg-lime text-background
            px-6 py-4 rounded-full
            font-heading font-bold text-sm uppercase tracking-wide
            shadow-2xl shadow-lime/20
            flex items-center gap-2
            animate-pulse-lime
          "
        >
          <Calendar className="w-5 h-5" />
          <span className="hidden sm:inline">Запази час</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
