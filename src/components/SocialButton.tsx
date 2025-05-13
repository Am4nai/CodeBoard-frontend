import React from 'react';
import githubIcon from '../components/github.svg'; // Импортируем SVG-файл

interface SocialButtonProps {
  onClick: () => void;
}

export const SocialButton: React.FC<SocialButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center w-full px-4 py-2 mt-4 text-white transition duration-300 ease-in-out bg-gray-800 hover:bg-gray-700 rounded-md"
    >
      {/* GitHub иконка из файла */}
      <img
        src={githubIcon.src} // Используем импортированный файл
        alt="GitHub Logo"
        className="w-5 h-5 mr-3" // Размеры подогнаны под кнопку
      />
      Continue with GitHub
    </button>
  );
};