'use client'

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SectionProps {
  children: ReactNode;
  className?: string;
  spacing?: 'xs' | 'sm' | 'md' | 'lg';
  background?: 'none' | 'white' | 'glass' | 'gradient';
  delay?: number;
}

export function Section({
  children,
  className = "",
  spacing = 'sm',
  background = 'none',
  delay = 0,
}: SectionProps) {
  const spacingClasses = {
    xs: 'py-2',
    sm: 'py-3',
    md: 'py-4',
    lg: 'py-6'
  };

  const backgroundClasses = {
    none: '',
    white: 'bg-white rounded-lg shadow-sm border border-gray-100',
    glass: 'bg-white/80 backdrop-blur-sm rounded-lg shadow-md border border-gray-200',
    gradient: 'bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-100'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className={`${spacingClasses[spacing]} ${backgroundClasses[background]} ${className}`}
    >
      {children}
    </motion.div>
  );
} 