import React from 'react';

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({ id, className = '', ...props }) => {
  return (
    <input
      type="checkbox"
      id={id}
      className={`h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded ${className}`}
      {...props}
    />
  );
}; 