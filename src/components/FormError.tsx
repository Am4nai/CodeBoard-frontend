import React from 'react';

interface FormErrorProps {
  message: string;
}

export const FormError: React.FC<FormErrorProps> = ({ message }) => {
  return (
    <p className="mt-2 text-sm text-red-500">{message}</p>
  );
};