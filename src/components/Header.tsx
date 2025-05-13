// components/Header.tsx

import React from 'react';
import { useRouter, usePathname } from 'next/navigation'; // Импортируем usePathname

export const Header: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Получаем текущий путь

  const handleCreatePost = () => {
    router.push('/create-post');
  };

  // Обработчик для перенаправления на dashboard
  const handleLogoClick = () => {
    router.push('/dashboard');
  };

  // Обработчик для перехода на личный профиль
  const handleAvatarClick = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      router.push(`/profile/${user.username}`);
    } else {
      router.push('/auth'); // Если пользователь не авторизован
    }
  };

  // Проверяем, находимся ли мы на странице /admin
  const isAdminPage = pathname === '/admin';

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-gray-800 text-white">
      {/* Левая часть: Логотип и кнопки */}
      <div className="flex items-center space-x-4">
        {/* Логотип CodeBoard */}
        <span
          className="text-green-500 cursor-pointer"
          onClick={handleLogoClick} // Добавляем обработчик клика
        >
          {"[<>]"}
        </span>
        <h1
          className="text-2xl font-semibold cursor-pointer"
          onClick={handleLogoClick} // Добавляем обработчик клика
        >
          CodeBoard
        </h1>
        {!isAdminPage && (
          <button className="text-white hover:text-gray-300 transition-colors">
            Today
          </button>
        )}
      </div>

      {/* Правая часть: Поиск, кнопки и аватар */}
      <div className="flex items-center space-x-4">
        {/* Поле поиска */}
        {!isAdminPage && (
          <input
            type="text"
            placeholder="Search..."
            className="px-4 py-2 bg-gray-700 text-white rounded-md"
          />
        )}
        {/* Кнопка Create */}
        {!isAdminPage && (
          <button
            onClick={handleCreatePost}
            className="text-white hover:text-gray-300 transition-colors"
          >
            Create
          </button>
        )}
        {/* Кнопка Notifications */}
        {!isAdminPage && (
          <button className="text-white hover:text-gray-300 transition-colors">
            Notifications
          </button>
        )}
        {/* Аватар пользователя */}
        <img
          src="https://randomuser.me/api/portraits/men/3.jpg "
          alt="User Avatar"
          className="w-8 h-8 rounded-full cursor-pointer"
          onClick={handleAvatarClick} // Добавляем обработчик клика
        />
      </div>
    </header>
  );
};