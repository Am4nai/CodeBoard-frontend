import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset"; // Добавьте тип кнопки
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string; // Дополнительные классы для стилизации
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  disabled,
  variant = 'primary',
}) => {
  const buttonClasses = `w-full rounded-md px-4 py-2 text-center text-white transition duration-300 ease-in-out ${
    variant === 'primary'
      ? 'bg-green-500 hover:bg-green-600'
      : 'bg-gray-800 hover:bg-gray-700'
  } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`;

  return (
    <button onClick={onClick} disabled={disabled} className={buttonClasses}>
      {children}
    </button>
  );
};