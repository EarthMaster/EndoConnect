import { ReactNode } from 'react';

interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
}

export function Container({
  children,
  size = 'lg',
  padding = 'md',
  className = '',
}: ContainerProps) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4 py-2',
    md: 'px-4 sm:px-6 lg:px-8 py-4',
    lg: 'px-4 sm:px-6 lg:px-8 py-6'
  };

  return (
    <div className={`${sizeClasses[size]} mx-auto ${paddingClasses[padding]} ${className}`}>
      {children}
    </div>
  );
} 