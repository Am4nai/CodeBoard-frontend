// components/SelectField.tsx

import React from 'react';

interface SelectFieldProps {
  label: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

export const SelectField: React.FC<SelectFieldProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="mb-4">
      <label htmlFor={label} className="block mb-2 text-sm font-medium text-gray-300">
        {label}
      </label>
      <select
        id={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 border border-gray-500 rounded-md focus:outline-none focus:border-blue-500 bg-gray-800"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};