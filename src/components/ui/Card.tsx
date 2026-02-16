'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  selected?: boolean;
  onClick?: () => void;
  hoverable?: boolean;
}

export default function Card({
  children,
  className = '',
  selected = false,
  onClick,
  hoverable = true,
}: CardProps) {
  return (
    <motion.div
      whileHover={hoverable ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      onClick={onClick}
      className={`
        glass-card p-6 transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
        ${
          selected
            ? 'border-lime/40 bg-lime/[0.04] ring-1 ring-lime/20'
            : 'hover:border-white/10'
        }
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
