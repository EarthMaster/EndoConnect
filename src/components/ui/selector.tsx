'use client';

import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectorProps {
  options: Option[];
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export const Selector: React.FC<SelectorProps> = ({
  options,
  value,
  onChange,
  className = ''
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`w-full p-4 text-left rounded-lg border transition-colors ${
            value === option.value
              ? 'border-purple-500 bg-purple-50 text-black font-medium'
              : 'border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-black'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}; 