import axios from 'axios';
import Cookies from 'js-cookie'; // Импортируем библиотеку для работы с куки
import { API_BASE_URL } from '@/config/apiConfig'; // Импортируем базовый URL

// Функция для получения всех тегов
export const fetchTags = async () => {
  try {
    const token = Cookies.get('authToken'); // Получаем токен из куки
    if (!token) {
      throw new Error('Token not found in cookies');
    }

    const response = await axios.get(`${API_BASE_URL}/api/tags/all`, {
      headers: { Authorization: `Bearer ${token}` }, // Добавляем заголовок авторизации
    });

    return response.data; // Возвращаем данные тегов
  } catch (error) {
    console.error('Failed to fetch tags:', error);
    throw error; // Пробрасываем ошибку, чтобы её можно было обработать в компоненте
  }
};