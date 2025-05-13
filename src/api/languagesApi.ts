// src/api/languagesApi.ts

import axios from 'axios';
import Cookies from 'js-cookie'; // Импортируем библиотеку для работы с куки
import { API_BASE_URL } from '@/config/apiConfig'; // Импортируем базовый URL

// Функция для получения всех языков программирования
export const fetchLanguages = async () => {
  try {
    const token = Cookies.get('authToken'); // Получаем токен из куки
    if (!token) {
      throw new Error('Token not found in cookies');
    }

    const response = await axios.get(`${API_BASE_URL}/api/languages/all`, {
      headers: { Authorization: `Bearer ${token}` }, // Добавляем заголовок авторизации
    });

    return response.data; // Возвращаем данные языков
  } catch (error) {
    console.error('Failed to fetch languages:', error);
    throw error; // Пробрасываем ошибку, чтобы её можно было обработать в компоненте
  }
};