// src/hooks/useAuth.ts

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { getToken, removeToken } from '@/utils/authUtils';
import { API_BASE_URL } from '@/config/apiConfig'; // Импортируем базовый URL

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Новое состояние загрузки
  const [user, setUser] = useState<any | null>(null); // Добавляем состояние для данных пользователя
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      const token = getToken(); // Получаем токен из куки
      const storedUser = localStorage.getItem('user'); // Извлекаем данные пользователя из localStorage

      console.log('useAuth: Token retrieved:', token); // Логируем токен
      console.log('useAuth: User retrieved:', storedUser); // Логируем данные пользователя

      if (!token || !storedUser) {
        console.log('useAuth: Redirecting to /auth'); // Логируем перенаправление
        setIsLoading(false); // Загрузка завершена
        router.push('/auth');
        return;
      }

      try {
        // Отправляем запрос на проверку валидности токена
        const response = await axios.post(`${API_BASE_URL}/api/auth/validate-token`, {
          token, // Передаём токен в теле запроса
        });

        if (response.data.valid) {
          console.log('useAuth: Token is valid');
          setIsAuthenticated(true);
          setUser(JSON.parse(storedUser)); // Сохраняем данные пользователя в состоянии
        } else {
          console.log('useAuth: Token is invalid');
          removeToken();
          localStorage.removeItem('user');
          setIsAuthenticated(false);
          router.push('/auth');
        }
      } catch (error) {
        console.error('useAuth: Token validation failed:', error);
        removeToken();
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        router.push('/auth');
      } finally {
        setIsLoading(false); // Загрузка завершена
      }
    };

    validateToken();
  }, [router]);

  const logout = () => {
    console.log('useAuth: Logging out'); // Логируем выход
    removeToken(); // Удаляем токен из куки
    localStorage.removeItem('user'); // Удаляем данные пользователя из localStorage
    setIsAuthenticated(false);
    setUser(null); // Очищаем данные пользователя
    router.push('/auth'); // Перенаправляем на страницу входа
  };

  return { isAuthenticated, isLoading, user, logout };
};