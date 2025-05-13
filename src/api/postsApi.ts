// src/api/postsApi.ts

import axios from 'axios';
import Cookies from 'js-cookie'; // Импортируем библиотеку для работы с куки
import { API_BASE_URL } from '@/config/apiConfig';

// Интерфейс для данных поста
export interface PostData {
  title: string;
  content: string;
  tagIds: number[];
  languageId: number;
  userId: number; // userId должен быть числом
  visibility: string;
}

// Интерфейс для ответа сервера
export interface Post {
  id: number;
  title: string;
  content: string;
  languageName: string; // Изменено с "language" на "languageName"
  authorUsername: string; // Изменено с "author" на "authorUsername"
  tags: string[];
  visibility: string;
  createdAt: string;
}

// Функция для получения постов с пагинацией
export const fetchPosts = async (page: number, limit: number = 10): Promise<Post[]> => {
  try {
    const token = Cookies.get('authToken'); // Получаем токен из куки
    if (!token) {
      throw new Error('Token not found in cookies');
    }

    const response = await axios.get(`${API_BASE_URL}/api/posts/all`, {
      headers: {
        Authorization: `Bearer ${token}`, // Добавляем заголовок авторизации
      },
      params: {
        page,
        limit,
      },
    });

    // Извлекаем данные из ответа
    const posts = response.data.content; // Список постов
    return posts;
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    throw error; // Пробрасываем ошибку, чтобы её можно было обработать в компоненте
  }
};

// Функция для создания нового поста
export const createPost = async (postData: PostData) => {
  try {
    const token = Cookies.get('authToken'); // Получаем токен из куки
    if (!token) {
      throw new Error('Token not found in cookies');
    }

    const response = await axios.post(`${API_BASE_URL}/api/posts/create`, postData, {
      headers: {
        Authorization: `Bearer ${token}`, // Добавляем заголовок авторизации
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Возвращаем данные ответа
  } catch (error) {
    console.error('Failed to create post:', error);
    throw error; // Пробрасываем ошибку, чтобы её можно было обработать в компоненте
  }
};