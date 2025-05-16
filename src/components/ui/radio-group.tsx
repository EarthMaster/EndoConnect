import React from 'react';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ name, options, className = '', onChange }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {options.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
            onChange={onChange}
          />
          <label
            htmlFor={`${name}-${option.value}`}
            className="text-gray-700"
          >
            {option.label}
          </label>
        </div>
      ))}
    </div>
  );
}; 