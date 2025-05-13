// components/InputField.tsx

import React from 'react';

interface InputFieldProps {
  label: string;
  type?: "text" | "password" | "email";
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
  classNameDiv?: string;
  disabled?: boolean; // Новое свойство
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  className = '',
  classNameDiv = '',
  disabled = false,
}) => {
  return (
    <div className={`${classNameDiv}`}>
      {label && (
        <label
          htmlFor={label}
          className="block text-sm font-medium text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled} // Применяем disabled
        className={`block w-full rounded-md border bg-gray-800 px-3 py-2 placeholder-gray-400 focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 ${
          error ? 'border-red-500' : 'border-gray-700'
        } ${className}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};