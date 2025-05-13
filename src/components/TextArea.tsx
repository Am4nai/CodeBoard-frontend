// components/TextArea.tsx

import React, { useRef, useEffect } from 'react';

interface TextAreaProps {
  label: string;
  value: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  value,
  onChange,
  placeholder,
  className = '',
  disabled = false,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  return (
    <div className="mb-4">
      <label htmlFor={label} className="block mb-2 text-sm font-medium text-gray-300">
        {label}
      </label>
      <textarea
        id={label}
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        rows={1}
        disabled={disabled}
        className={`w-full p-2 border rounded-md resize-none overflow-hidden focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 border-gray-700 text-white ${className}`}
        placeholder={placeholder || 'Enter your content...'}
      />
    </div>
  );
};
