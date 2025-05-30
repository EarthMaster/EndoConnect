'use client'

import { motion } from 'framer-motion';
import { PageHeader } from './page-header';
import { AppHeader } from './app-header';
import { Container } from './container';

interface PageLayoutProps {
  title: string;
  subtitle?: string;
  gradient?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
  showCard?: boolean;
  showPattern?: boolean;
  containerPadding?: 'none' | 'sm' | 'md' | 'lg';
}

export function PageLayout({
  title,
  subtitle,
  gradient,
  children,
  maxWidth = "lg",
  className = "",
  showCard = false,
  showPattern = true,
  containerPadding = 'md',
}: PageLayoutProps) {
  if (!showCard) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 ${className}`}
      >
        <AppHeader />
        
        {/* Header */}
        <PageHeader
          title={title}
          subtitle={subtitle}
          gradient={gradient}
          showPattern={showPattern}
        />

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <Container size={maxWidth} padding={containerPadding}>
            {children}
          </Container>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={`min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 ${className}`}
    >
      <AppHeader />
      
      <div className="py-4 md:py-6">
        <Container size="xl" padding="sm">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-purple-100/50 overflow-hidden">
            {/* Header */}
            <PageHeader
              title={title}
              subtitle={subtitle}
              gradient={gradient}
              showPattern={showPattern}
            />

            {/* Content */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Container size={maxWidth} padding={containerPadding}>
                {children}
              </Container>
            </motion.div>
          </div>
        </Container>
      </div>
    </motion.div>
  );
}
