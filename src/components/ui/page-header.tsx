'use client'

import { motion } from 'framer-motion';
import Image from 'next/image';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  gradient?: string;
  showPattern?: boolean;
  showLogo?: boolean;
}

export function PageHeader({
  title,
  subtitle,
  gradient = "from-purple-600 to-blue-600",
  showPattern = true,
  showLogo = true
}: PageHeaderProps) {
  return (
    <div className={`bg-gradient-to-r ${gradient} p-3 md:p-4 text-center text-white relative overflow-hidden`}>
      {/* Background Pattern */}
      {showPattern && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12"></div>
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full -translate-x-10 translate-y-10"></div>
          <div className="absolute bottom-0 right-0 w-28 h-28 bg-white rounded-full translate-x-14 translate-y-14"></div>
        </div>
      )}

      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10"
      >
        {showLogo && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl border border-white/30 shadow-xl">
              <Image
                src="/logo.png"
                alt="EndoConnect Logo"
                width={120}
                height={120}
                className="w-28 h-28 md:w-32 md:h-32 object-contain"
              />
            </div>
          </motion.div>
        )}

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-lg md:text-xl lg:text-2xl font-bold mb-1"
        >
          {title}
        </motion.h1>

        {subtitle && (
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-xs md:text-sm opacity-90 max-w-lg mx-auto leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}


      </motion.div>
    </div>
  );
}
