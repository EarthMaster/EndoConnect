'use client'

import { motion } from 'framer-motion';
import { PageHeader } from './page-header';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  gradient?: string;
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
  showCard?: boolean;
  showPattern?: boolean;
  showLogo?: boolean;
}

export function PageLayout({
  title,
  subtitle,
  gradient,
  children,
  maxWidth = "max-w-6xl",
  className = "",
  showCard = true,
  showPattern = true,
  showLogo = true
}: PageLayoutProps) {
  if (!showCard) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 ${className}`}
      >
        {/* Header */}
        <PageHeader
          title={title}
          subtitle={subtitle}
          gradient={gradient}
          showPattern={showPattern}
          showLogo={showLogo}
        />

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`${maxWidth} mx-auto p-6 md:p-8 lg:p-12`}
        >
          {children}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-4 md:py-8 ${className}`}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl border border-purple-100 overflow-hidden mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl">
        {/* Header */}
        <PageHeader
          title={title}
          subtitle={subtitle}
          gradient={gradient}
          showPattern={showPattern}
          showLogo={showLogo}
        />

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`${maxWidth} mx-auto p-6 md:p-8 lg:p-12`}
        >
          {children}
        </motion.div>
      </div>
    </motion.div>
  );
}
