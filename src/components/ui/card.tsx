'use client';

import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Card: React.FC<CardProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-sm ${className}`}
      {...props}
    />
  );
}; 