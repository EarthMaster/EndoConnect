'use client'

import { motion } from 'framer-motion';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  gradient?: string;
  showPattern?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  gradient = "from-purple-600 to-blue-600",
  showPattern = true,
}: PageHeaderProps) {
  return (
    <div className={`bg-gradient-to-r ${gradient} p-4 md:p-6 text-center text-white relative overflow-hidden`}>
      {/* Background Pattern */}
      {showPattern && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-24 h-24 bg-white rounded-full -translate-x-12 -translate-y-12"></div>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full translate-x-10 -translate-y-10"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full -translate-x-8 translate-y-8"></div>
          <div className="absolute bottom-0 right-0 w-22 h-22 bg-white rounded-full translate-x-11 translate-y-11"></div>
        </div>
      )}

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10 max-w-3xl mx-auto"
      >
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 tracking-tight"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-sm md:text-base opacity-90 max-w-2xl mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
